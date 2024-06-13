<script lang="ts" setup>
import type { ParsedContent } from "@nuxt/content/types"

const route = useRoute("posts")
const pageNum = computed(() => (Number.isNaN(Number(route.query.page)) ? 1 : Number(route.query.page)))
const routePathPrefix = "/posts?page="
const { data: posts } = await useAsyncData("posts", usePosts(), { transform: addPermalink })
const pageSize = 12
const maxPage = computed(() => Math.ceil((posts.value?.length ?? 1) / pageSize))
const nextNavItem = computed(() => (pageNum.value < maxPage.value ? { _path: `${routePathPrefix}${pageNum.value + 1}`, title: "" } : undefined))
const previousNavItem = computed(() => (pageNum.value > 1 ? { _path: `${routePathPrefix}${pageNum.value - 1}`, title: "" } : undefined))
const currPage = computed(() => {
    return getPage(posts.value ?? [], pageNum.value)
})
const active = useState<string | undefined>()

function sortByDate(list: Array<Partial<ParsedContent>>) {
    return list.sort((a: Partial<ParsedContent>, b: Partial<ParsedContent>) => {
        return new Date(b.date).valueOf() - new Date(a.date).valueOf()
    })
}

/**
 * get current page
 */
function getPage(list: Array<Partial<ParsedContent>>, pageNum: number | string = 1) {
    const num = Number(pageNum)
    return sortByDate(list).slice((num - 1) * pageSize, num * pageSize)
}
</script>

<template>
    <section>
        <div class="post-list min-w-0 lt-sm:mx-6 sm:(ml-[calc(5rem+3rem)] w-3xl) md:w-5xl space-y-4">
            <PageHead />
            <template v-if="posts?.length">
                <div
                    v-for="post in currPage"
                    :key="post._path" class="post-item show-up first:mt-8"
                >
                    <NuxtLink
                        class="text-lg font-400 font-serif [&.active]:[view-transition-name:title]" :class="{ active: active === post._path }"
                        :href="post.permalink" role="link" prefetch @click="active = post._path"
                    >
                        {{ post.title }}
                    </NuxtLink>
                    <span class="float-left ml--5rem mr-4 v-text-bottom text-xs leading-7 op55">{{ useDateFormat(post.date, "YYYY.MM.DD").value }}</span>
                    <div class="post-tags flex flex-(row nowrap) gap-x-4">
                        <NuxtLink
                            v-for="tag in post.tags" :key="tag" :to="`/posts/tags/${tag}`"
                            class="bg-none text-xs c-input font-sans italic op-75 hover:op-100"
                        >
                            {{ `#${tag}` }}
                        </NuxtLink>
                    </div>
                </div>
            </template>
            <template v-else>
                <p>Can't found any posts</p>
            </template>
        </div>
        <PageNav class="show-up" :previous="previousNavItem" :next="nextNavItem" />
    </section>
</template>
