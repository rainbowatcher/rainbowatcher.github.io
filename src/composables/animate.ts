export function showupAnimate(interval = 50) {
    if (preferredMotion.value === "reduce") return
    const elements = document?.querySelectorAll(".show-up") ?? []
    for (const [i, element] of elements.entries()) {
        if (!element) return
        setTimeout(() => {
            if (element?.classList.contains("show")) return
            element?.classList.toggle("show")
        }, i * interval)
    }
}
