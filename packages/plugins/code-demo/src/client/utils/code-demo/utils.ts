import type { Code } from "./typings"
import type { CodeDemoOptions } from "../../../shared"

declare const CODE_DEMO_OPTIONS: CodeDemoOptions

export const options = CODE_DEMO_OPTIONS

export type PreProcessorType = "css" | "html" | "js"

export const preProcessorConfig: Record<
    PreProcessorType,
    {
        map: Record<string, string | undefined>
        types: string[]
    }
> = {
    css: {
        map: {
            css: "none",
            styl: "stylus",
        },
        types: ["css", "less", "sass", "scss", "stylus", "styl"],
    },
    html: {
        map: {
            html: "none",
            md: "markdown",
            vue: "none",
        },
        types: ["html", "slim", "haml", "md", "markdown", "vue"],
    },
    js: {
        map: {
            coffee: "coffeescript",
            javascript: "none",
            js: "none",
            ls: "livescript",
            ts: "typescript",
        },
        types: [
            "js",
            "javascript",
            "coffee",
            "coffeescript",
            "ts",
            "typescript",
            "ls",
            "livescript",
        ],
    },
}

export function h(
    tag: string,
    attrs: Record<string, string>,
    children?: HTMLElement[],
): HTMLElement {
    const node = document.createElement(tag)
    attrs
    // eslint-disable-next-line unicorn/no-array-for-each
    && Object.keys(attrs).forEach((key) => {
        // @ts-expect-error type
        if (key.indexOf("data")) { node[key] = attrs[key] } else {
            const k = key.replace("data", "")
            node.dataset[k] = attrs[key]
        }
    })

    if (children) {
        for (const child of children) {
            node.append(child)
        }
    }

    return node
}

export function getConfig(config: Partial<CodeDemoOptions>): CodeDemoOptions {
    return {
        ...options,
        ...config,
        cssLib: [...new Set([...options.cssLib || [], ...config.cssLib || []])],
        jsLib: [...new Set([...options.jsLib || [], ...config.jsLib || []])],
    }
}

export function loadScript(
    state: Record<string, Promise<void>>,
    link: string,
): Promise<void> {
    if (state[link] !== undefined) return state[link]

    const loadEvent = new Promise<void>((resolve) => {
        const script = document.createElement("script")

        script.src = link
        document.querySelector("body")?.append(script)

        script.addEventListener("load", (): void => {
            resolve()
        })
    })

    state[link] = loadEvent

    return loadEvent
}

export function injectCSS(shadowRoot: ShadowRoot, code: Code): void {
    if (
        code.css
        // style not injected
        // @ts-expect-error type
        && [...shadowRoot.childNodes].every(element => element.nodeName !== "STYLE")
    ) {
        const style = h("style", { innerHTML: code.css })

        shadowRoot.append(style)
    }
}

export function injectScript(
    id: string,
    shadowRoot: ShadowRoot,
    code: Code,
): void {
    const scriptText = code.getScript()

    if (
        scriptText
        // style not injected
        // @ts-expect-error type
        && [...shadowRoot.childNodes].every(element => element.nodeName !== "SCRIPT")
    ) {
        const script = document.createElement("script")
        // here we are fixing `document` variable back to shadowDOM
        const node = `{const document = window.document.querySelector('#${id} .code-demo-container').shadowRoot;\n${scriptText}}`
        script.append(document.createTextNode(node))
        shadowRoot.append(script)
    }
}
