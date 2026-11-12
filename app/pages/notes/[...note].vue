<script lang="ts" setup>
/**
 * 做什么：/notes/<slug> 详情页，渲染单条知识库条目并提供前后篇导航。
 * 状态与生命周期：路由切换时按 route.path 重新取文档；索引顺序取自 manifest.notes。
 * 取舍与不变量：标题、副标题与标签来自 frontmatter（正文从 h2 起写），
 * 前后篇顺序与 /notes 索引页一致，见 utils/notes.ts。
 * 边界：不生成索引页（见 index.vue），也不校验 frontmatter 之外的内容。
 */
import ProseCodeInline from "~/components/content/ProseCodeInline.vue"
import "katex/dist/katex.min.css"
import { flattenNotes } from "~/utils/notes"

const route = useRoute()
const { data: notes } = await useAsyncData("notes-nav", useNotes())
const ordered = computed(() => flattenNotes(notes.value ?? []))
const path = computed(() => ordered.value.find((item) => item.path === route.path)?.path)
if (!path.value) throw createError({ fatal: true, statusCode: 404 })
const { data: doc } = await useAsyncData(
    `note:${route.path}`,
    async () => {
        if (!path.value) return null
        return await useDocument(path.value)()
    },
    { watch: [() => route.path] },
)
if (!doc.value) throw createError({ fatal: true, statusCode: 404 })

const currIdx = computed(() => ordered.value.findIndex((item) => item.path === path.value))
const nextNote = computed(() => {
    const list = ordered.value
    if (!list.length) return undefined
    return currIdx.value === list.length - 1 ? list[0] : list[currIdx.value + 1]
})
const previousNote = computed(() => {
    const list = ordered.value
    if (!list.length) return undefined
    return currIdx.value <= 0 ? list.at(-1) : list[currIdx.value - 1]
})
useShowup(".show-up")
</script>

<template>
    <section class="flex flex-1 flex-col">
        <article class="relative min-w-0 w-full font-mb">
            <p class="show-up mx-6.5dvw mt-1.2em text-center text-xs c-muted tracking-wide">
                {{ doc!.section }} · 笔记
            </p>
            <h1
                class="show-up page-title [view-transition-name:title] z-1 mx-6.5dvw mt-2 text-center text-pretty tracking-tight lt-md:text-12vw md:text-7vw xl:text-5vw"
            >
                {{ doc!.title }}
            </h1>
            <p v-if="doc!.subtitle" class="show-up mx-6.5dvw text-center c-coolGray leading-8">
                {{ doc!.subtitle }}
            </p>
            <span class="show-up mxa flex flex-row flex-wrap justify-center text-pretty space-x-4">
                <TagList :tags="doc!.tags" class="text-lg" />
                <span v-if="doc!.updated" class="hidden text-lg op-75 lt-md:inline">
                    更新于 {{ useDateFormat(doc!.updated as string, "YYYY.MM.DD").value }}
                </span>
            </span>
            <MDCRenderer
                v-if="doc"
                :body="(doc as any).body"
                :data="doc"
                :components="{ code: ProseCodeInline }"
                class="md-doc show-up mt-24 min-w-0 font-sans lt-sm:mx-6 sm:(mxa w-xl) lg:w-3xl md:w-2xl xl:w-5xl space-y-6"
            />
        </article>
        <PageNav class="show-up" :next="nextNote" :previous="previousNote" use-title />
    </section>
</template>
