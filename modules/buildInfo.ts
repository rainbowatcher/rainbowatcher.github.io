/**
 * 做什么：构建信息模块，把构建时刻做成 #build/build-info 虚拟模块，供 SiteFooter 展示部署时间。
 * 状态与生命周期：模块装配时取一次时间，写进生成目录 .nuxt/，dev 下即该次启动的时刻。
 * 取舍与不变量：构建时间只存在于生成目录，不进 git；用 Intl 固定 Asia/Shanghai，
 * 输出形如 `YYYY-MM-DD HH:mm:ss GMT+8`，与构建机本地时区无关。
 * 边界：只产出一个时刻常量，不计算版本号、不参与页面渲染逻辑。
 */

import { addTemplate, defineNuxtModule } from "@nuxt/kit"

const TIME_FORMAT = new Intl.DateTimeFormat("sv-SE", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Shanghai",
    year: "numeric",
})

export default defineNuxtModule({
    meta: {
        name: "build-info",
    },
    setup() {
        const buildTime = `${TIME_FORMAT.format(new Date())} GMT+8`

        addTemplate({
            filename: "build-info.ts",
            getContents: () => `export const buildTime = ${JSON.stringify(buildTime)}\n`,
            write: true,
        })
    },
})
