<script setup lang="ts">
/**
 * 做什么：文章右栏目录：默认显示缩略线条，hover/聚焦时交叉渐变为明文目录，并高亮当前小节。
 * 状态与生命周期：标题与高亮来自文章页的 useArticleToc，本组件只负责渲染与派发选择事件。
 * 取舍与不变量：缩略线条与明文列表叠在同一个 grid 单元上做淡入淡出，宽度固定 132px，
 * 因此正文只需为它留出安全边距，不参与 grid 列宽分配。
 * 边界：不采集标题、不算阅读进度，也不处理窄屏（见 ArticleTocMobile）。
 */
import type { TocHeading } from "~/composables/useArticleToc"

defineProps<{
    activeId?: string
    headings: TocHeading[]
}>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
    <aside class="absolute bottom-0 right-0 top-[clamp(32px,4.5vw,52px)] w-132px lt-lg:hidden" aria-label="文章目录">
        <div class="sticky top-[calc(var(--header-h)+30px)] flex flex-col items-start gap-24px">
            <nav class="group grid cursor-pointer" aria-label="本文目录">
                <div
                    class="flex flex-col gap-5px py-6px transition-opacity group-hover:op-0 group-focus-within:op-0"
                    aria-hidden="true"
                >
                    <i
                        v-for="heading in headings"
                        :key="heading.id"
                        class="block h-2px"
                        :class="heading.id === activeId ? 'bg-accent' : 'bg-lineStrong'"
                        :style="{
                            marginLeft: heading.level === 3 ? '7px' : '',
                            width: heading.level === 3 ? '13px' : '20px',
                        }"
                    />
                </div>
                <div
                    class="col-start-1 row-start-1 flex flex-col justify-self-start op-0 transition-opacity group-hover:op-100 group-focus-within:op-100"
                >
                    <button
                        v-for="heading in headings"
                        :key="heading.id"
                        class="cursor-pointer border-l border-line py-5px pl-12px text-left text-11.5px leading-[1.55] transition-colors hover:c-ink"
                        :class="[
                            heading.level === 3 ? 'pl-24px text-11px' : '',
                            heading.id === activeId ? 'border-l-accent c-accent font-600' : 'c-ink2',
                        ]"
                        type="button"
                        @click="emit('select', heading.id)"
                    >
                        {{ heading.text }}
                    </button>
                </div>
            </nav>

            <div class="w-full border-t border-line pt-16px">
                <button
                    class="cursor-pointer c-muted font-mono text-10px tracking-[0.02em] hover:c-accent"
                    type="button"
                    @click="emit('select', '')"
                >
                    回到顶部 ↑
                </button>
            </div>
        </div>
    </aside>
</template>
