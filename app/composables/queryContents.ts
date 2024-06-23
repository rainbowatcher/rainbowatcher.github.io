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

// export function usePostNav(): (page: PageItem) => PageNav {
//     useNavigatorLanguage
// }
