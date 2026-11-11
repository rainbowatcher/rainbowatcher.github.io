/**
 * 做什么：v3 的全站搜索面板，调用 Algolia 索引并渲染结果。
 * 状态与生命周期：面板由 #searchMount 注入一次，页头按钮、列表页按钮或 ⌘K / Ctrl K / / 打开，Esc 或点遮罩关闭。
 * 取舍与不变量：结果标题与摘要只用文本节点写入，命中词包 mark，不注入远端 HTML。
 * 边界：不做本地关键词搜索，也不做分页；索引请求与结果映射由 algolia.js 负责。
 */

import { hitExcerpt, hitSection, hitTitle, prototypeUrl, searchSite } from "./algolia-client.js"

const IDLE_TEXT = "输入关键词，查询站点已有的 Algolia 索引"

const PANEL_HTML = `
    <div class="search-overlay" id="searchOverlay" hidden>
        <div class="search-panel" role="dialog" aria-modal="true" aria-label="全站搜索">
            <div class="search-panel__bar">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>
                <label class="sr-only" for="searchInput">搜索全站</label>
                <input id="searchInput" type="search" placeholder="搜索文章、项目与研究…" autocomplete="off" aria-label="搜索关键词" />
                <kbd>Esc</kbd>
            </div>
            <p class="search-panel__status" id="searchStatus" role="status">${IDLE_TEXT}</p>
            <ol class="search-results" id="searchResults"></ol>
            <div class="search-panel__foot">
                <span>↑↓ 选择 · ↵ 打开 · Esc 关闭</span>
                <span>索引 rainbowatcher · 结果指向原型对应页</span>
            </div>
        </div>
    </div>`

let overlay = null
let input = null
let results = null
let status = null
let timer = 0
let activeIndex = -1
let lastTrigger = null
let requestId = 0

function links() {
    return [...results.querySelectorAll("a")]
}

function appendMarked(node, text, query) {
    const needle = query.trim().toLocaleLowerCase()
    if (!needle) {
        node.textContent = text
        return
    }
    const haystack = text.toLocaleLowerCase()
    let from = 0
    let at = haystack.indexOf(needle)
    while (at !== -1) {
        node.append(document.createTextNode(text.slice(from, at)))
        const mark = document.createElement("mark")
        mark.textContent = text.slice(at, at + needle.length)
        node.append(mark)
        from = at + needle.length
        at = haystack.indexOf(needle, from)
    }
    node.append(document.createTextNode(text.slice(from)))
}

function setActive(index) {
    const items = links()
    if (!items.length) return
    activeIndex = (index + items.length) % items.length
    items.forEach((link, i) => link.classList.toggle("is-active", i === activeIndex))
    items[activeIndex].scrollIntoView({ block: "nearest" })
}

function setStatus(text) {
    status.textContent = text
}

function render(hits) {
    results.replaceChildren()
    activeIndex = -1
    hits.forEach((hit) => {
        const item = document.createElement("li")
        const link = document.createElement("a")
        link.href = prototypeUrl(hit)
        const title = document.createElement("strong")
        appendMarked(title, hitTitle(hit), input.value)
        const detail = document.createElement("span")
        detail.textContent = `${hitSection(hit)} · ${hitExcerpt(hit)}`.slice(0, 180)
        link.append(title, detail)
        item.append(link)
        results.append(item)
    })
    setStatus(hits.length ? `找到 ${hits.length} 条结果 · 点击跳到原型对应页面` : "没有匹配结果，换个关键词再试")
}

async function runQuery() {
    const query = input.value.trim()
    const current = ++requestId
    if (!query) {
        results.replaceChildren()
        setStatus(IDLE_TEXT)
        return
    }
    setStatus("正在查询 Algolia 索引…")
    try {
        const hits = await searchSite(query)
        if (current !== requestId) return
        render(hits)
    } catch {
        if (current !== requestId) return
        results.replaceChildren()
        setStatus("搜索暂时不可用（网络或索引不可达），可直接浏览文章")
    }
}

function open(trigger) {
    if (!overlay || !overlay.hidden) return
    lastTrigger = trigger ?? null
    overlay.hidden = false
    document.body.style.overflow = "hidden"
    input.value = ""
    results.replaceChildren()
    setStatus(IDLE_TEXT)
    input.focus()
}

function close() {
    if (!overlay || overlay.hidden) return
    overlay.hidden = true
    document.body.style.overflow = ""
    requestId += 1
    window.clearTimeout(timer)
    lastTrigger?.focus()
}

function bindPanel() {
    input.addEventListener("input", () => {
        window.clearTimeout(timer)
        timer = window.setTimeout(runQuery, 180)
    })
    input.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault()
            setActive(activeIndex + 1)
        } else if (event.key === "ArrowUp") {
            event.preventDefault()
            setActive(activeIndex - 1)
        } else if (event.key === "Enter") {
            event.preventDefault()
            const target = links()[activeIndex] ?? links()[0]
            if (target) window.location.assign(target.href)
        }
    })
    results.addEventListener("mouseover", (event) => {
        const link = event.target.closest("a")
        if (link) setActive(links().indexOf(link))
    })
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) close()
    })
}

export function initSearch() {
    const mountPoint = document.querySelector("#searchMount")
    if (!mountPoint) return
    mountPoint.innerHTML = PANEL_HTML

    overlay = document.querySelector("#searchOverlay")
    input = document.querySelector("#searchInput")
    results = document.querySelector("#searchResults")
    status = document.querySelector("#searchStatus")
    if (!overlay || !input || !results || !status) return

    bindPanel()
    document.querySelectorAll("#searchTrigger, .algolia-trigger").forEach((trigger) => {
        trigger.addEventListener("click", () => open(trigger))
    })
    document.addEventListener("keydown", (event) => {
        const key = event.key.toLocaleLowerCase()
        const shortcut = (event.metaKey || event.ctrlKey) && key === "k"
        const slash = key === "/" && !/^(input|textarea|select)$/i.test(document.activeElement?.tagName ?? "")
        if (shortcut || (slash && overlay.hidden)) {
            event.preventDefault()
            if (overlay.hidden) open()
            else close()
        } else if (event.key === "Escape" && !overlay.hidden) {
            close()
        }
    })
}
