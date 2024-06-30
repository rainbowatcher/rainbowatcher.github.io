<script setup lang="ts">
import "katex/dist/katex.min.css"
</script>

<template>
    <section class="flex flex-1 flex-col">
        <article class="relative min-w-0 w-full font-mb">
            <ContentDoc v-slot="{ doc }" :head="false">
                <!-- <PageHead :title="`${doc.title} - Rainbow Watcher's Portfolio`" /> -->
                <ContentRenderer :value="doc" class="show-up md-doc my-12 min-w-0 font-sans lt-sm:mx-6 sm:(mxa w-xl) lg:w-3xl md:w-2xl xl:w-5xl space-y-4" />
            </ContentDoc>
        </article>
    </section>
</template>
