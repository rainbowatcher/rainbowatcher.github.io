/**
 * 做什么：v3 原型入口，按页面存在的元素依次挂载主题、动效、阅读与筛选模块。
 * 状态与生命周期：DOMContentLoaded 后执行一次，各模块自行判断当前页面是否适用。
 * 取舍与不变量：所有页面共用同一个脚本入口，避免出现多套初始化顺序。
 * 边界：不渲染内容数据，也不接管路由。
 */

import { initTheme } from "./theme.js"
import { initMotion } from "./motion.js"
import { initReading } from "./reading.js"
import { initFilter } from "./filter.js"

const boot = () => {
    initTheme()
    initMotion()
    initReading()
    initFilter()
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true })
else boot()
