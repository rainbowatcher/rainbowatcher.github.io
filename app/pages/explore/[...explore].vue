<script setup lang="ts">
/**
 * 做什么：/explore/<slug> 探索记录详情页：取文档与相邻记录，交给 ArticleLayout 渲染。
 * 状态与生命周期：路由切换时按归一化路径重新取文档；相邻关系取自 manifest.explore 的顺序。
 * 取舍与不变量：探索记录固定带「本机环境依赖」提示条，提醒结论换台机器未必复现；
 * explore 的 path 即路由（无时间永久链接），匹配与链接都用 path。
 * 边界：不渲染正文排版与目录（见 ArticleLayout），也不负责列表页。
 */
import "katex/dist/katex.min.css"
import type { Explore } from "~/types/content"
import { normalizePath } from "~/utils/path"

const route = useRoute()
const { data: explore } = await useAsyncData("explore-nav", useExplore())
const routePath = computed(() => normalizePath(route.path))
const path = computed(() => explore.value?.find((item) => item.path === routePath.value)?.path)
if (!path.value) throw createError({ fatal: true, statusCode: 404 })
const { data: doc } = await useAsyncData(
    `explore:${routePath.value}`,
    async () => {
        if (!path.value) return null
        return await useDocument(path.value)()
    },
    { watch: [routePath] },
)
if (!doc.value) throw createError({ fatal: true, statusCode: 404 })

const list = computed(() => explore.value ?? [])
const currIdx = computed(() => list.value.findIndex((item) => item.path === path.value))

function entry(item?: Explore) {
    return item ? { title: item.title ?? "", to: item.path } : undefined
}

/** 首尾环绕：第一篇的上一篇是最后一篇，反之亦然。 */
function neighbor(offset: number) {
    if (!list.value.length || currIdx.value < 0) return undefined
    return list.value[(currIdx.value + offset + list.value.length) % list.value.length]
}

const nextExplore = computed(() => neighbor(1))
const previousExplore = computed(() => neighbor(-1))

useHead({ title: doc.value.title })
</script>

<template>
    <ArticleLayout
        :doc="doc!"
        :back="{ label: '探索', to: '/explore' }"
        :banner="{
            lead: '本机环境探索记录。',
            text: '结论依赖当时的机器状态、工具版本与本地配置，换台机器未必复现；引用其中的命令与数据前请先在本机复验。',
        }"
        fallback-label="全部探索记录"
        fallback-to="/explore"
        :kicker="'探索'"
        :next="entry(nextExplore)"
        :previous="entry(previousExplore)"
    />
</template>
