import { getConfig, preProcessorConfig } from "./utils"

import type { Code, CodeType } from "./typings"
import type { PreProcessorType } from "./utils"
import type { CodeDemoOptions } from "../../../shared"
import type Babel from "@babel/core"

declare global {
    // eslint-disable-next-line ts/consistent-type-definitions
    interface Window {
        Babel: typeof Babel
    }
}

export function getCode(code: Record<string, string>): CodeType {
    const languages = Object.keys(code)
    const result: CodeType = {
        css: [],
        html: [],
        isLegal: false,
        js: [],
    }

    for (const type of (["html", "js", "css"] as PreProcessorType[])) {
        const match = languages.filter(language => preProcessorConfig[type].types.includes(language))

        if (match.length > 0) {
            const language = match[0]

            result[type] = [
                code[language].replaceAll(/^\n|\n$/g, ""),
                preProcessorConfig[type].map[language] || language,
            ]
        }
    }

    result.isLegal
    = (result.html.length === 0 || result.html[1] === "none")
    && (result.js.length === 0 || result.js[1] === "none")
    && (result.css.length === 0 || result.css[1] === "none")

    return result
}

function handleHTML(html: string): string {
    return html
        .replaceAll("<br />", "<br>")
        .replaceAll(/<((\S+)[^<]*?)\s+\/>/g, "<$1></$2>")
}

function getHtmlTemplate(html: string): string {
    return `<div id="app">\n${handleHTML(html)}\n</div>`
}

function getReactTemplate(code: string): string {
    return `${code
        .replace("export default ", "const $reactApp = ")
        .replace(
            /App\.__style__(\s*)=(\s*)`([\S\s]*)?`/,
            "",
        )};\nReactDOM.createRoot(document.getElementById("app")).render(React.createElement($reactApp))`
}

function getVueJsTemplate(js: string): string {
    return js
        .replace(
            /export\s+default\s*\{(\n*[\s\S]*)\n*\}\s*;?$/u,
            "Vue.createApp({$1}).mount('#app')",
        )
        .replace(
            /export\s+default\s*define(Async)?Component\s*\(\s*\{(\n*[\s\S]*)\n*\}\s*\)\s*;?$/u,
            "Vue.createApp({$1}).mount('#app')",
        )
        .trim()
}

export function wrapper(scriptStr: string): string {
    return `(function(exports){var module={};module.exports=exports;${scriptStr};return module.exports.__esModule?module.exports.default:module.exports;})({})`
}

export function getNormalCode(
    code: CodeType,
    config: Partial<CodeDemoOptions>,
): Code {
    const codeConfig = getConfig(config)
    const js = code.js[0] || ""

    return {
        ...codeConfig,
        css: code.css[0] || "",
        // eslint-disable-next-line style-ts/no-extra-parens
        getScript: (): string => (codeConfig.useBabel
            ? window.Babel.transform(js, { presets: ["es2015"] })?.code || ""
            : js),
        html: handleHTML(code.html[0] || ""),
        isLegal: code.isLegal,
        js,
    }
}

export function getVueCode(
    code: CodeType,
    config: Partial<CodeDemoOptions>,
): Code {
    const codeConfig = getConfig(config)

    const vueTemplate = code.html[0] || ""
    const htmlBlock = /<template>([\s\S]+)<\/template>/u.exec(vueTemplate)
    const jsBlock = /<script(\s*lang=(['"])(.*?)\2)?>([\s\S]+)<\/script>/u.exec(vueTemplate)
    const cssBlock
    = /<style(\s*lang=(['"])(.*?)\2)?\s*(?:scoped)?>([\s\S]+)<\/style>/u.exec(vueTemplate)
    const html = htmlBlock ? htmlBlock[1].replaceAll(/^\n|\n$/g, "") : ""
    const [js = "", jsLang = ""] = jsBlock
        ? [jsBlock[4].replaceAll(/^\n|\n$/g, ""), jsBlock[3]]
        : []
    const [css = "", cssLang = ""] = cssBlock
        ? [cssBlock[4].replaceAll(/^\n|\n$/g, ""), cssBlock[3]]
        : []

    const isLegal = jsLang === "" && (cssLang === "" || cssLang === "css")

    return {
        ...codeConfig,
        css,
        getScript: (): string => {
            const scriptStr = config.useBabel
                ? window.Babel?.transform(js, { presets: ["es2015"] })?.code || ""
                : js.replace(/export\s+default/u, "return")

            return `const app=window.document.createElement('div');document.firstElementChild.appendChild(app);const appOptions=${wrapper(scriptStr)};appOptions.template=\`${html.replace(
                "`",
                '\\`"',
            )}\`;window.Vue.createApp(appOptions).mount(app);`
        },
        html: getHtmlTemplate(html),
        isLegal,
        js: getVueJsTemplate(js),
        jsLib: [codeConfig.vue, ...codeConfig.jsLib],
    }
}

export function getReactCode(
    code: CodeType,
    config: Partial<CodeDemoOptions>,
): Code {
    const codeConfig = getConfig(config)

    return {
        ...codeConfig,
        css:
      code.css[0]
      || (code.js[0]
          ? code.js[0]
              .replace(/App\.__style__\s*=\s*`([\S\s]*)?`/, "$1")
              .trim()
          : ""),
        getScript: (): string => {
            const scriptStr
        = window.Babel?.transform(code.js[0] || "", {
            presets: ["es2015", "react"],
        })?.code || ""

            return `window.ReactDOM.createRoot(document.firstElementChild).render(window.React.createElement(${wrapper(scriptStr)}))`
        },
        html: getHtmlTemplate(""),
        isLegal: code.isLegal,
        js: getReactTemplate(code.js[0] || ""),
        jsLib: [codeConfig.react, codeConfig.reactDOM, ...codeConfig.jsLib],
        jsx: true,
    }
}
