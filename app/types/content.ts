/**
 * 做什么：内容管线共享类型：MDC 文档、博客列表项、知识库条目、研究报告、专题与导航项。
 * 状态与生命周期：纯类型声明，无运行时副作用。
 * 取舍与不变量：ContentDocument 保留 frontmatter 的宽松形状，列表类型只收窄不裁剪。
 * 边界：不描述 public/_content/manifest.json 的结构，也不做运行时校验。
 */

export type MdcRoot = {
    children: unknown[]
    type: string
}

export type ContentDocument = {
    _path?: string
    [key: string]: unknown
    body?: unknown
    date?: string
    description?: string
    headerImage?: string
    id?: string
    layout?: string
    path: string
    permalink?: string
    subtitle?: string
    tags?: string[]
    title?: string
}

export type Post = {
    date: string
    permalink: string
    tags: string[]
    title: string
} & ContentDocument

/** 知识库条目：path 即路由（/notes/<slug>），section 决定它在索引页的归属分区。 */
export type Note = ContentDocument & { section: string; title: string }

/** 研究报告：path 即路由（/research/<slug>），不需要时间永久链接。 */
export type Research = ContentDocument & { title: string }

/** 专题：path 即路由（/topics/<slug>），列表页需要 summary 做摘要。 */
export type Topic = ContentDocument & { summary?: string; title: string }

export type NavigationItem = {
    path?: string
    permalink?: string
    title?: string
}
