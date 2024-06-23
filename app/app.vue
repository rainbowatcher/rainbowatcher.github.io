<script setup lang="ts">
import { ConfigProvider } from "radix-vue"
import { joinURL } from "ufo"
import "uno.css"
import "~/styles/index.css"

const route = useRoute()
// const { head } = useAppConfig()
const useIdFunction = () => useId()
// useHead(head)

defineOgImageComponent("DefaultOgImg", {
    date: "",
    tags: [],
    title: "Rainbow Watcher",
})

if (import.meta.server) {
    prerenderRoutes(joinURL("/__og-image__/image", route.path, "og.png"))
}
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
