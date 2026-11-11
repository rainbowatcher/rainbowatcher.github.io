/**
 * 做什么：v3 文章列表的标签筛选，只按分类收起条目。
 * 状态与生命周期：当前标签存在闭包里，结果数量写回计数文本；关键词搜索交给 Algolia 面板。
 * 取舍与不变量：只匹配 data-tags，标签可单选或取消；不改动列表 DOM 顺序。
 * 边界：不做分页、不做远程搜索，也不处理文章正文。
 */

export function initTags() {
    const rows = [...document.querySelectorAll(".post-list li[data-tags]")]
    const chips = [...document.querySelectorAll(".filter-chips button[data-tag]")]
    const result = document.querySelector("#filterResult")
    const empty = document.querySelector("#emptyState")
    const list = document.querySelector(".post-list")
    if (!rows.length) return

    let tag = ""

    const apply = () => {
        let visible = 0
        rows.forEach((row) => {
            const show = !tag || row.dataset.tags.toLocaleLowerCase().includes(tag.toLocaleLowerCase())
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
    apply()
}
