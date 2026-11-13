<script setup lang="ts">
/**
 * 做什么：列表行：日期 · 标题与摘要 · 标签 · 箭头，首页、博客、知识、探索、经验共用一套。
 * 状态与生命周期：纯展示；整行可点击由标题链接的伪元素覆盖实现，因此行内其它链接（标签）仍可点。
 * 取舍与不变量：窄屏依次降级——先隐藏右侧标签，再把日期移到独立一行；摘要始终单行截断。
 * 边界：不负责筛选、分页与展开（见博客列表页），也不渲染标签的计数。
 */
defineProps<{
    date?: string
    excerpt?: string
    tags?: string[]
    title: string
    to: string
}>()
</script>

<template>
    <div
        class="group relative grid grid-cols-[88px_minmax(0,1fr)_auto_18px] items-center gap-20px border-b border-line py-19px lt-lg:(grid-cols-[78px_minmax(0,1fr)_18px]) lt-md:(grid-cols-[1fr_16px] gap-x-12px gap-y-6px py-16px)"
    >
        <time
            v-if="date"
            class="c-muted font-mono text-[10.5px] tracking-[0.02em] whitespace-nowrap lt-md:(col-span-2 text-[9.5px])"
            :datetime="date"
        >
            {{ date.replaceAll("-", ".") }}
        </time>
        <span class="min-w-0">
            <NuxtLink
                class="block font-serif text-[19.5px] font-600 tracking-[-0.01em] leading-[1.4] transition-colors after:(absolute inset-0 z-1 content-['']) group-hover:c-accent lt-md:text-[17.5px]"
                :to="to"
                prefetch
            >
                {{ title }}
            </NuxtLink>
            <span v-if="excerpt" class="mt-4px line-clamp-1 c-muted text-[12.5px] leading-[1.6] lt-md:line-clamp-2">
                {{ excerpt }}
            </span>
        </span>
        <span v-if="tags?.length" class="relative z-2 flex flex-wrap justify-end gap-6px">
            <TagList :tags="tags.slice(0, 3)" />
        </span>
        <span class="c-faint transition-all group-hover:(c-accent translate-x-3px)">
            <i class="i-ph-arrow-up-right text-17px" />
        </span>
    </div>
</template>
