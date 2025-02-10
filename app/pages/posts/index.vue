<script lang="ts" setup>
import type { PostsCollectionItem } from "@nuxt/content"

const routePathPrefix = "/posts?page="
const route = useRoute("posts")
const pageNum = computed(() => (Number.isNaN(Number(route.query.page)) ? 1 : Number(route.query.page)))
const { data: posts } = await useAsyncData("posts", usePosts())
const pageSize = 12
const maxPage = computed(() => Math.ceil((posts.value?.length ?? 1) / pageSize))
const nextNavItem = computed(() => (pageNum.value < maxPage.value ? { path: `${routePathPrefix}${pageNum.value + 1}`, title: "" } : undefined))
const previousNavItem = computed(() => (pageNum.value > 1 ? { path: `${routePathPrefix}${pageNum.value - 1}`, title: "" } : undefined))
const currPage = computed(() => {
    return getPage(posts.value ?? [], pageNum.value)
})
// class for element add view transition id
const active = useState<string | undefined>()

function sortByDate(list: PostsCollectionItem[]) {
    return list.sort((a: PostsCollectionItem, b: PostsCollectionItem) => {
        return new Date(b.date).valueOf() - new Date(a.date).valueOf()
    })
}

/**
 * get current page
 */
function getPage(list: PostsCollectionItem[], pageNum: number | string = 1) {
    const num = Number(pageNum)
    return sortByDate(list).slice((num - 1) * pageSize, num * pageSize)
}

watch(() => route.query, () => {
    nextTick(() => {
        useShowup(".show-up", 25)
    })
}, { immediate: true })
</script>

<template>
    <section class="font-mb">
        <div class="post-list min-w-0 md:(ml-[calc(5rem+3rem)] w-5xl) sm:(ml-[calc(5rem+2rem)] max-w-3xl) space-y-4 lt-sm:px-6">
            <template v-if="posts?.length">
                <div
                    v-for="post in currPage"
                    :key="post.path" class="show-up post-item relative"
                >
                    <NuxtLink
                        class="text-lg font-400 [&.active]:[view-transition-name:title]" :class="{ active: active === post.path }"
                        :href="post.permalink" role="link" prefetch @click="active = post.path"
                    >
                        {{ post.title }}
                    </NuxtLink>
                    <div class="post-tags h4 flex flex-(row nowrap) gap-x-4">
                        <TagList :tags="post.tags" />
                    </div>
                    <span class="select-none lt-sm:(absolute right-0 top-1.875rem text-3xl c-muted/18 leading-4) sm:(float-left my--2.75rem ml--5rem mr-4 v-text-bottom text-xs c-muted leading-7)">{{ useDateFormat(post.date, "YYYY.MM.DD").value }}</span>
                </div>
            </template>
            <template v-else>
                <p>Can't found any posts</p>
            </template>
        </div>
        <PageNav class="show-up" :previous="previousNavItem" :next="nextNavItem" />
    </section>
</template>
