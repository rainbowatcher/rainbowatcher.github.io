/**
 * 做什么：v3 的亮暗主题初始化、切换按钮与系统主题跟随。
 * 状态与生命周期：首屏前的内联脚本已写入 data-theme；本模块只在用户未选择时跟随系统变化。
 * 取舍与不变量：选择结果存 localStorage，主题色 meta 与按钮文案始终描述「点下去会变成什么」。
 * 边界：不持久化字号与筛选状态，也不改动其它页面状态。
 */

const STORAGE_KEY = "prototypeTheme"
const THEME_COLOR = { light: "hsl(200 32% 97%)", dark: "hsl(203 60% 12%)" }

function currentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light"
}

function syncControls() {
    const next = currentTheme() === "dark" ? "light" : "dark"
    const button = document.querySelector("#themeToggle")
    const meta = document.querySelector('meta[name="theme-color"]')

    if (button) {
        button.setAttribute("aria-label", `切换到${next === "dark" ? "暗色" : "亮色"}主题`)
        button.title = `切换到${next === "dark" ? "暗色" : "亮色"}主题`
    }
    if (meta) {
        meta.content = THEME_COLOR[currentTheme()]
    }
}

export function initTheme() {
    syncControls()

    document.querySelector("#themeToggle")?.addEventListener("click", () => {
        const next = currentTheme() === "dark" ? "light" : "dark"
        document.documentElement.dataset.theme = next
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {
            // 隐私模式下不持久化，本次会话内仍然生效
        }
        syncControls()
    })

    const query = window.matchMedia("(prefers-color-scheme: dark)")
    query.addEventListener("change", (event) => {
        let saved = null
        try {
            saved = localStorage.getItem(STORAGE_KEY)
        } catch {
            // 没有存储时按系统主题走
        }
        if (saved === "light" || saved === "dark") return
        document.documentElement.dataset.theme = event.matches ? "dark" : "light"
        syncControls()
    })
}
