---
title: CDP 直连读取 Chromium 页面内容
date: 2026-11-17
tags: [Agent, 浏览器]
summary: 不装 Playwright，用 fetch /json/version + WebSocket 直连 CDP 就能读标签页：YouTube 视频页 AX 树约为 DOM 节点数的 1/5，关闭的 Shadow DOM 只有 AX 树读得到，ytInitialData 有 47 万字节、6 条字幕轨；Reddit 与 X 在机房 IP 下先返回 403。
---

## 结论

- 四十行原始 CDP 客户端就能替代 Playwright 做读取：`Target.createTarget` → `Target.attachToTarget` → `Runtime.evaluate` / `Accessibility.getFullAXTree`。
- AX 树比 DOM 小一个量级：YouTube `watch` 页两次实测 DOM 5002 / 5309 节点，AX 989 / 1037 节点，有名字的 149 / 301。
- 关闭的 Shadow DOM 是分水岭：页面里 `querySelectorAll("article,h2,button")` 命中 0、`shadowRoot` 为 `null`，AX 树里 heading、button、文本都在。
- 站点自曝 JSON 最省 token：YouTube `ytInitialData` 约 47 万字节，`ytInitialPlayerResponse` 里有 6 条字幕轨。
- 反爬先于解析：Reddit、X 对机房 IP 直接 403，AX 树只能读到拦截页。

## 环境

macOS（Apple Silicon）+ Chrome for Testing 143.0.7499.4（Playwright 缓存的 `chromium-1200`）+ Node 24.22。

```bash
CHROME="$HOME/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
"$CHROME" --headless=new --no-sandbox --disable-gpu \
  --remote-debugging-port=9333 --user-data-dir=/tmp/cdp-profile about:blank
```

## 做法

`/json/version` 拿浏览器级 WebSocket，建空白标签页后 `flatten: true` attach，后续命令都带 `sessionId`。读取只用到三个方法：`Runtime.evaluate` 取 DOM 与 JSON、`Accessibility.getFullAXTree` 取结构树、`Page.navigate` 导航。

```js
// cdp-read.mjs：node cdp-read.mjs <url> [等待毫秒] [额外表达式]
const info = await (await fetch("http://127.0.0.1:9333/json/version")).json()
const ws = new WebSocket(info.webSocketDebuggerUrl)
const pending = new Map()
let seq = 0
ws.onmessage = ({ data }) => {
    const m = JSON.parse(data)
    pending.get(m.id)?.(m)
    pending.delete(m.id)
}
await new Promise((ok) => (ws.onopen = ok))
const send = (method, params = {}, sessionId) =>
    new Promise((ok, fail) => {
        const id = ++seq
        pending.set(id, (m) => (m.error ? fail(new Error(m.error.message)) : ok(m.result)))
        ws.send(JSON.stringify({ id, method, params, sessionId }))
    })

const { targetId } = await send("Target.createTarget", { url: "about:blank" })
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true })
await send("Page.navigate", { url: process.argv[2] }, sessionId)
await new Promise((ok) => setTimeout(ok, Number(process.argv[3] ?? 6000)))
const evaluate = async (expression) =>
    (await send("Runtime.evaluate", { expression, returnByValue: true }, sessionId)).result.value
const { nodes } = await send("Accessibility.getFullAXTree", {}, sessionId)
console.log("DOM:", await evaluate("document.querySelectorAll('*').length"))
console.log("AX:", nodes.length, "named:", nodes.filter((n) => n.name?.value).length)
console.log("extra:", await evaluate(process.argv[4] ?? "''"))
ws.close()
```

取数表达式按站点换，`extra` 就是第三个参数：

```bash
node cdp-read.mjs "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 9000 \
  "JSON.stringify({initBytes: JSON.stringify(window.ytInitialData).length, captions: window.ytInitialPlayerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks?.length})"
# extra: {"initBytes":472552,"captions":6}
```

## 边界与失败

- Reddit 返回 `You've been blocked by network security.`，X 返回 403：机房 IP + headless 被拦，本机真实会话能否过未验证。
- AX 树不含图片像素、视频画面与 canvas 内容，要画面得 `Page.captureScreenshot`，要视频内容得走字幕轨。
- 关闭的 shadow root 用页面 JS 拿不到，只有 CDP 的 AX 树能读到——这正是「富站点优先 AX 树」的依据。
- Chrome 143 的 `/json/new` 需要 PUT，脚本绕开它改用 `Target.createTarget`。
- 页面是动态渲染的，AX 节点数每次跑都浮动，别拿它当固定阈值。

## 证据

```bash
node cdp-read.mjs "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 9000
# title: Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster) - YouTube
# DOM: 5309
# AX: 1037 named: 301

node cdp-read.mjs "file:///tmp/shadow.html" 1500 \
  "JSON.stringify({query: document.querySelectorAll('article,h2,button').length, closedRoot: document.getElementById('host').shadowRoot === null})"
# DOM: 5
# AX: 14 named: 8
# extra: {"query":0,"closedRoot":true}
```
