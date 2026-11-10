/**
 * 做什么：读取当前主题的 CSS 变量，实时计算文本/背景对比度并渲染表格。
 * 取舍：只校验正文会用到的关键配对；装饰性边框不计入 WCAG 文本要求。
 * 边界：不做自动调色，颜色在 tokens.css 里人工校准。
 */

const PAIRS = [
    { name: "正文", fg: "--ink", bg: "--bg", target: 7, note: "长文阅读" },
    { name: "次要文字", fg: "--ink-2", bg: "--bg", target: 4.5, note: "说明与摘要" },
    { name: "弱化文字", fg: "--muted", bg: "--bg", target: 4.5, note: "日期 / 标签" },
    { name: "纸面强调文字", fg: "--accent-text", bg: "--bg", target: 4.5, note: "顶栏选中 / 正文链接" },
    { name: "琥珀字段", fg: "--accent-ink", bg: "--accent", target: 7, note: "按钮 / 选中态" },
    { name: "深面强调", fg: "--accent-on-panel", bg: "--panel", target: 4.5, note: "页脚 / 目录 / 浮层" },
    { name: "反色面板", fg: "--panel-ink", bg: "--panel", target: 7, note: "目录 / 页脚" },
    { name: "面板次要", fg: "--panel-muted", bg: "--panel", target: 4.5, note: "面板里的注释" },
    { name: "代码块", fg: "--code-ink", bg: "--code-bg", target: 7, note: "代码阅读" },
]

function readVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function parseColor(value) {
    const hex = value.replace("#", "").trim()
    if (/^[0-9a-f]{3}$/i.test(hex)) {
        return [...hex].map((char) => Number.parseInt(char + char, 16) / 255)
    }
    if (/^[0-9a-f]{6}$/i.test(hex)) {
        return hex.match(/.{2}/g).map((pair) => Number.parseInt(pair, 16) / 255)
    }
    const rgb = value.match(/\d+(\.\d+)?/g)
    return rgb
        ? rgb
              .slice(0, 3)
              .map(Number)
              .map((channel) => channel / 255)
        : [0, 0, 0]
}

function luminance(value) {
    const [r, g, b] = parseColor(value).map((channel) =>
        channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(fg, bg) {
    const values = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
    return (values[0] + 0.05) / (values[1] + 0.05)
}

function grade(value) {
    if (value >= 7) return { label: "AAA", cls: "aaa", passed: true }
    if (value >= 4.5) return { label: "AA", cls: "aa", passed: true }
    if (value >= 3) return { label: "AA Large", cls: "aa", passed: true }
    return { label: "FAIL", cls: "fail", passed: false }
}

export function renderContrastTable(target = document.querySelector("#contrastTable")) {
    if (!target) return
    const rows = PAIRS.map((pair) => {
        const fg = readVar(pair.fg)
        const bg = readVar(pair.bg)
        const value = ratio(fg, bg)
        const result = grade(Math.min(value, 21))
        const passesTarget = value >= pair.target
        const badge = passesTarget ? result : { label: "FAIL", cls: "fail" }
        return `
            <div class="contrast-row" role="row">
                <span class="contrast-sample" role="cell">
                    <span class="contrast-chip" style="color:${fg};background:${bg}">Aa</span>
                    ${pair.name}
                </span>
                <span class="contrast-ratio" role="cell">${value.toFixed(2)}:1</span>
                <span class="contrast-badge ${badge.cls}" role="cell">${badge.label}</span>
                <span class="contrast-note" role="cell">${pair.note}</span>
            </div>`
    }).join("")

    target.innerHTML = `
        <div class="contrast-row head" role="row">
            <span role="columnheader">配色对</span>
            <span role="columnheader">比值</span>
            <span role="columnheader">WCAG</span>
            <span role="columnheader">说明</span>
        </div>
        ${rows}`
}

export function initContrast() {
    const dialog = document.querySelector("#contrastDialog")
    const open = () => {
        document.querySelectorAll("dialog[open]").forEach((item) => {
            if (item !== dialog) item.close()
        })
        renderContrastTable()
        dialog.showModal()
        document.body.classList.add("is-locked")
    }
    document.querySelectorAll("[data-open-contrast]").forEach((button) => {
        button.addEventListener("click", open)
    })
    window.addEventListener("themechange", () => {
        if (dialog.open) renderContrastTable()
    })
}
