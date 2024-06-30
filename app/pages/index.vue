<script lang="ts" setup>
const md = "\
I'm an developer and open-source maintainer that fond of adventurous exploration.\
<br>\
I write `Typescript`, `Rust`, `Python`, `Go`, and will learn `Swift` in the distant future,\
and finally i don't like `Java`.\
"
useShowup(".show-up")
</script>

<template>
    <section class="font-mb lt-md:mx-12 md:(mx-12 w-3xl) lg:w-5xl">
        <p class="show-up text-4rem">
            Hi, I'm <strong class="bg-rainbow">Rainbow Watcher</strong>.
        </p>
        <MDC :value="md" class="show-up text-1.2rem" />
    </section>
</template>
