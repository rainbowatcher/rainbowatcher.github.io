---
title: opencode 的会话循环、inbox 调度与压缩
date: 2026-11-18
tags: [Agent, LLM, 源码阅读]
subtitle: 提示词先 admit 进 inbox 再 wake 循环，输入排队与抢占是显式状态机而不是隐含行为；工具走文件、检索、执行、网络与 subagent，压缩由 Session.compact 与 admitCompaction 承担。
---

opencode 和别家最大的不同，是把「会话里多条输入怎么排队」当成一等问题。

- 不是「用户消息直接进循环」，而是 `admit` 进 inbox、`wake` 起循环、循环 drain 后调模型。
- steer / queue / interrupt / revert 四种输入语义各有状态字段。
- 结论取自 2.3.0 单文件二进制的符号串，精度低于源码级分析。

## 问题

发布物是编译后的单文件（`@opencode/cli` 只带二进制），没有可读源码，只能从服务名与字符串还原结构。

## 候选

### 主循环

```text
Session.prompt → inbox.admit(item) → wake(sessionID)
loop: drain inbox → 调模型 → 执行 tool call → 回填历史 → 再 drain
```

`tickInFlightPrompt`、`pendingLoopWakeup`、`consecutiveKeepalives` 三个字段描述的正是这条唤醒与占用状态。

### 工具面

| 类别 | 内容                                                            |
| ---- | --------------------------------------------------------------- |
| 文件 | read / write / edit / apply_patch（内部映射到 patch）           |
| 检索 | glob / grep                                                     |
| 执行 | bash / execute                                                  |
| 网络 | webfetch / websearch                                            |
| 委派 | subagent：可续聊、可指定 agent 类型与模型                       |
| 交互 | permission request：allow_once / allow_always / reject          |
| 模式 | plan mode（`hasExitedPlanMode`、`needsPlanModeExitAttachment`） |

二进制里还能看到 `cachedClaudeMdContent` 与 `CLAUDE_CODE_SUBAGENT_PROMPT_CACHE_TTL` 一类兼容层，说明它在向 Claude Code 的约定对齐。

### 压缩

| 触发                     | 动作                                                                           |
| ------------------------ | ------------------------------------------------------------------------------ |
| `/compact` 或 token 压力 | `Session.compact` → `admitCompaction({ delivery })` 把压缩任务排进 inbox       |
| 完成后                   | 生成 `type: "compaction"` 消息段替代旧历史，`pendingPostCompaction` 标记待续点 |

## 当前判断

- 把输入排队、抢占、打断做成显式状态机，换来的是弱网、多端、多人同时喂消息时不丢不串。
- 实现用 Effect 组织服务边界，职责清楚但阅读门槛高。

## 下一步

- 需要跑一次真实会话验证 inbox 的抢占与 keepalive 语义（未验证）。

## 参考

- <https://github.com/anomalyco/opencode>
- [Codex CLI 的 turn 循环、沙箱审批与自动压缩](codex-cli-turn-loop-compaction.md)
