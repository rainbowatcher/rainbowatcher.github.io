<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h1)
</script>

<template>
    <h4 :id="id" class="group my2 text-lg font-600 leading-[1.5]">
        <slot />
        <DocTitleAnchor :id="id" :generate="generate" />
    </h4>
</template>
