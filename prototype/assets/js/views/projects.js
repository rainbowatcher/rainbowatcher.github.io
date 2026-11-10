/**
 * 做什么：项目页：以卡片展示维护中的开源项目与入口。
 * 取舍：不展示 star 数等易过期的指标，只保留状态、简介与技术标签。
 * 边界：不负责项目详情页，链接直接跳到 GitHub。
 */

import { projects } from "../data.js"
import { esc } from "../utils.js"
import { icon } from "../icons.js"

export function render() {
    return `
    <div class="container view-enter">
        <header class="page-head">
            <p class="eyebrow">Projects / Open source</p>
            <div class="page-title-row">
                <h1 class="page-title">项目</h1>
                <span class="page-meta">${String(projects.length).padStart(2, "0")} ACTIVE</span>
            </div>
            <p class="page-desc">长期维护的小工具和配置。数量不多，尽量让每一个都能用、能读、能改。</p>
        </header>

        <div class="project-grid">
            ${projects
                .map(
                    (project) => `
            <article class="project-card">
                <div class="project-top">
                    <span class="project-mark" aria-hidden="true">${esc(project.mark)}</span>
                    <span class="project-status">${esc(project.status)}</span>
                </div>
                <h2>${esc(project.name)}</h2>
                <p>${esc(project.description)}</p>
                <div class="project-foot">
                    <div class="tag-row">${project.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div>
                    <a class="project-link" href="${project.link}" target="_blank" rel="noreferrer">GitHub ${icon("arrow-up-right")}</a>
                </div>
            </article>`,
                )
                .join("")}

            <div class="project-more">
                <span>还有一些零散的实验留在本地，<br>整理好之后再放上来。</span>
                <a href="https://github.com/rainbowatcher?tab=repositories" target="_blank" rel="noreferrer">去 GitHub 看看 ${icon("arrow-up-right")}</a>
            </div>
        </div>

        <div class="notice" style="margin-top:36px">
            ${icon("info")}
            <div>
                <strong>关于这张列表</strong>
                <p>只列出仍在维护、且我愿意回答问题的项目。归档与实验性仓库不在此列。</p>
            </div>
        </div>
    </div>`
}
