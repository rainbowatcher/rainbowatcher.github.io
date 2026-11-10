/**
 * 做什么：v2 搜索：全局 ⌘K 浮层与首页内联联想，共用一份内存索引。
 * 取舍：首页输入直接联想，Enter 进入完整索引；浮层支持方向键选择。
 * 边界：只索引原型数据，不请求远端搜索服务。
 */

import { posts, researchReports } from "./data.js"
import { esc, fmtDate } from "./utils.js"

const PAGES = [
    { title: "研究", desc: "基于本机环境的探索报告", href: "#/research", tag: "页面" },
    { title: "在用", desc: "每天真正在使用的工具与硬件", href: "#/uses", tag: "页面" },
    { title: "归档", desc: "按时间浏览全部文章", href: "#/archives", tag: "页面" },
    { title: "项目", desc: "维护中的开源项目", href: "#/projects", tag: "页面" },
]

function index() {
    return [
        ...posts.map((post) => ({
            title: post.title,
            desc: `${fmtDate(post.date)} · ${post.tags.join(" / ")}`,
            href: `#/posts/${post.slug}`,
            tag: "文章",
            haystack: `${post.title} ${post.subtitle ?? ""} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase(),
        })),
        ...researchReports.map((report) => ({
            title: report.title,
            desc: `${fmtDate(report.date)} · 研究`,
            href: `#/research/${report.slug}`,
            tag: "研究",
            haystack: `${report.title} ${report.subtitle} ${report.tags.join(" ")}`.toLowerCase(),
        })),
        ...PAGES.map((page) => ({
            ...page,
            haystack: `${page.title} ${page.desc}`.toLowerCase(),
        })),
    ]
}

let dialog
let input
let results
let count
let items = []
let cursor = 0

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
    const labels = { 文章: "文章", 研究: "研究", 页面: "页面" }
    let position = 0
    results.innerHTML = [...groups.entries()]
        .map(
            ([tag, group]) => `
        <div class="palette-group">${labels[tag] ?? tag}</div>
        ${group
            .map((item) => {
                const current = position++
                return `
            <a class="palette-item" href="${item.href}" role="option" aria-selected="${current === 0}" data-index="${current}">
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
    document.querySelectorAll("dialog[open]").forEach((item) => {
        if (item !== dialog) item.close()
    })
    if (!dialog.open) dialog.showModal()
    document.body.classList.add("is-locked")
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
    if (!dialog || !input) return

    document.querySelectorAll("[data-open-search]").forEach((button) => {
        button.addEventListener("click", open)
    })

    input.addEventListener("input", paint)

    input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault()
            close()
        } else if (event.key === "ArrowDown") {
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
        if (event.target.closest(".palette-item")) close()
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

let heroController

export function bindHeroSearch() {
    const form = document.querySelector("#heroSearch")
    const field = document.querySelector("#heroSearchInput")
    const panel = document.querySelector("#heroSearchResults")
    if (!form || !field || !panel) return

    heroController?.abort()
    heroController = new AbortController()
    const { signal } = heroController
    let heroItems = []
    let active = -1

    const hide = () => {
        panel.classList.remove("is-open")
        panel.innerHTML = ""
        active = -1
    }

    const paintHero = () => {
        const keyword = field.value.trim().toLowerCase()
        if (!keyword) {
            hide()
            return
        }
        heroItems = index()
            .filter((item) => item.haystack.includes(keyword))
            .slice(0, 5)
        active = -1
        panel.classList.add("is-open")
        if (!heroItems.length) {
            panel.innerHTML = `<p class="cover-empty">没有找到“${esc(field.value.trim())}”，试试主题或年份。</p>`
            return
        }
        panel.innerHTML = heroItems
            .map(
                (item, i) => `
            <a class="cover-result" href="${item.href}" role="option" aria-selected="false" data-hero-index="${i}">
                <span>${esc(item.title)}</span>
                <small>${esc(item.desc)}</small>
            </a>`,
            )
            .join("")
    }

    const select = (index) => {
        const nodes = [...panel.querySelectorAll(".cover-result")]
        if (!nodes.length) return
        if (active >= 0) nodes[active]?.setAttribute("aria-selected", "false")
        active = (index + nodes.length) % nodes.length
        nodes[active].setAttribute("aria-selected", "true")
    }

    field.addEventListener("input", paintHero, { signal })
    field.addEventListener("focus", () => {
        if (field.value.trim()) panel.classList.add("is-open")
    })
    field.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            hide()
            field.blur()
        } else if (event.key === "ArrowDown") {
            event.preventDefault()
            select(active + 1)
        } else if (event.key === "ArrowUp") {
            event.preventDefault()
            select(active - 1)
        } else if (event.key === "Enter" && active >= 0) {
            event.preventDefault()
            const href = panel.querySelectorAll(".cover-result")[active]?.getAttribute("href")
            if (href) {
                hide()
                window.location.hash = href.slice(1)
            }
        }
    })

    panel.addEventListener("click", (event) => {
        if (event.target.closest(".cover-result")) hide()
    })

    form.addEventListener(
        "submit",
        (event) => {
            event.preventDefault()
            hide()
            const query = field.value.trim()
            window.location.hash = query ? `#/posts?q=${encodeURIComponent(query)}` : "#/posts"
        },
        { signal },
    )

    document.addEventListener(
        "click",
        (event) => {
            if (!form.contains(event.target)) hide()
        },
        { signal },
    )
}
