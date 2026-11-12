<script setup lang="ts">
/**
 * 做什么：正文里的状态徽章（tip / note / warning / danger / info），供 markdown 内联使用。
 * 状态与生命周期：纯展示，无状态。
 * 取舍与不变量：配色收敛到 tokens：tip 用强调色底、note 用表面色、warning 用金色、danger 用危险色，
 * 与正文提示块（callout）同一套语义色。
 * 边界：不参与正文容器布局，也不做图标。
 */
type BadgeType = "danger" | "info" | "note" | "tip" | "warning"

defineProps({
    text: {
        default: "",
        required: false,
        type: String,
    },
    type: {
        default: "tip",
        required: false,
        type: String as PropType<BadgeType>,
    },
    vertical: {
        default: undefined,
        required: false,
        type: String as PropType<"bottom" | "middle" | "top">,
    },
})
</script>

<template>
    <span
        class="badge inline-block select-none rounded-full px-2 py-0.5 font-mono text-11px"
        :class="[type]"
        :style="{ verticalAlign: vertical }"
    >
        <slot>{{ text }}</slot>
    </span>
</template>

<style scoped>
.badge {
    border: 1px solid var(--line);
    background: var(--surface-2);
    color: var(--ink-2);
    line-height: 1.5;
}

.badge.tip {
    border-color: color-mix(in srgb, var(--accent) 24%, var(--line));
    background: var(--accent-soft);
    color: var(--accent);
}

.badge.warning {
    border-color: color-mix(in srgb, var(--gold) 30%, var(--line));
    color: var(--gold);
}

.badge.danger {
    border-color: color-mix(in srgb, var(--danger) 30%, var(--line));
    color: var(--danger);
}
</style>
