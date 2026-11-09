import process from "node:process"
import { addPermalink, toNavItems } from "~/utils/path"
import type { ContentDocument, NavigationItem, Post } from "~/types/content"

export type { ContentDocument, NavigationItem, Post }

type Manifest = {
    documents: Record<string, string>
    posts: ContentDocument[]
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
    return await $fetch<T>(`${baseURL()}/_content/${file}`)
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

export function useDocument(path: string) {
    return async (): Promise<ContentDocument | undefined> => {
        return await fetchDocument(path)
    }
}
