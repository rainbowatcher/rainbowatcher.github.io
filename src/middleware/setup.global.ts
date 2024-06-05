export default defineNuxtRouteMiddleware(() => {
    if (import.meta.server) return
    const nuxtApp = useNuxtApp()
    const router = useRouter()
    const isReady = ref(false)
    router.isReady()
        .then(() => {
            isReady.value = true
        })
        .catch(() => {})
    if (nuxtApp.isHydrating || !isReady.value) return
})
