/**
 * 做什么：v2 归档页：按年份分组，年份保持大字，右侧是紧凑的时间索引。
 * 取舍：年份是真实数据，不做装饰性编号；行与行之间只靠留白分开。
 * 边界：不负责分页与主题筛选。
 */

import { posts } from "../data.js"
import { esc, fmtDate, sortedPosts } from "../utils.js"

export function render() {
    const sorted = sortedPosts(posts)
    const groups = new Map()
    for (const post of sorted) {
        const year = post.date.slice(0, 4)
        if (!groups.has(year)) groups.set(year, [])
        groups.get(year).push(post)
    }

    return `
    <div class="view-enter">
        <div class="wrap">
            <header class="page-head">
                <div>
                    <h1 class="page-title">归档</h1>
                    <p class="page-sub">从 2022 年到现在，所有写过的笔记。按年份倒序排列。</p>
                </div>
                <p class="page-meta"><strong>${sorted.length}</strong> 篇<br />${groups.size} 个年份</p>
            </header>

            <div class="archive">
                ${[...groups.entries()]
                    .map(
                        ([year, items]) => `
                    <section class="year-group" aria-labelledby="year-${year}">
                        <h2 class="year" id="year-${year}">${year}</h2>
                        <div class="year-list">
                            ${items
                                .map(
                                    (post) => `
                                <a class="year-row" href="#/posts/${post.slug}">
                                    <time class="year-date" datetime="${post.date}">${fmtDate(post.date).slice(5)}</time>
                                    <span class="year-title">${esc(post.title)}</span>
                                    <span class="year-tags">${post.tags
                                        .slice(0, 2)
                                        .map((tag) => `<span class="tag">${esc(tag)}</span>`)
                                        .join("")}</span>
                                </a>`,
                                )
                                .join("")}
                        </div>
                    </section>`,
                    )
                    .join("")}
            </div>
        </div>
    </div>`
}

export function title() {
    return "归档 — Rainbow Watcher"
}
