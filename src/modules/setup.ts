import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { defineNuxtModule } from "@nuxt/kit"

export default defineNuxtModule((_, nuxt) => {
    nuxt.hook("pages:extend", (_pages) => {})
    nuxt.hook("build:before", () => {
        const buildInfo = { time: new Date().toISOString() }
        fs.writeFileSync(path.join(process.cwd(), "src/public/build-info.json"), JSON.stringify(buildInfo, null, 4))
    })
})
