<script setup lang="ts">
import "katex/dist/katex.min.css"

const route = useRoute("posts-post")
const { data: posts } = await useAsyncData("posts", usePosts(), { transform: addPermalink })
const path = computed(() => posts.value?.find(i => [i._path, i.permalink].includes(route.path))?._path)
const currIdx = computed(() => posts.value?.findIndex(i => i._path === path.value) ?? 0)
const nextPost = computed(() => {
    if (!posts.value) return
    return currIdx.value === posts.value.length - 1 ? posts.value[0] : posts.value[currIdx.value + 1]
})
const previousPost = computed(() => {
    if (!posts.value) return
    return currIdx.value === 0 ? posts.value.at(-1) : posts.value[currIdx.value - 1]
})
</script>

<template>
    <section class="flex flex-1 flex-col">
        <article class="relative min-w-0 w-full font-mb">
            <ContentDoc v-slot="{ doc }" :path="path" :head="false">
                <!-- <PageHead :title="`${doc.title} - Rainbow Watcher's Portfolio`" /> -->
                <span class="absolute right-50% top--.125em z--1 translate-x-50% select-none text-nowrap text-11vw c-cyan/38 font-800 show-up lt-md:hidden dark:c-cyan/18">
                    {{ useDateFormat(doc.date, "YYYY MM DD", { locales: "zh-Hans-CN" }).value }}
                </span>
                <h1 class="page-title [view-transition-name:title] z-1 mx-6.5dvw mt-1.2em text-center text-pretty tracking-tight show-up lt-md:text-12vw md:text-7vw xl:text-5vw">
                    {{ doc.title }}
                </h1>
                <p v-if="doc.subtitle" class="mx-6.5dvw text-center c-coolGray leading-8 show-up">
                    {{ doc.subtitle }}
                </p>
                <span class="mxa flex flex-row flex-wrap justify-center text-pretty show-up space-x-4">
                    <TagList :tags="doc.tags" class="text-lg" />
                    <span class="hidden text-lg op-75 lt-md:inline">{{ useDateFormat(doc.date, "YYYY.MM.DD").value }}</span>
                </span>
                <ContentRenderer :value="doc" class="md-doc mt-24 min-w-0 font-sans show-up lt-sm:mx-6 sm:(mxa w-xl) lg:w-3xl md:w-2xl xl:w-5xl space-y-6" />
            </ContentDoc>
        </article>
        <PageNav class="show-up" :previous="previousPost" :next="nextPost" use-title use-permalink />
    </section>
</template>
