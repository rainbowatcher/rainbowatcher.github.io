---
title: Hermes Agent 的单轮会话循环、工具面与后台复盘
date: 2026-11-18
tags: [Agent, LLM, 源码阅读]
summary: 经典单轮 tool-calling 循环加 IterationBudget 限轮，外围是巨型工具面、多平台 gateway 与每轮结束后的后台复盘 fork，MoA 只是按轮开关，不改变循环归属。
---

Hermes 的循环很小，外围极重，读它要先切开这两层。

- `run_conversation` 驱动一次用户轮：模型调用 → 工具分发 → 重试/降级 → 压缩 → 后置钩子。
- `IterationBudget` 兜住轮次上限，防死循环与费用失控。
- 自沉淀靠 `background_review.py` 每轮 fork 一个复盘 agent，不是运行时自动写技能。

## 问题

`agent/` 目录有数百个模块，主循环与外围耦合在同一个文件中，容易被外围体量误导。

## 候选

### 主循环

```text
run_conversation(agent, messages)          // agent/conversation_loop.py
  while budget.remaining():
      resp = call_model()
      if resp.tool_calls: dispatch → 回填 → continue
      break
  后置：压缩、memory 同步、后台复盘
```

### 工具面

| 类别 | 内容                                                                                              |
| ---- | ------------------------------------------------------------------------------------------------- |
| 执行 | bash 与文件编辑类工具                                                                             |
| 浏览 | CDP、lightpanda、camofox 三套浏览器后端                                                           |
| 审批 | `approval*.py` 一组模块，按风险分层拦截                                                           |
| 异步 | async_delegation：把长任务转后台                                                                  |
| 外部 | MCP client、ACP adapter、gateway（Telegram 等）                                                   |
| 技能 | `skills/` 下按领域分 12 组：apple、devops、email、research、social-media、software-development 等 |

### 压缩

| 模块                                | 作用                                                  |
| ----------------------------------- | ----------------------------------------------------- |
| `agent/conversation_compression.py` | 会话级压缩，多段循环处理溢出与分块                    |
| `trajectory_compressor.py`          | 轨迹压缩，给复盘与记忆用                              |
| `agent/moa_loop.py`                 | MoA：每次迭代前收集参考模型上下文，主循环仍管工具调用 |

## 当前判断

- 它的重心不在编程而在常驻代理：多平台入口、审批分层、按领域的技能库。
- MoA 与压缩都是循环外的装饰，主循环本身与 2023 年的 tool-calling 没差别——真正的增量在 `background_review` 这条自我复盘支线。

## 下一步

- 未跑真实会话，压缩与复盘的触发条件需实测。

## 参考

- <https://github.com/NousResearch/hermes-agent>
- [DeepSeek Harness 的插件图、goal 续跑与压缩](dsh-plugin-graph-goal-compaction.md)
