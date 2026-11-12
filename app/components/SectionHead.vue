<script setup lang="ts">
/**
 * 做什么：分区标题行：序号 + 标题 + 「更多」链接，首页各分区共用。
 * 状态与生命周期：纯展示。
 * 取舍与不变量：序号用等宽字与强调色，标题用衬线体，与页头标题形成层级差。
 * 边界：不渲染分区内容，也不做锚点滚动。
 */
defineProps<{
    index: string
    moreLabel?: string
    moreTo?: string
    title: string
}>()
</script>

<template>
    <div class="flex items-baseline gap-14px border-t border-line pt-18px lt-md:flex-wrap">
        <span class="c-accent font-mono text-10px tracking-[0.08em]">{{ index }}</span>
        <h2 class="section-title">{{ title }}</h2>
        <NuxtLink
            v-if="moreTo"
            class="ml-auto inline-flex items-center gap-5px c-muted text-12px hover:c-accent"
            :to="moreTo"
            prefetch
        >
            {{ moreLabel }}
            <i class="i-ph-arrow-up-right text-14px" />
        </NuxtLink>
    </div>
</template>
