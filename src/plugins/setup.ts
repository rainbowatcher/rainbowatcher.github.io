export default defineNuxtPlugin((app) => {
    // app.hook("app:created", (_vueApp) => {
    //     // console.log("app:created", vueApp)
    // })
    // app.hook("app:error", (_err) => {
    //     // console.log("app:error", err)
    // })
    // app.hook("app:error:cleared", (_e) => {
    //     // console.log("app:error:cleared")
    // })
    // app.hook("app:data:refresh", (_keys) => {
    //     console.log("app:data:refresh", _keys)
    // })
    // app.hook("vue:setup", () => {
    //     // console.log("vue:setup")
    // })
    // app.hook("vue:error", (_err, _target, _info) => {
    //     // console.log("vue:error", err, target, info)
    // })
    // app.hook("app:redirected", () => {
    //     // console.log("app:redirected")
    // })
    // app.hook("app:rendered", (_ctx) => {
    //     console.log("app:rendered", _ctx)
    // })
    // app.hook("app:beforeMount", (_ctx) => {
    //     console.log("app:beforeMount", _ctx)
    // })
    // app.hook("app:mounted", (_ctx) => {
    //     console.log("app:mounted", _ctx)
    // })
    // app.hook("app:suspense:resolve", (_ctx) => {
    //     console.log("app:suspense:resolve")
    // })
    // app.hook("link:prefetch", (_to) => {
    //     // console.log("link:prefetch", to)
    // })
    // app.hook("page:loading:end", () => {
    //     // console.log("page:loading:end")
    // })
    // app.hook("page:start", (_comp) => {
    //     // console.log("page:start", comp)
    // })
    app.hook("page:finish", () => {
        const { path } = useRoute()
        if (path.startsWith("/posts")) {
            addCodeCopy()
        }
        if (path === "/posts") {
            showupAnimate(30)
        } else {
            showupAnimate(100)
        }
    })
})
