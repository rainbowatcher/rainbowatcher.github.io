<script lang="ts" setup>
defineProps<{
    class?: string
    tags: Array<[string, number] | string>
}>()

function tagNum(tag: [string, number] | string) {
    if (typeof tag === "string") {
        return 0
    } else {
        return tag[1]
    }
}

function tagName(tag: [string, number] | string) {
    if (typeof tag === "string") {
        return tag
    } else {
        return tag[0]
    }
}
</script>

<template>
    <NuxtLink
        v-for="tag in tags" :key="tagName(tag)" :to="`/posts/tags/${tagName(tag)}`"
        :class="cn('bg-none text-nowrap text-xs c-input tracking-widest op-65 transition-opacity-300 hover:op-100', $props.class)"
    >
        {{ tagName(tag) }}
        <sup v-if="tagNum(tag)">{{ tagNum(tag) }}</sup>
    </NuxtLink>
</template>

<style>

</style>
