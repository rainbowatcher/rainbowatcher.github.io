/**
 * 做什么：v2 首页视图：黑色封面、最近条目、工作台照片、主题带与关于区。
 * 取舍：首屏把“搜索”做成真实入口，不用装饰性按钮；照片只出现在后半页。
 * 边界：不负责页头页脚、搜索索引与路由。
 */

import { posts } from "../data.js"
import { esc, fmtDate, homeEntry, sortedPosts, tagHref, tagStats } from "../utils.js"
import { icon } from "../icons.js"

export function render() {
    const sorted = sortedPosts(posts)
    const tags = tagStats(posts)
    const latest = sorted[0]
    const recent = sorted.slice(0, 6)
    const years = [...new Set(sorted.map((post) => post.date.slice(0, 4)))]
    const firstYear = years.at(-1)

    return `
    <div class="view-enter">
        <section class="cover" aria-labelledby="coverTitle">
            <div class="cover-inner">
                <div class="cover-top">
                    <h1 class="cover-title" id="coverTitle">
                        <span class="cover-line"><span>看彩虹的</span></span>
                        <span class="cover-line"><span>人<span class="cover-dot" aria-hidden="true"></span></span></span>
                    </h1>
                    <dl class="cover-stats" aria-label="站点数字">
                        <div class="cover-stat"><strong>${sorted.length}</strong><span>篇文章</span></div>
                        <div class="cover-stat"><strong>${tags.length}</strong><span>个主题</span></div>
                        <div class="cover-stat"><strong>${firstYear}</strong><span>开始写作</span></div>
                    </dl>
                </div>

                <p class="cover-lede">
                    开发者，开源维护者。写 TypeScript、Rust、Python、Go，也折腾终端、网络和这个博客本身。
                </p>

                <div class="cover-bottom">
                    <form class="cover-search" id="heroSearch" role="search" action="#/posts">
                        <label class="sr-only" for="heroSearchInput">搜索文章、主题或年份</label>
                        <input
                            id="heroSearchInput"
                            name="q"
                            type="search"
                            placeholder="搜索文章、主题或年份…"
                            autocomplete="off"
                            spellcheck="false"
                        />
                        <button class="btn btn--accent" type="submit" aria-label="搜索">
                            ${icon("arrow-right")}
                        </button>
                        <div class="cover-results" id="heroSearchResults" role="listbox" aria-label="搜索建议"></div>
                    </form>

                    <a class="cover-latest" href="#/posts/${latest.slug}">
                        <span class="cover-latest-label">最近更新 · ${fmtDate(latest.date)}</span>
                        <span class="cover-latest-title">
                            <span>${esc(latest.title)}</span>
                            ${icon("arrow-up-right")}
                        </span>
                        <span class="cover-latest-meta">${latest.minutes} 分钟阅读 · ${esc(latest.tags.join(" / "))}</span>
                    </a>
                </div>
            </div>
        </section>

        <section class="section recent" aria-labelledby="recentTitle">
            <div class="wrap">
                <div class="section-head" data-reveal>
                    <h2 class="section-title" id="recentTitle">最近更新</h2>
                    <a class="section-link" href="#/posts">全部 ${sorted.length} 篇 ${icon("arrow-up-right")}</a>
                </div>
                <div class="entry-list">
                    ${recent.map((post, index) => homeEntry(post, index)).join("")}
                </div>
                <a class="entry-more" href="#/posts">
                    <span>全部文章</span>
                    ${icon("arrow-right")}
                </a>
            </div>
        </section>

        <figure class="photo-band">
            <img
                src="../../public/img/home-bg/3.jpeg"
                alt="明亮的复古电脑工作台，屏幕上是 hello，桌上有键盘、台灯和植物"
                width="3200"
                height="1800"
                loading="lazy"
            />
            <figcaption>
                <span><strong>工作台</strong> / 2022</span>
                <span>屏幕上是 hello，桌上是还没写完的笔记。</span>
            </figcaption>
        </figure>

        <section class="section topics" aria-labelledby="topicsTitle">
            <div class="wrap">
                <div class="section-head" data-reveal>
                    <div>
                        <h2 class="section-title" id="topicsTitle">按主题</h2>
                        <p class="section-note">从 Git、Shell 到 Nuxt，一共 ${tags.length} 个主题。</p>
                    </div>
                    <a class="section-link" href="#/archives">看归档 ${icon("arrow-up-right")}</a>
                </div>
                <div class="topic-grid">
                    ${tags
                        .slice(0, 10)
                        .map(
                            (tag) => `
                        <a class="topic" href="${tagHref(tag.name)}">
                            ${esc(tag.name)}<small>${tag.count}</small>
                        </a>`,
                        )
                        .join("")}
                    <a class="topic" href="#/posts">全部主题<small>${tags.length}</small></a>
                </div>
            </div>
        </section>

        <section class="about" aria-labelledby="aboutTitle">
            <div class="wrap">
                <div class="about-grid">
                    <div class="about-copy" data-reveal>
                        <h2 class="about-title" id="aboutTitle">关于</h2>
                        <p class="about-statement">这是一个人的日志：<br />技术笔记、实验，<br />以及写代码之外的事。</p>
                        <div class="about-links">
                            <a href="https://github.com/rainbowatcher" target="_blank" rel="noreferrer">GitHub ${icon("arrow-up-right")}</a>
                            <a href="https://x.com/_rainbowatcher" target="_blank" rel="noreferrer">X / Twitter ${icon("arrow-up-right")}</a>
                            <a href="#/uses">在用 ${icon("arrow-right")}</a>
                        </div>
                    </div>
                    <div class="about-figures" data-reveal style="--delay: 80ms">
                        <figure class="about-figure">
                            <img src="../../public/img/home-bg/2.jpeg" alt="夜晚的复古电脑工作台，屏幕亮着 hello" width="3200" height="1800" loading="lazy" />
                            <figcaption><span>工作台</span><span>夜</span></figcaption>
                        </figure>
                        <figure class="about-figure">
                            <img src="../../public/img/code.jpg" alt="屏幕上虚化的代码与语法高亮" width="1920" height="1280" loading="lazy" />
                            <figcaption><span>代码</span><span>屏幕上</span></figcaption>
                        </figure>
                        <figure class="about-figure">
                            <img src="../../public/img/blog.jpg" alt="黑白打字机，纸面上印着 BLOG" width="2334" height="1498" loading="lazy" />
                            <figcaption><span>BLOG</span><span>打字机</span></figcaption>
                        </figure>
                        <figure class="about-figure">
                            <img src="../../public/img/avatar.jpg" alt="Rainbow Watcher 的头像，办公室里的自拍" width="460" height="460" loading="lazy" />
                            <figcaption><span>我</span><span>办公室</span></figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </section>
    </div>`
}

export function title() {
    return "Rainbow Watcher — 看彩虹的人"
}
