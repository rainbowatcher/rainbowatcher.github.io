<script setup lang="ts">
/**
 * 做什么：代码块：外壳带文件名与复制按钮，内部是 Shiki 高亮后的代码。
 * 状态与生命周期：复制状态来自 useClipboard，1.6 秒后由 copied 自动复位；语言为 mermaid 时改渲染图表。
 * 取舍与不变量：高亮交给 MDC/Shiki（token 配色随主题），这里只负责外壳与复制；
 * 复制内容优先用渲染前的 code 原文，避免读到行号或装饰节点。
 * 边界：不做行高亮与折叠，也不改写高亮结果。
 */
const props = withDefaults(
    defineProps<{
        class?: string
        code?: string
        filename?: string
        language?: string
        meta?: string
    }>(),
    {
        class: undefined,
        code: "",
        filename: undefined,
        language: undefined,
        meta: undefined,
    },
)

const { copied, copy } = useClipboard({ legacy: true, source: computed(() => props.code) })
const id = useId()
const label = computed(() => props.filename || props.language || "text")
</script>

<template>
    <Mermaid v-if="language === 'mermaid'" :id="id" class="mermaid" :graph="code" />
    <div v-else class="code-block">
        <div class="code-head">
            <span>{{ label }}</span>
            <button class="code-copy" type="button" aria-label="复制代码" @click="copy(code)">
                <i :class="copied ? 'i-ph-check' : 'i-ph-copy'" />
                {{ copied ? "已复制" : "复制" }}
            </button>
        </div>
        <pre :class="$props.class"><slot /></pre>
    </div>
</template>
