<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
// @ts-expect-error field not exists
const generate = computed(() => props.id && headings?.anchorLinks?.h1)
</script>

<template>
    <h1 :id="id" class="my-12 text-3xl font-600 font-mb [&>header-anchor]-hover:op-100">
        <AnchorLink :id="id" :generate="generate" />
        <slot />
    </h1>
</template>
