type PageItem = {
    _path?: string
    date: string
    permalink: string
    tags?: string[]
    title?: string
}

export function usePosts(): () => Promise<PageItem[]> {
    return () => queryContent("posts")
        .only(["tags", "date", "title", "_path"])
        .sort({ date: -1 })
        .find()
        .then(posts => posts.map((p) => {
            const date = p.date ? new Date(p.date) : new Date()
            const year = `${date.getFullYear()}`
            const month = `${date.getMonth() + 1}`.padStart(2, "0")
            const day = `${date.getDate()}`.padStart(2, "0")
            const filename = p._path?.split("/").at(-1)
            const permalink = `/posts/${year}/${month}/${day}/${filename}`
            return { ...p, permalink }
        }))
}undefined
