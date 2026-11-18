---
title: Claude Code 的查询循环、工具面与三层压缩
date: 2026-11-18
tags: [Agent, LLM, 源码阅读]
summary: 闭源 CLI 还原出的结构是单 agent tool-calling 循环加分层压缩与子 agent 隔离——query() 是 async generator，queryLoop 是 while(true)，压缩阈值是公式而非百分比，子 agent 各起一个独立 query 实例。
---

Claude Code 没有编排器，只有一个循环，复杂度全在循环周边。

- 控制流单线程，工具按只读/写分组，只读并行、写串行。
- 压缩三层：microcompact 纯本地、autocompact 调模型、reactive 兜 413。
- 子 agent 复用同一个 `query()`，主循环只收摘要。

## 问题

闭源，只能靠泄露的 `cli.js.map` 与早期混淆版本的逆向互相印证，符号名每版都换。

## 候选

### 主循环

`query()` 是 async generator，内部的 `queryLoop()` 是 `while(true)`：

```text
while (true) {
  compactIfNeeded()
  msg = await callModel(messages, tools)   // 流式
  if (!msg.toolUses.length) return completed
  messages += msg + await runTools(msg.toolUses)
}
```

### 工具面

| 类别 | 内容                                                        |
| ---- | ----------------------------------------------------------- |
| 文件 | Read / Write / Edit / Glob / Grep，MCP 工具同表             |
| 执行 | Bash（含后台运行）                                          |
| 网络 | WebFetch / WebSearch                                        |
| 计划 | TodoWrite / exit_plan_mode                                  |
| 委派 | Task：内部再起一个 `query()`，独立 context 与 system prompt |

Explore 只读且跳过 CLAUDE.md，Plan 供 plan mode 用，general-purpose 全能；子 agent 并发上限 20、嵌套默认 3 层。CLAUDE.md 启动时整段注入，MCP 只常驻工具名，skill 只常驻描述，hooks 零上下文。

### 压缩

| 层               | 触发                                 | 动作                                                          |
| ---------------- | ------------------------------------ | ------------------------------------------------------------- |
| microcompact     | 每轮                                 | 本地把旧 tool_result 换成占位符，只动 Read/Bash/Grep/Glob/Web |
| autocompact      | `(窗口 − min(maxOutput, 20k)) − 13k` | 调模型摘要并替换压缩点之前的历史，随后重读最近 5 个文件       |
| reactive compact | 413                                  | 立即压缩重试，每轮至多一次                                    |

## 当前判断

- 流传的「92% 阈值」来自 2025 年对 v1.0.33 的逆向，现行版本是上面的公式：200K 窗口约 167K，1M 窗口约 967K。
- thinking 块连同 signature 必须整条轨迹原样回传，工具往返期间不能改，这是它比别家多的一条硬约束。

## 下一步

- 未跑真实会话，阈值公式与层边界取自源码分析，换版本需重核。

## 参考

- <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>
- <https://code.claude.com/docs/en/sub-agents>
- [ReAct 循环在三类模型接口里的消息形态](../knowledge/react-loop-message-shapes.md)
