/**
 * 做什么：Node 侧 Markdown 解析器，复刻 @nuxt/content v3 管线（插件顺序与选项、Shiki
 * 高亮器、相对链接归一化、toc depth 3），把 markdown 解析成 MDC AST。
 * 状态与生命周期：高亮器与语言包在 createContentParser 调用时一次性加载，由调用方复用。
 * 取舍与不变量：`#mdc-imports` / `#mdc-configs` 在 Vite 外不可解析，故插件在此显式
 * import；主题按「具名槽位在前、default 在后」排序，class 列表与 CSS 变量顺序稳定。
 * 语言包按语法自带的别名一并登记，`js` / `sh` 这类围栏写法的渲染结果与文档顺序无关。
 * 边界：不读文件、不写产物、不维护路由或 manifest。
 */

import { createHash } from "node:crypto"
import { createMarkdownParser, createShikiHighlighter, rehypeHighlight } from "@nuxtjs/mdc/runtime"
import defu from "defu"
import { normalizeUri } from "micromark-util-sanitize-uri"
import rehypeExternalLinks from "rehype-external-links"
import rehypeKatex from "rehype-katex"
import remarkEmoji from "remark-emoji"
import remarkFlexibleContainers from "remark-flexible-containers"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { pascalCase } from "scule"
import { createOnigurumaEngine } from "shiki/engine/oniguruma"
import slugify from "slugify"
import { isRelative, withLeadingSlash, withoutTrailingSlash } from "ufo"
import { visit } from "unist-util-visit"
import type { MDCParserResult } from "@nuxtjs/mdc"

const SEMVER_REGEX = /^\d+(?:\.\d+)*(?:\.x)?$/

function refineUrlPart(name: string) {
    const base = name.split(/[/:]/).pop() ?? name
    if (SEMVER_REGEX.test(base)) {
        return base
    }
    return base
        .replace(/(\d+\.)?(.*)/, "$2")
        .replace(/^index(\.draft)?$/, "")
        .replace(/\.draft$/, "")
}

function generatePath(
    path: string,
    { forceLeadingSlash = true, slugifyOptions = { lower: true } } = {} as {
        forceLeadingSlash?: boolean
        slugifyOptions?: Record<string, unknown>
    },
) {
    const mapped = path
        .split("/")
        .map((part) => slugify(refineUrlPart(part), slugifyOptions as Parameters<typeof slugify>[1]))
        .join("/")
    return forceLeadingSlash ? withLeadingSlash(withoutTrailingSlash(mapped)) : mapped
}

function generateTitle(path: string) {
    return path
        .split(/[\s-]/g)
        .map((p) => pascalCase(p))
        .join(" ")
}

export function toSourcePath(relativeFilePath: string) {
    const stem = relativeFilePath.replace(/\.md$/, "")
    const parts = stem.split("/")
    const basename = parts.at(-1) ?? ""
    const path = generatePath(stem)
    const title = generateTitle(refineUrlPart(basename))
    return { path, stem, title }
}

