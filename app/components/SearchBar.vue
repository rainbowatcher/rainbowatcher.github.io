<script setup lang="ts">
/**
 * 做什么：搜索入口：挂载 DocSearch 官方 UI（索引与快捷键由它提供），外观由 docsearch.css 换成站点胶囊样式。
 * 状态与生命周期：客户端挂载时动态 import DocSearch，卸载时 destroy；每个实例独占容器。
 * 取舍与不变量：索引里的绝对 URL 归一成站内路径，点击结果走 Vue Router 的 SPA 导航；
 * 触发器文案通过 translations 传入，避免在 CSS 里拼文案。
 * 边界：不自建搜索索引，也不接管键盘事件。
 */
const container = ref<HTMLElement>()
const router = useRouter()
const route = useRoute()
const {
    public: { docSearch },
} = useRuntimeConfig()

let instance: { destroy: () => void } | undefined

function toPath(url: string) {
    const { pathname, hash } = new URL(url, window.location.origin)
    return `${pathname.replace(/\/$/, "") || "/"}${hash}`
}

onMounted(async () => {
    const [{ default: docsearch }] = await Promise.all([import("@docsearch/js/docsearch"), import("@docsearch/css")])

    instance = docsearch({
        apiKey: docSearch.apiKey,
        appId: docSearch.appId,
        container: container.value!,
        indices: [docSearch.indexName],
        transformItems: (items) => items.map((item) => ({ ...item, url: toPath(item.url) })),
        translations: {
            button: {
                buttonAriaLabel: "搜索文章、主题或页面",
                buttonText: "搜索",
            },
        },
        navigator: {
            navigate: ({ itemUrl }) => {
                const path = toPath(itemUrl)
                if (path !== route.fullPath) {
                    router.push(path)
                }
            },
        },
    })
})

onUnmounted(() => instance?.destroy())
</script>

<template>
    <div ref="container" class="docsearch" />
</template>
