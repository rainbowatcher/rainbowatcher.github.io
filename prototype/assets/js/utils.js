/**
 * 做什么：视图共用的纯函数：日期、转义、标签统计与路由参数。
 * 取舍：日期输出统一为 YYYY.MM.DD，避免各页各写一套格式。
 * 边界：不处理 DOM，也不发起导航。
 */

export function fmtDate(iso) {
    return iso.replaceAll("-", ".")
}

export function fmtMonth(iso) {
    return iso.slice(5, 10).replace("-", ".")
}

export function esc(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
}

export function sortedPosts(list) {
    return [...list].sort((a, b) => b.date.localeCompare(a.date))
}

export function tagStats(list) {
    const map = new Map()
    for (const post of list) {
        for (const tag of post.tags) {
            map.set(tag, (map.get(tag) ?? 0) + 1)
        }
    }
    return [...map.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function tagHref(tag, page) {
    const base = `#/posts?tag=${encodeURIComponent(tag)}`
    return page && page > 1 ? `${base}&page=${page}` : base
}

export function tagChip(tag, { active = false, link = true } = {}) {
    const cls = active ? "tag is-active" : "tag"
    return link ? `<a class="${cls}" href="${tagHref(tag)}">${esc(tag)}</a>` : `<span class="${cls}">${esc(tag)}</span>`
}

export function postRow(post, { hrefBase = "posts" } = {}) {
    return `
        <div class="post-row">
            <time class="post-date" datetime="${post.date}">${fmtDate(post.date)}</time>
            <span class="post-main">
                <a class="post-title" href="#/${hrefBase}/${post.slug}">${esc(post.title)}</a>
                <span class="post-excerpt">${esc(post.excerpt)}</span>
            </span>
            <span class="post-tags">${post.tags
                .slice(0, 3)
                .map((tag) => tagChip(tag))
                .join("")}</span>
            <span class="post-arrow" aria-hidden="true"><svg class="arrow-ic" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg></span>
        </div>`
}

export function queryOf(route) {
    return new URLSearchParams(route.query)
}

export function pageTitleFor(route, postsCount) {
    const map = {
        home: "Rainbow Watcher — 看彩虹的人",
        posts: `博客 · ${postsCount} 篇 — Rainbow Watcher`,
        archives: "归档 — Rainbow Watcher",
        uses: "在用 — Rainbow Watcher",
        projects: "项目 — Rainbow Watcher",
        research: "研究 — Rainbow Watcher",
        notfound: "页面不存在 — Rainbow Watcher",
    }
    return map[route.name] ?? "Rainbow Watcher"
}
