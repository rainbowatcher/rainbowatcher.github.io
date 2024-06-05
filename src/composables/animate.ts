export function showupAnimate(interval = 50) {
    const elements = document?.querySelectorAll(".show-up") ?? []
    for (let i = 0; i <= elements.length; i++) {
        setTimeout(() => {
            elements[i]?.classList.toggle("show")
        }, i * interval)
    }
}
