/* eslint-disable unicorn/filename-case */
/* eslint-disable ts/dot-notation */
/* eslint-disable style-ts/no-extra-parens */

import {
    computed, defineComponent, h, onMounted, reactive, ref,
} from "vue"
import { loadNormal, loadReact, loadVue } from "../composables"
import {
    getCode,
    getNormalCode,
    getReactCode,
    getVueCode,
    injectCSS,
    injectScript,
} from "../utils"

import {
    CODEPEN_SVG, JSFIDDLE_SVG, LOADING_SVG, TOGGLE_SVG,
} from "./icons"
import type { CodeDemoOptions } from "../../shared"
import type { PropType, VNode } from "vue"

import "balloon-css/balloon.css"
import "../styles/code-demo.scss"

declare const MARKDOWN_ENHANCE_DELAY: number

export default defineComponent({
    name: "CodeDemo",

    props: {
        code: {
            required: true,
            type: String,
        },
        config: {
            default: "",
            type: String,
        },

        id: {
            required: true,
            type: String,
        },

        title: {
            default: "",
            type: String,
        },

        type: {
            default: "normal",
            type: String as PropType<"normal" | "react" | "vue">,
        },
    },

    setup(props, { slots }) {
        const isExpanded = ref(false)
        const demoWrapper = ref<HTMLDivElement | undefined>()
        const codeContainer = ref<HTMLDivElement | undefined>()
        const loaded = ref(false)

        const config = computed(() => JSON.parse(decodeURIComponent(props.config || "{}")) as Partial<CodeDemoOptions>)

        const codeType = computed(() => {
            const codeConfig = JSON.parse(decodeURIComponent(props.code || "{}")) as Record<string, string>

            return getCode(codeConfig)
        })

        const code = computed(() => (props.type === "react"
            ? getReactCode(codeType.value, config.value)
            : (props.type === "vue"
                ? getVueCode(codeType.value, config.value)
                : getNormalCode(codeType.value, config.value))))

        const isLegal = computed(() => code.value.isLegal)
        const codeWrapper = reactive({
            height: "0",
            overflow: "hidden",
        })

        const initDom = (innerHTML = false): void => {
            // attach a shadow root to demo

            const shadowRoot = demoWrapper.value!.attachShadow({ mode: "open" })
            const appElement = document.createElement("div")

            appElement.classList.add("code-demo-app")
            shadowRoot.append(appElement)

            if (isLegal.value) {
                if (innerHTML) appElement.innerHTML = code.value.html
                injectCSS(shadowRoot, code.value)
                injectScript(props.id, shadowRoot, code.value)

                codeWrapper.height = "0"
            } else { codeWrapper.height = "auto" }

            loaded.value = true
        }

        const loadDemo = async (): Promise<void> => {
            switch (props.type) {
                case "react": {
                    await loadReact(code.value)
                    initDom(); return
                }
                case "vue": {
                    await loadVue(code.value)
                    initDom(); return
                }

                default: {
                    await loadNormal(code.value)
                    initDom(true); return
                }
            }
        }

        const codepenData = JSON.stringify({
            css: code.value.css,
            css_external: code.value.cssLib.join(";"),
            css_pre_processor: codeType.value
                ? codeType.value.css[1]
                : "none",

            editors: code.value.codepenEditors,

            html: code.value.html,
            html_pre_processor: codeType.value
                ? codeType.value.html[1]
                : "none",

            js: code.value.js,

            js_external: code.value.jsLib.join(";"),

            js_pre_processor: codeType.value
                ? codeType.value.js[1]
                : (code.value.jsx
                    ? "babel"
                    : "none"),
            layout: code.value.codepenLayout,
        })

        onMounted(() => {
            setTimeout(async () => {
                await loadDemo()
            }, MARKDOWN_ENHANCE_DELAY)
        })

        return (): VNode => h("div", { class: "code-demo-wrapper", id: props.id }, [
            h("div", { class: "code-demo-header" }, [
                code.value.isLegal
                    ? h("button", {
                        class: ["toggle-button", isExpanded.value ? "down" : "right"],
                        innerHTML: TOGGLE_SVG,
                        onClick: () => {
                            isExpanded.value = !isExpanded.value
                            if (isExpanded.value) {
                                codeWrapper.height = `${codeContainer.value!.clientHeight + 13.8}px`
                                setTimeout(() => {
                                    codeWrapper.overflow = "visible"
                                }, 200)
                            } else {
                                codeWrapper.overflow = "hidden"
                                setTimeout(() => {
                                    codeWrapper.height = "0"
                                }, 100)
                            }
                        },
                    })
                    : null,
                props.title
                    ? h("span", { class: "title" }, decodeURIComponent(props.title))
                    : null,

                code.value.isLegal && code.value.jsfiddle !== false
                    ? h(
                        "form",
                        {
                            action: "https://jsfiddle.net/api/post/library/pure/",
                            class: "code-demo-jsfiddle",
                            method: "post",
                            target: "_blank",
                        },
                        [
                            h("input", {
                                name: "html",
                                type: "hidden",
                                value: code.value.html,
                            }),
                            h("input", {
                                name: "js",
                                type: "hidden",
                                value: code.value.js,
                            }),
                            h("input", {
                                name: "css",
                                type: "hidden",
                                value: code.value.css,
                            }),
                            h("input", { name: "wrap", type: "hidden", value: "1" }),
                            h("input", { name: "panel_js", type: "hidden", value: "3" }),
                            h("input", {
                                name: "resources",
                                type: "hidden",
                                value: [...code.value.cssLib, ...code.value.jsLib].join(","),
                            }),
                            h("button", {
                                "aria-label": "JSFiddle",
                                class: "jsfiddle-button",
                                "data-balloon-pos": "up",
                                innerHTML: JSFIDDLE_SVG,
                                type: "submit",
                            }),
                        ],
                    )
                    : null,

                !code.value.isLegal || code.value.codepen !== false
                    ? h(
                        "form",
                        {
                            action: "https://codepen.io/pen/define",
                            class: "code-demo-codepen",
                            method: "post",
                            target: "_blank",
                        },
                        [
                            h("input", {
                                name: "data",
                                type: "hidden",
                                value: codepenData,
                            }),
                            h("button", {
                                "aria-label": "Codepen",
                                class: "codepen-button",
                                "data-balloon-pos": "up",
                                innerHTML: CODEPEN_SVG,
                                type: "submit",
                            }),
                        ],
                    )
                    : null,
            ]),

            loaded.value
                ? null
                : h("div", {
                    class: ["loading"],
                    innerHTML: LOADING_SVG,
                }),

            h("div", {
                class: "code-demo-container",
                ref: demoWrapper,
                style: {
                    display: isLegal.value && loaded.value ? "block" : "none",
                },
            }),

            h(
                "div",
                { class: "code-demo-code-wrapper", style: { height: codeWrapper.height, overflow: codeWrapper.overflow } },
                h(
                    "div",
                    {
                        class: "code-demo-codes",
                        ref: codeContainer,
                    },

                    slots["default"]?.(),
                ),
            ),
        ])
    },
})
