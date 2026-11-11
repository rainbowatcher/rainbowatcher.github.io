/**
 * 做什么：v3 的移动端菜单、页脚年份与长文目录把手的展开状态。
 * 状态与生命周期：菜单与目录都用 hidden / is-open 配合 aria-expanded，窗口变宽时菜单自动收起。
 * 取舍与不变量：入场动画交给 CSS，本模块不重复触发，也不注册滚动监听。
 * 边界：不作滚动联动的渐显，也不改变主题、搜索与文章内容。
 */

function initMobileMenu() {
    const button = document.querySelector("#menuToggle")
    const sheet = document.querySelector("#mobileMenu")
    if (!button || !sheet) return

    const setOpen = (open) => {
        sheet.hidden = !open
        button.setAttribute("aria-expanded", String(open))
        button.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单")
    }

    button.addEventListener("click", () => setOpen(sheet.hidden))
    sheet.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)))
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !sheet.hidden) {
            setOpen(false)
            button.focus()
        }
    })
    window.addEventListener("resize", () => {
        if (window.innerWidth > 639 && !sheet.hidden) setOpen(false)
    })
}

function initTocToggle() {
    const rail = document.querySelector(".rail")
    const handle = document.querySelector("#tocToggle")
    if (!rail || !handle) return

    const setOpen = (open) => {
        rail.classList.toggle("is-open", open)
        handle.setAttribute("aria-expanded", String(open))
        handle.setAttribute("aria-label", open ? "收起目录" : "展开目录")
    }

    handle.addEventListener("click", () => setOpen(!rail.classList.contains("is-open")))
    rail.querySelectorAll(".toc a").forEach((link) => link.addEventListener("click", () => setOpen(false)))
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && rail.classList.contains("is-open")) setOpen(false)
    })
}

export function initMotion() {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = String(new Date().getFullYear())
    })
    initMobileMenu()
    initTocToggle()
}
