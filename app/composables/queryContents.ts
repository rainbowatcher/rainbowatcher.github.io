/**
 * 做什么：读取构建期产物 public/_content/（manifest.json 与哈希 JSON），向页面提供
 * 首页/文档、博客列表、知识库条目、研究报告与专题列表。
 * 状态与生命周期：manifestPromise 首次读取后模块级缓存，失败时清除以允许重试。
 * 取舍与不变量：SSR 直接读磁盘（Nitro 不向进程内 $fetch 暴露 public 资产），客户端走
 * $fetch；posts 的 permalink 由 addPermalink 现场补齐，notes / research / topics 的 path 即路由。
 * 边界：不做路由匹配、不渲染页面、不写产物。
 */

import process from "node:process"
import { addPermalink, toNavItems } from "~/utils/path"
import type { ContentDocument, NavigationItem, Note, Post, Research, Topic } from "~/types/content"

type Manifest = {
    documents: Record<string, string>
    notes: Note[]
    posts: ContentDocument[]
    research: Research[]
    topics: Topic[]
}

let manifestPromise: Promise<Manifest> | undefined

function baseURL() {
    const config = useRuntimeConfig()
    const url = (config.app?.baseURL ?? "/").replace(/\/$/, "")
    return url
}

/**
 * Totally public-asset fetch (client + SPA navigation on static hosting).
 * At prerender time Nitro does not serve public assets to in-process
 * $fetch, so read the very same generated files from disk on the server.
 */
async function loadJson<T>(file: string): Promise<T> {
    if (import.meta.server) {
        const { readFileSync } = await import(/* @vite-ignore */ "node:fs")
        return JSON.parse(readFileSync(`${process.cwd()}/public/_content/${file}`, "utf8")) as T
    }
    return (await $fetch<T>(`${baseURL()}/_content/${file}`)) as T
}

async function getManifest(): Promise<Manifest> {
    if (!manifestPromise) {
        // Evict the cached promise on failure so one transient fetch error
        // does not brick navigation for the whole client session.
        manifestPromise = loadJson<Manifest>("manifest.json").catch((error) => {
            manifestPromise = undefined
            throw error
        })
    }
    return manifestPromise
}

async function fetchDocument(path: string): Promise<ContentDocument | undefined> {
    const normalized = path.length > 1 ? path.replace(/\/$/, "") : path
    const manifest = await getManifest()
    const file = manifest.documents[normalized]
    if (!file) {
        return undefined
    }
    return await loadJson<ContentDocument>(file)
}

export function usePosts() {
    return async (): Promise<Post[]> => {
        const manifest = await getManifest()
        return addPermalink(manifest.posts as Post[])
    }
}

export function usePost(path: string) {
    return async (): Promise<ContentDocument | undefined> => {
        return await fetchDocument(path)
    }
}

export function useNavItems() {
    return async (): Promise<NavigationItem[]> => {
        const manifest = await getManifest()
        return toNavItems(manifest.posts as Post[])
    }
}

export function useNotes() {
    return async (): Promise<Note[]> => {
        const manifest = await getManifest()
        return manifest.notes
    }
}

export function useResearch() {
    return async (): Promise<Research[]> => {
        const manifest = await getManifest()
        return manifest.research
    }
}

export function useTopics() {
    return async (): Promise<Topic[]> => {
        const manifest = await getManifest()
        return manifest.topics
    }
}

export function useDocument(path: string) {
    return async (): Promise<ContentDocument | undefined> => {
        return await fetchDocument(path)
    }
}
