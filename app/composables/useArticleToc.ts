/**
 * 做什么：文章正文的目录采集与滚动高亮：从渲染后的正文里找出 h2/h3，跟踪当前阅读位置。
 * 状态与生命周期：调用方（文章页）在 setup 中调用一次；挂载后采集标题、监听滚动与尺寸变化，
 * 卸载时移除监听；标题集合在正文渲染完成后通过 refresh() 重新采集。
 * 取舍与不变量：无 id 的标题补 `section-N`，避免与页内锚点冲突；高亮阈值取视口上方 120px，
 * 与阅读进度（ReadingProgress）各自独立，互不引用。
 * 边界：不渲染目录；平滑滚动只在用户未要求减弱动效时启用。
 */
export type TocHeading = {
    id: string
    level: 2 | 3
    text: string
}

const ACTIVE_THRESHOLD = 120

export function useArticleToc(target: string) {
    const headings = ref<TocHeading[]>([])
    const activeId = ref("")
    let ticking = false

    function refresh() {
        const root = document.querySelector(target)
        if (!root) return
        headings.value = [...root.querySelectorAll("h2, h3")].map((element, index) => {
            if (!element.id) element.id = `section-${index + 1}`
            return {
                id: element.id,
                level: element.tagName === "H3" ? 3 : 2,
                text: element.textContent?.trim() ?? "",
            } satisfies TocHeading
        })
    }

    function update() {
        let current = headings.value[0]?.id ?? ""
        for (const heading of headings.value) {
            const node = document.getElementById(heading.id)
            if (node && node.getBoundingClientRect().top <= ACTIVE_THRESHOLD) current = heading.id
        }
        activeId.value = current
    }

    function onScroll() {
        if (ticking) return
        ticking = true
        requestAnimationFrame(() => {
            update()
            ticking = false
        })
    }

    function scrollTo(id: string) {
        document.getElementById(id)?.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start",
        })
    }

    onMounted(() => {
        refresh()
        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", update)
    })

    onUnmounted(() => {
        window.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", update)
    })

    return { activeId, headings, refresh, scrollTo }
}
