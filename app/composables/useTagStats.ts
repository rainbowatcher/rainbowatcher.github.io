/**
 * 做什么：把博客、笔记、研究、专题四个集合取一次，并合并出标签计数，供首页、标签页与列表页共用。
 * 状态与生命周期：四个 useAsyncData 用固定键（tags-posts / tags-notes / tags-research / tags-topics）
 * 注册，跨页面复用同一份缓存；计数与文档合集由 computed 派生。
 * 取舍与不变量：注册必须发生在页面 setup 的同步阶段（调用方不要先 await 再调用），
 * 否则 SSR 取不到数据；计数按标签原文累计、链接统一小写，避免同名标签分裂。
 * 边界：不做筛选结果本身，也不读取文档正文。
 */
import type { ContentDocument, Note, Post, Research, Topic } from "~/types/content"

export type TagStat = [string, number]

export function useTagStats() {
    const { data: posts } = useAsyncData("tags-posts", usePosts())
    const { data: notes } = useAsyncData("tags-notes", useNotes())
    const { data: research } = useAsyncData("tags-research", useResearch())
    const { data: topics } = useAsyncData("tags-topics", useTopics())

    const documents = computed<ContentDocument[]>(() => [
        ...(posts.value ?? []),
        ...(notes.value ?? []),
        ...(research.value ?? []),
        ...(topics.value ?? []),
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
        hasTag,
        notes: computed<Note[]>(() => notes.value ?? []),
        posts: computed<Post[]>(() => posts.value ?? []),
        research: computed<Research[]>(() => research.value ?? []),
        tags,
        topics: computed<Topic[]>(() => topics.value ?? []),
    }
}
