/**
 * 做什么：文章详情视图：正文排版、目录、阅读进度与上下篇。
 * 取舍：目录链接用 data-anchor 而非 hash，避免和前端路由的 hash 冲突。
 * 边界：不处理 Markdown 解析，正文由数据层直接给出 HTML。
 */

import { posts, researchReports } from "../data.js"
import { esc, fmtDate, sortedPosts, tagChip } from "../utils.js"
import { icon } from "../icons.js"

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

    return `
    <div class="article-wrap view-enter">
        <header class="article-head">
            <a class="article-back" href="${isResearch ? "#/knowledge" : "#/posts"}">${icon("arrow-left")} ${isResearch ? "知识库" : "博客"}</a>
            <div class="article-kicker">
                <time datetime="${doc.date}">${fmtDate(doc.date)}</time><span class="dot"></span>
                <span>${doc.minutes} 分钟阅读</span>
            </div>
            <h1>${esc(doc.title)}</h1>
            ${doc.subtitle ? `<p class="article-sub">${esc(doc.subtitle)}</p>` : ""}
            <div class="article-tags">${doc.tags.map((tag) => tagChip(tag)).join("")}</div>
            ${isResearch ? `<div class="article-banner">${icon("flask")}<p><strong>本机环境探索报告。</strong>结论依赖当时的机器状态、工具版本与本地配置，换台机器未必复现；引用前请先在本机复验。</p></div>` : ""}
        </header>

        <div class="article-layout">
            <article class="article-body">
                <details class="toc-mobile">
                    <summary>本文目录</summary>
                    <nav id="tocMobile"></nav>
                </details>
                <div class="prose" id="articleBody">${body}</div>
            </article>

            <aside class="article-rail" aria-label="文章目录与阅读设置">
                <nav class="toc-nav" id="tocNav" aria-label="本文目录"></nav>
                <div class="reading-tools">
                    <button type="button" class="toc-top" data-to-top>回到顶部 ↑</button>
                </div>
            </aside>
        </div>

        <footer class="article-foot">
            <div class="article-foot-tags"><span>Topics</span>${doc.tags.map((tag) => tagChip(tag)).join("")}</div>
            ${
                prev || next
                    ? `
            <nav class="prev-next" aria-label="相邻文章">
                ${
                    prev
                        ? `<a href="#/posts/${prev.slug}"><span>← 上一篇</span><strong>${esc(prev.title)}</strong></a>`
                        : `<a href="#/posts"><span>回到列表</span><strong>全部 ${posts.length} 篇文章</strong></a>`
                }
                ${
                    next
                        ? `<a class="next" href="#/posts/${next.slug}"><span>下一篇 →</span><strong>${esc(next.title)}</strong></a>`
                        : `<a class="next" href="#/posts"><span>继续阅读</span><strong>浏览全部文章</strong></a>`
                }
            </nav>`
                    : ""
            }
        </footer>
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
    const thumb = headings
        .map((heading) => `<i class="depth-${heading.level}" data-anchor="${heading.id}"></i>`)
        .join("")
    nav.innerHTML = `<div class="toc-thumb" aria-hidden="true">${thumb}</div><div class="toc-list">${toc}</div>`
    mobileNav.innerHTML = toc

    const links = [...document.querySelectorAll("#tocNav a, #tocMobile a")]
    const thumbs = [...document.querySelectorAll("#tocNav .toc-thumb i")]
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
    document.querySelector("[data-to-top]")?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
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
        thumbs.forEach((thumb) => {
            thumb.classList.toggle("is-current", thumb.dataset.anchor === activeId)
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
