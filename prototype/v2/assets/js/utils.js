/**
 * 做什么：v2 视图共用的纯函数：日期、转义、标签、条目行与查询参数。
 * 取舍：首页条目整行可点，列表页保留标签链接，用覆盖层而不是嵌套链接。
 * 边界：不处理 DOM，也不发起导航。
 */

export function fmtDate(iso) {
    return iso.replaceAll("-", ".")
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

export function homeEntry(post, index = 0) {
    return `
        <a class="entry entry-link" href="#/posts/${post.slug}" data-reveal style="--delay:${index * 60}ms">
            <time class="entry-date" datetime="${post.date}">${fmtDate(post.date)}</time>
            <span class="entry-main">
                <span class="entry-title">${esc(post.title)}</span>
                <span class="entry-excerpt">${esc(post.excerpt)}</span>
            </span>
            <span class="entry-tags">${post.tags
                .slice(0, 3)
                .map((tag) => tagChip(tag, { link: false }))
                .join("")}</span>
            <span class="entry-arrow" aria-hidden="true"><svg class="arrow-ic" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg></span>
        </a>`
}

export function postRow(post) {
    return `
        <div class="entry">
            <time class="entry-date" datetime="${post.date}">${fmtDate(post.date)}</time>
            <span class="entry-main">
                <a class="entry-title" href="#/posts/${post.slug}">${esc(post.title)}</a>
                <span class="entry-excerpt">${esc(post.excerpt)}</span>
            </span>
            <span class="entry-tags">${post.tags
                .slice(0, 3)
                .map((tag) => tagChip(tag))
                .join("")}</span>
            <a class="entry-arrow" href="#/posts/${post.slug}" aria-label="阅读 ${esc(post.title)}"><svg class="arrow-ic" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg></a>
        </div>`
}

export function queryOf(route) {
    return new URLSearchParams(route.query)
}

export function pageTitleFor(route, postsCount) {
    const map = {
        home: "Rainbow Watcher — 看彩虹的人",
        posts: `文章 · ${postsCount} 篇 — Rainbow Watcher`,
        archives: "归档 — Rainbow Watcher",
        uses: "在用 — Rainbow Watcher",
        projects: "项目 — Rainbow Watcher",
        research: "研究 — Rainbow Watcher",
        notfound: "页面不存在 — Rainbow Watcher",
    }
    return map[route.name] ?? "Rainbow Watcher"
}
