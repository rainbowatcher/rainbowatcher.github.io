<script setup lang="ts">
/**
 * 做什么：搜索入口：挂载 DocSearch 官方 UI（索引与快捷键由它提供），外观由 docsearch.css 换成站点胶囊样式。
 * 状态与生命周期：客户端挂载时动态 import DocSearch，卸载时 destroy；每个实例独占容器。
 * 取舍与不变量：索引里的绝对 URL 归一成站内路径；docsearch 5.2.0 只在键盘选中时调 navigator.navigate，
 * 鼠标点击走原生 <a href> 整页跳转，静态托管下会吃 301 尾斜杠重定向，所以点击拦截后改走 router.push；
 * 触发器文案通过 translations 传入，避免在 CSS 里拼文案；
 * 请求 stalled 时 DocSearch 换掉放大镜图标会顺带重建输入框，这里补一次焦点归还。
 * 边界：不自建搜索索引，也不接管键盘事件；外链与修饰键点击放行给浏览器默认行为。
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
    return `${pathname.replace(/\/+$/, "") || "/"}${hash}`
}

/**
 * 鼠标点击搜索结果时拦截同源 <a>，改成 SPA 导航；外链与修饰键（新标签等）交回浏览器默认行为。
 * 监听挂在 document 上：结果弹窗由 docsearch 自行挂载，不在触发器容器里。
 */
function onDocumentClick(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = event.target instanceof Element ? event.target.closest("a") : null
    if (!anchor || !anchor.closest(".DocSearch")) return
    if (new URL(anchor.href, window.location.origin).origin !== window.location.origin) return
    const path = toPath(anchor.href)
    event.preventDefault()
    if (path !== route.fullPath) router.push(path)
}

/**
 * 请求 stalled 时 DocSearch 把放大镜 <label> 换成加载图标，内联的 preact 11.0.0-beta.0 按索引
 * 复用子节点因此错位，整个输入框被重建、焦点掉到 body；替换完成后把焦点与光标还给新输入框。
 * TODO：@docsearch/js 升到 5.2.0 以上且上游给这两个图标补 key（或换掉那份内联 preact）后删掉本兜底；
 * 验证方式是给 Algolia 的 XHR 加延迟触发 stalled，确认输入框不再被替换。
 */
function refocusInput(input: HTMLInputElement, caret: number) {
    if (input.isConnected) return
    if (!document.querySelector(".DocSearch-Container") || document.activeElement !== document.body) return
    const next = document.querySelector<HTMLInputElement>(".DocSearch-Input")
    if (!next) return
    next.focus({ preventScroll: true })
    next.setSelectionRange(caret, caret)
}

function onSearchFocusOut(event: FocusEvent) {
    const input = event.target
    if (!(input instanceof HTMLInputElement) || !input.classList.contains("DocSearch-Input")) return
    const caret = input.selectionEnd ?? input.value.length
    requestAnimationFrame(() => refocusInput(input, caret))
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

    document.addEventListener("focusout", onSearchFocusOut)
    document.addEventListener("click", onDocumentClick)
})

onUnmounted(() => {
    document.removeEventListener("focusout", onSearchFocusOut)
    document.removeEventListener("click", onDocumentClick)
    instance?.destroy()
})
</script>

<template>
    <div ref="container" class="docsearch" />
</template>
