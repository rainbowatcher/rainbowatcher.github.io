import process from "node:process"
import {
    algolia, app, appConfig, site,
} from "./siteConfig"

export default defineNuxtConfig({
    $development: {
        // Nuxt collects anonymous telemetry data
        // telemetry: true,
        vite: {
            build: {
                minify: false,
            },
        },
    },

    $production: {
        nitro: {
            future: { nativeSWR: true },
            prerender: {
                autoSubfolderIndex: true,
                // crawlLinks: true,
                routes: ["/", "/sitemap.xml"],
            },
        },
        routeRules: {
            "/**": { isr: true },
        },
        sourcemap: true,
        ssr: true,
    },

    algolia,
    app,
    appConfig,
    colorMode: { classSuffix: "" },
    compatibilityDate: "2024-08-22",
    content: {
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
    },
    css: ["uno.css", "@unocss/reset/tailwind.css", "~/styles/index.css"],
    devtools: { enabled: false },
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
        headNext: true,
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
    fonts: {
        providers: {
            bunny: false,
            fontshare: false,
            google: false,
            googleicons: false,
        },
    },
    future: {
        compatibilityVersion: 4,
    },
    i18n: {
        locales: [
            { code: "zh", language: "zh-CN", name: "简体中文" },
            { code: "en", language: "en-US", name: "English" },
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
    },
    // because i'm using permalink for my posts, and og-image not support custom route path yet
    ogImage: { enabled: false },
    postcss: {
        plugins: {
            "@unocss/postcss": {},
        },
    },
    router: {
        options: {
            scrollBehaviorType: "smooth",
        },
    },
    site,
    unocss: {
        disableNuxtInlineStyle: false,
    },
})
