<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core"

withDefaults(defineProps<{
    class?: string
    code?: string
    filename?: string
    highlights?: number[]
    language?: string
    meta?: string
    style?: Record<string, string>
}>(), {
    class: undefined,
    code: "",
    filename: undefined,
    highlights: () => [],
    language: undefined,
    meta: undefined,
    style: () => ({}),
})


const id = useId()
const codePreRef = ref<HTMLPreElement>()
const breakpoints = useBreakpoints(breakpointsTailwind)
const greatScreen = breakpoints.greater("sm")
const { copied, copy, isSupported } = useClipboard()
const copyCode = () => copy(codePreRef.value?.textContent ?? "")
</script>

<template>
    <Mermaid v-if="language === 'mermaid'" :id="id" :graph="code" />
    <template v-else>
        <div class="group code-pre relative overflow-auto rounded-lg bg-popover">
            <span v-if="filename" class="absolute left-6.5 top-2 select-none text-sm c-neutral5 font-sans">{{ filename }}</span>
            <span class="absolute right-6.5 top-2 ml-auto select-none text-sm c-neutral5 font-sans lowercase transition-opacity duration-300 ease-in-out group-hover:(op0 blur)">{{ language }}</span>
            <div v-if="greatScreen && isSupported" class="code-copy absolute right-2.5 top-2.5 b b-border rounded bg-[hsl(from_var(--muted)_h_s_l_/10%)] px-2 py1 op0 blur transition-opacity duration-300 ease-in-out active:bg-[hsl(from_var(--muted)_h_s_l_/10%)] hover:bg-[hsl(from_var(--muted)_h_s_l_/5%)] group-hover:(op100 blur-none)" @click="copyCode">
                <div :class="[copied ? 'i-line-md-clipboard-to-clipboard-check-transition' : 'i-line-md-clipboard']" c-input />
            </div>
            <pre
                ref="codePreRef"
                class="overflow-auto rounded-lg bg-popover py5 [&_.highlight]:(mx--6 px-6) [&>code]:(block px-6) [&>code>.line]:(block vertical-text-bottom text-sm leading-6 font-mono) ![&_.highlight]:(bg-black/10 dark:bg-black/45)" :class="[$props.class, { pt8: filename }]"
            ><slot /></pre>
        </div>
    </template>
</template>
