/**
 * 做什么：文章列表页：主题筛选、关键词搜索与分页。
 * 取舍：搜索只在当前页内即时过滤，不走路由；页码用 replaceState 保持可分享。
 * 边界：不负责文章详情渲染。
 */

import { posts } from "../data.js"
import { esc, pageTitleFor, postRow, queryOf, sortedPosts, tagChip, tagStats } from "../utils.js"
import { icon } from "../icons.js"

const PAGE_SIZE = 8

export function render(route) {
    const sorted = sortedPosts(posts)
    const tag = queryOf(route).get("tag") ?? ""
    const tags = tagStats(sorted)
    const active = tag && tags.some((item) => item.name === tag) ? tag : ""

    return `
    <div class="container view-enter">
        <header class="page-head">
            <p class="eyebrow">Index / Posts</p>
            <div class="page-title-row">
                <h1 class="page-title">文章</h1>
                <span class="page-meta">${sorted.length} POSTS · 2022—2024</span>
            </div>
            <p class="page-desc">关于代码、工具与日常折腾的笔记。按时间倒序排列，可以用主题或关键词筛选。</p>
        </header>

        <div class="list-toolbar">
            <label class="filter-field" id="filterField">
                ${icon("search")}
                <input id="postSearch" type="search" placeholder="在 ${sorted.length} 篇文章里搜索…" autocomplete="off" aria-label="搜索文章">
                <button type="button" id="clearSearch" aria-label="清空搜索">${icon("close")}</button>
            </label>
            <span class="list-toolbar-note" id="resultCount">${sorted.length} 篇 · 全部主题</span>
        </div>

        <div class="filter-tags" aria-label="按主题筛选">
            <a class="${active ? "tag" : "tag is-active"}" href="#/posts">全部 ${sorted.length}</a>
            ${tags.map((item) => tagChip(item.name, { active: item.name === active })).join("")}
        </div>

        <div id="postsList" aria-live="polite"></div>
    </div>`
}

export function mount(route) {
    const list = document.querySelector("#postsList")
    const input = document.querySelector("#postSearch")
    const field = document.querySelector("#filterField")
    const count = document.querySelector("#resultCount")
    const clear = document.querySelector("#clearSearch")
    const tag = queryOf(route).get("tag") ?? ""
    const activeTag = tagStats(posts).some((item) => item.name === tag) ? tag : ""
    let state = { page: Math.max(1, Number(queryOf(route).get("page")) || 1), query: "" }

    const filtered = () => {
        const keyword = state.query.trim().toLowerCase()
        return sortedPosts(posts).filter((post) => {
            const tagOk = !activeTag || post.tags.includes(activeTag)
            const text = `${post.title} ${post.subtitle ?? ""} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase()
            return tagOk && (!keyword || text.includes(keyword))
        })
    }

    const paint = () => {
        const items = filtered()
        const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
        state.page = Math.min(state.page, totalPages)
        const pageItems = items.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE)
        const from = items.length ? (state.page - 1) * PAGE_SIZE + 1 : 0
        const to = Math.min(items.length, state.page * PAGE_SIZE)

        count.textContent = `${items.length} 篇 · ${activeTag || (state.query ? `“${state.query}”` : "全部主题")}`
        field.classList.toggle("has-value", Boolean(state.query))
        clear.hidden = !state.query

        if (!items.length) {
            list.innerHTML = `<div class="empty-state"><strong>没有找到文章</strong><p>换一个关键词，或者清空主题筛选再试试。</p></div>`
            return
        }

        const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
        list.innerHTML = `
            <div class="post-list">${pageItems.map(postRow).join("")}</div>
            <nav class="pager" aria-label="分页">
                <span class="pager-info">${from}–${to} / ${items.length}${activeTag ? ` · 主题 ${esc(activeTag)}` : ""}</span>
                <div class="pager-pages">
                    <button class="pager-btn" type="button" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""} aria-label="上一页">${icon("chevron-left")}</button>
                    ${pages.map((page) => `<button class="pager-btn ${page === state.page ? "is-current" : ""}" type="button" data-page="${page}" ${page === state.page ? 'aria-current="page"' : ""}>${String(page).padStart(2, "0")}</button>`).join("")}
                    <button class="pager-btn" type="button" data-page="${state.page + 1}" ${state.page === totalPages ? "disabled" : ""} aria-label="下一页">${icon("chevron-right")}</button>
                </div>
            </nav>`
        history.replaceState(
            null,
            "",
            `#/posts?${new URLSearchParams({ ...(activeTag ? { tag: activeTag } : {}), page: String(state.page) })}`,
        )
    }

    input.addEventListener("input", () => {
        state.query = input.value
        state.page = 1
        paint()
    })

    clear.addEventListener("click", () => {
        input.value = ""
        state.query = ""
        state.page = 1
        input.focus()
        paint()
    })

    list.addEventListener("click", (event) => {
        const button = event.target.closest("[data-page]")
        if (!button || button.disabled) return
        state.page = Number(button.dataset.page)
        paint()
        list.scrollIntoView({ behavior: "smooth", block: "start" })
    })

    paint()
}

export function title(route) {
    const tag = queryOf(route).get("tag")
    if (!tag) return pageTitleFor({ ...route, name: "posts" }, posts.length)
    const count = posts.filter((post) => post.tags.includes(tag)).length
    return `${tag} · ${count} 篇文章 — Rainbow Watcher`
}
