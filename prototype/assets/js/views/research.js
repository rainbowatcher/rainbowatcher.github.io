/**
 * 做什么：研究分区首页：说明本地环境限制，列出探索报告与方法原则。
 * 取舍：报告单独分区，不与常规文章混排，避免把本机结论当通用文档。
 * 边界：不渲染报告正文，正文由 article 视图承担。
 */

import { researchReports } from "../data.js"
import { esc, fmtDate } from "../utils.js"
import { icon } from "../icons.js"

export function render() {
    const reports = [...researchReports].sort((a, b) => b.date.localeCompare(a.date))

    return `
    <div class="container view-enter">
        <header class="page-head">
            <p class="eyebrow">Research / Field notes</p>
            <div class="page-title-row">
                <h1 class="page-title">研究</h1>
                <span class="page-meta">${String(reports.length).padStart(2, "0")} REPORT · 2026</span>
            </div>
            <p class="page-desc">基于本机环境的探索报告：读协议、跑命令、记录版本，再把结果整理成可复验的步骤。</p>
        </header>

        <div class="notice">
            ${icon("flask")}
            <div>
                <strong>阅读前请知悉</strong>
                <p>这里的结论依赖当时的机器状态、工具版本与本地配置。换一台机器、换一个版本，结果可能不同；引用前请先在自己的环境里复验。</p>
            </div>
        </div>

        <div>
            ${reports
                .map(
                    (report) => `
            <a class="research-card" href="#/research/${report.slug}">
                <div class="research-card-meta">
                    <time datetime="${report.date}">${fmtDate(report.date)}</time><span class="dot"></span>
                    <span>${report.minutes} 分钟阅读</span>
                    ${report.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}
                </div>
                <h2>${esc(report.title)}</h2>
                <p>${esc(report.subtitle)}</p>
                <div class="research-card-foot">
                    <span>本机环境 · 可复验步骤</span>
                    <span>阅读报告 ${icon("arrow-right")}</span>
                </div>
            </a>`,
                )
                .join("")}
        </div>

        <section class="method-grid" aria-label="记录方法">
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
        </section>
    </div>`
}
