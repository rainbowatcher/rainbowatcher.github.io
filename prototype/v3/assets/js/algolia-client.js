/**
 * 做什么：连接站点已有的 Algolia 索引，把命中结果映射到原型页面。
 * 状态与生命周期：客户端脚本按需加载一次；请求失败时清空缓存，允许下次重试。
 * 取舍与不变量：凭据与索引名取自 siteConfig.ts 的 docSearch，属于公开搜索密钥。
 * 边界：不渲染界面，也不做本地兜底搜索；断网时明确报出不可用。
 */

const CLIENT_URL = "https://cdn.jsdelivr.net/npm/algoliasearch@4.24.0/dist/algoliasearch-lite.umd.js"
const APP_ID = "3BGNB9V5MC"
const SEARCH_KEY = "f757c625852758ee96aaf2268959166e"
const INDEX_NAME = "rainbowatcher"

let clientPromise = null

function loadClient() {
    if (window.algoliasearch) return Promise.resolve(window.algoliasearch)
    if (clientPromise) return clientPromise

    clientPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = CLIENT_URL
        script.async = true
        script.onload = () => {
            if (window.algoliasearch) resolve(window.algoliasearch)
            else reject(new Error("搜索客户端未就绪"))
        }
        script.onerror = () => reject(new Error("无法加载搜索客户端"))
        document.head.append(script)
    })
    return clientPromise
}

export async function searchSite(query, limit = 8) {
    try {
        const createClient = await loadClient()
        const index = createClient(APP_ID, SEARCH_KEY).initIndex(INDEX_NAME)
        const response = await index.search(query, { hitsPerPage: limit })
        return response.hits ?? []
    } catch (error) {
        clientPromise = null
        throw error
    }
}

export function hitTitle(hit) {
    const level = hit.hierarchy ?? {}
    return level.lvl1 || level.lvl0 || hit.title || hit.url || "未命名条目"
}

export function hitSection(hit) {
    const level = hit.hierarchy ?? {}
    return level.lvl0 || level.lvl2 || hit.type || "站点内容"
}

export function hitExcerpt(hit) {
    return hit.content || hit.description || hit._snippetResult?.content?.value || ""
}

export function prototypeUrl(hit) {
    const url = String(hit.url || hit.permalink || hit.objectID || "")
    if (url.includes("research")) return "research-note.html"
    if (url.includes("uses")) return "uses.html"
    if (url.includes("project")) return "projects.html"
    if (url.includes("archive")) return "archives.html"
    if (url.includes("post") || url.includes("tag")) return "article.html"
    return "index.html"
}
