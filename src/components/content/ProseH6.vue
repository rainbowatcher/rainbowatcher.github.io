<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h1)
</script>

<template>
    <h6 :id="id" class="group leading-[1.5] font-mb">
        <slot />
        <DocTitleAnchor :id="id" :generate="generate" />
    </h6>
</template>
