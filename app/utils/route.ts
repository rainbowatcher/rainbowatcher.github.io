import type { RouteLocationNormalizedLoadedGeneric } from "vue-router"

export function getRouteParamAsString(route: RouteLocationNormalizedLoadedGeneric, key: string) {
    const param = route.params?.[key]
    const isArray = Array.isArray(param)
    if (isArray && param.length > 0) {
        return param[0] ?? ""
    } else if (isArray) {
        return ""
    }
    return param ?? ""
}
