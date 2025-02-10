export type PageItem = {
    _path?: string
    date: string
    permalink: string
    tags?: string[]
    title?: string
}

export function usePosts() {
    return () => queryCollection("posts")
        // .select("tags", "date", "title")
        .order("date", "DESC")
        .all()
        .then(addPermalink)
}

export function usePost(path: string) {
    return () => queryCollection("posts")
        .path(path)
        .first()
}

export function useNavItems() {
    return () => queryCollection("posts")
        // .select("tags", "date", "title")
        .order("date", "DESC")
        .all()
        .then(toNavItems)
}
