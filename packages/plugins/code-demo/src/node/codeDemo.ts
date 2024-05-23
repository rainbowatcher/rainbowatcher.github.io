import { hash } from "@vuepress/utils"
import { container } from "./container"
import type { CodeDemoOptions } from "../shared"
import type { PluginSimple } from "markdown-it"
import type Token from "markdown-it/lib/token"

export const CODE_DEMO_DEFAULT_SETTING: CodeDemoOptions = {
    babel: "https://unpkg.com/@babel/standalone/babel.min.js",
    codepenEditors: "101",
    codepenLayout: "left",
    cssLib: [],
    jsLib: [],
    react: "https://unpkg.com/react/umd/react.production.min.js",
    reactDOM: "https://unpkg.com/react-dom/umd/react-dom.production.min.js",
    useBabel: false,
    vue: "https://unpkg.com/vue/dist/vue.global.prod.js",
}

function getPlugin(name: string): PluginSimple {
    return (md) => {
        container(
            md,
            {
                closeRender: () => "</CodeDemo>",
                name,
                openRender: (tokens: Token[], index: number): string => {
                    const title = tokens[index].info.trimStart().slice(name.length)
                        .trim()

                    let config = ""
                    const code: Record<string, string> = {}

                    for (let i = index; i < tokens.length; i++) {
                        const { content, info, type } = tokens[i]

                        if (type === `container_${name}_close`) break
                        if (!content) continue
                        if (type === "fence") {
                            if (info === "json") config = encodeURIComponent(content)
                            else code[info] = content
                        }
                    }

                    return `
          <CodeDemo id="code-demo-${hash(code)}" type="${name.split("-")[0]}"${title ? ` title="${encodeURIComponent(title)}"` : ""
}${config ? ` config="${config}"` : ""} code="${encodeURIComponent(JSON.stringify(code))}">`
                },
            },
        )
    }
}

export const normalDemo: PluginSimple = getPlugin("normal-demo")

export const vueDemo: PluginSimple = getPlugin("vue-demo")

export const reactDemo: PluginSimple = getPlugin("react-demo")
