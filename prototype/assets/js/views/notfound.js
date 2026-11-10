/**
 * 做什么：404 视图：说明链接失效并提供回到首页/文章列表的入口。
 * 取舍：保留一个巨大的 404 装饰数字，不加载额外插画资源。
 * 边界：不负责路由判断。
 */

import { icon } from "../icons.js"

export function render() {
    return `
    <div class="container view-enter">
        <div class="notfound">
            <span class="notfound-code" aria-hidden="true">404</span>
            <h1>这页大概去看彩虹了</h1>
            <p>链接可能已经失效，或者文章被移动到了别处。</p>
            <a class="btn btn-primary" href="#/posts">回到文章列表 ${icon("arrow-right")}</a>
        </div>
    </div>`
}
