<script setup lang="ts">
/**
 * 做什么：深浅色切换按钮：浅色显示太阳、深色显示月亮。
 * 状态与生命周期：偏好写入 @nuxtjs/color-mode 的 localStorage；系统主题变化时跟随（手选后不覆盖）。
 * 取舍与不变量：图标用 iconify 的 ph 图标集，与页头其它入口同一套线条风格。
 * 边界：不负责首屏防闪（由 color-mode 注入的脚本承担）。
 */
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
    <button class="icon-btn" type="button" title="切换深浅色主题" aria-label="切换深浅色主题" @click="toggleDark()">
        <i class="i-ph-sun text-18px dark:i-ph-moon" />
    </button>
</template>
