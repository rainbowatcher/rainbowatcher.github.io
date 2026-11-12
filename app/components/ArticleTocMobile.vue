<script setup lang="ts">
/**
 * 做什么：窄屏文章目录：折叠在 <details> 里的明文目录，点击小节后自动收起。
 * 状态与生命周期：标题与高亮来自文章页的 useArticleToc；open 状态是本地 UI 状态。
 * 取舍与不变量：宽度不足 1080px 时替代右栏出现（见 ArticleTocRail），二者不会同时可见；
 * 点击小节后关闭折叠面板，避免遮住刚跳到的正文。
 * 边界：不采集标题，也不显示缩略线条。
 */
import type { TocHeading } from "~/composables/useArticleToc"

defineProps<{
    activeId?: string
    headings: TocHeading[]
}>()

const emit = defineEmits<{ select: [id: string] }>()

const open = ref(false)

function select(id: string) {
    open.value = false
    emit("select", id)
}
</script>

<template>
    <details v-if="headings.length" class="mb-28px rounded-ctrl border border-line bg-surface lg:hidden" :open="open">
        <summary
            class="cursor-pointer list-none px-14px py-12px c-ink2 text-12.5px font-600 after:(float-right c-muted content-['+']) open:after:content-['−']"
            @click.prevent="open = !open"
        >
            本文目录
        </summary>
        <nav class="flex flex-col px-14px pb-10px" aria-label="本文目录">
            <button
                v-for="heading in headings"
                :key="heading.id"
                class="cursor-pointer py-5px text-left text-11.5px c-muted hover:c-accent"
                :class="[heading.level === 3 ? 'pl-14px' : '', heading.id === activeId ? 'c-accent' : '']"
                type="button"
                @click="select(heading.id)"
            >
                {{ heading.text }}
            </button>
        </nav>
    </details>
</template>
