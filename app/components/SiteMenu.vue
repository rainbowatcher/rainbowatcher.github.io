<script setup lang="ts">
/**
 * 做什么：窄屏菜单入口按钮，展开全屏抽屉。
 * 状态与生命周期：显隐状态由本组件的 show 驱动，抽屉内容见 SiteMenuContent；关闭后状态复位。
 * 取舍与不变量：lg 以下才出现，与 SiteNav 的隐藏断点成对，避免两套入口同时可见。
 * 边界：不定义导航项，也不直接写抽屉内容。
 */
const [show, toggleShow] = useToggle(false)
</script>

<template>
    <div class="lg:hidden">
        <button class="icon-btn" type="button" aria-label="打开菜单" title="菜单" @click="toggleShow(true)">
            <i class="i-ph-list text-18px" />
        </button>
        <SiteMenuContent v-model:show="show" />
    </div>
</template>
