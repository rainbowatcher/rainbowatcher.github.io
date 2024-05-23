export default defineNuxtConfig({
    components: [
        {
            // island: true,
            path: "~/components",
            pathPrefix: false,

            // preload: true,
        },
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
    ],
})
