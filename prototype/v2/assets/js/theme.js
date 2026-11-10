/**
 * 做什么：深浅主题的初始化、持久化与切换，并广播 themechange 事件。
 * 取舍：只分 light / dark 两档；首次访问跟随系统，之后记住用户选择。
 * 边界：不关心主题按钮的位置与样式。
 */

const STORAGE_KEY = "rw-theme"

export function currentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light"
}

function apply(theme) {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }))
}

export function initTheme() {
    let saved
    try {
        saved = localStorage.getItem(STORAGE_KEY)
    } catch {
        saved = undefined
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    apply(saved === "light" || saved === "dark" ? saved : prefersDark ? "dark" : "light")

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
        let hasSaved = false
        try {
            hasSaved = Boolean(localStorage.getItem(STORAGE_KEY))
        } catch {
            hasSaved = false
        }
        if (!hasSaved) apply(event.matches ? "dark" : "light")
    })
}

export function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark"
    try {
        localStorage.setItem(STORAGE_KEY, next)
    } catch {
        // 私密模式下写不进去也不影响本次切换
    }
    apply(next)
    return next
}
