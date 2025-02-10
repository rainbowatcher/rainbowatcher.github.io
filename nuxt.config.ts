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

    content: {
        build: {
            markdown: {
                highlight: {
                    langs: ["astro", "batch", "c", "cpp", "csharp", "css", "diff", "go", "html", "http", "ini", "java", "javascript", "json", "jsx", "kotlin", "latex", "lua", "markdown", "mermaid", "md", "python", "ruby", "shell", "sql", "svelte", "tex", "toml", "tsx", "typescript", "vue", "xml", "yaml", "zig", "zsh"],
                    theme: {
                        dark: "aurora-x",
                        default: "github-light",
                    },
                },
                rehypePlugins: {
                    "rehype-external-links": { options: { target: "_blank" } },
                    "rehype-katex": {
                        options: { output: "html", strict: "warn" },
                    },
                },
                remarkPlugins: {
                    "remark-flexible-containers": {},
                    "remark-gfm": { options: { singleTilde: false } },
                    "remark-math": {},
                },
                toc: {
                    depth: 3,
                },
            },
        },
        renderer: {
            anchorLinks: true,
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

    linkChecker: {
        enabled: false,
    },

    mdc: {
        components: {
            map: {
                a: "ProseA",
                blockquote: "ProseBlockquote",
                code: "ProseCodeInline",
                em: "ProseEm",
                h1: "ProseH1",
                h2: "ProseH2",
                h3: "ProseH3",
                h4: "ProseH4",
                h5: "ProseH5",
                h6: "ProseH6",
                hr: "ProseHr",
                img: "ProseImg",
                li: "ProseLi",
                ol: "ProseOl",
                p: "ProseP",
                pre: "ProsePre",
                script: "ProseScript",
                // span: "ProseSpan",
                strong: "ProseStrong",
                // sub: "ProseSub",
                // sup: "ProseSup",
                table: "ProseTable",
                tbody: "ProseTbody",
                td: "ProseTd",
                th: "ProseTh",
                thead: "ProseThead",
                tr: "ProseTr",
                ul: "ProseUl",
            },
            prose: false,
        },
    },

    modules: [
        "@nuxtjs/algolia",
        "@nuxtjs/seo",
        "@nuxtjs/color-mode",
        "@nuxt/eslint",
        "@nuxt/content",
        "@nuxt/image",
        "@nuxt/fonts",
        "@vueuse/nuxt",
        "@vueuse/motion/nuxt",
        "@unocss/nuxt",
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

    compatibilityDate: "2025-02-05",
})
