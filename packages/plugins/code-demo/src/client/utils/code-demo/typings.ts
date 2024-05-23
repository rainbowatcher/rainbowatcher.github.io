import type { CodeDemoOptions } from "../../../shared"

export type CodeType = {
    css: [code: string, type: string] | string[]
    html: [code: string, type: string] | string[]
    isLegal: boolean
    js: [code: string, type: string] | string[]
}

export type Code = {
    css: string
    getScript: () => string
    html: string
    isLegal: boolean
    js: string
    jsx?: boolean
} & CodeDemoOptions
