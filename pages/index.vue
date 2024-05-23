<script setup lang="ts">
useHead({
    title: "Home",
})
</script>

<template>
    <header>
        header
    </header>
    <main class="mx-auto lg:w-3xl">
        <section class="border rounded space-y-4">
            <ContentList v-slot="{ list }" path="/posts">
                <div v-for="post in list" :key="post._path">
                    <a class="text-xl font-400" :href="post._path">
                        {{ post.title }}
                    </a>
                    <p v-if="post.description" class="text-sm c-border font-300">
                        {{ post.description }}
                    </p>
                </div>
            </ContentList>
        </section>
    </main>
    <footer>
        footer
    </footer>
</template>
