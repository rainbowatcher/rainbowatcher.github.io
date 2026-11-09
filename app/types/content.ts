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

export type NavigationItem = {
    path?: string
    permalink?: string
    title?: string
}
