<script lang="ts" setup>
const md = "\
I'm an developer and open-source maintainer that fond of adventurous exploration.\
<br>\
I write `Typescript`, `Rust`, `Python`, `Go`, and will learn `Swift` in the distant future,\
and i don't like `Java`.\
<br>\
I'm learning english no\
"
useShowup(".show-up")
</script>

<template>
    <section class="font-mb lt-md:mx-12 md:(mx-12 w-3xl) lg:w-5xl">
        <p class="show-up text-1.2rem">
            Hi there, I'm
        </p>
        <p class="show-up bg-rainbow text-3rem">
            Rainbow Watcher
        </p>
        <MDC :value="md" class="show-up text-1.2rem" />
    </section>
</template>
