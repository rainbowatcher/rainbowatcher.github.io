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
            <span v-if="filename" class="absolute left-6.5 top-2 select-none text-sm c-neutral4/80 font-sans">{{ filename }}</span>
            <span class="absolute right-6.5 top-2 ml-auto select-none text-sm c-neutral4/80 font-sans lowercase transition-opacity duration-300 ease-in-out group-hover:(op-0 blur)">{{ language }}</span>
            <div class="code-copy absolute right-2.5 top-2.5 hidden cursor-pointer b b-ring rounded bg-muted/10 px-2 py1 op-0 blur transition-opacity duration-300 ease-in-out active:bg-muted/40 hover:bg-muted/20 group-hover:(op-100 blur-none)" />
            <pre
                class="overflow-auto bg-popover py6 [&_.highlight]:(mx--6 px-6) [&>code]:(block px-6) [&>code>.line]:(block v-text-bottom text-sm leading-6 font-mono) ![&_.highlight]:(bg-black/10 dark:bg-black/45)" :class="[$props.class, { pt8: filename }]"
            ><slot /></pre>
        </div>
    </template>
</template>
