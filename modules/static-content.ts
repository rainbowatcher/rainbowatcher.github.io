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
    uses: { patterns: ["uses.md"], root: "uses" },
}

function yamlDate(value: any): any {
    if (value instanceof Date) {
        return value.toISOString()
    }
    return value
}

/**
 * Build-time content layer: scans content/, parses each document once with
 * the shared Node-only parser, writes deterministic per-document JSON
 * assets plus a manifest into `buildDir/static-content/`, exposed under
 * `/_content/` as Nitro public assets.
 *
 * Nothing from content/hide/ is ever published.
 */
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
        // Generate into the Nuxt public dir so files are copied to dist and
        // served by Nitro's static handler during prerender + on static hosts.
        const publicDir = join(rootDir, "public", "_content")
        const outDir = publicDir

        const mdcOptions = (nuxt.options as any).mdc ?? {}
        const { highlight } = mdcOptions
        const { parse } = await createContentParser({ highlight })

        // Serialize rebuilds (dev watcher can fire bursts of events). The
        // recovery catch only drains a previously rejected chain: a transient
        // malformed edit must not permanently break later watcher rebuilds,
        // while the current rebuild's own rejection still propagates to the
        // caller (dev overlay/console, or a hard build failure at setup).
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
                    // Reproduce @nuxt/content's tree compression: empty
                    // `className` arrays on <code> nodes are stripped so
                    // MDCRenderer does not emit class="" on unresolved
                    // (literal) tags.
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

                    // Content-hash filename: stale JSON never outlives a redeploy.
                    const fileName = `${path.slice(1).replaceAll("/", "_")}.${createHash("sha1").update(JSON.stringify(data))
                        .digest("hex")
                        .slice(0, 8)}.json`
                    const outPath = join(outDir, fileName)
                    writeFileSync(outPath, JSON.stringify(data))

                    if (documents[path]) {
                        errors.push(`duplicate path ${path} from ${file}`)
                    }
                    documents[path] = fileName

                    // Home doc is additionally reachable at "/" (index page).
                    if (file === "home.md") {
                        documents["/"] = fileName
                    }

                    if (file.startsWith("posts/")) {
                        // Meta only — list views must not download bodies.
                        const { body: _body, ...metaOnly } = data
                        posts.push(metaOnly)
                    }
                }

                if (errors.length > 0) {
                    throw new Error(`static-content: ${errors.join("; ")}`)
                }

                posts.sort((a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf())

                const manifest = {
                    documents,
                    posts,
                }
                writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest))

                const parsedCount = Object.keys(documents).length
                console.log(`[static-content] wrote ${parsedCount} paths + manifest (${posts.length} posts) to ${relative(rootDir, outDir)}`)
            })
            return rebuildChain
        }

        await rebuild()

        // Dev watcher: rebuild on add/change/unlink under content/.
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
