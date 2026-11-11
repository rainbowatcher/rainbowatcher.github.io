/**
 * 做什么：知识库页：把研究报告与博文并入同一条可追溯索引，按时间倒序排列。
 * 取舍：不再按年份分组，也不区分报告与笔记；两者都使用同一行式列表。
 * 边界：不渲染正文，正文由 article 视图承担。
 */

import { posts, researchReports } from "../data.js"
import { postRow, sortedPosts } from "../utils.js"

export function render() {
    const entries = sortedPosts([
        ...researchReports.map((report) => ({ ...report, hrefBase: "research" })),
        ...posts.map((post) => ({ ...post, hrefBase: "posts" })),
    ])
    const years = entries.map((entry) => entry.date.slice(0, 4))
    const span = `${years.at(-1)}—${years[0]}`

    return `
    <div class="container view-enter">
        <header class="page-head">
            <p class="eyebrow">Knowledge / Traceable notes</p>
            <div class="page-title-row">
                <h1 class="page-title">知识库</h1>
                <span class="page-meta">${entries.length} ENTRIES · ${span}</span>
            </div>
            <p class="page-desc">研究报告与笔记的统一索引。和博客不同，这里尽量留下可追溯的命令、版本与边界。</p>
        </header>

        <div class="post-list">
            ${entries.map((entry) => postRow(entry, { hrefBase: entry.hrefBase, linkTags: false })).join("")}
        </div>
    </div>`
}

export function title() {
    return "知识库 — Rainbow Watcher"
}
