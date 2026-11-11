/**
 * 做什么：v3 的移动端菜单、页脚年份与搜索框聚焦。
 * 状态与生命周期：菜单状态由 hidden 与 aria-expanded 共同维护，窗口变宽时自动收起。
 * 取舍与不变量：入场动画交给 CSS，本模块不重复触发，也不注册滚动监听。
 * 边界：不作滚动联动的渐显，也不改变主题与文章内容。
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

function initSearchFocus() {
    if (!new URLSearchParams(window.location.search).has("focus")) return
    const input = document.querySelector("#postFilter")
    input?.focus()
}

export function initMotion() {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = String(new Date().getFullYear())
    })
    initMobileMenu()
    initSearchFocus()
}
