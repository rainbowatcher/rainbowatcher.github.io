<script lang="ts" setup>
/**
 * 做什么：/tags/<tag> 页：统计标签并列出该标签下的博客、研究报告与专题。
 * 状态与生命周期：标签计数在 posts、research 与 topics 的元数据加载后计算，随路由参数变化。
 * 取舍与不变量：三类内容共用同一套标签页，避免内容页的标签链接成为死路。
 * 边界：不区分大小写之外的标签归一化，也不做分页。
 */
import type { ContentDocument } from "~/types/content"
import { getRouteParamAsString } from "~/utils/route"

const route = useRoute("tags-tag")
const { data: posts } = await useAsyncData("tags-posts", usePosts())
const { data: research } = await useAsyncData("tags-research", useResearch())
const { data: topics } = await useAsyncData("tags-topics", useTopics())
const currentTag = computed(() => getRouteParamAsString(route, "tag")?.toLocaleLowerCase() ?? "")

function hasTag(item: ContentDocument) {
    return item.tags?.map(tag => tag.toLocaleLowerCase()).includes(currentTag.value) ?? false
}

const tags = computed(() => {
    const map = new Map<string, number>()
    for (const item of [...(posts.value ?? []), ...(research.value ?? []), ...(topics.value ?? [])]) {
        if (!item.tags) continue
        for (const tag of item.tags) {
            // TODO: Maybe better to use lowercase tags
            map.set(tag, (map.get(tag) ?? 0) + 1)
        }
    }

    return [...map.entries()].sort((a, b) => b[1] - a[1])
})
const postList = computed(() => {
    return [...(posts.value ?? [])].filter(hasTag)
        .sort((i, j) => new Date(j.date).getTime() - new Date(i.date).getTime())
})
const researchList = computed(() => (research.value ?? []).filter(hasTag))
const topicsList = computed(() => (topics.value ?? []).filter(hasTag))
useShowup(".show-up", 25)
</script>

<template>
    <section class="font-mb">
        <div class="tag-list flex flex-row flex-wrap gap-x-4 gap-y-1 of-hidden lt-sm:mx6 sm:(mx-[calc(3rem)])">
            <TagList :tags="tags" class="lt-sm:text-sm sm:text-lg [&.router-link-active]:(c-accent op-100)" />
        </div>
        <div class="post-list mt-8 lt-sm:ml-26 sm:ml-[calc(5rem+3rem)] space-y-4">
            <div v-for="post in postList" :key="post.path" class="show-up">
                <NuxtLink class="text-lg font-400" :href="post.permalink ?? post.path" role="link">
                    {{ post.title }}
                </NuxtLink>
                <span class="float-left ml--5rem mr-4 v-text-bottom text-xs leading-7 op-55">{{ useDateFormat(post.date, "YYYY.MM.DD").value }}</span>
            </div>
        </div>
        <div v-if="researchList.length" class="research-list mt-8 lt-sm:ml-26 sm:ml-[calc(5rem+3rem)] space-y-4">
            <h2 class="text-sm c-muted font-sans op-75">
                研究
            </h2>
            <div v-for="item in researchList" :key="item.path" class="show-up">
                <NuxtLink class="text-lg font-400" :href="item.path" role="link">
                    {{ item.title }}
                </NuxtLink>
                <span v-if="item.date" class="float-left ml--5rem mr-4 v-text-bottom text-xs leading-7 op-55">{{ useDateFormat(item.date, "YYYY.MM.DD").value }}</span>
            </div>
        </div>
        <div v-if="topicsList.length" class="topics-list mt-8 lt-sm:ml-26 sm:ml-[calc(5rem+3rem)] space-y-4">
            <h2 class="text-sm c-muted font-sans op-75">
                专题
            </h2>
            <div v-for="item in topicsList" :key="item.path" class="show-up">
                <NuxtLink class="text-lg font-400" :href="item.path" role="link">
                    {{ item.title }}
                </NuxtLink>
                <span v-if="item.date" class="float-left ml--5rem mr-4 v-text-bottom text-xs leading-7 op-55">{{ useDateFormat(item.date, "YYYY.MM.DD").value }}</span>
            </div>
        </div>
    </section>
</template>