function normaliseLink(link: string) {
    const match = link.match(/#.+$/)
    const hashPart = match ? match[0] : ""
    if (
        link.replace(/#.+$/, "").endsWith(".md") &&
        (isRelative(link) || (!/^https?/.test(link) && !link.startsWith("/")))
    ) {
        return `${generatePath(link.replace(`.md${hashPart}`, ""), { forceLeadingSlash: false })}${hashPart}`
    }
    return link
}

function link(state: any, node: any) {
    const properties = {
        ...node.attributes,
        href: normalizeUri(normaliseLink(node.url)),
    }
    if (node.title !== undefined && node.title !== null) {
        properties.title = node.title
    }
    const result = {
        children: state.all(node),
        properties,
        tagName: "a",
        type: "element",
    }
    state.patch(node, result)
    return state.applyData(node, result)
}

export type ParserConfig = {
    langs?: string[]
    theme?: Record<string, string>
}

export async function createContentParser(config: { highlight?: ParserConfig } = {}) {
    // 复刻 @nuxt/content 的 `getHighlightPluginInstance`（compress: true）。
    const highlightOptions: ParserConfig = defu(config.highlight ?? {}, {
        langs: ["bash", "html", "mdc", "vue", "yml", "scss", "ts", "ts", "typescript"],
        // 与 nuxt.config 的 mdc.highlight.theme 一致：明暗都用深色代码块
        theme: { default: "vitesse-dark" },
    } as ParserConfig)
    const langs = [
        ...new Set([
            "bash",
            "html",
            "mdc",
            "vue",
            "yml",
            "scss",
            "ts",
            "ts",
            "typescript",
            ...(highlightOptions.langs ?? []),
        ]),
    ]
    const rawThemes = (
        typeof highlightOptions.theme === "string"
            ? { default: highlightOptions.theme }
            : (highlightOptions.theme ?? { default: "vitesse-dark" })
    ) as Record<string, string>
    // 复刻 @nuxt/content 管线的确定性主题排序：具名槽位（非 default）在前、
    // `default` 在后。生成的 `shiki-themes` class 列表与 token 样式里的
    // CSS 自定义属性顺序都由此决定，保证预渲染 HTML 结构一致。
    const { default: defaultTheme, ...restThemes } = rawThemes
    const themesObject: Record<string, string> =
        defaultTheme === undefined ? { ...restThemes } : { ...restThemes, default: defaultTheme }
    const bundledThemes: Record<string, any> = {}
    for (const [name, theme] of Object.entries(themesObject)) {
        const themeModule = typeof theme === "string" ? await import(`shiki/themes/${theme}.mjs`) : null
        bundledThemes[name] = typeof theme === "string" ? themeModule?.default : theme
    }
    const bundledLangs: Record<string, any> = {}
    for (const lang of langs) {
        const langModule = await import(`@shikijs/langs/${lang}`)
        bundledLangs[lang] = langModule.default
        // 别名必须一起登记：@nuxtjs/mdc 只按 bundledLangs 的键精确查找，查不到就直接
        // 回退纯文本；shiki 自带的别名要等语法首次加载后才生效，于是围栏写 `js`
        // 能否高亮取决于别的代码块是否先触发过 `javascript`。别名登记后与顺序无关。
        for (const grammar of [langModule.default].flat() as any[]) {
            for (const alias of grammar?.aliases ?? []) {
                bundledLangs[alias] = langModule.default
            }
        }
    }
    const highlighter = createShikiHighlighter({
        bundledLangs,
        bundledThemes,
        engine: createOnigurumaEngine(import("shiki/wasm")),
        getMdcConfigs: () => Promise.resolve([]),
    })

    const highlight = {
        instance: rehypeHighlight,
        options: {
            highlighter: async (code: string, lang: string, theme: any, opts: any) => {
                const result = await highlighter(code, lang, theme, opts)
                const visitTree = { children: result.tree, type: "element" }
                const stylesMap: Record<string, string> = {}
                visit(
                    visitTree,
                    (node: any) => !!node.properties?.style,
                    (node: any) => {
                        const { style } = node.properties
                        stylesMap[style] =
                            stylesMap[style] || `s${createHash("sha1").update(style).digest("hex").slice(0, 4)}`
                        node.properties.class = `${node.properties.class || ""} ${stylesMap[style]}`.trim()
                        node.properties.style = undefined
                    },
                )
                if (result.style) {
                    result.style =
                        Object.entries(stylesMap)
                            .map(([style, cls]) => `html pre.shiki code .${cls}, html code.shiki .${cls}{${style}}`)
                            .join("") + result.style
                }
                return result
            },
            theme: bundledThemes,
        },
    }

    const parser = await createMarkdownParser({
        rehype: {
            options: {
                handlers: { link },
            },
            plugins: {
                highlight,
                "rehype-external-links": { instance: rehypeExternalLinks, options: { target: "_blank" } },
                "rehype-katex": { instance: rehypeKatex, options: { output: "html", strict: "warn" } },
            },
        },
        remark: {
            plugins: {
                "remark-emoji": { instance: remarkEmoji, options: {} },
                "remark-flexible-containers": { instance: remarkFlexibleContainers, options: {} },
                "remark-gfm": { instance: remarkGfm, options: { singleTilde: false } },
                "remark-math": { instance: remarkMath, options: {} },
            },
        },
        toc: { depth: 3 },
    })

    return {
        parse: async (
            markdown: string,
            fileOptions?: Record<string, any>,
        ): Promise<{ data: Record<string, any> } & MDCParserResult> => {
            const result = await parser(markdown, { fileOptions })
            return result as any
        },
    }
}

export default function contentParserModule() {
    // 本文件并非 Nuxt 模块；保留默认导出仅为满足 modules/ 目录的自动加载器，
    // 避免它把该文件当成非法模块报错。
}
