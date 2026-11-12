<script setup lang="ts">
/**
 * 做什么：顶部 2px 品牌线里的阅读进度：按整页滚动比例缩放强调色条。
 * 状态与生命周期：客户端监听滚动与尺寸变化，卸载时移除监听；条宽由 transform 缩放，不触发布局。
 * 取舍与不变量：进度取整页可滚动比例（列表页同样有意义），文章页不再单独算一次，
 * 避免两处进度定义不一致。
 * 边界：不做锚点高亮（见 ArticleRail），也不渲染品牌线本身。
 */
const ratio = ref(0)

function update() {
    const doc = document.documentElement
    const scrollable = doc.scrollHeight - doc.clientHeight
    ratio.value = scrollable > 0 ? Math.min(1, Math.max(0, doc.scrollTop / scrollable)) : 0
}

onMounted(() => {
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
})

onUnmounted(() => {
    window.removeEventListener("scroll", update)
    window.removeEventListener("resize", update)
})
</script>

<template>
    <div class="rainbow-rule" aria-hidden="true">
        <div class="reading-progress" :style="{ transform: `scaleX(${ratio})` }" />
    </div>
</template>
