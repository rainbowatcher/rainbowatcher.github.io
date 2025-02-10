<script setup lang="ts">
import "katex/dist/katex.min.css"

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection("archives").path(route.path)
        .first()
})
</script>

<template>
    <section class="flex flex-1 flex-col">
        <article class="relative min-w-0 w-full font-mb">
            <ContentRenderer v-if="page" :value="page" class="show-up md-doc my-12 min-w-0 font-sans lt-sm:mx-6 sm:(mxa w-xl) lg:w-3xl md:w-2xl xl:w-5xl space-y-4" />
        </article>
    </section>
</template>
