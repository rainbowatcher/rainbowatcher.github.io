---
title: pi 的最小主循环与扩展机制
date: 2026-11-18
tags: [Agent, LLM, 源码阅读]
subtitle: 刻意不做 sub-agent 与 plan mode，内核只有 read/bash/edit/write 四件套加会话、压缩、skill 与 RPC，缺的能力交给 extension 与 package，因此主循环是六家里最可审计的。
---

pi 的取舍是把「智能」放在提示词与扩展里，而不是编排机制里。

- README 原话：skips features like sub-agents and plan mode。
- 压缩在 `core/compaction/`：自动压缩加分支摘要。
- 定位是 SDK：interactive / print / json / rpc 四个入口共用同一个 `AgentSession`。

## 问题

极简内核能不能覆盖复杂任务，取决于扩展生态而不是内核本身。

## 候选

### 主循环

```text
AgentSession.sendUserMessage()
  → 流式取模型输出 → 解析 tool_call
  → read / bash / edit / write 执行并回填
  → 无 tool_call 则结束本轮
```

### 工具面

| 工具                       | 备注                                         |
| -------------------------- | -------------------------------------------- |
| read / bash / edit / write | 默认四项，`selectedTools` 可改               |
| powershell                 | Windows 上替代 bash                          |
| grep / find / ls           | 可选；不选则由 bash 代劳，系统提示会改写规则 |
| MCP                        | 外部工具一律走 MCP，不内置                   |

扩展面另算：`extensions/`、skills、prompt templates、Pi packages（npm 或 git 分发）、RPC 与 TS SDK。

### 压缩

| 机制     | 位置                                                                      |
| -------- | ------------------------------------------------------------------------- |
| 自动压缩 | `core/compaction/compaction.js`，用 `isContextOverflow` 判溢出            |
| 分支摘要 | `core/compaction/branch-summarization.js`，切分支时把被丢弃的历史压成摘要 |
| 超大输出 | `output-guard.js` 在进上下文前截断                                        |

## 当前判断

- 它是六家里唯一明确拒绝 sub-agent 与 plan mode 的，把这两项当上层可选项。
- 代价是复杂任务要自己搭，收益是内核确定性最高、最好审计。
- 分支摘要比别家的「单条时间线压缩」更贴代码库场景：回退一个分支不等于丢掉它。

## 下一步

- 未实测扩展包对主循环的侵入程度，也未跑过压缩触发。

## 参考

- <https://github.com/earendil-works/pi>
- [opencode 的会话循环、inbox 调度与压缩](opencode-session-inbox-compaction.md)
