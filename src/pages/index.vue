<script lang="ts" setup>
import About from "~/components/about.md?raw"

const { body } = await parseMarkdown(About)
</script>

<template>
    <section class="ma lt-md:mx-12 lg:w-5xl md:w-3xl">
        <MDCRenderer :body="body" />
    </section>
</template>
