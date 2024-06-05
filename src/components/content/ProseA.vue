<script setup lang="ts">
import type { PropType } from "vue"

defineProps({
    href: {
        default: "",
        type: String,
    },
    target: {
        default: undefined,
        required: false,
        type: String as PropType<"_blank" | "_parent" | "_self" | "_top" | (Record<string, unknown> & string) | undefined | undefined>,
    },
})
</script>

<template>
    <ANuxtLink
        :href="href"
        :target="target"
    >
        <slot />
    </ANuxtLink>
</template>
