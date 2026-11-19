---
title: 网站反爬虫与防自动化的分层手段
date: 2026-11-19
tags: [网络, HTTP, 浏览器]
subtitle: 约定、边缘、客户端挑战、业务风控四层；越靠后越能精确放行，成本与误伤也越高
---

反自动化不是单一开关：按请求经过的位置分成约定、边缘、客户端、业务四层，每层只挡自己能判定的请求；目标不是拦住所有 bot，而是抬高滥用成本、同时放行搜索引擎与正常用户。

- 约定层（robots.txt、服务条款、数据分级）只表意不执行；本机 curl 实测 `Disallow` 路径仍返回 200。
- 边缘层（IP/ASN 信誉、WAF、限速、Bot Fight Mode）先挡量；误伤 API 与移动端是主要代价，BFM 还不能用 WAF `Skip` 做例外。
- 客户端挑战（托管挑战 / Turnstile、PoW、蜜罐字段）回答「这次提交是否真人」，必须配服务端校验，不能替代限速。
- 业务层（认证、配额、幂等、异常检测、降质响应）按身份与动作判定，是唯一能精确放行的层，但要自建状态与监控。

## 是什么

反爬虫针对批量抓取内容；防自动化覆盖更广——撞库、刷单、养号、礼品卡枚举、漏洞扫描都在内，OWASP 把它们编成 OAT-001～OAT-021。两者都是滥用治理的子集。

| 层         | 判定依据                   | 代表手段                                       | 挡什么                         | 挡不住什么                       |
| ---------- | -------------------------- | ---------------------------------------------- | ------------------------------ | -------------------------------- |
| 约定       | 文本声明                   | robots.txt、服务条款、公开数据分级             | 善意爬虫自愿遵守               | 任何不读声明的客户端             |
| 边缘       | IP/ASN、请求速率、特征规则 | WAF、IP 信誉、限速、Bot Fight Mode             | 高频与已知恶意来源             | 换住宅代理、低速长尾、登录态请求 |
| 客户端挑战 | 浏览器执行能力与交互       | JS 挑战、Turnstile、PoW、蜜罐字段              | 无浏览器环境的脚本、填表机器人 | 有头浏览器、打码服务、真实会话   |
| 业务与数据 | 身份、动作频率、交易异常   | API key/配额、MFA、幂等键、风控评分、降质/投毒 | 具体账号上的恶意动作           | 未接入这些信号的公开内容         |

不负责：DDoS 的容量消耗（属于容量层防护）；SEO 的「不索引」（`noindex` 只影响搜索结果）；访问控制本身（认证与授权才管「谁能看」）。浏览器端混淆与「必须执行 JS 才出内容」也只是提高解析成本，不构成服务端边界——本机读页面的实践见 [CDP 直连读取 Chromium 页面内容](../experience/chromium-cdp-content-extraction.md)。

## 使用方式

### 按端点选第一道控制

| 端点          | 主要风险   | 首选控制                                        |
| ------------- | ---------- | ----------------------------------------------- |
| 登录          | 撞库       | 用户名与 IP 两个独立限速桶 + 泄露密码检查 + MFA |
| 注册          | 批量养号   | 邮箱验证 + 每 IP/ASN 速率限制                   |
| 搜索 / 目录   | 内容抓取   | 按身份限速 + 行为信号                           |
| 结算 / 购物车 | 刷单、囤货 | 排队 + 服务端购买上限 + 持有时间                |
| 公开 API      | 抓取、扫描 | API key + 每 key 配额 + 请求签名 + 分层数据     |
| 评论 / 表单   | 垃圾内容   | 蜜罐字段 + 人机验证 + 延迟发布                  |

### 常见手段与代价

| 手段                     | 关键差别                               | 代价 / 何时选                                    |
| ------------------------ | -------------------------------------- | ------------------------------------------------ |
| robots.txt               | 声明抓取边界，也可放诱饵路径           | 零成本，但无强制力；不要当访问控制               |
| IP / ASN 信誉与封禁      | 按来源判断，能挡机房 IP                | 误伤共享出口与移动网络；住宅代理绕过             |
| WAF 自定义规则           | 按 expression 匹配并放行或拦截         | 要维护规则；只覆盖它评估的请求                   |
| 限速                     | 按 IP、会话、身份、端点分别计数        | 用滑动窗口或令牌桶；固定窗口会被边界突发绕过     |
| Bot Fight Mode           | 免费全站开关，识别已知 bot 并挑战      | 无例外规则；会挑战 API 与移动 App 流量           |
| Super Bot Fight Mode     | 可按类别配置动作，支持 WAF `Skip` 例外 | 付费套餐；仍无逐请求 bot 评分                    |
| 客户端挑战 / Turnstile   | 验证「这次提交是不是真人」             | 必须服务端验 token；无障碍与体验成本，最后一步用 |
| TLS / HTTP2 指纹         | JA3/JA4、帧序等被动信号，换 IP 也难藏  | 误报需人工复核；采集前要过隐私披露               |
| 蜜罐 / tarpit / 水印记录 | 隐藏字段抓填表机器人；慢响应拖垮吞吐   | 对正常用户近乎无感；要服务端配合判定             |
| 认证 + 配额 + 幂等       | 按身份与业务动作判定                   | 需要账号体系与状态；精确放行能力最强             |

