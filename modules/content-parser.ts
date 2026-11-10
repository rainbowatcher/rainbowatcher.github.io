import { createMarkdownParser, createShikiHighlighter, rehypeHighlight } from "@nuxtjs/mdc/runtime"
import defu from "defu"
import { normalizeUri } from "micromark-util-sanitize-uri"
import { hash } from "ohash"
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

/**
 * Node-only Markdown parser replicating the @nuxt/content v3 pipeline:
 * - same remark/rehype plugin order and options as nuxt.config.ts
 * - same Shiki highlighter construction (compressed class maps, themes/languages)
 * - same relative-link normalization handler
 * - toc depth 3
 *
 * `#mdc-imports` / `#mdc-configs` do not resolve outside the Nuxt/Vite
 * context, so plugins are imported explicitly here.
 */

const SEMVER_REGEX = /^\d+(?:\.\d+)*(?:\.x)?$/

function refineUrlPart(name: string) {
    const base = name.split(/[/:]/).pop() ?? name
    if (SEMVER_REGEX.test(base)) {
        return base
    }
    return base.replace(/(\d+\.)?(.*)/, "$2").replace(/^index(\.draft)?$/, "")
        .replace(/\.draft$/, "")
}

function generatePath(path: string, { forceLeadingSlash = true, slugifyOptions = { lower: true } } = {} as { forceLeadingSlash?: boolean; slugifyOptions?: Record<string, unknown> }) {
    const mapped = path.split("/").map(part => slugify(refineUrlPart(part), slugifyOptions as Parameters<typeof slugify>[1]))
        .join("/")
    return forceLeadingSlash ? withLeadingSlash(withoutTrailingSlash(mapped)) : mapped
}

function generateTitle(path: string) {
    return path.split(/[\s-]/g).map(p => pascalCase(p))
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
    if (link.replace(/#.+$/, "").endsWith(".md") && (isRelative(link) || !/^https?/.test(link) && !link.startsWith("/"))) {
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
    // Reproduce @nuxt/content `getHighlightPluginInstance` with compress: true.
    const highlightOptions: ParserConfig = defu(config.highlight ?? {}, {
        langs: ["bash", "html", "mdc", "vue", "yml", "scss", "ts", "ts", "typescript"],
        theme: { default: "material-theme-palenight" },
    } as ParserConfig)
    const langs = [...new Set(["bash", "html", "mdc", "vue", "yml", "scss", "ts", "ts", "typescript", ...(highlightOptions.langs ?? [])])]
    const rawThemes = (typeof highlightOptions.theme === "string"
        ? { default: highlightOptions.theme }
        : highlightOptions.theme ?? { default: "material-theme-palenight" }) as Record<string, string>
    // Reproduce the @nuxt/content pipeline's deterministic theme ordering:
    // named (non-default) slots first, `default` last. This orders both the
    // generated `shiki-themes` class list and CSS custom-property order in
    // token styles, keeping prerendered HTML structurally identical.
    const { default: defaultTheme, ...restThemes } = rawThemes
    const themesObject: Record<string, string> = defaultTheme === undefined ? { ...restThemes } : { ...restThemes, default: defaultTheme }
    const bundledThemes: Record<string, any> = {}
    for (const [name, theme] of Object.entries(themesObject)) {
        const themeModule = typeof theme === "string" ? await import(`shiki/themes/${theme}.mjs`) : null
        bundledThemes[name] = typeof theme === "string" ? themeModule?.default : theme
    }
    const bundledLangs: Record<string, any> = {}
    for (const lang of langs) {
        const langModule = await import(`@shikijs/langs/${lang}`)
        bundledLangs[lang] = langModule.default
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
                        stylesMap[style] = stylesMap[style] || `s${hash(style).slice(0, 4)}`
                        node.properties.class = `${node.properties.class || ""} ${stylesMap[style]}`.trim()
                        node.properties.style = undefined
                    },
                )
                if (result.style) {
                    result.style = Object.entries(stylesMap)
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
        parse: async (markdown: string, fileOptions?: Record<string, any>): Promise<{ data: Record<string, any> } & MDCParserResult> => {
            const result = await parser(markdown, { fileOptions })
            return result as any
        },
    }
}

export default function contentParserModule() {
    // Non-module helper; kept as default export so Nuxt's modules/ auto
    // loader does not treat this file as an invalid module.
}
