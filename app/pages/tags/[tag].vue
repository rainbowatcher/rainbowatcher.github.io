<script lang="ts" setup>
const route = useRoute("tags-tag")
const { data: posts } = await useAsyncData("posts", usePosts(), { transform: addPermalink })
const tags = computed(() => {
    const map = new Map<string, number>()
    if (!posts.value) return [...map.entries()]

    for (const post of posts.value) {
        if (!post.tags) continue
        for (const tag of post.tags) {
            map.set(tag, (map.get(tag) ?? 0) + 1)
        }
    }

    return [...map.entries()].sort((a, b) => b[1] - a[1])
})
const postList = computed(() => {
    return posts.value?.filter(i => i.tags?.map((i: string) => i.toLocaleLowerCase()).includes(route.params.tag.toLocaleLowerCase()))
        .sort((i, j) => new Date(j.date).getTime() - new Date(i.date).getTime()) ?? []
})
</script>

<template>
    <section class="font-mb">
        <!-- <PageHead :title="`${route.params.tag} - Rainbow Watcher's Portfolio`" /> -->
        <div class="tag-list flex flex-row flex-wrap gap-x-4 gap-y-1 of-hidden lt-sm:mx6 sm:(mx-[calc(3rem)])">
            <TagList :tags="tags" class="lt-sm:text-sm sm:text-lg [&.router-link-active]:(c-accent op-100)" />
        </div>
        <div class="post-list mt-8 lt-sm:ml-26 sm:ml-[calc(5rem+3rem)] space-y-4">
            <div v-for="post in postList" :key="post._path" class="show-up">
                <NuxtLink class="text-lg font-400" :href="post.permalink ?? post._path" role="link">
                    {{ post.title }}
                </NuxtLink>
                <span class="float-left ml--5rem mr-4 v-text-bottom text-xs leading-7 op-55">{{ useDateFormat(post.date, "YYYY.MM.DD").value }}</span>
            </div>
        </div>
    </section>
</template>
