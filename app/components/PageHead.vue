<script setup lang="ts">
/**
 * 做什么：页面头：小标题、大标题、右侧元信息与描述，列表页共用一套。
 * 状态与生命周期：纯展示；按钮/筛选等额外内容通过默认插槽追加。
 * 取舍与不变量：标题用衬线体大字号，元信息用等宽小字右对齐；窄屏元信息折到标题下方。
 * 边界：不含列表与分页，也不写页面级 SEO（见各页 useHead）。
 */
defineProps<{
    desc?: string
    eyebrow?: string
    meta?: string
    title: string
}>()
</script>

<template>
    <header class="border-b border-line pb-26px pt-[clamp(42px,6vw,68px)]">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <div class="mt-10px flex items-end justify-between gap-24px lt-md:(flex-col items-start gap-6px)">
            <h1 class="page-title">{{ title }}</h1>
            <span v-if="meta" class="meta-mono whitespace-nowrap pb-8px lt-md:pb-0">{{ meta }}</span>
        </div>
        <p v-if="desc" class="mt-16px max-w-38em c-ink2 text-[14.5px] leading-[1.8]">{{ desc }}</p>
        <slot />
    </header>
</template>
