<script lang="ts" setup>
defineProps<{
    generate?: "" | boolean
    id?: string
}>()
</script>

<template>
    <a
        v-if="generate" class="header-anchor float-left ml--.87em touch-auto select-none bg-none pr-.23em font-800 op-0"
        :href="`#${id}`" aria-hidden="true" tabindex="-1"
    >
        #
    </a>
    <slot v-else />
</template>
