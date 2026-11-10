/**
 * 做什么：首页视图：自我介绍、站点速览、最近更新、主题入口与联系方式。
 * 取舍：首屏只保留一个主行动（读文章），社交入口降级为次级按钮。
 * 边界：不负责页头页脚与路由。
 */

import { posts } from "../data.js"
import { esc, fmtDate, postRow, sortedPosts, tagStats, tagHref } from "../utils.js"
import { icon } from "../icons.js"

export function render() {
    const sorted = sortedPosts(posts)
    const tags = tagStats(posts)
    const latest = sorted[0]
    const years = [...new Set(sorted.map((post) => post.date.slice(0, 4)))]
    const yearSpan = Number(years[0]) - Number(years.at(-1)) + 1
    const recent = sorted.slice(0, 6)

    return `
    <div class="container view-enter">
        <section class="hero">
            <div class="hero-copy">
                <p class="eyebrow">Personal log · 2022 — Now</p>
                <h1>看彩虹的人<span class="hero-stop">。</span></h1>
                <p class="lede">开发者，开源维护者。写 TypeScript、Rust、Python、Go，也折腾终端、网络和这个博客本身。</p>
                <div class="hero-actions">
                    <a class="btn btn-primary" href="#/posts">开始阅读 ${icon("arrow-right")}</a>
                    <a class="btn btn-ghost" href="https://github.com/rainbowatcher" target="_blank" rel="noreferrer">GitHub ${icon("arrow-up-right")}</a>
                </div>
                <p class="hero-meta">
                    <span>${sorted.length} 篇文章</span><span class="dot"></span>
                    <span>${tags.length} 个主题</span><span class="dot"></span>
                    <span>${years.at(-1)} 年起写作</span>
                </p>
            </div>

            <aside class="stats-card" aria-label="站点速览">
                <div class="stats-head">
                    <span class="eyebrow" style="font-size:9px">At a glance</span>
                    <span class="stats-live">持续写作</span>
                </div>
                <div class="stats-grid">
                    <div><strong>${sorted.length}</strong><span>篇文章</span></div>
                    <div><strong>${tags.length}</strong><span>个主题</span></div>
                    <div><strong>${yearSpan}</strong><span>年跨度</span></div>
                </div>
                <div class="stats-latest">
                    <span class="stats-latest-label">最近更新 · ${fmtDate(latest.date)}</span>
                    <a href="#/posts/${latest.slug}"><span>${esc(latest.title)}</span>${icon("arrow-right")}</a>
                </div>
            </aside>
        </section>

        <section class="home-section" aria-labelledby="recent-title">
            <div class="section-head">
                <span class="section-index">01</span>
                <h2 id="recent-title">最近更新</h2>
                <a class="more" href="#/posts">全部文章 ${icon("arrow-up-right")}</a>
            </div>
            <div class="post-list">${recent.map(postRow).join("")}</div>
        </section>

        <section class="home-section" aria-labelledby="topics-title">
            <div class="section-head">
                <span class="section-index">02</span>
                <h2 id="topics-title">按主题浏览</h2>
                <a class="more" href="#/archives">查看归档 ${icon("arrow-up-right")}</a>
            </div>
            <div class="topic-cloud">
                ${tags
                    .slice(0, 12)
                    .map(
                        (tag) => `
                    <a class="topic" href="${tagHref(tag.name)}">
                        ${esc(tag.name)}<span class="topic-count">${tag.count}</span>
                    </a>`,
                    )
                    .join("")}
                <a class="topic" href="#/posts">全部 ${tags.length} 个主题 ${icon("arrow-right")}</a>
            </div>
        </section>

        <section class="contact-band" aria-labelledby="contact-title">
            <div>
                <p class="eyebrow">Stay in touch</p>
                <h2 id="contact-title">偶尔写点东西，不常打扰。</h2>
                <p>文章之外，代码都放在 GitHub。如果你也在做类似的事，欢迎来打个招呼。</p>
            </div>
            <div class="hero-actions">
                <a class="btn btn-primary" href="https://github.com/rainbowatcher" target="_blank" rel="noreferrer">GitHub ${icon("arrow-up-right")}</a>
                <a class="btn btn-ghost" href="https://x.com/_rainbowatcher" target="_blank" rel="noreferrer">X / Twitter ${icon("arrow-up-right")}</a>
            </div>
        </section>
    </div>`
}
