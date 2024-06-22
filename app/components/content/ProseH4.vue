<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
// @ts-expect-error field not exists
const generate = computed(() => props.id && headings?.anchorLinks?.h1)
</script>

<template>
    <h4 :id="id" class="my2 text-lg font-600 leading-[1.5] font-mb [&>header-anchor]-hover:op-100">
        <AnchorLink :id="id" :generate="generate" />
        <slot />
    </h4>
</template>
