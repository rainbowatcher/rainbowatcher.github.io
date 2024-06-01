<script lang="ts" setup>
</script>

<template>
    <AlgoliaDocSearch />
</template>

<style>
#docsearch > .DocSearch-Button {
    @apply i-ph-magnifying-glass;
    height: 1.2em !important;
    width: 1.2em !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background-color: var(--foreground) !important;
    display: block;

    &:hover {
        box-shadow: none;
        background-color: white;
    }
}

.DocSearch-Button-Container, .DocSearch-Button-Keys {
    @apply !hidden !m0 overflow-hidden;
}
</style>
