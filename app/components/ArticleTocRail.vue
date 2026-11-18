<script setup lang="ts">
/**
 * 做什么：文章右栏目录：默认显示缩略线条，hover/聚焦时交叉渐变为明文目录，并高亮当前小节；下方挂回顶入口。
 * 状态与生命周期：标题与高亮来自文章页的 useArticleToc，回顶显隐来自 useBackToTop；本组件只渲染与派发选择事件。
 * 取舍与不变量：缩略线条与明文列表叠在同一个 grid 单元格上做淡入淡出，宽度固定 148px，
 * 因此正文只需为它留出安全边距，不参与 grid 列宽分配；缩略线条叠在上层但不接指针事件，
 * 目录 sticky 在视口顶部，高度上限为视口减去页头，超出部分在明文列表内滚动；
 * 回顶入口靠外层 flex 的 margin-top: auto 贴住视口底部，随文章结束停在文末上方，不进入页脚。
 * 边界：不采集标题、不算阅读进度，也不处理窄屏（见 ArticleTocMobile 与 BackToTop）。
 */
import type { TocHeading } from "~/composables/useArticleToc"

defineProps<{
    activeId?: string
    headings: TocHeading[]
}>()

const emit = defineEmits<{ select: [id: string] }>()

const { visible: backToTopVisible } = useBackToTop()
</script>

<template>
    <div class="absolute bottom-0 right-0 top-[clamp(16px,2.5vw,28px)] flex w-148px flex-col lt-lg:hidden">
        <aside class="sticky top-[calc(var(--header-h)+30px)] flex flex-col items-start" aria-label="文章目录">
            <nav class="group grid max-h-[calc(100vh_-_var(--header-h)_-_128px)] cursor-pointer" aria-label="本文目录">
                <div
                    class="col-start-1 row-start-1 max-h-[inherit] pointer-events-none flex flex-col gap-5px overflow-hidden py-6px transition-opacity group-hover:op-0 group-focus-within:op-0"
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
                    class="col-start-1 row-start-1 max-h-[inherit] flex flex-col justify-self-start overflow-y-auto op-0 transition-opacity group-hover:op-100 group-focus-within:op-100"
                >
                    <button
                        v-for="heading in headings"
                        :key="heading.id"
                        class="cursor-pointer border-l border-line py-5px pl-12px text-left text-12px leading-[1.55] transition-colors hover:c-ink"
                        :class="[
                            heading.level === 3 ? 'pl-24px text-11.5px' : '',
                            heading.id === activeId ? 'border-l-accent c-accent font-600' : 'c-ink2',
                        ]"
                        type="button"
                        @click="emit('select', heading.id)"
                    >
                        {{ heading.text }}
                    </button>
                </div>
            </nav>
        </aside>

        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="op-0"
            leave-active-class="transition-opacity duration-200"
            leave-to-class="op-0"
        >
            <div v-show="backToTopVisible" class="sticky bottom-24px mt-auto w-full border-t border-line pt-16px">
                <a class="inline-block font-mono text-10px tracking-[0.02em] c-muted hover:c-accent" href="#view">
                    回到顶部 ↑
                </a>
            </div>
        </Transition>
    </div>
</template>
