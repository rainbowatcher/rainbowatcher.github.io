<script setup lang="ts">
/**
 * 做什么：/experience 列表页：按日期倒序列出 content/experience/ 下的经验条目，列表展示摘要。
 * 状态与生命周期：条目来自 manifest.experience（仅元数据），渲染时读取一次。
 * 取舍与不变量：经验是围绕单个问题的系统总结，摘要优先取 frontmatter 的 summary，缺失时退回 description；
 * 页面级 SEO 与详情页同源，避免列表页标题落后于内容。
 * 边界：不渲染正文（见 experience/[...experience].vue），也不做分页与标签过滤。
 */
const { data: experience } = await useAsyncData("experience-list", useExperience())

const items = computed(() =>
    [...(experience.value ?? [])].sort((a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf()),
)

useHead({
    title: `经验 · ${items.value.length} 篇`,
    meta: [{ name: "description", content: "围绕一个问题的经验总结：结论、方案、边界与可复现的验证命令。" }],
})
</script>

<template>
    <div class="wrap view-enter">
        <PageHead
            eyebrow="Experience / Deep dives"
            title="经验"
            :meta="`${items.length} ENTRIES`"
            desc="围绕一个问题的经验总结：结论、方案、边界与可复现的验证命令。写完即定稿，改动会写明原因。"
        />

        <div class="pt-8px">
            <PostRow
                v-for="item in items"
                :key="item.path"
                :date="item.date"
                :excerpt="item.summary ?? item.description"
                :tags="item.tags"
                :title="item.title"
                :to="item.path"
            />
        </div>
        <p v-if="!items.length" class="py-40px c-muted">还没有经验条目。</p>
    </div>
</template>
