import { breakpointsTailwind } from "@vueuse/core"

const breakpoints = useBreakpoints(breakpointsTailwind)
const preferredMotion = usePreferredReducedMotion()

export const useSiteState = createGlobalState(() => {
    const pageLoading = ref(false)

    return {
        breakpoints,
        pageLoading,
        preferredMotion,
    }
})
