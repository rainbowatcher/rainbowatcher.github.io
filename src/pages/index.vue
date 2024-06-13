<script lang="ts" setup>
</script>

<template>
    <section class="font-mb lt-md:mx-12 md:(mx-12 w-3xl) lg:w-5xl">
        <PageHead />
        <ContentDoc v-slot="{ doc }" path="/about">
            <ContentRendererMarkdown :value="doc" class="show-up" />
        </ContentDoc>
    </section>
</template>
