<script setup lang="ts">
import "uno.css"
import "~/index.css"

useHead(globalHead)
</script>

<template>
    <div class="#12735 flex flex-1 flex-col min-h-dvh">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
