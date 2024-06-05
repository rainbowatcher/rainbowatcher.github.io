export default defineNuxtConfig({
    algolia: {
        apiKey: "f757c625852758ee96aaf2268959166e",
        applicationId: "3BGNB9V5MC",
        docSearch: {
            indexName: "rainbowatcher",
        },
    },
    colorMode: {
        classSuffix: "",
    },
    components: [
        {
            // island: true,
            path: "~/components",
            pathPrefix: false,
        },
    ],
    content: {
        csv: false,
        defaultLocale: "CN",
        highlight: {
            langs: ["astro", "batch", "c", "c#", "c++", "cpp", "csharp", "css", "diff", "go", "html", "http", "ini", "java", "javascript", "json", "jsx", "kotlin", "latex", "lua", "markdown", "mermaid", "md", "python", "ruby", "shell", "sql", "svelte", "tex", "toml", "tsx", "typescript", "vue", "yaml", "zig", "zsh"],
            theme: {
                dark: "aurora-x",
                default: "github-light",
            },
        },
        ignores: [
            "hide/*",
        ],
        locales: ["CN", "EN"],
        markdown: {
            anchorLinks: true,
            rehypePlugins: [
                // ["rehype-parse", { fragment: true }],
                ["rehype-katex", {
                    fleqn: true,
                    leqno: true,
                    output: "html",
                    strict: "warn",
                }],
                ["rehype-external-links", { rel: ["nofollow"] }],
                // ["rehype-stringify", {}],
            ],
            remarkPlugins: [
                ["remark-gfm", { singleTilde: false }],
                "remark-flexible-containers",
                "remark-math",
                // ["remark-rehype", {}],
            ],
        },
        sources: {
            archives: {
                base: "./content/archives",
                driver: "fs",
                prefix: "/archives",
            },
            posts: {
                base: "./content/posts",
                driver: "fs",
                prefix: "/posts",
            },
        },
        yaml: false,
    },
    css: [
        "@unocss/reset/tailwind.css",
    ],
    devtools: {
        enabled: false,
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
        inlineStyles: true,
    },
    fonts: {
        assets: {
            // The prefix where your fonts will be accessible
            prefix: "/_fonts",
        },
    },
    modules: [
        "@nuxtjs/algolia",
        "@vueuse/nuxt",
        "@unocss/nuxt",
        "@nuxt/eslint",
        "@nuxt/content",
        "@nuxtjs/color-mode",
        "@nuxt/image",
        "@nuxt/fonts",
    ],
    routeRules: {
        "/**": { isr: true, prerender: true },
    },
    router: {
        options: {
            scrollBehaviorType: "smooth",
        },
    },
    runtimeConfig: {
        buildTime: new Date().toISOString(),
    },
    srcDir: "src/",
    telemetry: false,
    vite: {
        build: {
            minify: false,
        },
    },
})
