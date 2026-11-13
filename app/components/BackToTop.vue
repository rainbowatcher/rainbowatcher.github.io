<script setup lang="ts">
/**
 * 做什么：窄屏回顶入口：滚过阈值后从右下角浮出的小圆钮。
 * 状态与生命周期：显隐来自 useBackToTop；固定定位，不参与任何布局。
 * 取舍与不变量：只在 lg 以下出现，宽屏文章页的回顶由右栏目录承担，两者不会同屏；
 * 用 <a href="#view"> 而非按钮，平滑滚动、焦点落位与减弱动效都交给浏览器与 base.css。
 * 边界：不显示阅读进度，也不做页内锚点跳转（见 ArticleTocRail、ArticleTocMobile）。
 */
const { visible } = useBackToTop()
</script>

<template>
    <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="op-0"
        leave-active-class="transition-opacity duration-200"
        leave-to-class="op-0"
    >
        <a
            v-show="visible"
            aria-label="回到顶部"
            class="fixed bottom-24px right-16px z-30 flex h-40px w-40px items-center justify-center rounded-full border border-line bg-surface c-ink2 shadow-[var(--shadow-2)] hover:c-accent lg:hidden"
            href="#view"
            title="回到顶部"
        >
            <i class="i-ph-arrow-up text-16px" />
        </a>
    </Transition>
</template>
