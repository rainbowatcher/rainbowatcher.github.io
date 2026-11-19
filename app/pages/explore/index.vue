<script setup lang="ts">
/**
 * 做什么：/explore 列表页：按日期倒序列出 content/explore/ 下的领域地图。
 * 状态与生命周期：条目来自 manifest.explore（仅元数据），渲染时读取一次。
 * 取舍与不变量：地图讲对象是什么与有哪几条路，已落地结论链到经验/知识；
 * 页面固定标注「地图不是结论」，行式列表与博客列表共用 PostRow。
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
            desc="陌生领域的路径地图：对象是什么、有哪几条路、每条走到哪一步。已落地的结论链到经验或知识文章；地图里未落地的部分引用前请先复核。"
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
