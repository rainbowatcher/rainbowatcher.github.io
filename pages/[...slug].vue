<script setup lang="ts">
const route = useRoute()
const { data: pageData } = await useAsyncData("page-data", () => queryContent(route.fullPath).findOne())
</script>

<template>
    <main>
        <ContentRenderer :value="pageData">
            <ContentRendererMarkdown :value="pageData ?? {}" />
            <template #empty>
                <p>No content found.</p>
            </template>
        </ContentRenderer>
    </main>
</template>
