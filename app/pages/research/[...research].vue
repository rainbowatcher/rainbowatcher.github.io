<script setup lang="ts">
/**
 * 做什么：/research/<slug> 研究报告详情页：取文档与相邻报告，交给 ArticleLayout 渲染。
 * 状态与生命周期：路由切换时按 route.path 重新取文档；相邻关系取自 manifest.research 的顺序。
 * 取舍与不变量：研究报告固定带「本机环境依赖」提示条，提醒结论换台机器未必复现；
 * research 的 path 即路由（无时间永久链接），匹配与链接都用 path。
 * 边界：不渲染正文排版与目录（见 ArticleLayout），也不负责列表页。
 */
import "katex/dist/katex.min.css"
import type { Research } from "~/types/content"

const route = useRoute()
const { data: research } = await useAsyncData("research-nav", useResearch())
const path = computed(() => research.value?.find((item) => item.path === route.path)?.path)
if (!path.value) throw createError({ fatal: true, statusCode: 404 })
const { data: doc } = await useAsyncData(
    `research:${route.path}`,
    async () => {
        if (!path.value) return null
        return await useDocument(path.value)()
    },
    { watch: [() => route.path] },
)
if (!doc.value) throw createError({ fatal: true, statusCode: 404 })

const list = computed(() => research.value ?? [])
const currIdx = computed(() => list.value.findIndex((item) => item.path === path.value))

function entry(item?: Research) {
    return item ? { title: item.title ?? "", to: item.path } : undefined
}

/** 首尾环绕：第一篇的上一篇是最后一篇，反之亦然。 */
function neighbor(offset: number) {
    if (!list.value.length || currIdx.value < 0) return undefined
    return list.value[(currIdx.value + offset + list.value.length) % list.value.length]
}

const nextResearch = computed(() => neighbor(1))
const previousResearch = computed(() => neighbor(-1))

useHead({ title: doc.value.title })
</script>

<template>
    <ArticleLayout
        :doc="doc!"
        :back="{ label: '研究', to: '/research' }"
        :banner="{
            lead: '本机环境探索报告。',
            text: '结论依赖当时的机器状态、工具版本与本地配置，换台机器未必复现；引用其中的命令与数据前请先在本机复验。',
        }"
        fallback-label="全部研究报告"
        fallback-to="/research"
        :kicker="'研究'"
        :next="entry(nextResearch)"
        :previous="entry(previousResearch)"
    />
</template>
