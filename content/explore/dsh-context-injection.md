---
title: dsh 上下文注入机制：pre-step 追加消息与 time-context 排程
subtitle: 注入不是独立通道，而是往这一步的 user 消息批次里塞一条带 source 的消息；时间上下文靠 sessionProjections 折叠事件控制频率
date: 2026-11-18
tags: [DeepSeek, Agent, 上下文, 源码阅读]
---

## 结论先行

- 没有任何"上下文通道"。注入 = 在 `agent/pre-step` 瀑布里往这一步的 `messages` 里加一条 **user 角色消息**，随后被 `session.append("user/message", …, { surfaceOp: "append" })` 落成可重放的会话事件。
- 每条注入必带 `source`：`kind` 说明**谁产的**，`form` 说明**是什么**（`instructions` / `catalog` / `snapshot` / `notice` / `relay` / `recall`）；两个轴正交，消费方按 `form` 决定怎么显示，按 `kind` 决定去重与排程。
- 时间上下文（`@deepseek-ai/dsh-time-context`）就是一条 `form: "snapshot"`：三行文本（采样时刻 / 浏览器时区策略 / 距上一条可见消息的间隔），默认每 600000 ms 一次，`refreshIntervalMs: 0` 则每步都注入。
- 它进的是**追加位**而不是 system prompt：system prompt 一改就要从第一个变更 token 起丢 KV cache，时间每步都变，只能追加在可复用前缀之后。
- 频率状态不在进程内：插件注册 `sessionProjections` 单元 `timeContext`，在 durable 事件流上折叠出上次注入时刻，所以 resume、compaction 之后排程照旧。
- 本机在跑的 `agentPreset: "standard"` 就带这一行；`~/.dsh/sessions` 里能翻到真实注入记录（见下）。

环境：macOS，dsh `0.2.1-rc.5`（mise `npm-deepseek-ai-dsh`），包解压在 `~/.local/share/mise/installs/npm-deepseek-ai-dsh/0.2.1-rc.5/node_modules/.mise/`，下面行号对应该副本。桌面端 `DeepSeek Harness.app` 打的是同一批包。

## 三个入口，只有一个会动消息

| 入口                                              | 谁用                                         | 产物                                                      | 变更代价                      |
| ------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------- | ----------------------------- |
| `ctx.systemPrompt.section({ order, text })`       | 固定说明，如工具用法                         | system 角色消息（surface 节点）                           | 从首个变更 token 起丢前缀缓存 |
| `ctx.systemPrompt.context({ name, order, text })` | 变动少的事实，如 cwd、sandbox 策略           | 一条 `kind: "runtime-context"` 的 user 快照，**原地替换** | 只重写那一条                  |
| `agent/pre-step` 里 append                        | 每步/每次触发都要新的状态，如时间、tmux 位置 | 一条自定义 `kind` 的 user 快照，**只追加**                | 前面的前缀不动                |

`agent/pre-step` 是 waterfall：`next()` 给出 loop 默认的批次，监听器可以 `reject` 或替换 `messages`。默认实现本身也会注入一条——`systemPrompt.assemble()` 收集的 runtime context 经 `RuntimeContextProjection.project()` 变成 user 消息（`lib/index.js:914`，`SOURCE = "runtime-context"`）。

```js
// @deepseek-ai/dsh-agent-loop/lib/index.js:909
const decision = await this.dispatch.waterfall(
    "agent/pre-step",
    {
        messages: claimed,
        ...position,
        signal,
    },
    () => ({ kind: "enter", messages: claimed }),
)
// :1069 起，首轮 attempt 逐条落盘
this.session.append("user/message", message, { surfaceOp: "append" })
```

落盘即"持久"：注入消息和真实用户输入走同一个 `user/message` 事件类型，只是 `source` 不同；UI 靠 `source` 把它们收成一行上下文条，模型看到的是同一条 user 消息。

## 时间上下文：一条 snapshot 的解剖

