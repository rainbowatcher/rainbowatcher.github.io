/**
 * 做什么：生成元素 class 字符串。先按 clsx 的语义拍平输入（字符串、数字、
 * 数组、`{ 类名: 是否启用 }` 对象），再交给 tailwind-merge 消解冲突。
 * 状态与生命周期：无状态，纯函数。
 * 取舍与不变量：自实现拍平以省掉 clsx 依赖；合并仍用 tailwind-merge，
 * 它按 Tailwind 语义去重，UnoCSS 的同类原子类也能覆盖大部分场景。
 * 边界：不做 UnoCSS 变体（如 `hover:`）的专有冲突合并，也不处理 CSS 变量。
 */

import { twMerge } from "tailwind-merge"

type ClassDictionary = Record<string, boolean | null | undefined>

export type ClassValue = string | number | null | undefined | false | ClassDictionary | ClassValue[]

function flatten(inputs: ClassValue[], acc: string[]): string[] {
    for (const input of inputs) {
        if (!input) {
            continue
        }
        if (typeof input === "string" || typeof input === "number") {
            acc.push(String(input))
        } else if (Array.isArray(input)) {
            flatten(input, acc)
        } else {
            for (const [className, enabled] of Object.entries(input)) {
                if (enabled) {
                    acc.push(className)
                }
            }
        }
    }
    return acc
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(flatten(inputs, []).join(" "))
}
