/**
 * 做什么：全局搜索浮层：文章与固定页面的即时过滤、键盘选择与跳转。
 * 取舍：纯前端内存索引，不引入 DocSearch；快捷键 ⌘K / CtrlK。
 * 边界：只索引本原型的数据，不请求远端搜索服务。
 */

import { posts, researchReports } from "./data.js"
import { esc, fmtDate } from "./utils.js"

const PAGES = [
    { title: "研究", desc: "基于本机环境的探索报告", href: "#/research", tag: "PAGE" },
    { title: "在用", desc: "每天真正在使用的工具与硬件", href: "#/uses", tag: "PAGE" },
    { title: "归档", desc: "按时间浏览全部文章", href: "#/archives", tag: "PAGE" },
    { title: "项目", desc: "维护中的开源项目", href: "#/projects", tag: "PAGE" },
]

let dialog
let input
let results
let count
let items = []
let cursor = 0

function index() {
    return [
        ...posts.map((post) => ({
            title: post.title,
            desc: `${fmtDate(post.date)} · ${post.tags.join(" / ")}`,
            href: `#/posts/${post.slug}`,
            tag: "POST",
            haystack: `${post.title} ${post.subtitle ?? ""} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase(),
        })),
        ...researchReports.map((report) => ({
            title: report.title,
            desc: `${fmtDate(report.date)} · 研究`,
            href: `#/research/${report.slug}`,
            tag: "LAB",
            haystack: `${report.title} ${report.subtitle} ${report.tags.join(" ")}`.toLowerCase(),
        })),
        ...PAGES.map((page) => ({
            ...page,
            haystack: `${page.title} ${page.desc}`.toLowerCase(),
        })),
    ]
}

function paint() {
    const keyword = input.value.trim().toLowerCase()
    items = index().filter((item) => !keyword || item.haystack.includes(keyword))
    cursor = 0

    if (!items.length) {
        results.innerHTML = `<p class="palette-empty">没有找到“${esc(input.value.trim())}”<br>试试文章标题、主题或“归档”。</p>`
        count.textContent = "0 个结果"
        return
    }

    const groups = new Map()
    for (const item of items) {
        if (!groups.has(item.tag)) groups.set(item.tag, [])
        groups.get(item.tag).push(item)
    }
    const labels = { POST: "文章", LAB: "研究", PAGE: "页面" }
    let indexInList = 0
    results.innerHTML = [...groups.entries()]
        .map(
            ([tag, group]) => `
        <div class="palette-group">${labels[tag] ?? tag}</div>
        ${group
            .map((item) => {
                const position = indexInList++
                return `
            <a class="palette-item" href="${item.href}" role="option" aria-selected="${position === 0}" data-index="${position}">
                <main>
                    <strong>${esc(item.title)}</strong>
                    <small>${esc(item.desc)}</small>
                </main>
                <span class="palette-item-tag">${item.tag}</span>
            </a>`
            })
            .join("")}
    `,
        )
        .join("")
    count.textContent = `${items.length} 个结果`
    markCursor()
}

function markCursor() {
    const nodes = [...results.querySelectorAll(".palette-item")]
    nodes.forEach((node, index) => {
        node.setAttribute("aria-selected", String(index === cursor))
    })
    nodes[cursor]?.scrollIntoView({ block: "nearest" })
}

function move(step) {
    if (!items.length) return
    cursor = (cursor + step + items.length) % items.length
    markCursor()
}

function open() {
    if (!dialog.open) dialog.showModal()
    input.value = ""
    paint()
    requestAnimationFrame(() => input.focus())
}

function close() {
    if (dialog.open) dialog.close()
}

export function initSearch() {
    dialog = document.querySelector("#searchDialog")
    input = document.querySelector("#paletteInput")
    results = document.querySelector("#paletteResults")
    count = document.querySelector("#paletteCount")

    document.querySelectorAll("[data-open-search]").forEach((button) => {
        button.addEventListener("click", open)
    })

    input.addEventListener("input", paint)

    input.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault()
            move(1)
        } else if (event.key === "ArrowUp") {
            event.preventDefault()
            move(-1)
        } else if (event.key === "Enter") {
            event.preventDefault()
            const href = items[cursor]?.href
            if (href) {
                close()
                window.location.hash = href.slice(1)
            }
        }
    })

    results.addEventListener("click", (event) => {
        const item = event.target.closest(".palette-item")
        if (item) close()
    })

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) close()
    })

    document.addEventListener("keydown", (event) => {
        const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
            event.preventDefault()
            open()
        } else if (event.key === "/" && !isInput && !dialog.open) {
            event.preventDefault()
            open()
        }
    })
}