最小声明示例，只表达意愿：

```txt
User-agent: *
Disallow: /private/
```

Agent 与工具也要能读这份声明——站点给 agent 的内容通道另见 [Electron 内置浏览器给 agent 读页面内容的接入与提取](agent-page-content-channels.md)。

## 已验证

### 本机实测

- 2026-11-19，临时目录放 `robots.txt`（`Disallow: /private`）与 `private`，用 `python3 -m http.server` 提供服务，curl 结果：

```bash
$ curl -sS http://127.0.0.1:18977/robots.txt
User-agent: *
Disallow: /private
$ curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:18977/private
200
$ curl -sS -A Googlebot -o /dev/null -w '%{http_code}\n' http://127.0.0.1:18977/private
200
```

- 结论：声明写与不写，普通 HTTP 客户端都拿得到 `/private`；伪装 `User-Agent` 也不改变返回。蜜罐、限速、指纹等其余手段本机未实测。

### 官方文档确认

- Google Search Central：robots.txt 无法强制爬虫遵守，可信爬虫照做，其他爬虫自行决定。
- Cloudflare Bot Fight Mode：免费开关，对匹配 bot 特征的下发计算挑战；跑在 Ruleset Engine 之外，WAF `Skip` 与 Page Rules 无效，IP Access 先匹配则不再触发；可能挑战 API 与移动端。
- Cloudflare 限速规则：按 expression 匹配并定义达到阈值后的动作；计数器按数据中心维护且有数秒延迟，不能保证精确的请求数到达源站；对已验证 bot 限速可能伤 SEO。
- OWASP Bot Management and Anti-Automation：分三层（边缘 / 应用 / 业务）；登录要分别设「每用户名」和「每 IP」桶，合成一个 `login:<ip>:<user>` 桶恰好放过了撞库；验证码是最后一步，过后仍要保留限速；响应可按置信度分级，不必一律 403。
- Turnstile 的 token 寿命与服务端校验要求见 [Cloudflare Turnstile 人机验证与服务端校验](cloudflare-turnstile.md)，此处不复述。

### 未验证

- 本站静态站未开启任何边缘规则或挑战，也没有真实流量样本，无法估算误报率。
- 指纹与行为评分的误报率、隐私披露边界未验证；确认方式：在真实流量上标注样本，对比命中率与人工复核结果。
- 降质 / 投毒响应的法律与 SEO 后果未验证。

## 路径

| 路径                 | 要做的事                                                  | 状态   | 产出 |
| -------------------- | --------------------------------------------------------- | ------ | ---- |
| 静态站声明           | 写 robots.txt 与服务条款，明确抓取边界和联系渠道          | 未开始 | —    |
| 边缘限速与 WAF       | 在托管层按端点设限速，观察 Security Events 的误伤         | 未开始 | —    |
| 表单人机验证         | 测试域名接 Turnstile，服务端验 token 并核 hostname/action | 未开始 | —    |
| 业务侧日志与异常检测 | 记录端点、IP/ASN、UA、决策信号，设速率与成功率告警        | 未开始 | —    |
| 指纹与行为评分       | 采样评估 JA4 / HTTP2 信号误报，先定隐私披露口径           | 未开始 | —    |
| 降质 / 投毒响应      | 明确法律边界后再小流量试验                                | 未开始 | —    |

## 待你决定

- 本站是 `nuxi generate` 的纯静态公开站：先定目标是「省带宽」还是「防表单滥用」。前者用缓存 + 边缘限速 + robots.txt 就够，后者才需要挑战和服务端接口。
- 指纹与行为评分涉及隐私披露，且对公开静态内容的收益有限，排在最后。
- 选定一条后跑通并把结论写成 `experience/` 文章，本表那一行补链接；本图不搬家。

## 参考

- [Bot Management and Anti-Automation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Bot_Management_and_Anti-Automation_Cheat_Sheet.html)
- [Cloudflare bot solutions](https://developers.cloudflare.com/bots/)
- [Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
- [Rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [robots.txt 简介](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Cloudflare Turnstile 人机验证与服务端校验](cloudflare-turnstile.md)
- [CDP 直连读取 Chromium 页面内容](../experience/chromium-cdp-content-extraction.md)
- [Electron 内置浏览器给 agent 读页面内容的接入与提取](agent-page-content-channels.md)
