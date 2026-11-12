<script setup lang="ts">
/**
 * 做什么：长页面右下角的回到顶部按钮，滚动超过 800px 后出现。
 * 状态与生命周期：显隐随窗口滚动；点击后平滑回到顶部。
 * 取舍与不变量：原型把「回到顶部」放在文章页右栏，这里保留全局浮动入口以覆盖列表页；
 * 文章页右栏仍另有一处文字入口，二者互不冲突。
 * 边界：不参与阅读进度计算（见 ReadingProgress）。
 */
const { y } = useWindowScroll({ behavior: "smooth" })
const [show, toggleShow] = useToggle(false)

const backToTop = () => (y.value = 0)

watch(y, () => {
    if (show.value) {
        if (y.value < 800) {
            toggleShow(false)
        }
    } else {
        if (y.value >= 800) {
            toggleShow(true)
        }
    }
})
</script>

<template>
    <Transition
        enter-active-class="animate-in-300 fade-in slide-in-from-bottom-10"
        leave-active-class="animate-out-300 fade-out slide-out-to-bottom-10"
    >
        <button
            v-if="show"
            class="icon-btn fixed z-99 bottom-8dvh right-4 border-line bg-surface shadow-[var(--shadow-2)] sm:right-4 md:right-6 lg:right-12 xl:right-24"
            type="button"
            aria-label="回到顶部"
            title="回到顶部"
            @click="backToTop"
        >
            <i class="i-ph-arrow-up text-18px" />
        </button>
    </Transition>
</template>
