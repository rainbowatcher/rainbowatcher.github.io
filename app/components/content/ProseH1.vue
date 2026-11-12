<script setup lang="ts">
/**
 * 做什么：正文 h1：挂标题锚点，样式由 .prose h1 统一提供。
 * 状态与生命周期：锚点是否生成取自运行时配置的 mdc.headings.anchorLinks。
 * 取舍与不变量：组件不写字号与间距，避免与 prose.css 两处定义漂移。
 * 边界：不处理目录采集（见 useArticleToc）。
 */
import { computed, useRuntimeConfig } from "#imports"

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
// @ts-expect-error field not exists
const generate = computed(() => props.id && headings?.anchorLinks?.h1)
</script>

<template>
    <h1 :id="id">
        <AnchorLink :id="id" :generate="generate" />
        <slot />
    </h1>
</template>
