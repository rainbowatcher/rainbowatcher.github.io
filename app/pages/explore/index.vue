<script setup lang="ts">
/**
 * 做什么：/explore 列表页：按日期倒序列出 content/explore/ 下的探索记录。
 * 状态与生命周期：条目来自 manifest.explore（仅元数据），渲染时读取一次。
 * 取舍与不变量：本机实测结论换机未必复现，调研草稿结论尚未定型，两类共用一栏；
 * 页面固定标注复核要求，行式列表与博客列表共用 PostRow。
 * 边界：不渲染正文（见 explore/[...explore].vue），也不做分页与标签过滤。
 */
const { data: explore } = await useAsyncData("explore-list", useExplore())

const items = computed(() =>
    [...(explore.value ?? [])].sort((a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf()),
)

const yearSpan = computed(() => {
    const years = items.value
        .map((item) => String(item.date ?? "").slice(0, 4))
        .filter(Boolean)
        .sort()
    return years.length ? `${years[0]}—${years.at(-1)}` : ""
})

useHead({ title: `探索 · ${items.value.length} 篇 — Rainbow Watcher` })
</script>

<template>
    <div class="wrap view-enter">
        <PageHead
            eyebrow="Explore / Notes"
            title="探索"
            :meta="`${items.length} RECORDS · ${yearSpan}`"
            desc="本机环境的实测记录，与还在验证的调研草稿。前者换台机器未必复现，后者结论未定型；引用其中的命令与数据前请先复核。"
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
        <p v-if="!items.length" class="py-40px c-muted">还没有探索记录。</p>
    </div>
</template>
