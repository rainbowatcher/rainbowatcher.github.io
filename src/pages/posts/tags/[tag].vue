<script lang="ts" setup>
import { useRoute } from "nuxt/app"

const route = useRoute("posts-tags-tag")
const { data: list } = await useAsyncData("tags", () => queryContent("/posts").find())
const tags = ref<Map<string, number>>(new Map())
const sortedTags = computed(() => [...tags.value.entries()].sort((a, b) => b[1] - a[1]))
const postList = computed(() => {
    return list.value?.filter(i => i.tags.includes(route.params.tag as string))
        .sort((i, j) => new Date(j.date).getTime() - new Date(i.date).getTime()) ?? []
})
onMounted(() => {
    if (list.value) {
        for (const post of list.value) {
            for (const tag of post.tags) {
                tags.value.set(tag, (tags.value.get(tag) ?? 0) + 1)
            }
        }
    }
})
</script>

<template>
    <div class="tag-list flex flex-row flex-wrap gap-x-4 lt-sm:mx-6 sm:(ml-[calc(3rem)] w-3xl) md:w-5xl">
        <NuxtLink
            v-for="tag in sortedTags" :key="tag[0]"
            class="tag-item bg-none text-nowrap c-input op30 hover:op100" :to="`/posts/tags/${tag[0]}`"
        >
            #{{ tag[0] }}
        </NuxtLink>
    </div>
    <div class="post-list mt-8 lt-sm:mx-6 sm:(ml-[calc(5rem+3rem)] w-3xl) md:w-5xl">
        <div v-for="post in postList" :key="post._path">
            <NuxtLink class="text-lg font-400" :href="post._path" role="link">
                {{ post.title }}
            </NuxtLink>
            <span class="float-left ml--5rem mr-4 vertical-text-bottom text-xs leading-7 op55">{{ useDateFormat(post.date, "YYYY.MM.DD").value }}</span>
            <div class="post-tags flex flex-(row nowrap) gap-x-4">
                <NuxtLink
                    v-for="tag in post.tags" :key="tag" :to="`/posts/tags/${tag}`"
                    class="bg-none text-xs c-input italic op-75 hover:op-100"
                >
                    {{ `#${tag}` }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style>

</style>
