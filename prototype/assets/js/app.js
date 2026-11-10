/**
 * 做什么：原型入口：hash 路由、页面挂载、主题/菜单/弹窗与全局交互。
 * 取舍：不引入框架，视图函数返回 HTML 字符串，挂载后统一回收副作用。
 * 边界：不做内容构建；正式实现由 Nuxt 路由与组件承担。
 */

import { initTheme, toggleTheme } from "./theme.js"
import { initSearch } from "./search.js"
import { initContrast } from "./contrast.js"
import * as home from "./views/home.js"
import * as postsView from "./views/posts.js"
import * as article from "./views/article.js"
import * as archive from "./views/archive.js"
import * as uses from "./views/uses.js"
import * as projects from "./views/projects.js"
import * as research from "./views/research.js"
import * as notfound from "./views/notfound.js"

const viewEl = document.querySelector("#view")
const header = document.querySelector("#siteHeader")
const progress = document.querySelector("#readingProgress")
const toastEl = document.querySelector("#toast")
let cleanup = null
let toastTimer

const routes = {
    home,
    posts: postsView,
    post: article,
    archives: archive,
    uses,
    projects,
    research,
    "research-detail": article,
    notfound,
}

const staticTitles = {
    home: "Rainbow Watcher — 看彩虹的人",
    archives: "归档 — Rainbow Watcher",
    uses: "在用 — Rainbow Watcher",
    projects: "项目 — Rainbow Watcher",
    research: "研究 — Rainbow Watcher",
    notfound: "页面不存在 — Rainbow Watcher",
}

function parseRoute() {
    const raw = decodeURI(location.hash.replace(/^#/, "")) || "/"
    const [pathPart, query = ""] = raw.split("?")
    const segments = pathPart.split("/").filter(Boolean)

    if (!segments.length) return { name: "home", query }
    if (segments[0] === "posts") {
        return segments[1] ? { name: "post", slug: segments[1], query } : { name: "posts", query }
    }
    if (segments[0] === "research") {
        return segments[1] ? { name: "research-detail", slug: segments[1], query } : { name: "research", query }
    }
    if (["archives", "uses", "projects"].includes(segments[0])) {
        return { name: segments[0], query }
    }
    return { name: "notfound", query }
}

function navTarget(route) {
    if (route.name === "post") return "posts"
    if (route.name === "research-detail") return "research"
    return route.name
}

function updateChrome(route) {
    const target = navTarget(route)
    document.querySelectorAll("[data-nav]").forEach((link) => {
        if (link.dataset.nav === target) link.setAttribute("aria-current", "page")
        else link.removeAttribute("aria-current")
    })
    document.title = routes[route.name]?.title?.(route) ?? staticTitles[route.name] ?? "Rainbow Watcher"
}

function render() {
    const route = parseRoute()
    const view = routes[route.name] ?? notfound
    cleanup?.()
    cleanup = null
    progress.style.transform = "scaleX(0)"

    let html = view.render(route)
    if (!html) {
        html = notfound.render()
        route.name = "notfound"
    }
    viewEl.innerHTML = html
    viewEl.querySelector(".view-enter")?.classList.add("view-enter")
    cleanup = view.mount?.(route) ?? null

    updateChrome(route)
    window.scrollTo({ top: 0, behavior: "instant" })
    document.querySelector("#drawerDialog")?.close()
}

function showToast(message) {
    clearTimeout(toastTimer)
    toastEl.textContent = message
    toastEl.classList.add("is-visible")
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 1800)
}

async function copyCode(button) {
    const code = button.closest(".code-block")?.querySelector("code")?.innerText ?? ""
    try {
        await navigator.clipboard.writeText(code)
        showToast("代码已复制")
    } catch {
        showToast("复制失败，请手动选择")
    }
    const original = button.innerHTML
    button.innerHTML =
        '<svg class="arrow-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>已复制'
    setTimeout(() => {
        button.innerHTML = original
    }, 1600)
}

function bindChrome() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        button.addEventListener("click", () => toggleTheme())
    })

    document.querySelectorAll("[data-open-menu]").forEach((button) => {
        button.addEventListener("click", () => document.querySelector("#drawerDialog").showModal())
    })

    document.querySelectorAll("[data-close-dialog]").forEach((button) => {
        button.addEventListener("click", () => button.closest("dialog")?.close())
    })

    document.querySelectorAll("dialog").forEach((dialog) => {
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) dialog.close()
        })
        dialog.addEventListener("click", (event) => {
            if (event.target.closest("a[href^='#/']")) dialog.close()
        })
    })

    document.addEventListener("click", (event) => {
        const copy = event.target.closest("[data-copy]")
        if (copy) copyCode(copy)
    })

    let ticking = false
    window.addEventListener(
        "scroll",
        () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(() => {
                header.classList.toggle("is-scrolled", window.scrollY > 8)
                ticking = false
            })
        },
        { passive: true },
    )
}

initTheme()
bindChrome()
initSearch()
initContrast()
window.addEventListener("hashchange", render)
render()
