/**
 * 做什么：把 content/ 下的 markdown 在构建期编译成静态 JSON 数据集，取代 @nuxt/content
 * 的运行时查询；每篇文档一个内容哈希命名的 JSON，外加 manifest.json 索引。
 * 状态与生命周期：rebuildChain 串行化重建（dev watcher 会突发事件），每次清空后全量重写。
 * 取舍与不变量：manifest.documents 以路由 path 为键，posts / research 的列表项剔除
 * body；哈希文件名保证旧 JSON 不跨部署残留；content/hide/ 与 COLLECTIONS 之外不发布。
 * 边界：只产出数据资产到 public/_content/（供 queryContents.ts 读取），不渲染页面、
 * 不定义路由，也不处理 .md 以外的文件。
 */

import { createHash } from "node:crypto"
import {
    existsSync, mkdirSync, readFileSync, rmSync, writeFileSync,
} from "node:fs"
import path from "node:path"
import { createResolver, defineNuxtModule } from "@nuxt/kit"
import FastGlob from "fast-glob"
import { visit } from "unist-util-visit"
import { createContentParser, toSourcePath } from "./content-parser"

const { dirname, join, relative } = path

const COLLECTIONS: Record<string, { patterns: string[]; root: string }> = {
    archives: { patterns: ["archives/**/*.md"], root: "archives" },
    home: { patterns: ["home.md"], root: "home" },
    posts: { patterns: ["posts/**/*.md"], root: "posts" },
    research: { patterns: ["research/**/*.md"], root: "research" },
    uses: { patterns: ["uses.md"], root: "uses" },
}

function yamlDate(value: any): any {
    if (value instanceof Date) {
        return value.toISOString()
    }
    return value
}

export default defineNuxtModule({
    meta: {
        name: "static-content",
    },
    async setup(_, nuxt) {
        const resolver = createResolver(import.meta.url)
        const { rootDir } = nuxt.options
        void resolver
        const { buildDir } = nuxt.options
        void buildDir
        // 写入 Nuxt 的 public 目录，以便文件随构建拷贝到 dist，并在预渲染与
        // 静态托管时由 Nitro 的静态 handler 直接提供。
        const publicDir = join(rootDir, "public", "_content")
        const outDir = publicDir

        const mdcOptions = (nuxt.options as any).mdc ?? {}
        const { highlight } = mdcOptions
        const { parse } = await createContentParser({ highlight })

        // 串行化重建（dev watcher 会突发多条事件）。catch 只用于排空上一次已
        // reject 的链路：临时写坏的文档不能让后续 watcher 重建永久失效；
        // 而本次重建自身的 reject 仍会抛给调用方（dev 遮罩/控制台，或 setup 期
        // 的硬性构建失败）。
        let rebuildChain: Promise<void> = Promise.resolve()

        async function rebuild() {
            rebuildChain = rebuildChain.catch(() => {}).then(async () => {
                if (existsSync(outDir)) {
                    rmSync(outDir, { force: true, recursive: true })
                }
                mkdirSync(outDir, { recursive: true })

                const files = await FastGlob(Object.values(COLLECTIONS).flatMap(c => c.patterns), {
                    absolute: false,
                    cwd: join(rootDir, "content"),
                    onlyFiles: true,
                })

                const documents: Record<string, string> = {}
                const posts: Array<Record<string, any>> = []
                const research: Array<Record<string, any>> = []
                const errors: string[] = []

                for (const file of files.sort()) {
                    const absPath = join(rootDir, "content", file)
                    let markdown: string
                    try {
                        markdown = readFileSync(absPath, "utf8")
                    } catch (error) {
                        errors.push(`${file}: ${(error as Error).message}`)
                        continue
                    }

                    const { path, title: fallbackTitle } = toSourcePath(file)
                    const parsed = await parse(markdown, {
                        id: file,
                        path,
                    })
                    // 复刻 @nuxt/content 的树压缩：剥离 <code> 节点上的空
                    // `className` 数组，避免 MDCRenderer 在未解析（字面量）标签上
                    // 输出 class=""。
                    visit(parsed.body as any, (node: any) => {
                        if (node.tag === "code" && node.props?.className?.length === 0) {
                            delete node.props.className
                        }
                    })

                    const data: Record<string, any> = {
                        ...parsed.data,
                        _path: path,
                        body: parsed.body,
                        id: file,
                        path,
                        title: (parsed.data as any)?.title ?? fallbackTitle,
                    }
                    for (const key of Object.keys(data)) {
                        if (data[key] instanceof Date) {
                            data[key] = yamlDate(data[key])
                        }
                    }

                    // 文件名带内容哈希：旧 JSON 不会跨部署残留。
                    const fileName = `${path.slice(1).replaceAll("/", "_")}.${createHash("sha1").update(JSON.stringify(data))
                        .digest("hex")
                        .slice(0, 8)}.json`
                    const outPath = join(outDir, fileName)
                    writeFileSync(outPath, JSON.stringify(data))

                    if (documents[path]) {
                        errors.push(`duplicate path ${path} from ${file}`)
                    }
                    documents[path] = fileName

                    // 首页文档额外以 "/" 暴露（index 页）。
                    if (file === "home.md") {
                        documents["/"] = fileName
                    }

                    if (file.startsWith("posts/")) {
                        // 仅元数据——列表页不得下载正文。
                        const { body: _body, ...metaOnly } = data
                        posts.push(metaOnly)
                    }

                    if (file.startsWith("research/")) {
                        const { body: _body, ...metaOnly } = data
                        research.push(metaOnly)
                    }
                }

                if (errors.length > 0) {
                    throw new Error(`static-content: ${errors.join("; ")}`)
                }

                posts.sort((a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf())
                research.sort((a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf())

                const manifest = {
                    documents,
                    posts,
                    research,
                }
                writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest))

                const parsedCount = Object.keys(documents).length
                console.log(`[static-content] wrote ${parsedCount} paths + manifest (${posts.length} posts, ${research.length} research) to ${relative(rootDir, outDir)}`)
            })
            return rebuildChain
        }

        await rebuild()

        // dev watcher：content/ 下新增/修改/删除 .md 时重建。
        if (nuxt.options.dev) {
            const contentDir = join(rootDir, "content")
            nuxt.hook("builder:watch", async (_event: string, path: string) => {
                const rel = dirname(path)
                if (rel.startsWith(contentDir) && path.endsWith(".md")) {
                    await rebuild()
                }
            })
        }
    },
})
