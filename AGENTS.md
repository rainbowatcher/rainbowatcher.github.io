# AGENTS.md

本文档是本仓库所有 AI Agent（自主编程代理、协作助手、代码审查工具）的执行准则，所有操作与交付必须严格遵守。

当前项目处于**功能快速迭代期**：约定优先保证改动小、可审查、可回滚，不做与当前任务无关的重构。

## 1. 核心铁律

### 1.1 必须提交代码

- 每完成一项功能或修复立即 `git commit`，严禁改完不提交就结束任务。
- 一次提交只包含一个逻辑事项（脚手架 / UI / 功能 / 依赖 / 文档分开），无关改动拆成多个提交。
- 提交前必须通过格式校验与 lint；涉及构建链路（nuxt.config、modules、内容管线）的改动还要能 `pnpm generate`。
- 提交信息遵循 **Conventional Commits**：`feat` / `fix` / `refactor` / `docs` / `test` / `chore` / `style` / `perf` / `build`。

### 1.2 工具与依赖

- 调用本地工具一律 `pnpm exec <bin>`（如 `pnpm exec oxlint`）。
- 禁用 `npx`：它会静默下载非锁定版本，且 npm 无法在这套 pnpm 隔离布局上工作。
- 新增依赖前先确认现有依赖能否满足；锁定文件（`pnpm-lock.yaml`）随依赖变更一起提交。
- **幽灵依赖是明确接受的**：`shamefullyHoist: true` 让 nuxt / @nuxtjs/mdc / unocss / shiki 的传递依赖（如 `@nuxt/kit`、`defu`、`ufo`、`unist-util-visit`、`@shikijs/langs`）可直接 import。不为它们声明版本，版本由上游决定，避免两份副本与独立漂移。
- knip 的 `unlisted` 结果只作审计参考，不进 CI 门禁；需要 fail-loud 时应关闭 `shamefullyHoist` 并全面声明，而非挑选部分声明。
- `.agents/skills/**` 里由 `skills-lock.json` 登记的是 skills CLI 装的第三方技能，属 vendored 代码：不进 `pnpm fmt` / `pnpm lint`（ignorePatterns 已排除），不要手改，升级用 `skills update`（同步重写哈希）。`.agents/skills/knowledge-writing/` 是自有写作规范，直接改，不登记进 lock。

### 1.3 文件头注释

**位置**：文件头注释是文件的第一个 token，位于所有 import 之前。写在 import 之后的块注释只是普通注释，不算文件头注释。

**范围**：手写源码（`.ts` / `.vue` 等）。生成物、纯 `export *` 汇总文件可豁免。

**篇幅**：`/**` 到 `*/` 计入行数与字符数（含空行与定界符），上限 10 行、500 字符。超限说明职责过多，先拆模块再写注释；仅常量表、类型清单可退化为一行说明。

**内容**：四段，没有的段落直接省略，不凑字数。

```ts
/**
 * 做什么：一句话说明职责。
 * 状态与生命周期：内部维护什么、谁创建、何时失效。
 * 取舍与不变量：非显然的选择与必须成立的前提。
 * 边界：明确不负责什么。
 */
```

模块入口（`index.ts` 等）：做什么 = 对外导出什么，边界 = 不负责什么。

**禁止废话**：不写 `@author`、`@date`、`@filename` 等元数据标签；不写变更史、时间状语、评审与文档编号、复述代码。

**篇幅守恒**：改写时新增一行就删掉一行过期描述；宁可留一句旧事实，也不要为了「最新」扩写。

**自查**：`head -12 <file>` 能否回答「这文件干什么、不干什么」。

### 1.4 语言约定

- 代码注释、测试标题、文档内容（`README.md`、`AGENTS.md`、`docs/`）统一使用中文。
- 不翻译：代码标识符、类型名、配置键名、环境变量名、第三方 API 名与第三方错误信息保持原文。
- 一次改到位：新增或修改的注释、测试标题必须为中文，不得新增英文注释。

### 1.5 单文件行数

- 非测试源码单文件不得超过 **500 行**，超限即视为违规，必须拆分为子模块、子组件或提取纯函数工具。
- 新增需求若预期超过上限，提前规划拆分，而不是写完再拆。

### 1.6 代码组织与单一职责

- 一个文件 = 一项功能，一个文件夹 = 一个模块。
- 禁止用文件名前缀区分模块（如 `post-*`、`user-*` 这类分组），禁止单体大文件。
- 每个文件、函数只做一件事：状态与副作用分离，纯计算与 IO 分离。
- 禁止把互不相干的类型定义、工具函数、网络请求、UI 渲染堆在同一个文件里。

### 1.7 模块说明

- 新增模块目录必须包含 `index.ts` 或 `README.md`，写明该模块的职责与边界。
- 目录复杂到需要图（架构、流程、数据流）才能讲清时，必须提供 `README.md`（推荐 Mermaid）。

