<script lang="ts" setup>
import { useRoute } from "nuxt/app"

const route = useRoute("posts-tags-tag")
const { data: posts } = await useAsyncData("posts", usePosts())
const tags = computed(() => {
    const map = new Map()
    if (!posts.value) return map

    for (const post of posts.value) {
        if (!post.tags) continue
        for (const tag of post.tags) {
            map.set(tag, (map.get(tag) ?? 0) + 1)
        }
    }

    return [...map.entries()].sort((a, b) => b[1] - a[1])
})
const postList = computed(() => {
    return posts.value?.filter(i => i.tags?.includes(route.params.tag))
        .sort((i, j) => new Date(j.date).getTime() - new Date(i.date).getTime()) ?? []
})
</script>

<template>
    <section>
        <div class="tag-list flex flex-row flex-wrap gap-x-4 lt-sm:mx-6 sm:(ml-[calc(3rem)] w-3xl) md:w-5xl">
            <ANuxtLink
                v-for="tag in tags" :key="tag[0]"
                class="tag-item bg-none text-nowrap c-input op75 hover:op100" :to="`/posts/tags/${tag[0]}`"
            >
                #{{ tag[0] }}
                <sup>{{ tag[1] }}</sup>
            </ANuxtLink>
        </div>
        <div class="post-list mt-8 lt-sm:mx-6 sm:(ml-[calc(5rem+3rem)] w-3xl) md:w-5xl space-y-4">
            <div v-for="post in postList" :key="post._path">
                <ANuxtLink class="text-lg font-400" :href="post._path" role="link">
                    {{ post.title }}
                </ANuxtLink>
                <span class="float-left ml--5rem mr-4 vertical-text-bottom text-xs leading-7 op55">{{ useDateFormat(post.date, "YYYY.MM.DD").value }}</span>
            </div>
        </div>
    </section>
</template>

<style>

</style>
