import type { NavigationItem, Post } from "~/types/content"

export const permalinkRE = /\w+\/\d{4}(\/\d{2}){2}\/.*?/

export function addPermalink(content: Post[]): Post[] {
    if (content.at(0)?.permalink) return content
    return content.map((p) => {
        const date = p.date ? new Date(p.date) : new Date()
        const year = `${date.getFullYear()}`
        const month = `${date.getMonth() + 1}`.padStart(2, "0")
        const day = `${date.getDate()}`.padStart(2, "0")
        const filename = p.path?.split("/").at(-1)
        const permalink = `/posts/${year}/${month}/${day}/${filename}`
        p.permalink = permalink
        return p
    })
}

export function toOriginPath(permalink: string) {
    if (permalinkRE.test(permalink)) {
        const hasStartSlash = permalink.startsWith("/")
        const slices = permalink.split("/")
        const parent = slices[hasStartSlash ? 1 : 0]
        return `/${parent}/${slices.slice(5).join("/")}`
    } else {
        return permalink
    }
}

/** 静态托管会把无尾斜杠 URL 301 到 <path>/index.html，匹配文档前先用它归一掉尾部斜杠。 */
export function normalizePath(path: string) {
    return path.length > 1 ? path.replace(/\/+$/, "") : path
}

export function toNavItems(content: Post[]): NavigationItem[] {
    const items = addPermalink(content)
    return items.map((i) => ({
        path: i.path,
        permalink: i.permalink,
        title: i.title,
    }))
}
