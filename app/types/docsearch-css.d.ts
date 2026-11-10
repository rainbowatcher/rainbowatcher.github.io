/**
 * 做什么：为 `@docsearch/css` 补模块声明，供 SearchBar 在客户端动态 import 样式。
 * 状态与生命周期：仅类型层，无运行时代码。
 * 取舍与不变量：该包没有导出 `.d.ts`，TS 无法解析样式入口，故在此显式声明。
 * 边界：只声明样式入口；`@docsearch/js` 自带类型，不在此列。
 */

declare module "@docsearch/css"
