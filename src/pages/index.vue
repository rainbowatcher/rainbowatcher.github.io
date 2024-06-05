<script lang="ts" setup>
import About from "~/components/about.md?raw"

const { body } = await parseMarkdown(About)
</script>

<template>
    <section class="lt-md:mx-12 md:(mx-12 w-3xl) lg:w-5xl">
        <MDCRenderer :body="body" class="show-up" />
    </section>
</template>
