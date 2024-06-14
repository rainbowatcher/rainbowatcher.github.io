<script lang="ts" setup>
defineProps<{
    generate?: "" | boolean
    id?: string
}>()
</script>

<template>
    <a
        v-if="generate" class="float-left ml--.87em touch-auto select-none pr-.23em c-foreground font-800 op0 group-focus-within:op-100 group-focus:op-100 group-hover:op-100"
        :href="`#${id}`" aria-hidden="true" tabindex="-1"
    >
        #
    </a>
    <slot v-else />
</template>
