<script setup lang="ts">
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
</script>

<template>
    <Mermaid v-if="language === 'mermaid'" :id="id" :graph="code" />
    <template v-else>
        <div class="group code-pre relative overflow-auto bg-popover lt-sm:mx--6 sm:rounded-lg">
            <span class="absolute right-6.5 top-2 select-none text-sm c-neutral5/90 font-sans transition-opacity duration-300 ease-in-out group-hover:(op-0 blur)">
                <template v-if="filename">
                    <i class="i-ph-file" />
                    {{ filename }}
                </template>
                <template v-else>
                    {{ language }}
                </template>
            </span>
            <div class="code-copy absolute right-2.5 top-2.5 hidden cursor-pointer b b-ring rounded bg-muted/10 px-2 py1 op-0 blur transition-opacity duration-300 ease-in-out active:bg-muted/10 hover:bg-muted/20 group-hover:(op-100 blur-none)" />
            <pre
                class="overflow-auto py-6 [&_.highlight]:(mx--6 px-6) [&>code]:(block px-6) [&>code>.line]:(block v-text-bottom text-sm leading-6 font-mono) ![&_.highlight]:(bg-black/10 dark:bg-black/45)"
                :class="[$props.class]"
            ><slot /></pre>
        </div>
    </template>
</template>
