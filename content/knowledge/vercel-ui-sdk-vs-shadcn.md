---
title: Vercel UI SDK 与 shadcn/ui：从组件源码到行为原语
date: 2026-11-17
tags: [React, 组件库, Agent]
section: 工具
subtitle: shadcn 主笔的两个抽象层 —— shadcn/ui 把组件源码复制进项目，UI SDK 把焦点、键盘、弹层等交互行为做成跨框架原语交给 agent 组合；结论基于 0.1.0-beta 实测
---

## 要点

只比较交付单位与组合方式，不比较视觉质量与性能基准；先澄清一点，`vercel-labs/ui` 的 465 次提交来自 shadcn 本人，UI SDK 不是 shadcn/ui 的竞品，而是同一套交互正确性下移一层的结果。

- shadcn/ui 交付组件源码：CLI 从 registry 把组件文件复制进仓库，行为来自可插拔的 base library（Radix / Base UI / React Aria），样式是 Tailwind 与 CSS 变量。拿到的是能直接改的成品。
- UI SDK 交付行为原语：`@ui-sdk/core` 提供 `createPopup`、`createRovingFocus`、`createSelection` 这类交互能力，Primitive 一次定义，React / Vue / Svelte / Solid / Web Components 五套适配器各自渲染。组件是 agent 按需拼出来的。
- 所以「agent 都能写 UI 了，组件库还有啥用」的答案是组件库下沉成行为层，并多出一条运行时通道（`createAgent` 的 `snapshot` / `act`），让 agent 直接读组件状态、调 action，而不是截图后点页面。

## 机制

两套库都在解决交互正确性，但把正确性封装在不同的层。仓库在 Vercel Labs 名下，贡献最多的是 shadcn，因此下面的差异是同一设计取向在不同抽象层上的取舍，不是阵营之争。

**shadcn/ui 的链条**：`components.json` 声明框架、别名、base library → CLI 按 registry 校验并复制源码 → 项目里的 `components/ui/*.tsx` 成为唯一事实。复制之后上游修复不再自动到达，重跑 CLI 或手工合并 diff 才会更新；换来的是任意改源码，且没有 UI 运行时包。

**UI SDK 的链条**：行为在 core，渲染在适配器，组件只是预设组装。

1. `@ui-sdk/core` 负责焦点、键盘导航、选择、弹层关闭、拖放、缩放、虚拟化与对应的 ARIA，根入口实测导出 117 个符号，其中 36 个是 `create*` 行为工厂。
2. Primitive 把状态、动作与插槽写在一起：`state()` 给初始状态，`api(context)` 暴露动作，`slots(slot)` 声明 part 的 `attrs`、事件与 `press` 行为。
3. 适配器用 `createParts(primitive, { part: "tag" })` 把 part 映射成宿主框架组件，行为逻辑不重复实现。
4. 组件自身不带样式，定制靠 `data-slot`、状态属性与 CSS 变量；`@ui-sdk/core/web.css` 只提供可选默认外观，全局样式需声明 `@layer ui-sdk`。
5. 行为修复随 npm 版本进入，不需要手工合并上游 diff；代价是无法像 shadcn 那样直接改实现。

**给 agent 的两条通道**：

- 写：skill 与 Markdown 文档随包发布在 `node_modules/@ui-sdk/<framework>/docs/`，agent 读到的总是项目锁定的版本。缺组件时组合行为，而不是从模板里找现成件；testing kit 用来验证键盘、焦点与 ARIA。
- 用：页面渲染前 `createAgent()`，渲染后 `agent.snapshot()` 返回 `{ ref, component, label, value, actions }`，再用 `agent.act({ steps: [{ ref: "Project name", action: "setValue", args: ["Atlas"] }] })` 执行。动作走组件 API 与 change 回调，应用可用 `allow` 审批、用回调里的 `source: "agent"` 拦截。

bridge 能按 `label` 定位控件，前提是每个控件都有名字。skill 里「每个控件都要有 label 或 `aria-label`」的规则，同时服务读屏用户和 agent —— 可访问性在这里直接变成可操作性。

## 规则与取值

