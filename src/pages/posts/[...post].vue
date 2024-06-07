<script setup lang="ts">
import "katex/dist/katex.min.css"

const route = useRoute("posts-post")
const { data: posts } = await useAsyncData("posts", usePosts())
const path = computed(() => posts.value?.find(i => [i._path, i.permalink].includes(route.path))?._path)
const postsIndex = computed(() => posts.value?.findIndex(i => i._path === path.value) ?? 0)
const nextPost = computed(() => {
    if (!posts.value) return
    return postsIndex.value === posts.value.length - 1 ? posts.value[0] : posts.value[postsIndex.value + 1]
})
const previousPost = computed(() => {
    if (!posts.value) return
    return postsIndex.value === 0 ? posts.value.at(-1) : posts.value[postsIndex.value - 1]
})
</script>

<template>
    <section class="flex flex-1 flex-col">
        <article class="relative min-w-0 lt-sm:mx-6 sm:(mx-6 w-fit) lg:w-3xl md:w-2xl xl:w-5xl md:self-center">
            <ContentDoc v-slot="{ doc }" :path="path">
                <h1 class="[view-transition-name:title] show-up z-1 mt-12 text-6xl font-800 font-serif">
                    {{ doc.title }}
                </h1>
                <span class="absolute right-1em top--.35em z--1 select-none text-6rem c-transparent font-900 font-sans text-stroke-1.5 text-stroke-muted op-10 lt-md:hidden">
                    {{ useDateFormat(doc.date, "YYYY.MM.DD").value }}
                </span>
                <span class="show-up space-x-4">
                    <NuxtLink
                        v-for="tag in doc.tags" :key="tag" :to="`/posts/tags/${tag}`"
                        class="bg-none text-sm c-input font-sans italic op-75 hover:op-100"
                    >
                        {{ `#${tag}` }}
                    </NuxtLink>
                    <span class="hidden op-75 lt-md:inline">{{ useDateFormat(doc.date, "YYYY.MM.DD").value }}</span>
                </span>
                <p v-if="doc.subtitle" class="show-up c-coolGray leading-8 font-serif">
                    {{ doc.subtitle }}
                </p>
                <ContentRenderer :value="doc" class="md-doc show-up mt-18 font-serif space-y-4" />
            </ContentDoc>
        </article>
        <PageNav class="show-up" :previous="previousPost" :next="nextPost" use-title use-permalink />
    </section>
</template>