### 1.8 样式分层

- 颜色、字体、圆角只在 `app/styles/tokens.css` 定义，`uno.config.ts` 把它们映射成工具类；组件不写十六进制色值。
- 工具类表达不了的规则（伪元素、交叉渐变、正文后代选择器、第三方皮肤）才落到 `app/styles/` 的其余文件，层叠顺序由 `nuxt.config.ts` 的 `css` 数组决定（reset → uno.css → index.css）；`index.css` 内部按 tokens → animations → base → prose → docsearch 汇总。

### 1.9 文章写入

- 写 `content/` 下任何 markdown 之前，必须先读 `.agents/skills/knowledge-writing/SKILL.md`；阶段、小节、frontmatter 与引用规则以它为准，本文件不重复。
- 用户只说“写一篇文章”时，默认落 `content/` 并按类型选目录（速查 → `knowledge/`、本机探索 → `explore/`、实践总结 → `experience/`、第一人称过程 → `posts/`、想法草稿 → `research/`），不写仓库根、`docs/` 或其他位置，也不反问放哪；只有用户指明别的目录才例外。

## 2. 仓库结构与内容数据流

```
content/                  markdown 唯一内容源
  knowledge/              长期维护的速查，平铺不建子目录
  explore/                本机环境探索记录，结论依赖机器与版本
  experience/             本机实践验证过的系统总结
  research/               研究草稿，允许并列方案与「未验证」
  posts/                  第一人称过程与教训
  {home,uses,projects}.md 数据源，只读 frontmatter
  hide/                   永不发布的草稿
modules/                  构建期 Nuxt 模块
  static-content.ts       扫描 content/ → public/_content/*.json + manifest.json
  content-parser.ts       复刻 @nuxt/content v3 解析管线 → MDC AST
app/                      pages / components / composables / layouts / utils / styles
public/                   静态资源
```

- 数据流单向：`content/**.md` → `static-content.ts` → `public/_content/`（生成物，禁止手改，dev watcher 重建、构建全量重写）→ `queryContents.ts` → 页面；不引入 `@nuxt/content` 运行时。
- 目录即阶段，禁止跳级与一稿多放，晋升只用 `git mv`：想法 → `research/`；本机跑通过 → `experience/`；脱离本机仍成立 → `knowledge/`；带第一人称过程 → `posts/`；只在本机成立 → `explore/`。写法按 1.9 先读规范。
- 每个内容目录各走同名路由与 `manifest.<name>` 列表，不手写 `index.md`；`research/`、`explore/` 页面固定标注草稿与环境依赖。
- `knowledge/` frontmatter 必填 `title` / `section`（取值见 `app/utils/knowledge.ts` 的 `SECTION_ORDER`）/ `tags` / `date`，可选 `subtitle` / `updated`；某分区涨到 8 条以上再提为子目录，`section` 契约不变。
- `home.md` / `uses.md` / `projects.md` 只读 frontmatter 结构化字段（读取点见 `app/pages/index.vue` / `uses.vue` / `projects.vue`），不渲染正文；新增工具或项目只改这三份。
- 解析行为（插件顺序、Shiki 主题、toc 深度）改动必须同步 `nuxt.config.ts` 与 `modules/content-parser.ts`，否则预渲染 HTML 会漂移。

## 3. 研发与交付流程

```
1. 需求分析与模块设计  → 评估文件行数与职责边界
2. 编写/修改代码        → 为每个源码文件补合规头注释
3. 验证                → fmt:check / lint /（必要时）generate
4. 提交                → 单个逻辑事项一次 commit
```

质量检查命令：

```bash
pnpm fmt          # 格式化（oxfmt）
pnpm fmt:check    # 格式校验
pnpm lint         # 代码检查（oxlint）
pnpm lint:fix     # 自动修复
pnpm typecheck    # 类型检查（nuxi + golar）
pnpm generate     # 全量构建，验证 prerender 与内容管线
pnpm check        # 检查 content/ 中的外部链接（lychee）
pnpm content:check # 校验 frontmatter 必填项、date 格式、tags 与相对链接
```

## 4. 提交前自查清单

- [ ] 已执行 `git commit`，工作区干净？
- [ ] 新增/修改的源码文件顶部有头注释，且符合位置、篇幅与四段要求？
- [ ] 注释、测试标题与文档均为中文，标识符与第三方名称未被翻译？
- [ ] 没有文件超过 500 行？
- [ ] 新增模块目录有 `index.ts` 或 `README.md` 说明职责？
- [ ] 未手改生成物（`public/_content/`、`.nuxt/`、`.output/`、`dist/`）？
- [ ] 写 `content/` 前已读 `.agents/skills/knowledge-writing/SKILL.md`，文章符合其阶段、小节与引用规则？
- [ ] `pnpm fmt:check`、`pnpm lint` 通过，`pnpm typecheck` 无新增错误；构建相关改动已跑 `pnpm generate`？
