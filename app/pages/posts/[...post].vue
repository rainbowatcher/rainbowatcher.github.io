<script setup lang="ts">
/**
 * 做什么：/posts/<permalink> 文章详情页：取文档、给出相邻文章，其余交给 ArticleLayout 渲染。
 * 状态与生命周期：路由切换时按 route.path 重新取文档；相邻关系按 manifest.posts 的导航顺序推导。
 * 取舍与不变量：文章用时间永久链接（permalink），因此匹配与链接都以 permalink 优先；
 * 首尾文章环绕到另一端，保证任何一篇都有上一篇与下一篇。
 * 边界：不渲染正文排版与目录（见 ArticleLayout），也不负责列表页。
 */
import "katex/dist/katex.min.css"
import type { NavigationItem } from "~/types/content"

const route = useRoute("posts-post")
const { post: postName } = route.params
if (!postName) {
    navigateTo("/posts")
}
const { data: posts } = await useAsyncData("posts-nav", useNavItems())
const path = computed(() => posts.value?.find((i) => [i.path, i.permalink].includes(route.path))?.path)
if (!path.value) throw createError({ fatal: true, statusCode: 404 })
const { data: post } = await useAsyncData(
    `post:${route.path}`,
    async () => {
        const target = posts.value?.find((i) => [i.path, i.permalink].includes(route.path))?.path
        if (!target) return null
        return await useDocument(target)()
    },
    { watch: [() => route.path] },
)
if (!post.value) throw createError({ fatal: true, statusCode: 404 })

const list = computed(() => posts.value ?? [])
const currIdx = computed(() => list.value.findIndex((i) => i.path === path.value))

function entry(item?: NavigationItem) {
    if (!item) return undefined
    return { title: item.title ?? "", to: (item.permalink ?? item.path) as string }
}

/** 首尾环绕：第一篇的上一篇是最后一篇，反之亦然。 */
function neighbor(offset: number) {
    if (!list.value.length || currIdx.value < 0) return undefined
    return list.value[(currIdx.value + offset + list.value.length) % list.value.length]
}

const nextPost = computed(() => neighbor(1))
const previousPost = computed(() => neighbor(-1))

useHead({ title: post.value.title })
</script>

<template>
    <ArticleLayout
        :doc="post!"
        :back="{ label: '博客', to: '/posts' }"
        fallback-label="全部文章"
        fallback-to="/posts"
        kicker="文章"
        :next="entry(nextPost)"
        :previous="entry(previousPost)"
    />
</template>
