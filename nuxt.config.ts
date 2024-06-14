import { isDevelopment } from "std-env"

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
        contentHead: false,
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
            "LICENSE",
        ],
        locales: ["CN", "EN"],
        markdown: {
            anchorLinks: true,
            rehypePlugins: [
                ["rehype-katex", {
                    fleqn: true,
                    leqno: true,
                    output: "html",
                    strict: "warn",
                }],
                "rehype-external-links",
            ],
            remarkPlugins: [
                ["remark-gfm", { singleTilde: false }],
                "remark-flexible-containers",
                "remark-math",
            ],
        },
        sources: {
            root: {
                base: "./content/",
                driver: "fs",
            },
        },
        yaml: false,
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
        componentIslands: true,
        defaults: {
            useAsyncData: {
                deep: false,
            },
        },
        // noVueServer: true,
        // inlineRouteRules: true,
        payloadExtraction: false,
        renderJsonPayloads: true,
        typedPages: true,
        // viewTransition: true,
    },

    features: {
        // For UnoCSS
        inlineStyles: true,
    },

    // fonts: {
    //     assets: {
    //         // The prefix where your fonts will be accessible
    //         prefix: "/_fonts",
    //     },
    // },

    modules: [
        "@nuxtjs/algolia",
        "@vueuse/nuxt",
        "@unocss/nuxt",
        "@nuxt/eslint",
        "@nuxt/content",
        "@nuxtjs/color-mode",
        "@nuxt/image",
        "@nuxt/fonts",
        "@nuxtjs/i18n",
    ],

    nitro: {
        future: { nativeSWR: true },
        hooks: {
            "prerender:generate"(route) {
                if (route.fileName?.endsWith(".html") && route.contents) {
                    route.contents = route.contents.replaceAll(/(?:src|href|srcset)="\/_ipx[^"]+"/g, r => r.replaceAll("//", "/"))
                }

                if (route.error) {
                    console.error(route.route, route.error, route)
                }
            },
        },
        prerender: {
            autoSubfolderIndex: true,
            // crawlLinks: true,
            routes: ["/"],
        },

        // replace: {
        //    "import.meta.test": isTest,
        // },
    },

    postcss: {
        plugins: {
            "@unocss/postcss": {},
            // "postcss-nesting": {},
        },
    },

    routeRules: {
        "/**": { isr: true },
    },

    router: {
        options: {
            scrollBehaviorType: "smooth",
        },
    },

    // sourcemap: false,
    srcDir: "src",
    // ssr: true,

    // Nuxt collects anonymous telemetry data
    telemetry: false,
    vite: {
        build: {
            minify: !isDevelopment,
        },
    },
})
