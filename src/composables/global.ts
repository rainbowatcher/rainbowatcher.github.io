import { breakpointsTailwind } from "@vueuse/core"

export const preferredMotion = usePreferredReducedMotion()
export const usePageLoading = () => useState("pageLoading", () => false)

export const breakpoints = useBreakpoints(breakpointsTailwind)
