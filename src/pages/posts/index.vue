<script setup lang="ts">
useHead({
    title: "Blogs",
})
</script>

<template>
    <section class="blog-list my4 lt-md:mx-4 md:mx-12 lg:w-5xl md:w-3xl space-y-4">
        <ContentList path="/posts">
            <template #default="{ list }">
                <div v-for="post in list" :key="post._path">
                    <div class="flex flex-row justify-between">
                        <a class="text-lg font-400" :href="post._path" role="link">
                            {{ post.title }}
                        </a>
                        <span class="self-center text-xs leading-4 op55">{{ useDateFormat(post.date, "YYYY.MM.DD").value }}</span>
                    </div>
                    <p v-if="post.subtitle" class="text-sm c-muted-foreground font-300">
                        {{ post.subtitle }}
                    </p>
                    <p v-if="post.description" class="text-sm c-muted-foreground font-300">
                        {{ post.description }}
                    </p>
                    <div class="post-status flex flex-(row nowrap) gap-x-1">
                        <a v-for="tag in post.tags" :key="tag" class="block text-xs c-muted-foreground mix-blend-difference drop-shadow-lg">{{ tag }}</a>
                    </div>
                </div>
            </template>
            <template #not-found>
                <p>No articles found.</p>
            </template>
        </ContentList>
        <div class="flex flex-(row nowrap) justify-between">
            <a class="my-4 inline-block">
                Previous Page
            </a>
            <a class="my-4 inline-block">
                Next Page
            </a>
        </div>
    </section>
</template>
