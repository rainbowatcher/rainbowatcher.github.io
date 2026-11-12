<script setup lang="ts">
/**
 * 做什么：主题云：按计数倒序列出主题胶囊，末位补一个「全部主题」入口。
 * 状态与生命周期：纯展示，标签与计数来自 useTagStats。
 * 取舍与不变量：只展示前 limit 个，避免首页被长尾标签撑高；计数为 0 的标签不出现。
 * 边界：不做筛选交互（筛选在博客列表页与标签页）。
 */
import type { TagStat } from "~/composables/useTagStats"

const props = withDefaults(
    defineProps<{
        limit?: number
        tags: TagStat[]
    }>(),
    {
        limit: 12,
    },
)

const visible = computed(() => props.tags.slice(0, props.limit))
</script>

<template>
    <div class="mt-22px flex flex-wrap gap-9px">
        <NuxtLink
            v-for="[name, count] in visible"
            :key="name"
            class="inline-flex items-center gap-9px rounded-full border border-line px-14px py-9px c-ink2 text-13px leading-none hover:(border-accent bg-accentSoft c-accent)"
            :to="`/tags/${name.toLocaleLowerCase()}`"
            prefetch
        >
            {{ name }}
            <span class="c-faint font-mono text-[9.5px]">{{ count }}</span>
        </NuxtLink>
        <NuxtLink
            v-if="tags.length > limit"
            class="inline-flex items-center gap-5px rounded-full border border-line px-14px py-9px c-ink2 text-13px leading-none hover:(border-accent bg-accentSoft c-accent)"
            to="/posts"
            prefetch
        >
            全部 {{ tags.length }} 个主题
            <i class="i-ph-arrow-right text-13px" />
        </NuxtLink>
    </div>
</template>
