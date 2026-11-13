---
name: knowledge-writing
description: >-
    本仓库文章写作规范，写 content/ 下任何 markdown 之前必须先读：新建、改写、晋升阶段、加站内引用、
    改 frontmatter 都适用。约定生命周期 content/research（草稿）→ content/experience（实践过）→
    content/knowledge（沉淀）、每阶段固定小节、相对 .md 引用与行数预算；文章先给 agent 读，其次给人读。
---

# 知识库写作

## 何时必须使用

- 写入 `content/` 下任何 markdown 之前：新建、改正文、改 frontmatter、加站内引用、`git mv` 晋升。
- 判断一篇该进 `research/`、`experience/` 还是 `knowledge/`。
- 只读代码、不改 `content/` 时不必读。

## 阶段

| 目录                   | 阶段        | 可以写                               | 晋升条件                       |
| ---------------------- | ----------- | ------------------------------------ | ------------------------------ |
| `content/research/`    | 研究（草稿） | 未验证判断、并列方案、待验证清单     | 真实执行过一次，能收敛出结论   |
| `content/experience/`  | 经验        | 本机验证过的结论、命令、环境、失败路径 | 脱离本机仍成立，且能与别的经验合并 |
| `content/knowledge/`   | 知识        | 可复用结论、用法、边界               | 终态                           |

- 晋升：`git mv content/<旧>/<slug>.md content/<新>/<slug>.md`，删掉过程段落，`date` 改成晋升日。
- 默认落库：写作一律落 `content/`，按上表选目录；不写仓库根、`docs/` 等别处，也不反问放哪。阶段不明先落 `research/`，验证或收敛后再 `git mv` 晋升。
- 不在阶段表里的集合按性质直接落：第一人称过程 → `posts/`，本机环境探索 → `explore/`，永不发布 → `hide/`。
- 证据不搬家：知识引用经验、经验引用研究，不复制它们的段落。
- 结论失效：文首写「已失效（YYYY-MM-DD）」并链到替代文章，不删文——agent 需要知道这条路是错的。

## 写作

冲突时按序号取舍：

1. 一篇一个问题。标题就是问题或结论，不写「浅谈」「详解」「入门」。
2. 前 5 行给结论：一句话回答 + ≤3 条要点；读完这段可以不读正文。
3. 能引用就不复述：一条命令、一个版本号、一个结论只存在一处，其余位置给链接。
4. 段落 = 断言 + 依据；没有依据就写 `未验证`。
5. 表格优于长段，命令优于描述；命令要能直接粘贴，不写 `...`。
6. 行数预算：research ≤ 40、experience ≤ 120、knowledge ≤ 200。超了先拆文。
7. 环境只写一处（系统 / 版本 / 日期）；knowledge 通常不需要环境。
8. 不写导语与总结段，不复述输出全文，不贴长日志（贴命令或路径）。

## frontmatter

| 集合       | 必填                              | 可选                |
| ---------- | --------------------------------- | ------------------- |
| research   | `title` `date` `tags`             | `summary` `subtitle` |
| experience | `title` `date` `tags`             | `summary` `subtitle` |
| knowledge  | `title` `date` `tags` `section`   | `subtitle` `updated` |

- `date`：当前阶段的成稿日，`YYYY-MM-DD`，不加引号。
- `tags`：行内数组，复用已有标签，不自造同义词。
- `section`：只能是 `基础` / `语言` / `系统` / `工具`（`app/utils/knowledge.ts`）。
- `summary`：一句话结论 + 边界，列表页直接展示，不写「本文介绍」。
- `posts/`、`explore/`、`hide/` 的必填字段见 `scripts/check-content.mjs`，本表不管。

## 小节

同一阶段用同一组 H2，agent 靠标题切片；额外内容放在这组之后。

- research：`## 问题` `## 候选` `## 当前判断` `## 下一步` `## 参考`
- experience：`## 结论` `## 环境` `## 做法` `## 边界与失败` `## 证据`
- knowledge：`## 要点` `## 用法` `## 边界` `## 参考`

## 引用

- 站内写相对 `.md` 链接：`[Linux 简介](../knowledge/linux-intro.md)`。渲染时转成路由，`pnpm content:check` 校验文件存在。
- 链接文字用目标标题，不写「这里」「上文」「另一篇」。
- 站外只引官方文档、源码、issue；二手博客只作研究阶段的线索，并注明来源性质。
- 引用前确认目标还在：`ls content/<集合>/`。

## 读写顺序

- 读：`title` + `summary` → 结论/要点 → 边界 → 引用。四步够用就不读全文。
- 写：查重 `rg -l "<关键词>" content/{research,experience,knowledge}` → 选阶段 → 套 `templates/<阶段>.md` → `pnpm content:check`。
- 命中已有文章就改那一篇，不新建。

## 边界

- 阶段表只管 `research/` / `experience/` / `knowledge/`；`posts/` / `explore/` / `hide/` 不适用阶段，但仍受「写作」「引用」两节约束。
- 不管页面、样式与渲染；正文只用 GFM 与已注册的 MDC 组件。
- 旧文不批量改写；下次改到哪篇，再把它对齐到最近的一组小节。
