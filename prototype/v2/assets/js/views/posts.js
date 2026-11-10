/**
 * 做什么：v2 文章索引页：关键词、主题筛选与分页，筛选状态写回 URL。
 * 取舍：筛选在本地即时完成，不重新渲染路由；主题仍是可分享的 hash 参数。
 * 边界：不负责文章正文与归档页。
 */

import { posts } from "../data.js"
import { esc, pageTitleFor, postRow, queryOf, sortedPosts, tagStats } from "../utils.js"
import { icon } from "../icons.js"

const PAGE_SIZE = 8

export function render(route) {
    const sorted = sortedPosts(posts)
    const query = queryOf(route)
    const tag = query.get("tag") ?? ""
    const tags = tagStats(sorted)
    const active = tags.some((item) => item.name === tag) ? tag : ""
    const initialQuery = query.get("q") ?? ""

    return `
    <div class="view-enter">
        <div class="wrap">
            <header class="page-head">
                <div>
                    <h1 class="page-title">文章</h1>
                    <p class="page-sub">关于代码、工具与日常折腾的笔记。按时间倒序排列，可以用主题或关键词筛选。</p>
                </div>
                <p class="page-meta"><strong>${sorted.length}</strong> 篇<br />${tags.length} 个主题</p>
            </header>

            <section class="index" aria-label="文章索引">
                <div class="filter-bar">
                    <form class="filter-search" id="postSearchForm" role="search" action="#/posts">
                        <label class="sr-only" for="postSearch">搜索文章</label>
                        <input
                            id="postSearch"
                            name="q"
                            type="search"
                            value="${esc(initialQuery)}"
                            placeholder="在 ${sorted.length} 篇文章里搜索…"
                            autocomplete="off"
                            spellcheck="false"
                        />
                        <button type="submit" aria-label="搜索">${icon("arrow-right")}</button>
                    </form>
                    <p class="result-count" id="resultCount"></p>
                </div>

                <div class="filter-tags" aria-label="按主题筛选">
                    <a class="${active ? "" : "is-active"}" href="#/posts">全部<small>${sorted.length}</small></a>
                    ${tags
                        .map(
                            (item) =>
                                `<a class="${item.name === active ? "is-active" : ""}" href="${`#/posts?tag=${encodeURIComponent(item.name)}`}">${esc(item.name)}<small>${item.count}</small></a>`,
                        )
                        .join("")}
                </div>

                <div id="postsList" aria-live="polite"></div>
            </section>
        </div>
    </div>`
}

export function mount(route) {
    const list = document.querySelector("#postsList")
    const form = document.querySelector("#postSearchForm")
    const input = document.querySelector("#postSearch")
    const count = document.querySelector("#resultCount")
    const query = queryOf(route)
    const tag = query.get("tag") ?? ""
    const activeTag = tagStats(posts).some((item) => item.name === tag) ? tag : ""
    const initialPage = Math.max(1, Number(query.get("page")) || 1)
    const state = { page: initialPage, query: query.get("q") ?? "" }

    const filtered = () => {
        const keyword = state.query.trim().toLowerCase()
        return sortedPosts(posts).filter((post) => {
            const tagOk = !activeTag || post.tags.includes(activeTag)
            const text = `${post.title} ${post.subtitle ?? ""} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase()
            return tagOk && (!keyword || text.includes(keyword))
        })
    }

    const writeUrl = (totalPages) => {
        const params = new URLSearchParams()
        if (state.query) params.set("q", state.query)
        if (activeTag) params.set("tag", activeTag)
        if (state.page > 1 && totalPages > 1) params.set("page", String(state.page))
        const suffix = params.toString()
        history.replaceState(null, "", `#/posts${suffix ? `?${suffix}` : ""}`)
    }

    const paint = () => {
        const items = filtered()
        const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
        state.page = Math.min(state.page, totalPages)
        const pageItems = items.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE)
        const from = items.length ? (state.page - 1) * PAGE_SIZE + 1 : 0
        const to = Math.min(items.length, state.page * PAGE_SIZE)

        count.textContent = `${items.length} 篇 · ${activeTag || (state.query ? `“${state.query}”` : "全部主题")}`
        writeUrl(totalPages)

        if (!items.length) {
            list.innerHTML = `<div class="empty-state"><strong>没有找到文章</strong><p>换一个关键词，或者清空主题筛选再试试。</p></div>`
            return
        }

        list.innerHTML = `
            <div class="entry-list">${pageItems.map(postRow).join("")}</div>
            <nav class="pager" aria-label="分页">
                <span class="pager-info">${from}–${to} / ${items.length}${activeTag ? ` · 主题 ${esc(activeTag)}` : ""}</span>
                <div class="pager-pages">
                    <button class="pager-btn" type="button" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""} aria-label="上一页">${icon("chevron-left")}</button>
                    ${Array.from({ length: totalPages }, (_, index) => index + 1)
                        .map(
                            (page) =>
                                `<button class="pager-btn ${page === state.page ? "is-current" : ""}" type="button" data-page="${page}" ${page === state.page ? 'aria-current="page"' : ""}>${page}</button>`,
                        )
                        .join("")}
                    <button class="pager-btn" type="button" data-page="${state.page + 1}" ${state.page === totalPages ? "disabled" : ""} aria-label="下一页">${icon("chevron-right")}</button>
                </div>
            </nav>`
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault()
        state.query = input.value
        state.page = 1
        paint()
    })

    input.addEventListener("input", () => {
        state.query = input.value
        state.page = 1
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
    const query = queryOf(route)
    const tag = query.get("tag")
    const search = query.get("q")
    if (search) return `搜索 “${search}” — Rainbow Watcher`
    if (!tag) return pageTitleFor({ ...route, name: "posts" }, posts.length)
    const count = posts.filter((post) => post.tags.includes(tag)).length
    return `${tag} · ${count} 篇文章 — Rainbow Watcher`
}
