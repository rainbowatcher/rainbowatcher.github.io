---
title: Cloudflare Turnstile 人机验证与服务端校验
date: 2026-11-19
tags: [浏览器, 网络, HTTP]
subtitle: 调研草稿：Turnstile 是嵌在页面或表单里的无感验证组件，与边缘 Bot Fight Mode 分属两层；前端提交 cf-turnstile-response，后端必须调 siteverify 校验 success、action 与 hostname。未在本站接入实测。
---

Turnstile 回答的是「这个请求是否由真人提交」，与 Cloudflare 边缘的 WAF / Bot Fight Mode 不互相替代。

- 三种 widget 模式：Managed / Non-Interactive / Invisible；前端提交字段固定为 `cf-turnstile-response`。
- 服务端必须调 `siteverify` 校验 `success`、`action`、`hostname`；只查 `success` 不够。

## 问题

- 表单、登录、注册与 API 想挡脚本又不给用户图片识别负担；真正的风险在服务端：token 可复制重放，密钥也可能被外部站点盗用。

## 候选

| 环节       | 官方机制                                                                         | 要点                                                                                      |
| ---------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 前端模式   | Managed / Non-Interactive / Invisible                                            | Managed 默认推荐，按风险自适应                                                            |
| 渲染       | implicit（`.cf-turnstile` + `data-sitekey`）或 explicit（`turnstile.render()`）  | callback 拿 token，随表单提交 `cf-turnstile-response`                                     |
| 服务端校验 | POST `siteverify`，传 `secret` / `response`，可带 `remoteip`                     | secret key 不下发浏览器                                                                   |
| 域名与联动 | Hostname Management；Any Hostname 仅 Enterprise；Pre-clearance 发 `cf_clearance` | 必须校验返回的 `hostname`；pre-clearance 默认 `no_clearance`，hostname 须与 WAF zone 一致 |

```js
const { success, action, hostname } = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET, response: req.body["cf-turnstile-response"] }),
}).then((r) => r.json())
if (!success || action !== "login" || hostname !== "example.com") return res.status(403).send("forbidden")
```

## 当前判断

- 只保护显式接入的页面或接口，全站自动程序防护交给边缘 WAF / Bot Fight Mode；Managed 适合默认启用，Invisible 无可见反馈，调试阶段先用可见模式并核对 `action` 与 `hostname`。

## 下一步

- 在测试域名创建 widget，用 implicit 与 explicit 跑通 token 提交，本机校验 `success` / `action` / `hostname`，故意写错 hostname 验证 403，并查清 token 有效期与重放语义后再决定晋升阶段。

## 参考

- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [Server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/)
