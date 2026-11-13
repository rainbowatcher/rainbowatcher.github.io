<script setup lang="ts">
/**
 * 做什么：/research 列表页：按日期倒序列出 content/research/ 下的研究草稿。
 * 状态与生命周期：条目来自 manifest.research（仅元数据），渲染时读取一次。
 * 取舍与不变量：草稿只展示当前判断与下一步，不保证结论可用；行式列表与其余分区共用 PostRow，
 * 阶段由目录表达，没有额外的 status 字段。
 * 边界：不渲染正文（见 research/[...research].vue），也不做分页与标签过滤。
 */
const { data: research } = await useAsyncData("research-list", useResearch())

const items = computed(() =>
    [...(research.value ?? [])].sort((a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf()),
)

useHead({ title: `研究 · ${items.value.length} 篇 — Rainbow Watcher` })
</script>

<template>
    <div class="wrap view-enter">
        <PageHead
            eyebrow="Research / Drafts"
            title="研究"
            :meta="`${items.length} DRAFTS`"
            desc="还在验证的想法：允许未验证、允许并列方案，结论随时可能被推翻。实践过后晋升为经验，多篇经验汇合才沉淀为知识。"
        />

        <div class="pt-8px">
            <PostRow
                v-for="item in items"
                :key="item.path"
                :date="item.date"
                :excerpt="item.summary ?? item.description ?? item.subtitle"
                :tags="item.tags"
                :title="item.title"
                :to="item.path"
            />
        </div>
        <p v-if="!items.length" class="py-40px c-muted">还没有研究草稿。</p>
    </div>
</template>
