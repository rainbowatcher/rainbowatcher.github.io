<script setup lang="ts">
import { ConfigProvider } from "radix-vue"
import "uno.css"
import "~/styles/index.css"

const { head } = useAppConfig()
const useIdFunction = () => useId()
useHead(head)
</script>

<template>
    <ConfigProvider :use-id="useIdFunction">
        <div class="#12735 flex flex-1 flex-col min-h-dvh">
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </div>
    </ConfigProvider>
</template>
