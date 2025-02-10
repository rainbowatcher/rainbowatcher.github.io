import type { ContentNavigationItem, PostsCollectionItem } from "@nuxt/content"

export const permalinkRE = /\w+\/\d{4}(\/\d{2}){2}\/.*?/

export function addPermalink(content: PostsCollectionItem[]): PostsCollectionItem[] {
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

export function toNavItems(content: PostsCollectionItem[]): ContentNavigationItem[] {
    const items = addPermalink(content)
    return items.map(i => ({
        path: i.path,
        permalink: i.permalink,
        title: i.title,
    }))

}
