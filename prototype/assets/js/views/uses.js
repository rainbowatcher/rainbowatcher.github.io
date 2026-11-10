/**
 * 做什么：在用页面：按场景分组的工具、硬件与命令行清单。
 * 取舍：左侧目录吸顶，移动端降级为横向标签，保持长名单可跳转。
 * 边界：内容来自 data.js，不在页面内维护清单。
 */

import { usesSections } from "../data.js"
import { esc } from "../utils.js"
import { icon } from "../icons.js"

function useItem(item) {
    return `
    <div class="use-item">
        <div class="use-item-main">
            ${
                item.href
                    ? `<a href="${item.href}" target="_blank" rel="noreferrer">${esc(item.name)}</a>`
                    : `<span style="font-size:14px;font-weight:600">${esc(item.name)}</span>`
            }
            <p>${esc(item.desc)}</p>
        </div>
        <span class="use-item-side">${esc(item.side)}</span>
    </div>`
}

export function render() {
    return `
    <div class="container view-enter">
        <header class="page-head">
            <p class="eyebrow">Uses / Setup</p>
            <div class="page-title-row">
                <h1 class="page-title">在用</h1>
                <span class="page-meta">LAST UPDATED 2026.11</span>
            </div>
            <p class="page-desc">工具是手的延伸。这里记录我每天真正在用的软件、硬件和命令行工具，不追求全，只记录留下来的。</p>
        </header>

        <div class="uses-layout">
            <aside class="uses-index" aria-label="在本页中跳转">
                <span class="uses-index-label">On this page</span>
                ${usesSections.map((section) => `<a href="#/uses" data-target="${section.id}">${esc(section.title)}</a>`).join("")}
            </aside>

            <div class="uses-sections">
                ${usesSections
                    .map(
                        (section) => `
                <section class="uses-section" id="uses-${section.id}">
                    <h2>${esc(section.title)} <span>${section.note}</span></h2>
                    <div class="uses-card">${section.items.map(useItem).join("")}</div>
                </section>`,
                    )
                    .join("")}

                <section class="uses-section" aria-label="说明">
                    <div class="notice">
                        ${icon("info")}
                        <div>
                            <strong>关于这份清单</strong>
                            <p>只列长期使用的工具，试用两周以内的不收入。链接指向官网或开源仓库，不含推广参数。</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>`
}

export function mount() {
    const links = [...document.querySelectorAll(".uses-index a")]
    const sections = links
        .map((link) => ({ link, section: document.querySelector(`#uses-${link.dataset.target}`) }))
        .filter((item) => item.section)

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault()
            document
                .querySelector(`#uses-${link.dataset.target}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
        })
    })

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue
                const current = sections.find((item) => item.section === entry.target)
                links.forEach((link) => link.classList.toggle("is-active", link === current?.link))
            }
        },
        { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    )

    sections.forEach((item) => observer.observe(item.section))
    return () => observer.disconnect()
}