| 维度         | shadcn/ui                                           | UI SDK                                              |
| ------------ | --------------------------------------------------- | --------------------------------------------------- |
| 交付单位     | 组件源码，复制进仓库                                | 行为原语与预组装组件，留在 npm 包                   |
| 运行时依赖   | 无 UI 运行时包，仍需 base library 与 Tailwind       | `@ui-sdk/core` 零依赖，组件按入口引入               |
| 升级路径     | 重跑 CLI 或手工合并上游 diff                        | 升级包版本，行为修复随包到达                        |
| 定制方式     | 直接改组件源码                                      | 组合 behavior，靠 `data-slot`、状态属性、CSS 变量   |
| 行为来源     | 可插拔 base library（Radix / Base UI / React Aria） | `@ui-sdk/core` 自带                                 |
| 框架         | React 生态（Next.js、Vite、Remix、Astro 等）        | React / Vue / Svelte / Solid / Web Components       |
| agent 的角色 | skill 与 MCP 负责找组件、装组件、按组合规则写页面   | skill 负责组合行为与测试；bridge 负责运行时读写状态 |

## 示例

同一份 primitive，换适配器不改定义。在一个临时目录里装依赖：

```bash
mkdir -p /tmp/ui-sdk-probe && cd /tmp/ui-sdk-probe
pnpm init
pnpm add @ui-sdk/core @ui-sdk/react @ui-sdk/vue react react-dom vue @vue/server-renderer
```

定义静音按钮，再用 React 与 Vue 各渲染一次：

```js
// mute-button.mjs
import { definePrimitive } from "@ui-sdk/core"

export const muteButton = definePrimitive({
    name: "mute-button",
    state: () => ({ muted: false }),
    api: (context) => ({
        toggle: () => context.store.set({ muted: !context.store.get().muted }),
    }),
    slots: (slot) => ({
        root: slot({
            attrs: (state) => ({ type: "button", "aria-pressed": String(state.muted) }),
            press: ({ api }) => api.toggle(),
        }),
    }),
})
```

```js
// probe-react.mjs
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createParts } from "@ui-sdk/react/primitive"
import { muteButton } from "./mute-button.mjs"

const parts = createParts(muteButton, { root: "button" })
console.log(renderToStaticMarkup(createElement(parts.Root, null, "Mute")))
```

```js
// probe-vue.mjs
import { createSSRApp, h } from "vue"
import { renderToString } from "@vue/server-renderer"
import { createParts } from "@ui-sdk/vue/primitive"
import { muteButton } from "./mute-button.mjs"

const parts = createParts(muteButton, { root: "button" })
const app = createSSRApp({ render: () => h(parts.Root, null, { default: () => "Mute" }) })
console.log(await renderToString(app))
```

两个脚本的 SSR 输出逐字相同：

```html
<button data-slot="mute-button" type="button" aria-pressed="false">Mute</button>
```

`data-slot` 与 `aria-pressed` 由 core 的行为产生，适配器只做绑定 —— 这就是「行为不重复实现」的具体形态，也是 agent 可以只写接线、不碰交互细节的原因。

## 与相邻概念的区别

| 概念                         | 差别                                                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Radix / Base UI / React Aria | 同样是 headless，但单位是组件（Root / Trigger / Content），绑定单一框架；UI SDK 的单位是行为，同一个 primitive 能渲染到五个栈 |
| MUI / Ant Design             | 运行时包，行为与样式一起封装，定制靠主题与 props，抽象层级最高                                                                |
| shadcn/ui                    | 组件源码复制进项目，行为外包给 base library；UI SDK 把行为收回自己维护，源码不再进仓库                                        |

用家具打比方：MUI 是买成品，shadcn 是买可改的成品加图纸，UI SDK 是买榫卯和五金件自己装。

## 边界

- 0.1.0-beta。npm 上 `@ui-sdk/core` 的 latest 为 `0.1.0-beta.6`，本文实测 `0.1.0-beta.5`；受 Vercel public beta 条款约束，API、文档与行为都可能变。
- 无样式意味着设计系统仍要自建，`web.css` 只是默认外观；迁移成本主要在这里，不在行为层。
- bridge 需要 agent 侧接入（MCP、WebMCP 或自建工具），且 `createAgent` 必须在页面渲染前调用，权限要在 `allow` 里自己写。
- 官方 benchmark（React 列：tool calls 17 → 7，tokens 291.7k → 69.5k，cost $0.139 → $0.044）由 Vercel 自测，只能说明 bridge 比浏览器工具省，不能当独立第三方结论。
- agent 读文档有 token 成本：skill 要求只读相关页面，`core.md` 超过 300KB。
- 组件数量与生态远小于 shadcn/ui，生产项目建议先在新页面试用，不要整体替换。

## 参考

- [UI SDK 文档](https://ui-sdk.dev/docs)
- [vercel-labs/ui](https://github.com/vercel-labs/ui)
- [Built for Agents：bridge 与 benchmark](https://ui-sdk.dev/docs/agents)
- [shadcn/ui Skills](https://ui.shadcn.com/docs/skills)
- [shadcn/ui MCP Server](https://ui.shadcn.com/docs/mcp)
