<script lang="ts" setup>
/**
 * 做什么：/topics 列表页，按日期倒序列出 content/topics/ 下的专题。
 * 状态与生命周期：数据来自 manifest.topics（仅元数据），渲染时读取一次。
 * 取舍与不变量：专题是围绕单个问题的系统分析，列表只展示摘要与标签。
 * 边界：不渲染正文（见 [...topic].vue），不做分页与标签过滤。
 */
import type { Topic } from "~/types/content"

const { data: topics } = await useAsyncData("topics-list", useTopics())
const items = computed<Topic[]>(() => {
    const list = topics.value ?? []
    return [...list].sort((a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf())
})
useHead({
    title: "专题",
    meta: [{ name: "description", content: "围绕一个问题的系统拆解：结论、方案、边界与可复现的验证命令。" }],
})
useShowup(".show-up", 25)
</script>

<template>
    <section class="font-mb">
        <div class="min-w-0 lt-sm:px-6 md:(ml-[calc(5rem+3rem)] w-5xl) sm:(ml-[calc(5rem+2rem)] max-w-3xl)">
            <header class="mb-8">
                <h1 class="mb-2 text-3xl font-600 font-mb">专题</h1>
                <p class="text-sm c-muted leading-6">围绕一个问题的系统拆解：结论、方案、边界与可复现的验证命令。</p>
            </header>
            <div v-if="items.length" class="space-y-6">
                <div v-for="item in items" :key="item.path" class="show-up relative">
                    <NuxtLink class="text-lg font-400" :href="item.path" role="link" prefetch>
                        {{ item.title }}
                    </NuxtLink>
                    <p v-if="item.summary" class="mt-1 text-sm c-muted leading-6">
                        {{ item.summary }}
                    </p>
                    <div class="mt-2 flex flex-(row nowrap) gap-x-4">
                        <TagList :tags="item.tags" />
                    </div>
                    <span
                        v-if="item.date"
                        class="select-none lt-sm:(absolute right-0 top-1.875rem text-3xl c-muted/18 leading-4) sm:(float-left my--2.75rem ml--5rem mr-4 v-text-bottom text-xs c-muted leading-7)"
                    >
                        {{ useDateFormat(item.date, "YYYY.MM.DD").value }}
                    </span>
                </div>
            </div>
            <p v-else class="c-muted">还没有专题。</p>
        </div>
    </section>
</template>
