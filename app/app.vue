<script setup lang="ts">
import { ConfigProvider } from "radix-vue"

const useIdFunction = () => useId()
</script>

<template>
    <ConfigProvider :use-id="useIdFunction" :scroll-body="false">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </ConfigProvider>
</template>
