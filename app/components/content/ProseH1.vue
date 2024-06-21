<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h1)
</script>

<template>
    <h1 :id="id" class="group my-12 text-3xl font-600 font-mb">
        <slot />
        <DocTitleAnchor :id="id" :generate="generate" />
    </h1>
</template>
