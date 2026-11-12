<script setup lang="ts">
/**
 * 做什么：文末的上一篇 / 下一篇卡片，缺失一侧时用「回到列表」兜底。
 * 状态与生命周期：纯展示，链接由调用方给出。
 * 取舍与不变量：左右两栏等宽，下一张右对齐；窄屏堆叠成一列，避免标题被压成一字一行。
 * 边界：不负责列表顺序（顺序由各内容集合的排序决定）。
 */
defineProps<{
    fallbackLabel?: string
    fallbackTo?: string
    next?: { title: string; to: string }
    previous?: { title: string; to: string }
}>()
</script>

<template>
    <footer class="mt-[clamp(44px,6vw,68px)] border-t border-line pt-28px">
        <nav class="mt-16px grid grid-cols-2 gap-12px lt-sm:grid-cols-1" aria-label="相邻文章">
            <NuxtLink
                v-if="previous"
                class="flex flex-col gap-4px rounded-card border border-line px-18px py-16px hover:(border-accent bg-surface)"
                :to="previous.to"
                prefetch
            >
                <span class="c-faint font-mono text-9px tracking-[0.1em] uppercase">← 上一篇</span>
                <strong class="font-serif text-14px font-600 leading-[1.5]">{{ previous.title }}</strong>
            </NuxtLink>
            <NuxtLink
                v-else-if="fallbackTo"
                class="flex flex-col gap-4px rounded-card border border-line px-18px py-16px hover:(border-accent bg-surface)"
                :to="fallbackTo"
                prefetch
            >
                <span class="c-faint font-mono text-9px tracking-[0.1em] uppercase">← 回到列表</span>
                <strong class="font-serif text-14px font-600 leading-[1.5]">{{ fallbackLabel }}</strong>
            </NuxtLink>

            <NuxtLink
                v-if="next"
                class="flex flex-col items-end gap-4px rounded-card border border-line px-18px py-16px text-right hover:(border-accent bg-surface)"
                :to="next.to"
                prefetch
            >
                <span class="c-faint font-mono text-9px tracking-[0.1em] uppercase">下一篇 →</span>
                <strong class="font-serif text-14px font-600 leading-[1.5]">{{ next.title }}</strong>
            </NuxtLink>
            <NuxtLink
                v-else-if="fallbackTo"
                class="flex flex-col items-end gap-4px rounded-card border border-line px-18px py-16px text-right hover:(border-accent bg-surface)"
                :to="fallbackTo"
                prefetch
            >
                <span class="c-faint font-mono text-9px tracking-[0.1em] uppercase">继续阅读 →</span>
                <strong class="font-serif text-14px font-600 leading-[1.5]">{{ fallbackLabel }}</strong>
            </NuxtLink>
        </nav>
    </footer>
</template>
