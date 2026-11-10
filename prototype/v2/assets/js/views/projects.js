/**
 * 做什么：v2 项目页：把项目排成大行，缩写当索引，不用卡片和图标底板。
 * 取舍：状态与标签是辅助信息，正文只留名称、一句描述和去向。
 * 边界：不展示仓库统计或提交记录。
 */

import { projects } from "../data.js"
import { esc } from "../utils.js"
import { icon } from "../icons.js"

export function render() {
    return `
    <div class="view-enter">
        <div class="wrap">
            <header class="page-head">
                <div>
                    <h1 class="page-title">项目</h1>
                    <p class="page-sub">维护中的开源项目，以及这个站点本身。都在 GitHub 上。</p>
                </div>
                <p class="page-meta"><strong>${projects.length}</strong> 个<br />持续维护</p>
            </header>

            <div class="project-list">
                ${projects
                    .map(
                        (project) => `
                    <a class="project-row" href="${esc(project.link)}" target="_blank" rel="noreferrer">
                        <span class="project-mark" aria-hidden="true">${esc(project.mark)}</span>
                        <span class="project-main">
                            <h2>${esc(project.name)}</h2>
                            <p>${esc(project.description)}</p>
                            <span class="project-tags">${project.tags
                                .map((tag) => `<span class="tag">${esc(tag)}</span>`)
                                .join("")}</span>
                        </span>
                        <span class="project-status">${esc(project.status)}</span>
                        <span class="project-arrow">${icon("arrow-up-right")}</span>
                    </a>`,
                    )
                    .join("")}
            </div>

            <a class="library-cta" href="https://github.com/rainbowatcher" target="_blank" rel="noreferrer">
                <span>全部代码在 GitHub</span>
                ${icon("arrow-up-right")}
            </a>
        </div>
    </div>`
}

export function title() {
    return "项目 — Rainbow Watcher"
}
