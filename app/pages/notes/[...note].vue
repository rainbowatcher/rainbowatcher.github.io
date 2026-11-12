<script setup lang="ts">
/**
 * 做什么：/notes/<slug> 知识库条目详情页：取文档与相邻条目，交给 ArticleLayout 渲染。
 * 状态与生命周期：路由切换时按 route.path 重新取文档；相邻顺序来自 flattenNotes（与索引页一致）。
 * 取舍与不变量：条目的 section 作为 kicker 标在日期前，链接只用 path，改 date 不会断链；
 * 首尾条目环绕到另一端，保证每条都有上一篇与下一篇。
 * 边界：不渲染正文排版与目录（见 ArticleLayout），也不负责索引页。
 */
import "katex/dist/katex.min.css"
import type { Note } from "~/types/content"
import { flattenNotes } from "~/utils/notes"

const route = useRoute()
const { data: notes } = await useAsyncData("notes-nav", useNotes())
const ordered = computed(() => flattenNotes(notes.value ?? []))
const path = computed(() => ordered.value.find((item) => item.path === route.path)?.path)
if (!path.value) throw createError({ fatal: true, statusCode: 404 })
const { data: doc } = await useAsyncData(
    `note:${route.path}`,
    async () => {
        if (!path.value) return null
        return await useDocument(path.value)()
    },
    { watch: [() => route.path] },
)
if (!doc.value) throw createError({ fatal: true, statusCode: 404 })

const currIdx = computed(() => ordered.value.findIndex((item) => item.path === path.value))

function entry(item?: Note) {
    return item ? { title: item.title ?? "", to: item.path } : undefined
}

/** 首尾环绕：第一条的上一条是最后一条，反之亦然。 */
function neighbor(offset: number) {
    if (!ordered.value.length || currIdx.value < 0) return undefined
    return ordered.value[(currIdx.value + offset + ordered.value.length) % ordered.value.length]
}

const nextNote = computed(() => neighbor(1))
const previousNote = computed(() => neighbor(-1))

useHead({ title: doc.value.title })
</script>

<template>
    <ArticleLayout
        :doc="doc!"
        :back="{ label: '笔记', to: '/notes' }"
        fallback-label="全部笔记"
        fallback-to="/notes"
        :kicker="`${doc!.section} · 笔记`"
        :next="entry(nextNote)"
        :previous="entry(previousNote)"
    />
</template>
