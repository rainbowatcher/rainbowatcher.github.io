/**
 * 做什么：内容管线共享类型：MDC 文档、博客列表项、知识条目、探索记录、经验条目与导航项。
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
    /** 构建期生成的 160 字以内纯文本摘要，列表卡片预览用，不含正文 MDC。 */
    excerpt?: string
    permalink: string
    tags: string[]
    title: string
} & ContentDocument

/** 知识条目：path 即路由（/knowledge/<slug>），section 决定它在索引页的归属分区。 */
export type Knowledge = ContentDocument & { section: string; title: string }

/** 探索地图：path 即路由（/explore/<slug>），记陌生领域是什么、有哪几条路径与各自状态，列表页展示 subtitle。 */
export type Explore = ContentDocument & { title: string }

/** 经验条目：path 即路由（/experience/<slug>），列表页需要 summary 做摘要。 */
export type Experience = ContentDocument & { summary?: string; title: string }

/** 「在用」条目：desc/side 是展示文案，href 缺失表示没有可点的链接。 */
export type UsesItem = {
    desc?: string
    href?: string
    name: string
    side?: string
}

/** 「在用」分区：id 同时是页内锚点，note 是标题后的序号。 */
export type UsesSection = {
    id: string
    items: UsesItem[]
    note?: string
    title: string
}

/** 「项目」条目：mark 是卡片上的两字缩写，status 是维护状态。 */
export type ProjectItem = {
    description?: string
    href: string
    mark?: string
    name: string
    status?: string
    tags?: string[]
}

export type NavigationItem = {
    path?: string
    permalink?: string
    title?: string
}
