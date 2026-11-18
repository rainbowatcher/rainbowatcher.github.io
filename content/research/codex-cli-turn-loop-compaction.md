---
title: Codex CLI 的 turn 循环、沙箱审批与自动压缩
date: 2026-11-18
tags: [Agent, LLM, 源码阅读]
summary: 事件驱动的 turn/step 结构包住 Responses API 的 tool-calling 内核，压缩在窗口 90% 触发且可异步或远端执行，沙箱与审批是独立 crate 与决策层而不是提示词。
---

Codex 的循环本身很小，外壳全是为 steer 与恢复服务的。

- 外层 `run_turns` 是 `loop { run_turn }`，`has_pending_input` 为假才退出，中途 steer 会重开采样。
- 每次采样二选一：执行 function call 并回灌，或收 assistant message 结束。
- 压缩阈值 `context_window * 9 / 10`，与 `model_auto_compact_token_limit` 取小。

## 问题

仓库 docs 是跳转占位，没有架构文档，只能读源码（main 分支 `3dbc6f8`）。

## 候选

### 主循环

```text
loop { run_turn(session, input) }        // tasks/regular.rs
// run_turn: 采样 → 有 function call 就执行并回灌 → 否则本轮结束
// 提示由 build_prompt() 组装：ResponseItem 列表 + tools + parallel_tool_calls
```

走 Responses API（`/responses`），reasoning item 原样回放。

### 工具面

| 类别 | 内容                                                                                 |
| ---- | ------------------------------------------------------------------------------------ |
| 执行 | shell（含 PTY 模式）                                                                 |
| 编辑 | apply_patch                                                                          |
| 计划 | `update_plan`：只写 todo，不驱动执行；plan 是一等 `ModeKind::Plan`                   |
| 委派 | multi_agents：spawn / send_input / wait / close_agent / resume_agent，带派生深度限制 |
| 外部 | MCP 工具与 MCP resource 走同一套 tool router                                         |

### 压缩

| 触发                            | 动作                                                  |
| ------------------------------- | ----------------------------------------------------- |
| 窗口 90%                        | `compact.rs` 用 `SUMMARIZATION_PROMPT` 摘要后替换历史 |
| 开启 `Feature::AsyncCompaction` | `async_compaction.rs` 把压缩挪到后台                  |
| 远端支持 V2                     | `compact_remote_v2.rs` 把摘要放到服务端               |
| 单条压缩输入                    | `COMPACT_USER_MESSAGE_MAX_TOKENS = 20_000`            |

## 当前判断

- 本质是 ReAct 的工程化版本：控制权始终在模型手里，没有把任务拆成 DAG 的调度器。
- Session / TurnContext / Task 三层是为了支撑 steer 和断点恢复，不是为了编排。
- 沙箱与审批在 `sandboxing` crate 与 `tools/orchestrator.rs`：macOS Seatbelt，Linux Landlock + bubblewrap，`safety.rs` 返回 AutoApprove / AskUser / Reject。

## 下一步

- 未在本机跑，行号与文件名对应 main 分支 `3dbc6f8`，换版本需重核。

## 参考

- <https://github.com/openai/codex>
- [Claude Code 的查询循环、工具面与三层压缩](claude-code-query-loop-compaction.md)
