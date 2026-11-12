<script setup lang="ts">
/**
 * 做什么：首页速览卡：内容与主题计数、年跨度，以及最近一篇的入口。
 * 状态与生命周期：纯展示，数据由首页传入；无数据时不渲染最近更新行。
 * 取舍与不变量：顶部 3px 彩虹条与「持续写作」圆点是首页唯一的彩色装饰，其余保持中性。
 * 边界：不做统计口径的定义（口径见首页），也不负责列表渲染。
 */
defineProps<{
    latest?: { date?: string; to: string; title: string }
    stats: Array<{ label: string; value: number }>
}>()
</script>

<template>
    <aside
        class="relative z-1 overflow-hidden border border-line rounded-card bg-surface p-24px pb-20px shadow-[var(--shadow-1)] stats-card before:(absolute inset-x-0 top-0 h-3px op-85 content-[''])"
        aria-label="站点速览"
    >
        <div class="flex items-center justify-between gap-12px border-b border-line pb-18px">
            <span class="eyebrow text-9px">At a glance</span>
            <span
                class="inline-flex items-center gap-6px c-muted font-mono text-9px tracking-[0.1em] uppercase before:(h-6px w-6px rounded-full bg-accent shadow-[0_0_0_3px_var(--accent-soft)] content-[''])"
            >
                持续写作
            </span>
        </div>

        <div class="grid grid-cols-3 py-20px pb-18px">
            <div
                v-for="item in stats"
                :key="item.label"
                class="flex flex-col gap-2px border-l border-line pl-15px first:(border-l-0 pl-0)"
            >
                <strong class="font-serif text-34px font-600 tracking-[-0.03em] leading-none">{{ item.value }}</strong>
                <span class="c-muted text-[10.5px] tracking-[0.02em]">{{ item.label }}</span>
            </div>
        </div>

        <div v-if="latest" class="flex flex-col gap-4px border-t border-line pt-14px">
            <span class="c-faint font-mono text-9px tracking-[0.12em] uppercase">
                最近更新{{ latest.date ? ` · ${latest.date.replaceAll("-", ".")}` : "" }}
            </span>
            <NuxtLink
                class="group flex items-center justify-between gap-8px font-serif text-[14.5px] font-600 leading-[1.5] hover:c-accent"
                :to="latest.to"
                prefetch
            >
                <span>{{ latest.title }}</span>
                <i class="i-ph-arrow-right flex-none c-faint text-14px transition-colors group-hover:c-accent" />
            </NuxtLink>
        </div>
    </aside>
</template>
