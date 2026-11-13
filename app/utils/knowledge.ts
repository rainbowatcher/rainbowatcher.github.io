/**
 * 做什么：把 manifest.knowledge 按 section 分组，并给出索引页与前后篇导航共用的稳定顺序。
 * 状态与生命周期：纯函数，无状态；入参是构建期产出的 knowledge 元数据。
 * 取舍与不变量：SECTION_ORDER 决定分区顺序，未登记的分区按名称升序排在末尾；
 * 组内按 date 倒序，同日期再按 title，保证产物与预览顺序一致。
 * 边界：不做筛选与分页，也不读取文档正文或任何 IO。
 */
import type { Knowledge } from "~/types/content"

/** 知识库一级分区。新增分区要同时改这里与 content/knowledge/ 的 section 取值。 */
export const SECTION_ORDER = ["基础", "语言", "系统", "工具"]

export type KnowledgeGroup = {
    items: Knowledge[]
    section: string
}

function compareItems(a: Knowledge, b: Knowledge) {
    const diff = new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf()
    return diff === 0 ? a.title.localeCompare(b.title, "zh-Hans-CN") : diff
}

/** 按 SECTION_ORDER 分组；未知 section 追加在末尾，避免新分区悄悄消失。 */
export function groupKnowledge(items: Knowledge[]): KnowledgeGroup[] {
    const buckets = new Map<string, Knowledge[]>()
    for (const item of items) {
        const section = item.section || "未分类"
        const list = buckets.get(section) ?? []
        list.push(item)
        buckets.set(section, list)
    }

    const known = SECTION_ORDER.filter((section) => buckets.has(section))
    const rest = [...buckets.keys()].filter((section) => !SECTION_ORDER.includes(section)).sort()
    return [...known, ...rest].map((section) => ({
        items: (buckets.get(section) ?? []).toSorted(compareItems),
        section,
    }))
}

/** 详情页的前后篇顺序：与索引页从上到下一致。 */
export function flattenKnowledge(items: Knowledge[]): Knowledge[] {
    return groupKnowledge(items).flatMap((group) => group.items)
}
