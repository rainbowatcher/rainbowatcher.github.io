---
title: Cloudflare Turnstile 人机验证与服务端校验
date: 2026-11-19
tags: [浏览器, 网络, HTTP]
subtitle: 嵌在表单里的人机验证：widget 模式只决定访客要不要点一下，前端产出一枚 300 秒有效的一次性 token，服务端必须调 siteverify 并核 hostname 与 action；接口形状已本机实测，页面接入未做。
---

Turnstile 回答的是「这次提交是否真人发起」，与边缘 WAF / Bot Fight Mode 分属两层，不互相替代。

- 三条形态 Managed / Non-Interactive / Invisible，差别只在访客要不要点一下、看不看得见。
- 前端只产出隐藏字段 `cf-turnstile-response`；不做服务端 `siteverify` 等于没接，只查 `success` 不够，还要核 `hostname` 与 `action`。
- 本机已实测接口形状（测试密钥 200、错误密钥 `invalid-input-secret`），本站怎么落地必须在三条路径里先选一条。

## 是什么

访客浏览器跑一段挑战脚本，成功时拿到一枚一次性 token；站方服务端拿 token 向 Cloudflare 换「真人」判定。

- 在链路里管一段：表单 / 登录 / 注册 / 关键 API 的提交入口。
- 不负责：全站爬虫拦截、限速、WAF 规则、账号风控——那些在边缘 WAF / Bot Fight Mode，两层叠加使用。
- token 寿命 300 秒（5 分钟）、原则上一次性；重放返回 `timeout-or-duplicate`，但跨网络的重复使用检测是最终一致的，短窗口内可能漏。
- 只在 `http://` / `https://` 页面生效，`file://` 不支持。

## 使用方式

| 方式                          | 差异                                                                        | 何时选                            |
| ----------------------------- | --------------------------------------------------------------------------- | --------------------------------- |
| Managed（推荐）               | 按风险在「无感」与「点一下复选框」之间自适应，不出图片文字题                | 默认，不想调参                    |
| Non-Interactive               | 有可见 widget 与 loading，但永不要求交互                                    | 体验优先，页面本就有提交按钮      |
| Invisible                     | 完全不可见；官方要求隐私政策引用 Turnstile Privacy Addendum                 | 视觉要求高且愿补隐私条款          |
| 隐式渲染                      | `<div class="cf-turnstile" data-sitekey>`，自动注入 `cf-turnstile-response` | 服务端渲染表单，最省代码          |
| 显式渲染                      | `turnstile.render()` + `getResponse` / `isExpired` / `reset` / `remove`     | SPA、动态或条件渲染               |
| `execution:execute`           | 先渲染不跑挑战，需要时 `turnstile.execute()`                                | 提交时才验证，避免 token 闲置过期 |
| `appearance:interaction-only` | 只在需要交互时才显示 widget                                                 | 要托管模式又怕留空位              |

可见性的另外两档是 `theme`（auto/light/dark）与 `size`（normal/flexible/compact），只影响外观。

```bash
curl -sS -X POST https://challenges.cloudflare.com/turnstile/v0/siteverify \
  -d "secret=$TURNSTILE_SECRET" -d "response=$TOKEN"
# 通过: {"success":true,"hostname":"example.com","error-codes":[]}
# 密钥错: {"success":false,"error-codes":["invalid-input-secret"]}
```

## 已验证

- 实测（2026-11-19，本机 curl）：官方测试 secret `1x0000000000000000000000000000000AA` + 任意 response → HTTP 200，`{"success":true,"hostname":"example.com","metadata":{"result_with_testing_key":true}}`。
- 实测（同日）：secret 换成随意字符串 → `{"success":false,"error-codes":["invalid-input-secret"]}`，无 `messages` 字段。
- 官方文档：三种模式定义与 Invisible 的隐私条款要求、300 秒与单次使用、`execution` / `appearance` 取值、`file://` 不支持、测试 sitekey `1x…AA` 总通过 / `2x…AB` 总失败。
- 未验证：真实站点集成、本站落地方案、测试 sitekey 与自有域名的白名单行为、Pre-clearance（企业版）。

## 路径

| 路径           | 要做的事                                                             | 状态   | 产出                                |
| -------------- | -------------------------------------------------------------------- | ------ | ----------------------------------- |
| 静态表单接入   | 测试域名建 widget，隐式渲染 + 服务端校验，故意写错 `hostname` 验 403 | 未开始 | —                                   |
| SPA 动态表单   | 显式渲染 + `execution:execute`，处理 `isExpired` 与失败重试          | 未开始 | —                                   |
| 纯 API 保护    | 无表单场景：提交前 `execute`，服务端只认 token                       | 未开始 | —                                   |
| 边缘防护联动   | WAF / Bot Fight Mode / Pre-clearance 的分层边界与配置顺序            | 未开始 | —                                   |
| 迁移 reCAPTCHA | 字段名、回调与迁移清单                                               | 已放弃 | 本站无历史 reCAPTCHA 接入，暂不需要 |

## 待你决定

- 本站是 `nuxi generate` 的纯静态站，没有常驻服务端：「静态表单接入」先要定验证码校验放在哪——Cloudflare Pages Function、VPS 上一个小接口，还是不接。
- 「纯 API 保护」不动页面与 CSP；「静态表单接入」还要加 `challenges.cloudflare.com` 的 CSP 白名单与隐私条款。
- 选定一条后我跑通并把结论落进 `experience/`，本表那一行补链接。

## 参考

- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [Turnstile widgets](https://developers.cloudflare.com/turnstile/concepts/widget/)
- [Client-side rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Test your Turnstile implementation](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
