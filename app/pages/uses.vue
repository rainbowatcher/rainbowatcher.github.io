<script lang="ts" setup>
import ProseCodeInline from "~/components/content/ProseCodeInline.vue"

const { data } = useAsyncData("uses-doc", () => useDocument("/uses")())
useShowup(".show-up")
</script>

<template>
    <div class="font-mb font-sans lt-md:mx-12 md:(mx-12 w-3xl) lg:w-5xl">
        <MDCRenderer v-if="data" :body="(data as any).body" :data="data" :components="{ code: ProseCodeInline }" class="md-doc show-up" />
    </div>
    <DevOnly>
        <PageProfileDisplay />
    </DevOnly>
</template>
