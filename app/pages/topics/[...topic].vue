<script setup lang="ts">
/**
 * 做什么：/topics/<slug> 专题详情页：取文档与相邻专题，交给 ArticleLayout 渲染，并写页面级 SEO。
 * 状态与生命周期：路由切换时按 route.path 重新取文档；相邻关系取自 manifest.topics 的顺序。
 * 取舍与不变量：专题固定带「命令与结论随环境变化」提示条；description 优先取 frontmatter，
 * 缺失时退回 summary，保证 meta description 非空。
 * 边界：不渲染正文排版与目录（见 ArticleLayout），也不负责列表页。
 */
import "katex/dist/katex.min.css"
import type { Topic } from "~/types/content"

const route = useRoute()
const { data: topics } = await useAsyncData("topics-nav", useTopics())
const path = computed(() => topics.value?.find((item) => item.path === route.path)?.path)
if (!path.value) throw createError({ fatal: true, statusCode: 404 })
const { data: doc } = await useAsyncData(
    `topic:${route.path}`,
    async () => {
        if (!path.value) return null
        return await useDocument(path.value)()
    },
    { watch: [() => route.path] },
)
if (!doc.value) throw createError({ fatal: true, statusCode: 404 })

const pageDescription = computed(() => {
    const description = doc.value?.description
    if (typeof description === "string" && description) return description
    const summary = doc.value?.summary
    return typeof summary === "string" ? summary : ""
})

useHead({
    title: doc.value.title,
    meta: [{ name: "description", content: pageDescription }],
})

const list = computed(() => topics.value ?? [])
const currIdx = computed(() => list.value.findIndex((item) => item.path === path.value))

function entry(item?: Topic) {
    return item ? { title: item.title ?? "", to: item.path } : undefined
}

/** 首尾环绕：第一篇的上一篇是最后一篇，反之亦然。 */
function neighbor(offset: number) {
    if (!list.value.length || currIdx.value < 0) return undefined
    return list.value[(currIdx.value + offset + list.value.length) % list.value.length]
}

const nextTopic = computed(() => neighbor(1))
const previousTopic = computed(() => neighbor(-1))
</script>

<template>
    <ArticleLayout
        :doc="doc!"
        :back="{ label: '专题', to: '/topics' }"
        :banner="{ lead: '专题分析。', text: '命令与结论会随版本、网络与部署方式变化，执行前请先核对目标环境。' }"
        fallback-label="全部专题"
        fallback-to="/topics"
        :kicker="'专题'"
        :next="entry(nextTopic)"
        :previous="entry(previousTopic)"
    />
</template>
