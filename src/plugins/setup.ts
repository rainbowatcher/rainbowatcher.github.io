import { pageLoading, usePrefetch } from "#imports"
import { usePageLoading } from "~/composables/global"

export default defineNuxtPlugin((app) => {
    const route = useRoute()
    const pageLoading = usePageLoading()
    // app.hook("app:created", (_vueApp) => {
    //     console.log("app:created")
    // })
    // app.hook("app:error", (_err) => {
    //     console.log("app:error")
    // })
    // app.hook("app:error:cleared", (_e) => {
    //     console.log("app:error:cleared")
    // })
    // app.hook("vue:setup", () => {
    //     console.log("vue:setup")
    // })
    // app.hook("app:data:refresh", (_keys) => {
    //     console.log("app:data:refresh")
    // })
    // app.hook("vue:error", (_err, _target, _info) => {
    //     console.log("vue:error")
    // })
    // app.hook("app:redirected", () => {
    //     console.log("app:redirected")
    // })
    // app.hook("app:rendered", (_ctx) => {
    //     console.log("app:rendered")
    // })
    // app.hook("app:beforeMount", (_ctx) => {
    //     console.log("app:beforeMount")
    // })
    // app.hook("app:mounted", (_ctx) => {
    //     console.log("app:mounted")
    // })
    // app.hook("app:suspense:resolve", (_ctx) => {
    //     console.log("app:suspense:resolve")
    // })
    app.hook("link:prefetch", (to) => {
        const conn = (navigator as any).connection
        if (conn.saveData || /2g/.test(conn.effectiveType)) {
        // Don't prefetch if using 2G or if Save-Data is enabled.
            return
        }

        if (to.startsWith("http") || to.startsWith("mailto")) {
            return
        }
        usePrefetch(to)
    })

    app.hook("page:loading:start", () => {
        pageLoading.value = true
        // console.log("page:loading:start")
    })
    // app.hook("page:start", (_comp) => {
    //     console.log("page:start")
    // })
    app.hook("page:finish", () => {
        if (route.path.startsWith("/posts")) {
            addCodeCopy()
        }
        if (route.path === "/posts") {
            showupAnimate(30)
        } else {
            showupAnimate(100)
        }
        // console.log("page:finish")
    })
    app.hook("page:loading:end", () => {
        pageLoading.value = false
        // console.log("page:loading:end")
    })
    // app.hook("dev:ssr-logs", () => {
    //     console.log("dev:ssr-logs")
    // })
    // app.hook("page:view-transition:start", () => {
    //     console.log("page:view-transition:start")
    // })
})
