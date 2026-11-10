/**
 * 做什么：v2 原型入口：hash 路由、页面挂载、滚动入场、菜单/搜索/说明浮层。
 * 取舍：视图返回 HTML 字符串，挂载后统一回收监听器；动效只做一次入场。
 * 边界：不做内容构建；正式实现由 Nuxt 路由与组件承担。
 */

import { initTheme, toggleTheme } from "./theme.js"
import { initSearch, bindHeroSearch } from "./search.js"
import { initContrast } from "./contrast.js"
import * as home from "./views/home.js"
import * as posts from "./views/posts.js"
import * as article from "./views/article.js"
import * as archive from "./views/archive.js"
import * as uses from "./views/uses.js"
import * as projects from "./views/projects.js"
import * as research from "./views/research.js"
import * as notfound from "./views/notfound.js"

const viewEl = document.querySelector("#view")
const progress = document.querySelector("#readingProgress")
const toastEl = document.querySelector("#toast")
let cleanup = null
let revealObserver = null
let revealTimer = 0
let toastTimer

const routes = {
    home,
    posts,
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

function closeDialogs() {
    document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close())
    document.body.classList.remove("is-locked")
}

function initReveal() {
    revealObserver?.disconnect()
    revealObserver = null
    clearTimeout(revealTimer)

    const nodes = [...document.querySelectorAll("[data-reveal]")]
    if (!nodes.length) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced || !("IntersectionObserver" in window)) {
        nodes.forEach((node) => node.classList.add("is-in"))
        return
    }

    revealObserver = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue
                entry.target.classList.add("is-in")
                revealObserver.unobserve(entry.target)
            }
        },
        { threshold: 0.06, rootMargin: "0px 0px -6% 0px" },
    )

    nodes.forEach((node) => {
        if (node.getBoundingClientRect().top < window.innerHeight * 0.94) {
            node.classList.add("is-in")
        } else {
            revealObserver.observe(node)
        }
    })

    revealTimer = window.setTimeout(() => {
        nodes.forEach((node) => node.classList.add("is-in"))
    }, 3000)
}

function render() {
    const route = parseRoute()
    const view = routes[route.name] ?? notfound
    cleanup?.()
    cleanup = null
    revealObserver?.disconnect()
    revealObserver = null
    clearTimeout(revealTimer)
    progress.style.transform = "scaleX(0)"

    let html = view.render(route)
    if (!html) {
        html = notfound.render()
        route.name = "notfound"
    }
    viewEl.innerHTML = html
    cleanup = view.mount?.(route) ?? null

    updateChrome(route)
    initReveal()
    bindHeroSearch()
    closeDialogs()
    window.scrollTo(0, 0)
}

function showToast(message) {
    clearTimeout(toastTimer)
    toastEl.textContent = message
    toastEl.classList.add("is-visible")
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 1800)
}

async function copyCode(button) {
    const code = button.closest(".code-block")?.querySelector("code")?.innerText ?? ""
    const original = button.textContent
    try {
        await navigator.clipboard.writeText(code)
        showToast("代码已复制")
        button.textContent = "已复制"
    } catch {
        showToast("复制失败，请手动选择")
    }
    setTimeout(() => {
        button.textContent = original
    }, 1600)
}

function syncLock() {
    document.body.classList.toggle("is-locked", Boolean(document.querySelector("dialog[open]")))
}

function bindChrome() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        button.addEventListener("click", () => toggleTheme())
    })

    document.querySelectorAll("[data-open-menu]").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll("dialog[open]").forEach((dialog) => {
                if (dialog.id !== "drawerDialog") dialog.close()
            })
            document.querySelector("#drawerDialog").showModal()
            syncLock()
        })
    })

    document.querySelectorAll("[data-close-dialog]").forEach((button) => {
        button.addEventListener("click", () => button.closest("dialog")?.close())
    })

    document.querySelectorAll("dialog").forEach((dialog) => {
        dialog.addEventListener("close", syncLock)
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) dialog.close()
            if (event.target.closest("a[href^='#/']")) dialog.close()
        })
    })

    document.addEventListener("click", (event) => {
        const copy = event.target.closest("[data-copy]")
        if (copy) copyCode(copy)
    })
}

initTheme()
bindChrome()
initSearch()
initContrast()
window.addEventListener("hashchange", render)
render()
