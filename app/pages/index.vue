<script lang="ts" setup>
const { data } = useAsyncData("home", () => queryCollection("home").first())
useShowup(".show-up")
</script>

<template>
    <section class="font-mb lt-md:mx-12 md:(mx-12 w-3xl) lg:w-5xl">
        <ContentRenderer v-if="data" :value="data" prose class="show-up" />
    </section>
</template>
