/**
 * 做什么：构建信息模块，在 build:before 阶段把构建时间写入 app/assets/build-info.json，
 * 供 SiteFooter 展示站点最后构建时间。
 * 状态与生命周期：无内部状态，每次构建触发一次写入。
 * 取舍与不变量：不依赖构建机器时区，统一换算成 UTC+8，输出固定带 GMT+8 后缀；
 * JSON 用 4 空格缩进并保留结尾换行，保证该文件在 git 中的 diff 稳定。
 * 边界：只写这一个 JSON 文件，不参与页面渲染，也不计算版本号。
 */

import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { defineNuxtModule } from "@nuxt/kit"
import { useDateFormat } from "@vueuse/core"

export default defineNuxtModule((_, nuxt) => {
    nuxt.hook("build:before", () => {
        const time = new Date()
        let formatted = useDateFormat(time, "YYYY-MM-DD HH:mm:ss")
        if (time.getTimezoneOffset() / 60 !== -8) {
            const shanghaiOffset = 8 * 60
            const utcOffset = time.getTimezoneOffset()
            const shanghaiTime = time.getTime() + (shanghaiOffset - utcOffset) * 60 * 1000
            formatted = useDateFormat(shanghaiTime, "YYYY-MM-DD HH:mm:ss")
        }

        const buildInfo = { time: `${formatted.value} GMT+8` }
        fs.writeFileSync(path.join(process.cwd(), "/app/assets/build-info.json"), `${JSON.stringify(buildInfo, null, 4)}\n`)
    })
})
