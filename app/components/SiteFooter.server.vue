<script lang="ts" setup>
import buildInfo from "assets/build-info.json"
</script>

<template>
    <footer class="relative font-mb lt-md:(mx-4 py-6) md:(mx-12 py-8)" role="contentinfo">
        <a
            rel="license" title="Creative Commons BY-NC-SA 4.0"
            href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"
        >CC BY-NC-SA 4.0</a>
        2022-PRESENT &copy;
        <NuxtLink href="https://github.com/rainbowatcher" target="_blank">
            Rainbowatcher
        </NuxtLink>
        Powered by
        <NuxtLink href="https://nuxt.com" target="_blank">
            Nuxt
        </NuxtLink>
        <span class="absolute bottom-1 right-0 ml-auto inline text-xs text-muted font-sans op-75">
            BUILD TIME: {{ buildInfo.time }}
        </span>
    </footer>
</template>
