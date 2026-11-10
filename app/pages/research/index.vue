<script lang="ts" setup>
/**
 * 做什么：/research 列表页，按日期倒序列出 content/research/ 下的探索报告。
 * 状态与生命周期：数据来自 manifest.research（仅元数据），渲染时读取一次。
 * 取舍与不变量：本机环境结论换机未必复现，页面固定标注复验要求。
 * 边界：不渲染正文（见 [...research].vue），不做分页与标签过滤。
 */
import type { Research } from "~/types/content"

const { data: research } = await useAsyncData("research-list", useResearch())
const items = computed<Research[]>(() => {
    const list = research.value ?? []
    return [...list].sort((a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf())
})
useShowup(".show-up", 25)
</script>

<template>
    <section class="font-mb">
        <div class="min-w-0 lt-sm:px-6 md:(ml-[calc(5rem+3rem)] w-5xl) sm:(ml-[calc(5rem+2rem)] max-w-3xl)">
            <header class="mb-8">
                <h1 class="mb-2 text-3xl font-600 font-mb">
                    研究
                </h1>
                <p class="text-sm c-muted leading-6">
                    基于本机环境的探索记录：结论依赖当时的机器状态、工具版本与本地配置，换台机器未必复现；引用其中的命令与数据前请先在本机复验。
                </p>
            </header>
            <div v-if="items.length" class="space-y-4">
                <div v-for="item in items" :key="item.path" class="show-up relative">
                    <NuxtLink class="text-lg font-400" :href="item.path" role="link" prefetch>
                        {{ item.title }}
                    </NuxtLink>
                    <div class="flex flex-(row nowrap) gap-x-4">
                        <TagList :tags="item.tags" />
                    </div>
                    <span v-if="item.date" class="select-none lt-sm:(absolute right-0 top-1.875rem text-3xl c-muted/18 leading-4) sm:(float-left my--2.75rem ml--5rem mr-4 v-text-bottom text-xs c-muted leading-7)">
                        {{ useDateFormat(item.date, "YYYY.MM.DD").value }}
                    </span>
                </div>
            </div>
            <p v-else class="c-muted">
                还没有研究报告。
            </p>
        </div>
    </section>
</template>