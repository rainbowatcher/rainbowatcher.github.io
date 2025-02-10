<script lang="ts" setup>
const { data } = useAsyncData("uses", () => queryCollection("uses").first())
useShowup(".show-up")
</script>

<template>
    <div class="font-mb font-sans lt-md:mx-12 md:(mx-12 w-3xl) lg:w-5xl">
        <ContentRenderer v-if="data" :value="data" class="md-doc show-up" />
    </div>
    <DevOnly>
        <PageProfileDisplay />
    </DevOnly>
</template>
