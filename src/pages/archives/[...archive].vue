<script setup lang="ts">
// const { data: page } = await useAsyncData("page-data", () => queryContent(route.path).findOne())
import "katex/dist/katex.min.css"

// const route = useRoute()
// const { data: navigation } = await useAsyncData("navigation", () => fetchContentNavigation())

// const nextPost = computed< any >(() => {
//     const posts = navigation.value?.[0].children ?? []
//     const currentIdx = posts?.findIndex(i => i._path === route.fullPath)
//     // eslint-disable-next-line unicorn/prefer-ternary
//     if (currentIdx === undefined || currentIdx === posts?.length - 1) {
//         return posts?.[0]
//     } else {
//         return posts?.[currentIdx + 1]
//     }
// })
// const previousPost = computed< any >(() => {
//     const posts = navigation.value?.[0].children ?? []
//     const currentIdx = posts?.findIndex(i => i._path === route.fullPath)
//     // eslint-disable-next-line unicorn/prefer-ternary
//     if (currentIdx === undefined || currentIdx === 0) {
//         return posts?.at(-1)
//     } else {
//         return posts?.[currentIdx - 1]
//     }
// })
</script>

<template>
    <section class="ma">
        <article class="font-mb relative min-w-0 w-100dvw">
            <ContentDoc v-slot="{ doc }" :head="false">
                <PageHead :title="`${doc.title} - Rainbow Watcher's Portfolio`" />
                <span class="absolute right-50% top--.125em z--1 translate-x-50% select-none text-nowrap text-11vw c-cyan/12 font-900 show-up lt-md:hidden">
                    {{ useDateFormat(doc.date, "YYYY MM DD", { locales: "zh-Hans-CN" }).value }}
                </span>
                <h1 class="page-title [view-transition-name:title] z-1 mx-6.5dvw mt-12dvh text-center text-pretty tracking-tight show-up lt-md:text-12vw md:text-7vw xl:text-5vw">
                    {{ doc.title }}
                </h1>
                <p v-if="doc.subtitle" class="text-center c-coolGray leading-8 show-up">
                    {{ doc.subtitle }}
                </p>
                <span class="mxa flex flex-row flex-wrap justify-center text-pretty show-up space-x-4">
                    <NuxtLink
                        v-for="tag in doc.tags" :key="tag" :to="`/posts/tags/${tag}`"
                        class="bg-none text-nowrap text-sm c-input tracking-widest italic op-75 hover:op-100"
                    >
                        {{ tag }}
                    </NuxtLink>
                    <span class="hidden op-75 lt-md:inline">{{ useDateFormat(doc.date, "YYYY.MM.DD", { locales: "zh-Hans-CN" }).value }}</span>
                </span>
                <ContentRenderer :value="doc" class="md-doc mt-24 min-w-0 font-sans show-up lt-sm:mx-6 sm:(mxa w-xl) lg:w-3xl md:w-2xl xl:w-5xl space-y-4" />
            </ContentDoc>
        </article>
    </section>
</template>
