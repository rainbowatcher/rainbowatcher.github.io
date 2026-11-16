<script setup lang="ts">
/**
 * 做什么：文章头：返回入口、日期与阅读时长、标题、副标题、标签，以及探索记录的环境提示条。
 * 状态与生命周期：纯展示；标签走 TagList，点击进标签页。
 * 取舍与不变量：标题用衬线大字号并限制 21em 行宽；探索/经验的环境提示条用左侧金色竖线区分，
 * 与正文里的普通提示块（accent 色）区分开。
 * 边界：不渲染正文与目录，也不做相邻文章导航（见 PrevNext）。
 */
defineProps<{
    backLabel: string
    backTo: string
    banner?: { lead: string; text: string }
    date?: string
    kicker?: string
    minutes?: number
    subtitle?: string
    tags?: string[]
    title: string
}>()
</script>

<template>
    <header class="border-b border-line pb-34px pt-[clamp(36px,5vw,58px)]">
        <NuxtLink
            class="inline-flex items-center gap-6px c-muted font-mono text-[10.5px] tracking-[0.02em] hover:c-accent"
            :to="backTo"
            prefetch
        >
            <i class="i-ph-arrow-left text-14px" />
            {{ backLabel }}
        </NuxtLink>

        <div class="mt-26px flex flex-wrap items-center gap-9px c-muted font-mono text-[10.5px] tracking-[0.03em]">
            <span v-if="kicker" class="kicker">{{ kicker }}</span>
            <span v-if="kicker && date" class="dot" />
            <time v-if="date" :datetime="date">{{ date.replaceAll("-", ".") }}</time>
            <span v-if="date && minutes" class="dot" />
            <span v-if="minutes">{{ minutes }} 分钟阅读</span>
        </div>

        <h1
            class="mt-13px max-w-21em text-balance font-serif text-[clamp(35px,5.2vw,58px)] font-700 tracking-[-0.035em] leading-[1.15] lt-sm:text-[clamp(31px,9.5vw,42px)]"
        >
            {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-15px max-w-40em c-ink2 text-[clamp(15px,1.5vw,17px)] leading-[1.8]">
            {{ subtitle }}
        </p>
        <div v-if="tags?.length" class="mt-22px flex flex-wrap gap-6px">
            <TagList :tags="tags" />
        </div>

        <div
            v-if="banner"
            class="mt-24px flex items-start gap-12px rounded-ctrl border border-line border-l-3 border-l-gold bg-surface px-16px py-14px"
        >
            <i class="i-ph-flask mt-2px flex-none c-gold text-16px" />
            <p class="c-ink2 text-11.5px leading-[1.7]">
                <strong class="c-ink">{{ banner.lead }}</strong> {{ banner.text }}
            </p>
        </div>
    </header>
</template>
