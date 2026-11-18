---
title: Electron 内置浏览器给 agent 读页面内容的接入与提取
date: 2026-11-17
tags: [Agent, 浏览器]
subtitle: 内嵌 webview 的读取分两段——接入（启动参数开 CDP、进程内 debugger、preload 注入、扩展）与提取（AX 树、站点自曝 JSON、网络响应、截图、字幕）；X/Reddit/YouTube 这类站点 AX 树覆盖交互与文案、站点 JSON 拿数据、视频另取字幕，真正的瓶颈是登录态与反爬而不是解析。
---

Electron 里给 agent 读页面是两层问题：先把页面暴露成可读目标，再选通道读。

- 接入最省事的是 `--remote-debugging-port` + 外部 CDP 客户端；不想开端口用 `webContents.debugger`，自家 webview 用 preload 回传。
- 提取先用 AX 树（穿透 Shadow DOM），列表数据走站点自曝 JSON，视频走字幕轨。
- 富站点的瓶颈是登录态与反爬，带用户会话的内嵌浏览器正好绕开机房 IP 那套限制。

## 问题

- 形态决定可见性：`<webview>` 与 `WebContentsView`（替代已废弃的 `BrowserView`）是独立 target，能单独 snapshot；iframe 只是页面里的 frame；主窗口页面就是普通 page。
- 富站点四类内容要分开处理：时间线与列表（虚拟滚动）、详情页、视频与音频、图片与 canvas。

## 候选

接入方式：

| 接入                | 做法                                                                                    | 适用                   | 代价                                 |
| ------------------- | --------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------ |
| 外部 CDP            | 启动加 `--remote-debugging-port=9222`，`agent-browser connect 9222` 或 `connectOverCDP` | 非自家 App、外包 agent | 端口暴露；App 已在跑要先退出         |
| 进程内 debugger     | `webContents.debugger.attach("1.3")` + `sendCommand`                                    | 自家 App、不开端口     | 写主进程代码；DevTools 打开会 detach |
| preload + IPC       | `<webview preload>` 注入，`sendToHost` 回传摘要                                         | 自家 webview           | 每个站点一套提取脚本                 |
| Playwright Electron | `_electron.launch({ executablePath })` 拿 `firstWindow()`                               | 自家 App 的端到端测试  | 进程内启动，要改测试代码             |
| 加载扩展            | `session.loadExtension` 装 content script                                               | 需要同上下文           | 受 CSP 与隔离世界限制                |

提取通道：

| 通道          | 实现                                                             | 富站点表现                                    |
| ------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| AX 树         | `Accessibility.getFullAXTree`、`snapshot -i`、`take_snapshot`    | 按钮/链接/文案全覆盖，穿透 Shadow DOM；无画面 |
| 站点自曝 JSON | `ytInitialData`、`__NEXT_DATA__`、Reddit `.json`、X GraphQL 响应 | 数据最全；字段随改版漂移                      |
| 网络响应      | CDP `Network` 域、chrome-devtools-mcp `list_network_requests`    | 拿接口原始 JSON，绕开 DOM                     |
| 截图          | `webContents.capturePage()`、`Page.captureScreenshot`            | canvas、验证码、画面；token 贵                |
| 字幕/转写     | `ytInitialPlayerResponse` 的 captionTracks、yt-dlp               | 视频内容的唯一可靠通道                        |

## 当前判断

- 默认链路：CDP 接上 webview target → AX 树做交互与文案 → 站点 JSON 拿列表全量 → 视频取字幕。
- 虚拟滚动（X 时间线、Reddit 列表）里 AX 树只有视口内容，要么滚动增量，要么直接打接口，别指望一次 snapshot 拿全。
- 站点 JSON 优先于 DOM 解析，字段变了再降级回 AX 树。
- 图片只有 alt/name，要视觉描述就按元素截一张图。
- 反爬：内嵌浏览器带用户的 cookie 是核心优势；headless + 机房 IP 访问 Reddit/X 直接 403（[CDP 直连读取 Chromium 页面内容](../experience/chromium-cdp-content-extraction.md)）。

## 下一步

- 在真 Electron 里跑通 `--remote-debugging-port` + webview target（本机没有 Electron 二进制，未验证）。
- 横评 AX 树与 `DOMSnapshot.captureSnapshot` 的 token 与保真，确定列表页用哪个。

## 参考

- [Electron debugger](https://www.electronjs.org/docs/latest/api/debugger)
- [Electron webview tag](https://www.electronjs.org/docs/latest/api/webview-tag)
- [WebContentsView](https://www.electronjs.org/docs/latest/api/web-contents-view)
- [agent-browser](https://github.com/vercel-labs/agent-browser)
