import { loadScript } from "../utils"
import type { Code } from "../utils"

export type ScriptLoadState = Record<string, Promise<void>>

const state: ScriptLoadState = {}

export const useState = (): ScriptLoadState => state

export function loadReact(code: Code): Promise<void[]> {
    return Promise.all([
        loadScript(state, code.babel),
        loadScript(state, code.react),
        loadScript(state, code.reactDOM),
    ])
}

export function loadVue(code: Code): Promise<void[]> {
    const promises = [loadScript(state, code.vue)]

    if (code.useBabel) promises.push(loadScript(state, code.babel))

    return Promise.all(promises)
}

export function loadNormal(code: Code): Promise<void> {
    return code.useBabel ? loadScript(state, code.babel) : Promise.resolve()
}
