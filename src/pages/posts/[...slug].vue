<script setup lang="ts">
import { ProseA } from "#components"

const route = useRoute()
const { data: page } = await useAsyncData("data", () => queryContent(route.fullPath).findOne())
const { data: navigation } = await useAsyncData("navigation", () => fetchContentNavigation())
const {
    navBottomLink,
    navDirFromPath,
    navKeyFromPath,
    navPageFromPath,
} = useContentHelpers()

const components = {

    a: ProseA,
}

const nextPost = computed< any >(() => {
    return navigation.value?.[0].children?.[1] ? navigation.value[0].children?.[1] : {}
})
</script>

<template>
    <!-- <pre>{{ navigation }}</pre> -->
    <ContentRenderer :value="page">
        <!-- <ContentRendererMarkdown :value="pageData ?? {}" />
        <template #empty>
            <p>No content found.</p>
        </template> -->
    </ContentRenderer>
    <pre>{{ nextPost }}</pre>
</template>
