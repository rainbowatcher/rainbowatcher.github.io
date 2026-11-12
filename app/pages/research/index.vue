<script setup lang="ts">
/**
 * 做什么：/research 列表页：按日期倒序列出 content/research/ 下的探索报告。
 * 状态与生命周期：条目来自 manifest.research（仅元数据），渲染时读取一次。
 * 取舍与不变量：本机环境结论换机未必复现，页面固定标注复验要求；行式列表与博客列表共用 PostRow。
 * 边界：不渲染正文（见 research/[...research].vue），也不做分页与标签过滤。
 */
const { data: research } = await useAsyncData("research-list", useResearch())

const items = computed(() =>
    [...(research.value ?? [])].sort((a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf()),
)

const yearSpan = computed(() => {
    const years = items.value
        .map((item) => String(item.date ?? "").slice(0, 4))
        .filter(Boolean)
        .sort()
    return years.length ? `${years[0]}—${years.at(-1)}` : ""
})

useHead({ title: `研究 · ${items.value.length} 篇 — Rainbow Watcher` })
</script>

<template>
    <div class="wrap view-enter">
        <PageHead
            eyebrow="Research / Local runs"
            title="研究"
            :meta="`${items.length} REPORTS · ${yearSpan}`"
            desc="基于本机环境的探索记录：结论依赖当时的机器状态、工具版本与本地配置，换台机器未必复现；引用其中的命令与数据前请先在本机复验。"
        />

        <div class="pt-8px">
            <PostRow
                v-for="item in items"
                :key="item.path"
                :date="item.date"
                :excerpt="item.description ?? item.subtitle"
                :tags="item.tags"
                :title="item.title"
                :to="item.path"
            />
        </div>
        <p v-if="!items.length" class="py-40px c-muted">还没有研究报告。</p>
    </div>
</template>
