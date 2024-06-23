import type { ParsedContent } from "@nuxt/content"

export const permalinkRE = /\w+\/\d{4}(\/\d{2}){2}\/.*?/

export function addPermalink(content: Array<Partial<ParsedContent>>) {
    return content.map((p) => {
        const date = p.date ? new Date(p.date) : new Date()
        const year = `${date.getFullYear()}`
        const month = `${date.getMonth() + 1}`.padStart(2, "0")
        const day = `${date.getDate()}`.padStart(2, "0")
        const filename = p._path?.split("/").at(-1)
        const permalink = `/posts/${year}/${month}/${day}/${filename}`
        console.debug(permalink)
        p.permalink = permalink
        return p
    })
}

export function toOriginPath(permalink: string) {
    if (permalinkRE.test(permalink)) {
        const hasStartSlash = permalink.startsWith("/")
        const slices = permalink.split("/")
        const parent = slices[hasStartSlash ? 1 : 0]
        console.debug(`/${parent}/${slices.slice(5).join("/")}`)
        return `/${parent}/${slices.slice(5).join("/")}`
    } else {
        return permalink
    }
}
