---
title: agent 读取浏览器页面内容的通道
date: 2026-11-17
tags: [Agent, 浏览器]
summary: 同一页面按用途要选不同通道——无障碍树给交互（ref/uid 定位）、正文提取给阅读（Accept: text/markdown 或 Readability）、网络响应给结构化数据、截图给视觉兜底；Playwright MCP 与 chrome-devtools-mcp 都默认 a11y 树，Lightpanda 用自研引擎换内存，内嵌浏览器用 CDP 接管。
---

页面内容对 agent 不是一种东西：同一页要按用途选通道，混着用才稳。

- 要点击、填表：无障碍树 + ref（`@e1`、`e5`、uid），文本小、可定位。
- 要正文：`Accept: text/markdown` 或 Readability 提取，别把整页 HTML 塞进上下文。
- 要数据：监听 XHR/fetch 响应，比从 DOM 反推稳；页面若暴露 WebMCP 工具，直接调。
- 要 canvas、验证码、样式核对：截图 + 视觉模型，最后手段。

## 问题

- 判据：单次读取的 token 成本、保真度（可见文本 / 隐藏数据 / 布局）、能否支撑后续动作、是否需要视觉模型。
- 页面分四类：SSR 文档、SPA 交互页、列表或表格数据页、canvas 与验证码页，四类要的通道不同。

## 候选

| 通道           | 代表实现                                                                                                                          | 输出                | 代价与边界                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| 无障碍树       | Playwright MCP `browser_snapshot`、chrome-devtools-mcp `take_snapshot`、agent-browser `snapshot`                                  | 带 ref/uid 的树     | 小、可定位、确定性；拿不到隐藏数据与图片                       |
| 正文提取       | `agent-browser read`（优先 `Accept: text/markdown` 与 `llms.txt`，回退 Readability）、Stagehand `extract`、Jina Reader、Firecrawl | Markdown 正文、JSON | 阅读便宜；丢交互点与页面结构                                   |
| 整页 HTML      | `agent-browser get html`、CDP `DOM.getOuterHTML` / `Runtime.evaluate`                                                             | HTML 字符串         | 保真最高；token 爆炸                                           |
| 网络响应       | chrome-devtools-mcp `list_network_requests` + `get_network_request`、Playwright `page.route` / HAR                                | JSON 或响应体       | 结构化且稳；要先判断哪个请求是目标                             |
| 截图 + 视觉    | Playwright MCP vision mode、Anthropic computer use、browser-use 截图通道                                                          | 图像                | 覆盖 canvas 与验证码；慢、贵，依赖视觉模型                     |
| 页面暴露工具   | WebMCP：chrome-devtools-mcp `execute_webmcp_tool`、agent-browser `webmcp invoke`（均在实验开关后）                                | 工具返回值          | 直接拿数据；站点需注册，覆盖面小                               |
| 接管内嵌浏览器 | Electron `webContents.debugger.attach("1.3")` 走 CDP、Playwright `connectOverCDP`                                                 | 复用到上面任一      | 无需改造 App；要求调试端口或进程内权限                         |
| 轻量渲染       | Lightpanda `fetch --dump markdown` / `structured_data`、自带 CDP server                                                           | Markdown、JSON-LD   | 厂商口径内存约为 Chrome 1/16、快 9x；无渲染引擎，canvas 不适用 |

## 当前判断

- 交互与阅读分两条腿：`snapshot` 定位可点元素，正文另走 markdown 提取；存在性检查也别截图（Playwright MCP、agent-browser 文档都这么要求）。
- 数据密集页先看网络请求，能直接打站点 JSON API 就不解析 DOM。
- 先试 `Accept: text/markdown`（Cloudflare Markdown for Agents 已在边缘按需转换），不认再起浏览器。
- 内嵌浏览器（Electron / CEF）优先 `connectOverCDP` 或 `webContents.debugger`，比注入 content script 稳。
- Lightpanda 适合批量抓取，不适合需要像素或复杂 CSS 的页面。

## 下一步

- 同一页面横评 `agent-browser snapshot` / `read` 与 chrome-devtools-mcp `take_snapshot` 的 token 与保真；本机沙箱内 agent-browser 因 `~/.agent-browser` 不可写、Chrome 启动失败，未跑通。
- 用 `agent-browser skills get electron` 验证内嵌 Electron App 的读取路径。

## 参考

- [Playwright MCP Snapshots](https://playwright.dev/mcp/snapshots)
- [chrome-devtools-mcp 工具参考](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)
- [agent-browser](https://github.com/vercel-labs/agent-browser)
- [browser-use](https://github.com/browser-use/browser-use)
- [Stagehand](https://docs.stagehand.dev/)
- [Lightpanda](https://github.com/lightpanda-io/browser)
- [Cloudflare Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
- [Electron debugger](https://www.electronjs.org/docs/latest/api/debugger)
