import path from "node:path"
import url from "node:url"

function require(name: string) {
    return path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), name)
}

export default defineNuxtConfig({
    colorMode: {
        classSuffix: "",
    },
    components: [
        {
            // island: true,
            path: "~/components",
            pathPrefix: false,
            // preload: true,
        },
    ],
    content: {
        ignores: [
            "hide/*",
        ],
        sources: {
            content: {
                base: require("content/posts"),
                driver: "fs",
                prefix: "/posts", // All contents inside this source will be prefixed with `/docs`
            },
        },
    },
    css: [
        "@unocss/reset/tailwind.css",
    ],
    devtools: {
        enabled: true,
    },
    eslint: {
        config: {
            standalone: false,
        },
    },
    experimental: {
        payloadExtraction: false,
        renderJsonPayloads: true,
        typedPages: true,
        viewTransition: true,
    },
    features: {
        // For UnoCSS
        inlineStyles: false,
    },
    modules: [
        "@nuxtjs/algolia",
        "@vueuse/nuxt",
        "@unocss/nuxt",
        "@nuxt/eslint",
        "@nuxt/content",
        "@nuxtjs/color-mode",
    ],
    srcDir: "src/",
})
