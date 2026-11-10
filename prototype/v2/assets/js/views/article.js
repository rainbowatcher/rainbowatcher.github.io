/**
 * 做什么：v2 文章视图：正文排版、黑色目录面板、阅读进度、字号与上下篇。
 * 取舍：目录链接使用 data-anchor，避免与 hash 路由冲突；正文只做最小包装。
 * 边界：不解析 Markdown，正文 HTML 来自数据层。
 */

import { posts, researchReports } from "../data.js"
import { esc, fmtDate, sortedPosts, tagChip } from "../utils.js"
import { icon } from "../icons.js"

const FONT_SIZES = { s: "16px", m: "17.5px", l: "19px" }

function readFontSize() {
    try {
        return localStorage.getItem("rw-prose-size") ?? "m"
    } catch {
        return "m"
    }
}

function defaultBody(post) {
    const code = post.tags.includes("Git")
        ? `<span class="tok-comment"># 查看当前分支与最近的提交</span>
git status -sb
git log --oneline --graph --decorate -<span class="tok-number">10</span>`
        : post.tags.includes("Shell")
          ? `<span class="tok-comment"># 列出当前目录下最大的十个文件</span>
du -ah . | sort -rh | head -n <span class="tok-number">10</span>`
          : `<span class="tok-key">const</span> note = <span class="tok-key">await</span> <span class="tok-fn">read</span>(<span class="tok-string">"content"</span>)
<span class="tok-fn">console</span>.<span class="tok-fn">log</span>(note.title)`

    return `
<p>${esc(post.excerpt)}</p>
<p>这篇笔记来自日常实践中的记录。最初只是编辑器里零散的备忘，后来在使用中不断补充，才整理成现在这一版。它不追求完整，但尽量把当时的判断和边界写清楚。</p>
<h2 id="background">背景</h2>
<p>真正开始整理，是因为同一个问题在几个月里被反复遇到。与其每次重新搜索，不如把结论、适用条件和失败案例固定下来，下一次只需要确认前提是否仍然成立。</p>
<ul>
<li>先确认问题边界：哪些情况适用，哪些情况应该换一种做法；</li>
<li>保留最小可复现的步骤，命令与版本尽量写全；</li>
<li>把“为什么”写清楚，而不只是记录“怎么做”。</li>
</ul>
<h2 id="notes">关键点</h2>
<p>实践里最容易忽略的是环境差异：同一段配置在不同版本、不同系统上可能表现不同。因此下面的片段只保留核心部分，使用前请先在本机确认版本。</p>
<div class="code-block"><div class="code-head"><span>${post.tags[0] ?? "notes"}.txt</span><button class="code-copy" data-copy>复制</button></div><pre><code>${code}</code></pre></div>
<blockquote><p>把结论写下来只是第一步，定期回来复验，才是笔记真正有价值的部分。</p></blockquote>
<h2 id="summary">小结</h2>
<p>这篇记录会随着使用继续补充。如果你发现了不准确的地方，欢迎通过 GitHub 找到我。</p>`
}

function tocMarkup(headings) {
    return headings
        .map(
            (heading) =>
                `<a class="depth-${heading.level}" href="#${heading.id}" data-anchor="${heading.id}">${esc(heading.text)}</a>`,
        )
        .join("")
}

function fontSwitch(font) {
    return `
        <div class="font-switch" role="group" aria-label="正文字号">
            <button type="button" data-font-size="s" class="${font === "s" ? "is-active" : ""}" aria-label="小号字">A</button>
            <button type="button" data-font-size="m" class="${font === "m" ? "is-active" : ""}" aria-label="中号字">A</button>
            <button type="button" data-font-size="l" class="${font === "l" ? "is-active" : ""}" aria-label="大号字">A</button>
        </div>`
}

