/**
 * 做什么：v2 在用页：按场景分组的工具清单，整行可点，不做卡片。
 * 取舍：只显示真实在用的名字与一句说明；删掉数据里的装饰性编号。
 * 边界：不负责推荐、比价或外部链接的可用性。
 */

import { usesSections } from "../data.js"
import { esc } from "../utils.js"
import { icon } from "../icons.js"

function external(href) {
    return href?.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""
}

export function render() {
    const total = usesSections.reduce((sum, section) => sum + section.items.length, 0)

    return `
    <div class="view-enter">
        <div class="wrap">
            <header class="page-head">
                <div>
                    <h1 class="page-title">在用</h1>
                    <p class="page-sub">每天真正会打开的东西：编辑器、终端、浏览器扩展，还有一些硬件。</p>
                </div>
                <p class="page-meta"><strong>${total}</strong> 项<br />${usesSections.length} 组</p>
            </header>

            <div class="uses">
                ${usesSections
                    .map(
                        (section) => `
                    <section class="uses-group" aria-labelledby="use-${section.id}">
                        <div class="uses-head">
                            <h2 id="use-${section.id}">${esc(section.title)}</h2>
                            <p>${section.items.length} 项</p>
                        </div>
                        <div class="use-list">
                            ${section.items
                                .map(
                                    (item) => `
                                <a class="use-row" href="${esc(item.href)}"${external(item.href)}>
                                    <span class="use-name">${esc(item.name)}</span>
                                    <span class="use-desc">${esc(item.desc)}</span>
                                    <span class="use-side">${esc(item.side)}</span>
                                    <span class="use-arrow" aria-hidden="true">${icon("arrow-up-right")}</span>
                                </a>`,
                                )
                                .join("")}
                        </div>
                    </section>`,
                    )
                    .join("")}
            </div>

            <a class="library-cta" href="https://github.com/rainbowatcher/scripts" target="_blank" rel="noreferrer">
                <span>脚本与配置都在 GitHub</span>
                ${icon("arrow-up-right")}
            </a>
        </div>
    </div>`
}

export function title() {
    return "在用 — Rainbow Watcher"
}
