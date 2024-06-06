<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h1)
</script>

<template>
    <h2 :id="id" class="group my-6 b-b b-border py2 text-2xl font-600 font-sans">
        <slot />
        <DocTitleAnchor :id="id" :generate="generate" />
    </h2>
</template>
