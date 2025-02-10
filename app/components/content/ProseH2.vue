<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
// @ts-expect-error field not exists
const generate = computed(() => props.id && headings?.anchorLinks?.h1)
</script>

<template>
    <h2 :id="id" class="my-6 py2 text-2xl font-600 font-mb shadow-[0px_2px_2px_-2px] shadow-ring [&>.header-anchor]-hover:op-100">
        <AnchorLink :id="id" :generate="generate" />
        <slot />
    </h2>
</template>
