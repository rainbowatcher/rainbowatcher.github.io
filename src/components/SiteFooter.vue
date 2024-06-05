<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()
</script>

<template>
    <footer class="relative py-8 font-serif md:mx-12" role="contentinfo">
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
        <span class="absolute bottom-1 right-0 ml-auto inline text-sm text-muted op70">
            BUILD TIME: {{ useDateFormat(runtimeConfig.buildTime, 'YYYY-MM-DD HH:mm:ss').value }}
        </span>
    </footer>
</template>
