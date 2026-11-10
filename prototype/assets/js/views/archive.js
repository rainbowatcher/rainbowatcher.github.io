/**
 * 做什么：归档页：按年份分组展示全部文章与年份计数。
 * 取舍：不做二次筛选，年份标签只承担阅读锚点的作用。
 * 边界：不包含研究分区的内容。
 */

import { posts } from "../data.js"
import { esc, fmtDate, fmtMonth, sortedPosts } from "../utils.js"

export function render() {
    const sorted = sortedPosts(posts)
    const years = [...new Set(sorted.map((post) => post.date.slice(0, 4)))]
    const groups = years.map((year) => ({
        year,
        items: sorted.filter((post) => post.date.startsWith(year)),
    }))

    return `
    <div class="container view-enter">
        <header class="page-head">
            <p class="eyebrow">Archive / All posts</p>
            <div class="page-title-row">
                <h1 class="page-title">归档</h1>
                <span class="page-meta">${sorted.length} POSTS · ${years.at(-1)}—${years[0]}</span>
            </div>
            <p class="page-desc">所有写过的东西，按年份排好。没有分类，只有时间。</p>
        </header>

        <div class="archive-list">
            ${groups
                .map(
                    (group) => `
            <section class="archive-year" aria-labelledby="year-${group.year}">
                <div class="archive-year-label">
                    <strong id="year-${group.year}">${group.year}</strong>
                    <span>${String(group.items.length).padStart(2, "0")} POSTS</span>
                </div>
                <div class="archive-rows">
                    ${group.items
                        .map(
                            (post) => `
                    <div class="archive-row">
                        <time datetime="${post.date}">${fmtMonth(post.date)}</time>
                        <a href="#/posts/${post.slug}">${esc(post.title)}</a>
                        <span class="tag">${esc(post.tags[0] ?? "")}</span>
                    </div>`,
                        )
                        .join("")}
                </div>
            </section>`,
                )
                .join("")}
        </div>

        <p class="page-meta" style="margin-top:28px;padding:0">最近更新 ${fmtDate(sorted[0].date)} · 时间会继续往前走</p>
    </div>`
}
