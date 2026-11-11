/**
 * 做什么：知识库页：合并研究报告与按年份归档的笔记，区别于博客的时间流。
 * 取舍：报告单独成节，归档保留年份分组；两者都指向可追溯的正文。
 * 边界：不渲染报告正文，正文由 article 视图承担。
 */

import { posts, researchReports } from "../data.js"
import { esc, fmtDate, fmtMonth, postRow, sortedPosts } from "../utils.js"

export function render() {
    const reports = sortedPosts(researchReports)
    const sorted = sortedPosts(posts)
    const years = [...new Set(sorted.map((post) => post.date.slice(0, 4)))]
    const groups = years.map((year) => ({
        year,
        items: sorted.filter((post) => post.date.startsWith(year)),
    }))

    return `
    <div class="container view-enter">
        <header class="page-head">
            <p class="eyebrow">Knowledge / Traceable notes</p>
            <div class="page-title-row">
                <h1 class="page-title">知识库</h1>
                <span class="page-meta">${String(reports.length).padStart(2, "0")} REPORT · ${sorted.length} ARCHIVE</span>
            </div>
            <p class="page-desc">研究报告与按年份归档的笔记。和博客不同，这里尽量留下可追溯的命令、版本与边界。</p>
        </header>

        <section class="home-section" aria-labelledby="knowledge-reports">
            <div class="section-head">
                <span class="section-index">01</span>
                <h2 id="knowledge-reports">研究报告</h2>
                <span class="more">本机环境 · 引用前复验</span>
            </div>
            <div class="post-list">${reports.map((report) => postRow(report, { hrefBase: "research" })).join("")}</div>
        </section>

        <section class="home-section" aria-labelledby="knowledge-archive">
            <div class="section-head">
                <span class="section-index">02</span>
                <h2 id="knowledge-archive">归档</h2>
                <span class="more">${sorted.length} 篇 · 按年份</span>
            </div>
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
        </section>

        <section class="home-section" aria-labelledby="knowledge-method">
            <div class="section-head">
                <span class="section-index">03</span>
                <h2 id="knowledge-method">记录方法</h2>
                <span class="more">先读协议 · 留命令 · 标环境</span>
            </div>
            <div class="method-grid">
                <div class="method-card">
                    <span>METHOD 01</span>
                    <h3>先读协议</h3>
                    <p>从 schema 和 API 文档入手，确认字段的真实含义，再动手写命令。</p>
                </div>
                <div class="method-card">
                    <span>METHOD 02</span>
                    <h3>留可复现命令</h3>
                    <p>每一条结论都配最小命令与当时的输出，避免只剩一句“我记得”。</p>
                </div>
                <div class="method-card">
                    <span>METHOD 03</span>
                    <h3>标注环境</h3>
                    <p>系统、版本、路径都写清楚。报告不是文档，结论有保质期。</p>
                </div>
            </div>
        </section>
    </div>`
}

export function title() {
    return "知识库 — Rainbow Watcher"
}
