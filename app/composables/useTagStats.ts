/**
 * 做什么：把博客、知识、探索、经验四个集合取一次，并合并出标签计数，供首页、标签页与列表页共用。
 * 状态与生命周期：四个 useAsyncData 用固定键（tags-posts / tags-knowledge / tags-explore / tags-experience）
 * 注册，跨页面复用同一份缓存；计数与文档合集由 computed 派生。
 * 取舍与不变量：注册必须发生在页面 setup 的同步阶段（调用方不要先 await 再调用），
 * 否则 SSR 取不到数据；计数按标签原文累计、链接统一小写，避免同名标签分裂。
 * 边界：不做筛选结果本身，也不读取文档正文。
 */
import type { ContentDocument, Experience, Explore, Knowledge, Post } from "~/types/content"

export type TagStat = [string, number]

export function useTagStats() {
    const { data: posts } = useAsyncData("tags-posts", usePosts())
    const { data: knowledge } = useAsyncData("tags-knowledge", useKnowledge())
    const { data: explore } = useAsyncData("tags-explore", useExplore())
    const { data: experience } = useAsyncData("tags-experience", useExperience())

    const documents = computed<ContentDocument[]>(() => [
        ...(posts.value ?? []),
        ...(knowledge.value ?? []),
        ...(explore.value ?? []),
        ...(experience.value ?? []),
    ])

    const tags = computed<TagStat[]>(() => {
        const map = new Map<string, number>()
        for (const item of documents.value) {
            for (const tag of item.tags ?? []) {
                map.set(tag, (map.get(tag) ?? 0) + 1)
            }
        }
        return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    })

    function hasTag(tag: string) {
        const target = tag.toLocaleLowerCase()
        return (item: ContentDocument) => item.tags?.some((value) => value.toLocaleLowerCase() === target) ?? false
    }

    return {
        documents,
        experience: computed<Experience[]>(() => experience.value ?? []),
        explore: computed<Explore[]>(() => explore.value ?? []),
        hasTag,
        knowledge: computed<Knowledge[]>(() => knowledge.value ?? []),
        posts: computed<Post[]>(() => posts.value ?? []),
        tags,
    }
}
