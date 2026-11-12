<script setup lang="ts">
/**
 * 做什么：分页条：左侧区间与总数，右侧上一页 / 页码 / 下一页。
 * 状态与生命周期：纯展示 + 事件；当前页与总页数由页面计算后传入，页码链接写回路由 query。
 * 取舍与不变量：页码用两位数字补齐并高亮当前页；总页数超过一屏时只显示当前页附近的窗口，
 * 避免长列表把页码行撑爆。
 * 边界：不读取数据，也不改 URL（由调用方决定 to 或事件）。
 */
const props = withDefaults(
    defineProps<{
        from?: number
        to?: number
        total: number
        current: number
        totalPages: number
    }>(),
    {
        from: 0,
        to: 0,
    },
)

const emit = defineEmits<{ change: [page: number] }>()

const windowPages = computed(() => {
    const pages: number[] = []
    const start = Math.max(1, Math.min(props.current - 2, props.totalPages - 4))
    const end = Math.min(props.totalPages, start + 4)
    for (let page = start; page <= end; page += 1) pages.push(page)
    return pages
})

function goto(page: number) {
    if (page < 1 || page > props.totalPages || page === props.current) return
    emit("change", page)
}
</script>

<template>
    <nav
        class="mt-34px flex items-center justify-between gap-16px border-t border-line pt-22px lt-md:(flex-col items-start)"
        aria-label="分页"
    >
        <span class="c-faint font-mono text-10px">{{ from }}–{{ to }} / {{ total }}</span>
        <div class="flex items-center gap-4px">
            <button
                class="inline-flex h-34px min-w-34px items-center justify-center rounded-ctrl border border-transparent px-10px c-ink2 font-mono text-11px hover:(border-line bg-surface) disabled:(c-faint cursor-not-allowed op-45 hover:border-transparent hover:bg-transparent)"
                type="button"
                :disabled="current === 1"
                aria-label="上一页"
                @click="goto(current - 1)"
            >
                <i class="i-ph-caret-left text-15px" />
            </button>
            <button
                v-for="page in windowPages"
                :key="page"
                class="inline-flex h-34px min-w-34px items-center justify-center rounded-ctrl border px-10px font-mono text-11px"
                :class="
                    page === current
                        ? 'border-accent bg-accentSoft c-accent font-600'
                        : 'border-transparent c-ink2 hover:(border-line bg-surface)'
                "
                type="button"
                :aria-current="page === current ? 'page' : undefined"
                @click="goto(page)"
            >
                {{ String(page).padStart(2, "0") }}
            </button>
            <button
                class="inline-flex h-34px min-w-34px items-center justify-center rounded-ctrl border border-transparent px-10px c-ink2 font-mono text-11px hover:(border-line bg-surface) disabled:(c-faint cursor-not-allowed op-45 hover:border-transparent hover:bg-transparent)"
                type="button"
                :disabled="current === totalPages"
                aria-label="下一页"
                @click="goto(current + 1)"
            >
                <i class="i-ph-caret-right text-15px" />
            </button>
        </div>
    </nav>
</template>