真实会话里的一条（`~/.dsh/sessions/…/session-67f028f0….jsonl.zstd`，`agentPreset: standard`）：

```json
{
    "type": "user/message",
    "seq": 837,
    "time": 1794892367220,
    "data": {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "Time sampled while preparing turn 1, step 91: 2026-11-17T13:12:47+08:00[Asia/Shanghai]\nBrowser time zone for this request: Asia/Shanghai. Interpret otherwise-unqualified dates and times in this zone.\nElapsed since the preceding step context: 10m 23s."
            }
        ],
        "source": {
            "kind": "time-context",
            "form": "snapshot",
            "sections": [{ "name": "time-context", "text": "…同上…" }]
        }
    },
    "surfaceOp": "append"
}
```

`step 91` 才第二条，间隔 10m 23s，正好卡在默认 `refreshIntervalMs` 上：步数涨得再快，10 分钟内也只发一次。

三行的语义（`dsh-time-context/lib/index.js:130` 的 `renderText`）：

| 行                                                            | 取值                                                                | 说明                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `Time sampled while preparing turn {turn}, step {step}: {ts}` | `Intl.DateTimeFormat` + `timeZoneName: "longOffset"`                | 形如 `2026-11-17T13:12:47+08:00[Asia/Shanghai]`，带 IANA 名              |
| `Browser time zone for this request: …`                       | 开放 turn 里 `user-rpc` 消息的 `clientTimeZone` 去重                | 唯一 → 直接给；多个 → `mixed [...]` 并要求模型反问；没有 → `unavailable` |
| `Elapsed since the preceding …`                               | `step === 1` 取上一条 model-visible 消息，否则取上一份 time-context | 没有基线写 `unavailable`；时钟回拨钳到 0                                 |

监听器本体很短，三点值得抄：`{ prepend: true }` 让它排在水位最前、`await next()` 之后再决定、只追加不改写。

```js
ctx.on(
    "agent/pre-step",
    async ({ agent, turn, step, signal }, next) => {
        const decision = await next()
        if (decision.kind === "reject" || signal.aborted) return decision
        const now = Date.now()
        const state = ctx.sessionProjections.stateOf(agent.session, "timeContext")
        if (
            refreshIntervalMs > 0 &&
            state.lastInjectionTime != null &&
            now - state.lastInjectionTime < refreshIntervalMs
        )
            return decision
        const browser = deriveBrowserTimeZoneContext(requestMessages(agent, turn, decision.messages))
        const zone = browser.kind === "resolved" ? browser.timeZone : fallbackTimeZone
        const text = renderText(now, turn, step, previous, formatterFor(zone), zone, browser)
        return {
            ...decision,
            messages: [
                ...decision.messages,
                createUserMessage({
                    content: [{ type: "text", text }],
                    source: { kind: "time-context", form: "snapshot", sections: [{ name: "time-context", text }] },
                }),
            ],
        }
    },
    { prepend: true },
)
```

时区不是猜的：`browserTimeZone()` 只认 Host 规范化过的值，非 `UTC` / 非 `Area/Location` / 非规范名一律 `TypeError`，然后用 `Intl.DateTimeFormat(...).resolvedOptions().timeZone` 反查必须完全相等。缺省回落到配置 `timeZone`，再回落到进程时区，且插件加载时就解析一次并缓存 formatter。

## 频率靠 projection，不靠计时器

`timeContext` 是一个 `sessionProjections` 单元（`key: "timeContext"`, `stateVersion: 2`），无 `wire` 块即只在 Host 侧：

```js
apply: (state, event) => {
    if (event.type === "turn/start" || event.type === "turn/end")
        return state.lastTurnInjectionTime === null ? state : { ...state, lastTurnInjectionTime: null }
    if (event.type === "user/message") {
        const injected = event.data.source.kind === "time-context"
        const withMessage = { ...state, lastMessageTime: event.time }
        return injected
            ? { ...withMessage, lastInjectionTime: event.time, lastTurnInjectionTime: event.time }
            : withMessage
    }
    if (event.type === "assistant/message" || event.type === "tool/result")
        return { ...state, lastMessageTime: event.time }
    return state
}
```

