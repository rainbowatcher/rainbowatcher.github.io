<script setup lang="ts">
// const { data: page } = await useAsyncData("page-data", () => queryContent(route.path).findOne())
import "katex/dist/katex.min.css"

const route = useRoute()
const { data: navigation } = await useAsyncData("navigation", () => fetchContentNavigation())

const nextPost = computed< any >(() => {
    const posts = navigation.value?.[0].children ?? []
    const currentIdx = posts?.findIndex(i => i._path === route.fullPath)
    // eslint-disable-next-line unicorn/prefer-ternary
    if (currentIdx === undefined || currentIdx === posts?.length - 1) {
        return posts?.[0]
    } else {
        return posts?.[currentIdx + 1]
    }
})
const previousPost = computed< any >(() => {
    const posts = navigation.value?.[0].children ?? []
    const currentIdx = posts?.findIndex(i => i._path === route.fullPath)
    // eslint-disable-next-line unicorn/prefer-ternary
    if (currentIdx === undefined || currentIdx === 0) {
        return posts?.at(-1)
    } else {
        return posts?.[currentIdx - 1]
    }
})
</script>

<template>
    <article class="relative min-w-0 lt-sm:mx-6 sm:(mx-6 w-fit) lg:w-3xl md:w-2xl xl:w-5xl md:self-center">
        <ContentDoc v-slot="{ doc }">
            <h1 class="z-1 mt-12 text-6xl font-bold">
                {{ doc.title }}
            </h1>
            <span class="text-stroke-offset-2 absolute right-1em top--.35em z--1 select-none text-6rem color-transparent font-900 text-stroke-2 text-stroke-neutral op-10 lt-md:hidden">
                {{ useDateFormat(doc.date, "YYYY.MM.DD").value }}
            </span>
            <span class="space-x-4">
                <NuxtLink v-for="tag in doc.tags" :key="tag" class="bg-none text-sm c-input italic op-75 hover:op-100">
                    {{ `#${tag}` }}
                </NuxtLink>
                <span class="hidden op-75 lt-md:inline">{{ useDateFormat(doc.date, "YYYY.MM.DD").value }}</span>
            </span>
            <ContentRenderer :value="doc" class="md-doc mt-18 space-y-4" />
        </ContentDoc>
    </article>
    <PageNav :previous="previousPost" :next="nextPost" use-title />
</template>
