<script lang="ts" setup>
// import { useAlgoliaSearch } from "#imports"

// const { result, search } = useAlgoliaSearch("rainbowatcher")

// onMounted(async () => {
//     const a = await search({ query: "vue" })
//     console.log({ a, result })
// })
</script>

<template>
    <AlgoliaDocSearch title="Search" class="leading-none" />
</template>

<style>
#docsearch {
    line-height: normal;
}
#docsearch > .DocSearch-Button {
    @apply i-ph-magnifying-glass;
    height: 1.2em !important;
    width: 1.2em !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background-color: hsl(var(--foreground)) !important;
    display: block;

    &:hover {
        box-shadow: none;
        background-color: white;
    }
}

.DocSearch-Button-Container, .DocSearch-Button-Keys {
    @apply !hidden !invisible of-hidden;
}
</style>
