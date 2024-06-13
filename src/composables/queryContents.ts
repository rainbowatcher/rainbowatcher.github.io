import type { ParsedContent } from "@nuxt/content/types"

export type PageItem = {
    _path?: string
    date: string
    permalink: string
    tags?: string[]
    title?: string
}

export function usePosts() {
    return () => queryContent("posts")
        .only(["tags", "date", "title", "_path"])
        .sort({ date: -1 })
        .find()
}

export function addPermalink(content: Array<Partial<ParsedContent>>) {
    return content.map((p) => {
        const date = p.date ? new Date(p.date) : new Date()
        const year = `${date.getFullYear()}`
        const month = `${date.getMonth() + 1}`.padStart(2, "0")
        const day = `${date.getDate()}`.padStart(2, "0")
        const filename = p._path?.split("/").at(-1)
        const permalink = `/posts/${year}/${month}/${day}/${filename}`
        p.permalink = permalink
        return p
    })
}
// export function usePostNav(): (page: PageItem) => PageNav {
//     useNavigatorLanguage
// }