折叠的是**已提交的 durable 事件**，不是当前 surface。所以：compaction 把旧消息摘要掉之后，注入记录仍在日志里，`lastInjectionTime` 照样算得出来；进程重启、会话 resume 也不丢，因为状态由日志重建（可选 checkpoint 加速冷读）。同一模式在 tmux-context 里也能看到，只是它多一层"状态没变就不发"的去重。

## 同一套写法的兄弟插件

| 包                       | `kind`               | `form`                     | 干什么                                                                |
| ------------------------ | -------------------- | -------------------------- | --------------------------------------------------------------------- |
| `dsh-agent-instructions` | `agent-instructions` | `instructions`             | 读 AGENTS.md 一类文件；改了才重发，且插在"最后一条已被认领的消息"之后 |
| `dsh-tmux-context`       | `tmux-context`       | `snapshot`                 | 只有 step 1 发；位置状态不变则跳过                                    |
| `dsh-tool-skill`         | `skill`              | `catalog` / `instructions` | 可用技能清单，变化时重发                                              |
| `dsh-plan-mode`          | `plan-mode`          | `notice`                   | 进入/退出 plan 模式的一次性通告，带 120 字上限的 `summary`            |
| `dsh-session-reference`  | `session-reference`  | `recall`                   | 从别的会话日志里摘出的材料                                            |
| `dsh-working-directory`  | `runtime-context`    | `snapshot`                 | cwd、sandbox 策略等，多段合并进一条 `<system-reminder>`               |

分工很清楚：**"是什么"用 `form` 交给消费方决定渲染，"变不变"决定用 section、runtime context 还是 pre-step 追加**。

## 启用与调参

时间上下文在 `dsh-web-app/presets/{standard,ptc,cordis}.patch.yml` 里各有一行，`minimal` 没有；`dsh-base` + `dsh-web-app` 这两个 bundle 本身不带，得靠 preset 层加上。会话头里的 `agentPreset` 决定用哪份。

要改成本地时区固定值，在 profile 的 `cordis.patch.yml` 追加：

```yaml
- id: time-context
  name: "@deepseek-ai/dsh-time-context"
  config:
      timeZone: Asia/Shanghai # 缺省用进程时区
      refreshIntervalMs: 600000 # 0 = 每步都注入
```

`refreshIntervalMs` 必须是非负安全整数，否则加载即抛；`timeZone` 非法在加载时抛，而不是等到第一次请求。

## 边界

- 时间上下文只是**提示**：它让模型按这个时区解释没写时区的日期，但不会替别的工具补必填时区参数。
- 浏览器时区混合或缺失时是"要求模型反问"，配置里的 `timeZone` 只负责格式化，不冒充用户授权。
- 显示精度到整秒；durable 事件时间保留毫秒。
- `refreshIntervalMs: 0` 时每次合格准备都留一条，直到被 compaction 遮蔽为止——省 token 与"总有最新时区提示"不可兼得。
- 本文对着 `0.2.1-rc.5` 解压产物读的，包还带着 `-rc` 号，函数名与行号会漂。

## 参考

- 上游仓库：<https://github.com/deepseek-ai/deepseek-harness>（`packages/context/time-context`、`packages/agent/agent-loop`）
- 本机包文档：`~/.local/share/mise/installs/npm-deepseek-ai-dsh/0.2.1-rc.5/node_modules/.mise/@deepseek-ai+dsh-time-context@0.2.1-rc.5_*/node_modules/@deepseek-ai/dsh-time-context/README.md`（同包 `README.zh.md` 为中文）
- `@deepseek-ai/dsh-llm` 的 `lib/types/message.d.ts`：`ContextForm` 六个值与 `MessageSource` 的定义
- `@deepseek-ai/dsh-tool-cordis` 的 `lib/types/api-catalog.js`：全部 waterfall / emit 事件签名，离线可查
