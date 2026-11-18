---
title: DeepSeek Harness 的插件图、goal 续跑与压缩
date: 2026-11-18
tags: [Agent, LLM, 源码阅读]
subtitle: 没有写死的主循环，循环本身由 profile 里的 bundle 行拼出来；goal 与 goal-round-driver 提供跨轮次自动续跑，压缩由 basic 摘要与 tool-result-pruner 裁剪两层分担。
---

DSH 的「范式」是配置项而不是代码路径：能力即插件，装什么就有什么。

- `dsh-base` 是一份 `cordis.patch.yml`，每插入一行就多一项能力，profile 决定装哪些。
- 六家里唯一有「无人值守续跑」原语的：目标未完成就自动开下一轮。
- 压缩分两层：摘要置换历史加工具结果裁剪。

## 问题

可组合意味着没有单一答案，同一个 harness 在不同 profile 下行为不同，描述它必须绑定具体组合。

## 候选

### 主循环

```text
pre-step 注入（time-context / session projection / working_directory）
  → 模型调用 → 工具执行 → 结果写进持久 session 日志
  → 空闲后 goal-round-driver 判断是否续跑下一轮
```

轮次不靠 while 循环保住，靠会话日志与 projection 让每一轮都能从落盘状态重开。

### 工具面

| 类别 | 内容                                                           |
| ---- | -------------------------------------------------------------- |
| 文件 | read / write / edit / glob / grep，另有可选 str_replace_editor |
| 执行 | bash 与 pwsh，各自带对应 sandbox 版本，按平台挂载              |
| 网络 | web_search / web_fetch                                         |
| 委派 | subagent / subagent_fork / send_message / workflow             |
| 任务 | todo_write / goal / schedule（cron 任务）/ jobs（后台作业）    |
| 交互 | ask_user_question / present / skill / plugin_manager           |

`workflow` 把多 agent 扇出做成模型可调用的工具：模型写一段 JS 编排脚本，用 `pipeline`、`parallel`、`phase` 组织子 agent 并返回 JSON。

### 压缩

| 包                                | 触发                          | 动作                                               |
| --------------------------------- | ----------------------------- | -------------------------------------------------- |
| dsh-compaction-tool-result-pruner | 压缩前                        | 先裁超大工具输出，避免单条结果吃掉摘要预算         |
| dsh-compaction-basic              | token 压力 / 413 / `/compact` | 把最旧历史摘成一段，保留近期消息；413 后压缩并重试 |

工具结果裁剪与摘要分开是有意的：工具输出几乎总能裁，历史不能。

## 当前判断

- goal-round-driver 只在轮次真正进入模型历史时消耗配额，耗尽时记 blocker——配额化的自主性，别家没有对应物。
- 代价是可观测性差：同一份描述换一个 profile 就不成立。

## 下一步

- 需要跑一次 goal 配额耗尽路径，看 blocker 的实际落盘形态（未验证）。

## 参考

- [dsh 上下文注入机制：pre-step 追加消息与 time-context 排程](dsh-context-injection.md)
- [pi 的最小主循环与扩展机制](pi-agent-minimal-loop-extensions.md)
