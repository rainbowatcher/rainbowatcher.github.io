<script setup lang="ts">
/**
 * 做什么：/knowledge/<slug> 知识条目详情页：取文档与相邻条目，交给 ArticleLayout 渲染。
 * 状态与生命周期：路由切换时按 route.path 重新取文档；相邻顺序来自 flattenKnowledge（与索引页一致）。
 * 取舍与不变量：条目的 section 作为 kicker 标在日期前，链接只用 path，改 date 不会断链；
 * 首尾条目环绕到另一端，保证每条都有上一篇与下一篇。
 * 边界：不渲染正文排版与目录（见 ArticleLayout），也不负责索引页。
 */
import "katex/dist/katex.min.css"
import type { Knowledge } from "~/types/content"
import { flattenKnowledge } from "~/utils/knowledge"

const route = useRoute()
const { data: knowledge } = await useAsyncData("knowledge-nav", useKnowledge())
const ordered = computed(() => flattenKnowledge(knowledge.value ?? []))
const path = computed(() => ordered.value.find((item) => item.path === route.path)?.path)
if (!path.value) throw createError({ fatal: true, statusCode: 404 })
const { data: doc } = await useAsyncData(
    `knowledge:${route.path}`,
    async () => {
        if (!path.value) return null
        return await useDocument(path.value)()
    },
    { watch: [() => route.path] },
)
if (!doc.value) throw createError({ fatal: true, statusCode: 404 })

const currIdx = computed(() => ordered.value.findIndex((item) => item.path === path.value))

function entry(item?: Knowledge) {
    return item ? { title: item.title ?? "", to: item.path } : undefined
}

/** 首尾环绕：第一条的上一条是最后一条，反之亦然。 */
function neighbor(offset: number) {
    if (!ordered.value.length || currIdx.value < 0) return undefined
    return ordered.value[(currIdx.value + offset + ordered.value.length) % ordered.value.length]
}

const nextKnowledge = computed(() => neighbor(1))
const previousKnowledge = computed(() => neighbor(-1))

useHead({ title: doc.value.title })
</script>

<template>
    <ArticleLayout
        :doc="doc!"
        :back="{ label: '知识', to: '/knowledge' }"
        fallback-label="全部知识"
        fallback-to="/knowledge"
        :kicker="`${doc!.section} · 知识`"
        :next="entry(nextKnowledge)"
        :previous="entry(previousKnowledge)"
    />
</template>
