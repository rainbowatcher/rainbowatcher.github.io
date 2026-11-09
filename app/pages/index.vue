<script lang="ts" setup>
const { data } = useAsyncData("home-doc", () => useDocument("/")())
useShowup(".show-up")
</script>

<template>
    <section class="font-mb lt-md:mx-12 md:(mx-12 w-3xl) lg:w-5xl">
        <MDCRenderer v-if="data" :body="(data as any).body" :data="data" prose class="show-up" />
    </section>
</template>
