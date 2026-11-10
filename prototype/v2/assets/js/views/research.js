/**
 * 做什么：v2 研究页：本机环境报告列表，顶部用整块琥珀提示结论的时效性。
 * 取舍：强调“换台机器未必复现”，不让研究内容看起来像通用教程。
 * 边界：不渲染报告正文，详情由文章视图承担。
 */

import { researchReports } from "../data.js"
import { esc, fmtDate, sortedPosts } from "../utils.js"
import { icon } from "../icons.js"

export function render() {
    const reports = sortedPosts(researchReports)

    return `
    <div class="view-enter">
        <div class="wrap">
            <header class="page-head">
                <div>
                    <h1 class="page-title">研究</h1>
                    <p class="page-sub">基于本机环境的探索报告：工具实测、版本差异，以及一些命令行之外的入口。</p>
                </div>
                <p class="page-meta"><strong>${reports.length}</strong> 篇<br />环境相关</p>
            </header>

            <div class="research">
                <div class="research-note">
                    <strong>先读这一句</strong>
                    <p>这些结论依赖当时的机器状态、工具版本与本地配置，换台机器未必复现。引用前请先在本机复验。</p>
                </div>

                <div class="research-list">
                    ${reports
                        .map(
                            (report) => `
                        <a class="research-row" href="#/research/${report.slug}">
                            <time class="research-date" datetime="${report.date}">${fmtDate(report.date)}</time>
                            <span>
                                <span class="research-title">${esc(report.title)}</span>
                                <span class="research-sub">${esc(report.subtitle)}</span>
                                <span class="research-tags">${report.tags
                                    .map((tag) => `<span class="tag">${esc(tag)}</span>`)
                                    .join("")}</span>
                            </span>
                            <span class="research-arrow">${icon("arrow-up-right")}</span>
                        </a>`,
                        )
                        .join("")}
                </div>
            </div>
        </div>
    </div>`
}

export function title() {
    return "研究 — Rainbow Watcher"
}
