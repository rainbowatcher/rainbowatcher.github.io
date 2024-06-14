export function addCodeCopy() {
    if (!breakpoints.smallerOrEqual("sm").value) return
    const { copied, copy, isSupported } = useClipboard()
    if (!isSupported) return

    const codePres = document.querySelectorAll(".code-pre")
    for (const cp of codePres) {
        const copyIconContainer = cp.querySelector(".code-copy")
        if (!copyIconContainer) continue
        const codePre = cp.querySelector("pre > code")
        copyIconContainer?.classList.remove("hidden")
        const copyIcon = document.createElement("button")
        copyIcon.title = "Copy Code"
        copyIcon.classList.add("i-line-md-clipboard")
        copyIcon.addEventListener("click", () => copy(codePre?.textContent?.slice(0, -1) ?? ""))
        watch(copied, () => {
            if (copied.value) {
                copyIcon.classList.remove("i-line-md-clipboard")
                copyIcon.classList.add("i-line-md-clipboard-to-clipboard-check-transition")
            } else {
                copyIcon.classList.remove("i-line-md-clipboard-to-clipboard-check-transition")
                copyIcon.classList.add("i-line-md-clipboard")
            }
        }, { immediate: true })
        copyIconContainer?.append(copyIcon)
    }
}
