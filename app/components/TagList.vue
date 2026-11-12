<script setup lang="ts">
/**
 * 做什么：标签胶囊组：把 标签 或 [标签, 计数] 渲染成指向 /tags/<标签> 的胶囊链接。
 * 状态与生命周期：纯展示，无状态；计数为 0 时不显示角标。
 * 取舍与不变量：链接路径统一小写，展示保留原文；当前标签用 active 显式指定，
 * 不依赖 router-link-active，避免同页多个标签同时高亮。
 * 边界：不做排序与计数统计（见 useTagStats）。
 */
defineProps<{
    active?: string
    class?: string
    tags?: Array<[string, number] | string>
}>()

function tagNum(tag: [string, number] | string) {
    return typeof tag === "string" ? 0 : tag[1]
}

function tagName(tag: [string, number] | string) {
    return typeof tag === "string" ? tag : tag[0]
}

function isActive(tag: [string, number] | string, active?: string) {
    return Boolean(active) && tagName(tag).toLocaleLowerCase() === active?.toLocaleLowerCase()
}
</script>

<template>
    <NuxtLink
        v-for="tag in tags"
        :key="tagName(tag)"
        :to="`/tags/${tagName(tag).toLocaleLowerCase()}`"
        class="tag-pill"
        :class="[{ 'border-accent bg-accentSoft c-accent': isActive(tag, active) }, $props.class]"
        prefetch
    >
        {{ tagName(tag) }}
        <span v-if="tagNum(tag)" class="ml-5px c-faint font-mono text-[9.5px]">{{ tagNum(tag) }}</span>
    </NuxtLink>
</template>
