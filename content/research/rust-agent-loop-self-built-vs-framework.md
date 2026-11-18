---
title: Rust agent 循环：自建与现成库的取舍
date: 2026-11-18
tags: [Agent, LLM, Rust]
summary: agent loop 建议自建（200–500 行），现成库只用在 provider 客户端与 tool schema；锁死单一供应商时 async-openai + schemars 比 Rig/AutoAgents 更可控，未实测。
---

结论是自建 loop，库只买 provider 与 schema 两层。

- loop 本体 200–500 行，成本全在压缩、错误分类、并发与取消。
- 框架省下头 1–2 天，抽象泄漏处一处不少。
- 要权限审批、可中断、可恢复时，loop 控制权就是产品本身。

## 问题

Rust 里搭 agent，主循环交给框架还是用 typed client 自建。依据是控制点是否属于产品，不是能省多少代码。

## 候选

| 方案                 | 定位                                            | 适合                             |
| -------------------- | ----------------------------------------------- | -------------------------------- |
| 自建 + async-openai  | typed client，指向任意 OpenAI 兼容端点          | 长会话、自定义编排、要审批与沙箱 |
| Rig                  | 20+ provider、trait-based、流式完整，有生产案例 | 跨供应商，或只借它的 provider 层 |
| AutoAgents           | actor model + 过程宏，ReAct 原生，WASM 工具隔离 | 愿意用重依赖换现成 ReAct         |
| swiftide / llm-chain | RAG pipeline / 维护停滞                         | 检索链路可看，通用 loop 不选     |

分层：HTTP、SSE、鉴权、重试计数交给 `async-openai`，tool schema 用 `schemars` 从 struct 生成，loop 与压缩、审批、取消自建。

## 当前判断

自建的代价集中在三处不变量：

- `assistant.tool_calls` 与 `tool` 结果必须严格一一对应，少一条或顺序错，兼容端点直接 400。用 `enum Message` 强约束，别用 `serde_json::Value`。
- 流式 tool call 的 arguments 是增量 fragment，按 `index` 聚合，`id` 可能后到。
- 错误分三类：可重试（429/5xx/网络）、不可重试（400、上下文超长）、可回灌给模型（工具失败包成 tool result）。

该用库：一次性脚本、纯 RAG、真需要 5 家以上 provider 频繁切换、团队不想碰协议细节。

## 下一步

- 未跑 Rig 的 `max_turns` 与流式接口，未测 AutoAgents 编译开销（二手：261 个 crate、debug 二进制 97MB），压缩阈值待按 token 预算实测。

## 参考

- [Rig](https://rig.rs/) / [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig)
- [rig 与 AutoAgents 实测对比（二手，2026-09）](https://zenn.dev/kai_kou/articles/1110-rust-ai-agent-framework-guide)
- [Best Rust Framework for Building AI Agents（二手，2026-10）](https://encore.dev/articles/best-rust-framework-for-building-ai-agents)
- [Rust AI Agent Frameworks 研究报告（二手，2026-03）](https://zylos.ai/en/research/2026-03-31-rust-ai-agent-frameworks-infrastructure/)
