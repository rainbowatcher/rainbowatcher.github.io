/**
 * 做什么：v2 404 视图：黑色整屏、巨大的 404 与一个回到索引的出口。
 * 取舍：不做插画或搜索框；先让读者知道发生了什么，再给出下一步。
 * 边界：不负责路由判定。
 */

import { icon } from "../icons.js"

export function render() {
    return `
    <div class="notfound view-enter">
        <div class="notfound-inner wrap">
            <p class="notfound-code" aria-hidden="true">404</p>
            <div class="notfound-copy">
                <h1>这页大概去看彩虹了。</h1>
                <p>链接可能已经失效，或者文章被移动到了别处。<br />回到索引，重新找一篇。</p>
                <a class="btn btn--accent" href="#/posts">回到文章列表 ${icon("arrow-right")}</a>
            </div>
        </div>
    </div>`
}

export function title() {
    return "页面不存在 — Rainbow Watcher"
}
