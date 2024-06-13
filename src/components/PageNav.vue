<script lang="ts" setup>
import type { NavItem } from "@nuxt/content/types"

type PageNavProps = {
    next?: Partial<NavItem>
    previous?: Partial<NavItem>
    usePermalink?: boolean
    useTitle?: boolean
}

defineProps<PageNavProps>()
</script>

<template>
    <div class="page-nav mt-auto flex justify-between py8 sm:(mx-[calc(5rem+3rem)] flex-row flex-nowrap) lt-sm:flex-col">
        <div v-if="previous" class="max-w-80 b-l b-l-border px8 py4">
            <NuxtLink prefetch @click="navigateTo(usePermalink ? previous?.permalink : previous?._path, { external: true })">
                {{ useTitle ? previous.title : "Previous" }}
            </NuxtLink>
        </div>
        <div v-if="next" class="max-w-80 b-r b-r-border px8 py4 sm:mla">
            <NuxtLink prefetch @click="navigateTo(usePermalink ? next?.permalink : next?._path, { external: true })">
                {{ useTitle ? next.title : "Next" }}
            </NuxtLink>
        </div>
    </div>
</template>