export function render(route) {
    const isResearch = route.name === "research-detail"
    const source = isResearch ? researchReports : posts
    const doc = source.find((item) => item.slug === route.slug)
    if (!doc) return null

    const sorted = sortedPosts(posts)
    const index = sorted.findIndex((item) => item.slug === doc.slug)
    const prev = !isResearch && index > 0 ? sorted[index - 1] : null
    const next = !isResearch && index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null
    const body = doc.body ?? defaultBody(doc)
    const font = readFontSize()

    return `
    <div class="article-page view-enter">
        <div class="article-wrap">
            <header class="article-head">
                <a class="article-back" href="${isResearch ? "#/research" : "#/posts"}">${icon("arrow-left")} ${isResearch ? "研究" : "文章"}</a>
                <div class="article-meta">
                    <time datetime="${doc.date}">${fmtDate(doc.date)}</time>
                    <span>${doc.minutes} 分钟阅读</span>
                </div>
                <h1>${esc(doc.title)}</h1>
                ${doc.subtitle ? `<p class="article-sub">${esc(doc.subtitle)}</p>` : ""}
                <div class="article-tags">${doc.tags.map((tag) => tagChip(tag)).join("")}</div>
                ${
                    isResearch
                        ? `<div class="article-banner"><strong>本机环境探索报告。</strong>结论依赖当时的机器状态、工具版本与本地配置，换台机器未必复现；引用前请先在本机复验。</div>`
                        : ""
                }
            </header>

            <div class="article-layout" data-font="${font}" style="--prose-size:${FONT_SIZES[font] ?? FONT_SIZES.m}">
                <article class="article-body">
                    <details class="toc-mobile">
                        <summary>本文目录</summary>
                        <nav class="toc-nav" id="tocMobile"></nav>
                        <div class="rail-tools" style="padding-inline: 18px">
                            <span class="rail-label" style="color: var(--panel-muted)">字号</span>
                            ${fontSwitch(font)}
                        </div>
                    </details>
                    <div class="prose" id="articleBody">${body}</div>
                </article>

                <aside class="article-rail" aria-label="文章目录与阅读设置">
                    <div class="rail-panel">
                        <p class="rail-title">本文目录</p>
                        <nav class="toc-nav" id="tocNav"></nav>
                        <div class="rail-tools">
                            <span class="rail-label">字号</span>
                            ${fontSwitch(font)}
                        </div>
                        <button type="button" class="toc-top" data-to-top>回到顶部 ↑</button>
                    </div>
                </aside>
            </div>

            <footer class="article-foot">
                ${
                    prev
                        ? `<a href="#/posts/${prev.slug}"><span class="prevnext-label">← 上一篇</span>${esc(prev.title)}</a>`
                        : `<a href="#/posts"><span class="prevnext-label">← 回到列表</span>全部 ${posts.length} 篇文章</a>`
                }
                ${
                    next
                        ? `<a class="next" href="#/posts/${next.slug}"><span class="prevnext-label">下一篇 →</span>${esc(next.title)}</a>`
                        : `<a class="next" href="#/posts"><span class="prevnext-label">继续阅读 →</span>浏览全部文章</a>`
                }
                <div class="author-line">
                    <span><strong>Rainbow Watcher</strong> · 开发者、开源维护者</span>
                    <a href="https://github.com/rainbowatcher" target="_blank" rel="noreferrer">GitHub ↗</a>
                </div>
            </footer>
        </div>
    </div>`
}

export function mount() {
    const article = document.querySelector("#articleBody")
    const nav = document.querySelector("#tocNav")
    const mobileNav = document.querySelector("#tocMobile")
    const progress = document.querySelector("#readingProgress")
    if (!article || !nav) return () => {}

    const headings = [...article.querySelectorAll("h2, h3")].map((heading, index) => {
        if (!heading.id) heading.id = `section-${index + 1}`
        return { id: heading.id, text: heading.textContent.trim(), level: heading.tagName === "H3" ? 3 : 2 }
    })
    const toc = tocMarkup(headings)
    nav.innerHTML = toc
    mobileNav.innerHTML = toc

    const links = [...document.querySelectorAll("#tocNav a, #tocMobile a")]
    const onTocClick = (event) => {
        const link = event.target.closest("[data-anchor]")
        if (!link) return
        event.preventDefault()
        document.getElementById(link.dataset.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" })
        const details = link.closest("details")
        if (details) details.open = false
    }
    nav.addEventListener("click", onTocClick)
    mobileNav.addEventListener("click", onTocClick)

    document.querySelectorAll("[data-font-size]").forEach((button) => {
        button.addEventListener("click", () => {
            const size = button.dataset.fontSize
            const layout = document.querySelector(".article-layout")
            layout.style.setProperty("--prose-size", FONT_SIZES[size] ?? FONT_SIZES.m)
            layout.dataset.font = size
            document.querySelectorAll("[data-font-size]").forEach((item) => {
                item.classList.toggle("is-active", item.dataset.fontSize === size)
            })
            try {
                localStorage.setItem("rw-prose-size", size)
            } catch {
                // 忽略隐私模式下的写入失败
            }
        })
    })

    document.querySelectorAll("[data-to-top]").forEach((button) => {
        button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }))
    })

    const update = () => {
        const articleTop = article.getBoundingClientRect().top + window.scrollY
        const readable = article.offsetHeight - window.innerHeight * 0.55
        const ratio = Math.min(1, Math.max(0, (window.scrollY - articleTop + 160) / Math.max(readable, 1)))
        progress.style.transform = `scaleX(${ratio})`

        const threshold = 120
        let activeId = headings[0]?.id
        for (const heading of headings) {
            const node = document.getElementById(heading.id)
            if (node && node.getBoundingClientRect().top <= threshold) activeId = heading.id
        }
        links.forEach((link) => {
            link.classList.toggle("is-active", link.dataset.anchor === activeId)
        })
    }

    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    update()

    return () => {
        window.removeEventListener("scroll", update)
        window.removeEventListener("resize", update)
        progress.style.transform = "scaleX(0)"
    }
}

export function title(route) {
    const source = route.name === "research-detail" ? researchReports : posts
    const doc = source.find((item) => item.slug === route.slug)
    return doc ? `${doc.title} — Rainbow Watcher` : "文章 — Rainbow Watcher"
}
