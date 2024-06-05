<script setup lang="ts">
import "uno.css"
import "~/index.css"

useHead(globalHead)
</script>

<template>
    <NuxtLayout>
        <NuxtPage
            class="transition duration-150"
            :transition="{
                enterActiveClass: 'ease-in-out',
                enterFromClass: 'opacity-20 blur-sm translate-y-2',
                leaveActiveClass: 'ease-in-out',
                leaveToClass: 'opacity-20 blur-sm translate-y-2',
                mode: 'out-in',
            }"
        />
    </NuxtLayout>
</template>
