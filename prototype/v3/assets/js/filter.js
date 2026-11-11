/**
 * 做什么：v3 文章列表的标签筛选与关键词过滤。
 * 状态与生命周期：当前标签存在闭包里，筛选结果写回 hidden 与计数文本；无结果时显示空状态。
 * 取舍与不变量：只按 data-tags 与标题文本匹配，大小写不敏感；不改动列表 DOM 顺序。
 * 边界：不做分页、不做远程搜索，也不处理文章正文。
 */

export function initFilter() {
    const input = document.querySelector("#postFilter")
    const rows = [...document.querySelectorAll(".post-list li[data-tags]")]
    const chips = [...document.querySelectorAll(".filter-chips button[data-tag]")]
    const result = document.querySelector("#filterResult")
    const empty = document.querySelector("#emptyState")
    const list = document.querySelector(".post-list")
    if (!input || !rows.length) return

    let tag = ""

    const apply = () => {
        const keyword = input.value.trim().toLocaleLowerCase()
        let visible = 0
        rows.forEach((row) => {
            const tags = row.dataset.tags.toLocaleLowerCase()
            const text = row.textContent.toLocaleLowerCase()
            const show = (!tag || tags.includes(tag.toLocaleLowerCase())) && (!keyword || text.includes(keyword))
            row.hidden = !show
            if (show) visible += 1
        })
        if (result) result.textContent = `显示 ${visible} 篇，共 ${rows.length} 篇`
        if (empty) empty.hidden = visible !== 0
        if (list) list.hidden = visible === 0
    }

    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            tag = chip.dataset.tag === tag ? "" : chip.dataset.tag
            chips.forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.tag === tag)))
            apply()
        })
    })
    input.addEventListener("input", apply)
    apply()
}
