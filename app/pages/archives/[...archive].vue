<script setup lang="ts">
import ProseCodeInline from "~/components/content/ProseCodeInline.vue"
import "katex/dist/katex.min.css"

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => useDocument(route.path)(), { watch: [() => route.path] })
</script>

<template>
    <section class="flex flex-1 flex-col">
        <article class="relative min-w-0 w-full font-mb">
            <MDCRenderer v-if="page" :body="(page as any).body" :data="page" :components="{ code: ProseCodeInline }" class="show-up md-doc my-12 min-w-0 font-sans lt-sm:mx-6 sm:(mxa w-xl) lg:w-3xl md:w-2xl xl:w-5xl space-y-4" />
        </article>
    </section>
</template>
