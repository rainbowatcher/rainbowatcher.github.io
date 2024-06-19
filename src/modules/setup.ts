import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { defineNuxtModule } from "@nuxt/kit"
import { useDateFormat } from "@vueuse/core"

export default defineNuxtModule((_, nuxt) => {
    nuxt.hook("pages:extend", (_pages) => {})
    nuxt.hook("build:before", () => {
        const time = new Date()
        const shanghaiOffset = 8
        const utcOffset = time.getTimezoneOffset()
        const shanghaiTime = time.getTime() - utcOffset + shanghaiOffset * 60
        const formatted = useDateFormat(shanghaiTime, "YYYY-MM-DD HH:mm:ss GMT+8")

        const buildInfo = { time: formatted.value }
        fs.writeFileSync(path.join(process.cwd(), "src/public/build-info.json"), JSON.stringify(buildInfo, null, 4))
    })
    // nuxt.hook("schema:extend", (schemas: SchemaDefinition[]) => {
    //     console.log("schemas", schemas)
    // })
    // nuxt.hook("schema:resolved", (schema) => {
    //     console.log("schema:resolved", schema)
    // })
    // nuxt.hook("schema:beforeWrite", (schema) => {
    //     console.log("schema:beforeWrite", schema)
    // })
})
