<script lang="ts" setup>
/**
 * 搜索框：客户端挂载 DocSearch（经典 UI），把爬虫索引里的绝对 URL 归一成站内路径，
 * 点击结果走 Vue Router 的 SPA 导航。每个实例独占自己的容器，移动菜单与页头可各有一份。
 */
const container = ref<HTMLElement>()
const router = useRouter()
const route = useRoute()
const { public: { docSearch } } = useRuntimeConfig()

let instance: { destroy: () => void } | undefined

function toPath(url: string) {
    const { pathname, hash } = new URL(url, window.location.origin)
    return `${pathname.replace(/\/$/, "") || "/"}${hash}`
}

onMounted(async () => {
    const [{ default: docsearch }] = await Promise.all([
        import("@docsearch/js/docsearch"),
        import("@docsearch/css"),
    ])

    instance = docsearch({
        apiKey: docSearch.apiKey,
        appId: docSearch.appId,
        container: container.value!,
        indices: [docSearch.indexName],
        transformItems: items => items.map(item => ({ ...item, url: toPath(item.url) })),
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

<style>
.docsearch {
    line-height: normal;
}

/* 预渲染阶段容器还是空的，先用伪元素占住图标位，DocSearch 注入按钮后 :empty 失效 */
.docsearch:empty::before {
    @apply i-ph-magnifying-glass block op-75;
    content: "";
    height: 1.2em;
    width: 1.2em;
    background-color: hsl(var(--foreground));
}
.docsearch > .DocSearch-Button {
    @apply i-ph-magnifying-glass;
    height: 1.2em !important;
    width: 1.2em !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background-color: hsl(var(--foreground)) !important;
    display: block;

    &:hover {
        box-shadow: none;
        background-color: white;
    }
}

.DocSearch-Button-Container, .DocSearch-Button-Keys {
    @apply !hidden !invisible of-hidden;
}
</style>
