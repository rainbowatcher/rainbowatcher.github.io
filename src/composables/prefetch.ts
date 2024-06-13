import { hasWindow } from "std-env"

const hasFetched = new Set<string>()
const createLink = () => document.createElement("link")

function viaDOM(url: string) {
    const link = createLink()
    link.rel = "prefetch"
    link.href = url
    document.head.append(link)
}

function viaXHR(url: string) {
    const req = new XMLHttpRequest()
    req.open("GET", url, req.withCredentials = true)
    req.send()
}

let link
export function usePrefetch(url: string) {
    if (hasFetched.has(url)) return
    if (hasWindow) {
        link = createLink()
        hasFetched.add(url)
        if (link.relList?.supports?.("prefetch")) {
            viaDOM(url)
        } else {
            viaXHR(url)
        }
    }
}
