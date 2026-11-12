<script setup lang="ts">
/**
 * 做什么：深浅色切换按钮：浅色显示太阳、深色显示月亮，可带文字标签。
 * 状态与生命周期：偏好写入 @nuxtjs/color-mode 的 localStorage；系统主题变化时跟随（手选后不覆盖）。
 * 取舍与不变量：外观分两档——页头等紧凑位置用圆形 icon-btn（默认），
 * 抽屉等需要整行按钮的位置传 block + label，避免两处各写一份切换逻辑。
 * 边界：不负责首屏防闪（由 color-mode 注入的脚本承担）。
 */
withDefaults(
    defineProps<{
        block?: boolean
        label?: string
    }>(),
    {
        block: false,
        label: "",
    },
)

const color = useColorMode()

function toggleDark() {
    color.preference = color.value === "dark" ? "light" : "dark"
}

const preferDark = usePreferredDark()
watch(preferDark, (newVal) => {
    color.preference = newVal === false ? "light" : "dark"
})
</script>

<template>
    <button
        :class="block ? 'btn-ghost flex-1' : 'icon-btn'"
        type="button"
        title="切换深浅色主题"
        aria-label="切换深浅色主题"
        @click="toggleDark()"
    >
        <i class="i-ph-sun text-18px dark:i-ph-moon" :class="{ 'text-16px': block }" />
        <span v-if="label">{{ label }}</span>
    </button>
</template>
