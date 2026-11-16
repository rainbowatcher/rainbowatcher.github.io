<script setup lang="ts">
/**
 * 做什么：/research/<slug> 研究草稿详情页：取文档与相邻条目，交给 ArticleLayout 渲染。
 * 状态与生命周期：路由切换时按归一化路径重新取文档；相邻关系取自 manifest.research 的顺序。
 * 取舍与不变量：草稿固定带「未定型」提示条，避免读者把未验证判断当成结论；
 * research 的 path 即路由，匹配与链接都用 path。
 * 边界：不渲染正文排版与目录（见 ArticleLayout），也不负责列表页。
 */
import "katex/dist/katex.min.css"
import type { Research } from "~/types/content"
import { normalizePath } from "~/utils/path"

const route = useRoute()
const { data: research } = await useAsyncData("research-nav", useResearch())
const routePath = computed(() => normalizePath(route.path))
const path = computed(() => research.value?.find((item) => item.path === routePath.value)?.path)
if (!path.value) throw createError({ fatal: true, statusCode: 404 })
const { data: doc } = await useAsyncData(
    `research:${routePath.value}`,
    async () => {
        if (!path.value) return null
        return await useDocument(path.value)()
    },
    { watch: [routePath] },
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
            lead: '草稿。',
            text: '结论尚未定型，可能需要且可能有多种方案并存；实践验证后再晋升为经验，请勿直接当作可复用的结论。',
        }"
        fallback-label="全部研究"
        fallback-to="/research"
        :kicker="'研究草稿'"
        :next="entry(nextResearch)"
        :previous="entry(previousResearch)"
    />
</template>
