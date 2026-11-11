/**
 * 做什么：v3 长文页的阅读进度、目录高亮、正文字号与代码块复制。
 * 状态与生命周期：滚动时同一帧内更新进度条、目录活跃线与当前章节名；字号由首屏前脚本恢复并写入 localStorage。
 * 取舍与不变量：进度以「已滚过全文的比例」计算，目录高亮取视口上方最近的标题，两者互不依赖数据。
 * 边界：不生成目录条目，HTML 里的 anchor 与 id 必须已经存在；不改动其它页面。
 */

const SCALE_KEY = "prototypeArticleScale"
const SCALE_MIN = 0.9
const SCALE_MAX = 1.2

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
}

function initProgress() {
    const bar = document.querySelector("#readingProgress")
    const percent = document.querySelector("[data-read-percent]")
    if (!bar) return () => 0

    return () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const ratio = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0
        document.documentElement.style.setProperty("--progress", ratio.toFixed(4))
        if (percent) percent.textContent = `已读 ${Math.round(ratio * 100)}%`
        return ratio
    }
}

function initToc() {
    const links = [...document.querySelectorAll(".toc a[href^='#']")]
    const headings = links
        .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
        .filter(Boolean)
    if (!links.length || !headings.length) return () => {}

    const current = document.querySelector("[data-toc-current]")
    const labelOf = (link) => link.dataset.label || link.getAttribute("aria-label") || ""
    let active = null
    let resting = ""

    const setActive = (id) => {
        if (id === active) return
        active = id
        links.forEach((link) => {
            const on = link.hash.slice(1) === id
            link.classList.toggle("is-active", on)
            if (on) link.setAttribute("aria-current", "true")
            else link.removeAttribute("aria-current")
        })
        const hit = links.find((link) => link.hash.slice(1) === id)
        resting = hit ? labelOf(hit) : ""
        if (current && resting) current.textContent = resting
    }

    links.forEach((link) => {
        const reveal = () => {
            if (current) current.textContent = labelOf(link)
        }
        const reset = () => {
            if (current && resting) current.textContent = resting
        }
        link.addEventListener("mouseenter", reveal)
        link.addEventListener("focus", reveal)
        link.addEventListener("mouseleave", reset)
        link.addEventListener("blur", reset)
    })

    const onHash = () => {
        const id = decodeURIComponent(window.location.hash.slice(1))
        if (id) setActive(id)
    }
    window.addEventListener("hashchange", onHash)
    onHash()

    return () => {
        const line = window.innerHeight * 0.3
        let candidate = headings[0].id
        for (const heading of headings) {
            if (heading.getBoundingClientRect().top <= line) candidate = heading.id
            else break
        }
        setActive(candidate)
    }
}

function initFontScale() {
    const prose = document.querySelector(".prose")
    const buttons = [...document.querySelectorAll("[data-scale]")]
    if (!prose || !buttons.length) return

    const booted = Number.parseFloat(document.documentElement.style.getPropertyValue("--article-scale"))
    let scale = Number.isFinite(booted) ? clamp(booted, SCALE_MIN, SCALE_MAX) : 1

    const apply = () => prose.style.setProperty("--article-scale", scale.toFixed(2))
    apply()

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const step = button.dataset.scale === "up" ? 0.05 : -0.05
            scale = clamp(Math.round((scale + step) * 100) / 100, SCALE_MIN, SCALE_MAX)
            apply()
            try {
                localStorage.setItem(SCALE_KEY, String(scale))
            } catch {
                // 隐私模式下只在本次会话内保留
            }
        })
    })
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        const area = document.createElement("textarea")
        area.value = text
        area.setAttribute("readonly", "")
        area.style.position = "fixed"
        area.style.opacity = "0"
        document.body.append(area)
        area.select()
        const ok = document.execCommand("copy")
        area.remove()
        return ok
    }
}

function initCodeCopy() {
    document.querySelectorAll(".code-block__copy").forEach((button) => {
        button.addEventListener("click", async () => {
            const code = button.closest(".code-block")?.querySelector("pre")?.textContent
            if (!code) return
            button.textContent = (await copyText(code.trim())) ? "已复制" : "复制失败"
            window.setTimeout(() => {
                button.textContent = "复制代码"
            }, 1600)
        })
    })
}

export function initReading() {
    const updateProgress = initProgress()
    const updateToc = initToc()
    initFontScale()
    initCodeCopy()
    if (!document.querySelector("#readingProgress")) return

    let frame = 0
    const update = () => {
        frame = 0
        updateProgress()
        updateToc()
    }
    const schedule = () => {
        if (frame) return
        frame = window.requestAnimationFrame(update)
    }
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    update()
}
