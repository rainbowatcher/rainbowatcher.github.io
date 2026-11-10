<script lang="ts" setup>
/**
 * 做什么：/research/<slug> 详情页，渲染单篇研究报告并提供前后篇导航。
 * 状态与生命周期：路由切换时按 route.path 重新取文档；列表元数据取自 manifest.research。
 * 取舍与不变量：research 的 path 即路由，无时间永久链接，故直接按 path 匹配与链接。
 * 边界：不生成列表页（见 index.vue），也不校验 frontmatter 之外的内容。
 */
import ProseCodeInline from "~/components/content/ProseCodeInline.vue"
import "katex/dist/katex.min.css"

const route = useRoute()
const { data: research } = await useAsyncData("research-nav", useResearch())
const path = computed(() => research.value?.find(item => item.path === route.path)?.path)
if (!path.value) throw createError({ fatal: true, statusCode: 404 })
const { data: doc } = await useAsyncData(`research:${route.path}`, async () => {
    if (!path.value) return null
    return await useDocument(path.value)()
}, { watch: [() => route.path] })
if (!doc.value) throw createError({ fatal: true, statusCode: 404 })

const currIdx = computed(() => research.value?.findIndex(item => item.path === path.value) ?? 0)
const nextResearch = computed(() => {
    const list = research.value
    if (!list?.length) return undefined
    return currIdx.value === list.length - 1 ? list[0] : list[currIdx.value + 1]
})
const previousResearch = computed(() => {
    const list = research.value
    if (!list?.length) return undefined
    return currIdx.value === 0 ? list.at(-1) : list[currIdx.value - 1]
})
useShowup(".show-up")
</script>

<template>
    <section class="flex flex-1 flex-col">
        <article class="relative min-w-0 w-full font-mb">
            <span v-if="doc!.date" class="show-up absolute inset-x-0 top--.125em z--1 select-none text-center text-nowrap text-11vw c-cyan/38 font-800 lt-md:hidden dark:c-cyan/18">
                {{ useDateFormat(doc!.date, "YYYY MM DD").value }}
            </span>
            <h1 class="show-up [view-transition-name:title] z-1 mx-6.5dvw mt-1.2em text-center text-pretty tracking-tight lt-md:text-12vw md:text-7vw xl:text-5vw">
                {{ doc!.title }}
            </h1>
            <p v-if="doc!.subtitle" class="show-up mx-6.5dvw text-center c-coolGray leading-8">
                {{ doc!.subtitle }}
            </p>
            <span class="show-up mxa flex flex-row flex-wrap justify-center text-pretty space-x-4">
                <TagList :tags="doc!.tags" class="text-lg" />
                <span v-if="doc!.date" class="hidden text-lg op-75 lt-md:inline">{{ useDateFormat(doc!.date, "YYYY.MM.DD").value }}</span>
            </span>
            <p class="show-up mx-6.5dvw mt-6 text-center text-xs c-muted leading-6">
                本机环境探索记录：版本号与结论随机器与配置而变，引用前请在本机复验。
            </p>
            <MDCRenderer
                v-if="doc" :body="(doc as any).body" :data="doc" :components="{ code: ProseCodeInline }"
                class="md-doc show-up mt-24 min-w-0 font-sans lt-sm:mx-6 sm:(mxa w-xl) lg:w-3xl md:w-2xl xl:w-5xl space-y-6"
            />
        </article>
        <PageNav class="show-up" :next="nextResearch" :previous="previousResearch" use-title />
    </section>
</template>