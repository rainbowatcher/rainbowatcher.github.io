import { isClient } from "@vueuse/core"

function calculateStyle() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    let textContent = ":root {"
    textContent += `--scrollbar-width: ${scrollbarWidth}px;`
    textContent += "}"
    return textContent
}

export function injectPageStyle() {
    if (isClient) {
        const textContent = calculateStyle()

        let styleEl = document.head.querySelector("#page-style")
        if (styleEl) {
            styleEl.textContent = textContent
        } else {
            styleEl = document.createElement("style")
            styleEl.textContent = textContent
            styleEl.id = "page-style"
            document.head.append(styleEl)
        }
    }
}
