import { useMotion } from "@vueuse/motion"

export function useShowupAnimate(interval = 50) {
    const { preferredMotion } = useSiteState()
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

export function useShowup(selector: string, delayInterval = 100) {
    const { preferredMotion } = useSiteState()
    if (preferredMotion.value === "reduce") return
    tryOnMounted(() => {
        if (document) {
            for (const [idx, el] of document.querySelectorAll<HTMLElement>(selector).entries()) {
                useMotion(el, {
                    enter: {
                        opacity: 1,
                        transition: {
                            damping: 25,
                            delay: delayInterval * idx,
                            mass: 0.5,
                            stiffness: 250,
                            type: "spring",
                        },
                        y: 0,
                    },
                    initial: {
                        opacity: 0,
                        y: 50,
                    },
                })
            }
        }
    })
}
