import process from "node:process"
import { isDevelopment, isProduction } from "std-env"
import { algolia, appConfig, site } from "./siteConfig"

export default defineNuxtConfig({
    algolia,
    appConfig,

    colorMode: {
        classSuffix: "",
    },

    components: [
        {
            path: "~/components",
            pathPrefix: false,
        },
    ],

    content: {
        contentHead: true,
        csv: false,
        highlight: {
            langs: ["astro", "batch", "c", "c#", "c++", "cpp", "csharp", "css", "diff", "go", "html", "http", "ini", "java", "javascript", "json", "jsx", "kotlin", "latex", "lua", "markdown", "mermaid", "md", "python", "ruby", "shell", "sql", "svelte", "tex", "toml", "tsx", "typescript", "vue", "xml", "yaml", "zig", "zsh"],
            theme: {
                dark: "aurora-x",
                default: "github-light",
            },
        },
        ignores: [
            "hide/*",
            "LICENSE",
        ],
        markdown: {
            anchorLinks: true,
            rehypePlugins: [
                ["rehype-katex", {
                    fleqn: true,
                    leqno: true,
                    output: "html",
                    strict: "warn",
                }],
                ["rehype-external-links", { target: "_blank" }],
            ],
            remarkPlugins: [
                ["remark-gfm", { singleTilde: false }],
                "remark-flexible-containers",
                "remark-math",
            ],
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
    //     defaults: {
    //         preload: true,
    //     },
    // },

    future: {
        compatibilityVersion: 4,
    },

    i18n: {
        locales: [
            { code: "cn", iso: "zh-CN", name: "简体中文" },
            { code: "en", iso: "en-US", name: "English" },
        ],
        strategy: "no_prefix",
        vueI18n: "i18n.config.ts",
    },

    linkChecker: {
        enabled: false,
    },

    modules: [
        "@nuxtjs/algolia",
        "@nuxtjs/color-mode",
        "@nuxtjs/i18n",
        "@nuxt/eslint",
        "@nuxt/content",
        "@nuxt/image",
        "@nuxt/fonts",
        "@vueuse/nuxt",
        "@vueuse/motion/nuxt",
        "@unocss/nuxt",
        "@nuxtjs/seo",
    ],

    nitro: {
        future: { nativeSWR: true },
        hooks: {
            "prerender:generate"(route: any) {
                if (route.fileName?.endsWith(".html") && route.contents) {
                    route.contents = route.contents.replaceAll(/(?:src|href|srcset)="\/_ipx[^"]+"/g, (r: string) => r.replaceAll("//", "/"))
                }

                if (route.error) {
                    console.error(route.route, route.error, route)
                    // eslint-disable-next-line unicorn/no-process-exit
                    process.exit(1)
                }
            },
        },
        prerender: {
            autoSubfolderIndex: true,
            // crawlLinks: true,
            // ignore: [],
            routes: ["/", "/sitemap.xml"],
        },

        // replace: {
        //    "import.meta.test": isTest,
        // },
    },

    ogImage: {
        compatibility: {
            prerender: {},
            runtime: {
                chromium: true,
                "css-inline": false,
                resvg: false,
                satori: false,
                sharp: false,
            },
        },
        componentOptions: {
            global: true,
        },
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

    site,
    sourcemap: isProduction,
    ssr: true,

    // Nuxt collects anonymous telemetry data
    telemetry: !isProduction,
    vite: {
        build: {
            minify: !isDevelopment,
        },
    },
})
