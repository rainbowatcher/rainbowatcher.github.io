<script setup lang="ts">
import { ConfigProvider } from "radix-vue"

const useIdFunction = () => useId()
</script>

<template>
    <ConfigProvider :use-id="useIdFunction" :scroll-body="false">
        <div class="#12735 flex flex-1 flex-col min-h-dvh">
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </div>
    </ConfigProvider>
</template>
