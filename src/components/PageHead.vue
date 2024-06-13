<script lang="ts" setup>
withDefaults(defineProps<{
    description?: string
    title?: string
}>(), {
    title: "Rainbow Watcher's Portfolio",
})
</script>

<template>
    <Head>
        <Title>{{ title }}</Title>
        <Meta name="description" :content="description ?? title" />
    </Head>
</template>
