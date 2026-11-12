/**
 * 做什么：UnoCSS 配置：把原型的设计变量映射成颜色、字体与圆角，并把重复的组件外观收成 shortcuts。
 * 状态与生命周期：构建期读取一次；颜色全部指向 tokens.css 的 CSS 变量，明暗切换无需重建。
 * 取舍与不变量：新增颜色一律先进 tokens.css，再在这里登记同名映射，组件里只写工具类；
 * shortcuts 只收「同一套外观在三处以上重复」的写法，避免变成第二套组件系统。
 * 边界：不做布局骨架与伪元素细节（那些留在 prose.css / base.css）。
 */
import { h } from "@unocss/preset-mini/utils"
import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetUno,
    transformerDirectives,
    transformerVariantGroup,
} from "unocss"

const handleMatchNumber = (v?: string, defaultVal = "0") => h.number(v ?? defaultVal)!

const handleMatchRem = (v?: string, defaultVal = "full") => h.rem(v ?? defaultVal)!

export default defineConfig({
    layers: {
        default: 0,
        icons: 8,
        preflights: 1,
        typography: 7,
    },
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            extraProperties: {
                display: "inline-block",
                height: "1.2em",
                "vertical-align": "text-bottom",
                width: "1.2em",
            },
            scale: 1.2,
        }),
    ],
    rules: [
        [
            /^animate-in-?(.+)?$/,
            ([, d]) => ({
                "--un-enter-opacity": "initial",
                "--un-enter-rotate": "initial",
                "--un-enter-scale": "initial",
                "--un-enter-translate-x": "initial",
                "--un-enter-translate-y": "initial",
                "animation-duration": `${Number(handleMatchNumber(d) ?? 150)}ms`,
                "animation-name": "animate-enter",
                "animation-timing-function": "ease-in-out",
            }),
        ],
        [
            /^animate-out-?(.+)?$/,
            ([, d]) => ({
                "--un-enter-opacity": "initial",
                "--un-enter-rotate": "initial",
                "--un-enter-scale": "initial",
                "--un-enter-translate-x": "initial",
                "--un-enter-translate-y": "initial",
                "animation-duration": `${Number(handleMatchNumber(d) ?? 150)}ms`,
                "animation-name": "animate-exit",
                "animation-timing-function": "ease-in-out",
            }),
        ],
        [/^fade-in-?(.+)?$/, ([, d]) => ({ "--un-enter-opacity": `${Number(handleMatchNumber(d) ?? 0) / 100}` })],
        [/^fade-out-?(.+)?$/, ([, d]) => ({ "--un-exit-opacity": `${Number(handleMatchNumber(d) ?? 0) / 100}` })],
        [/^zoom-in-?(.+)?$/, ([, d]) => ({ "--un-enter-scale": `${Number(handleMatchNumber(d) ?? 0) / 100}` })],
        [/^zoom-out-?(.+)?$/, ([, d]) => ({ "--un-exit-scale": `${Number(handleMatchNumber(d) ?? 0) / 100}` })],
        [/^spin-in-?(.+)?$/, ([, d]) => ({ "--un-enter-rotate": `${Number(handleMatchNumber(d) ?? 0)}deg` })],
        [/^spin-out-?(.+)?$/, ([, d]) => ({ "--un-exit-rotate": `${Number(handleMatchNumber(d) ?? 0)}deg` })],
        [/^slide-in-from-top-?(.+)?$/, ([, d]) => ({ "--un-enter-translate-y": `-${handleMatchRem(d)}` })],
        [/^slide-in-from-bottom-?(.+)?$/, ([, d]) => ({ "--un-enter-translate-y": handleMatchRem(d) })],
        [/^slide-in-from-left-?(.+)?$/, ([, d]) => ({ "--un-enter-translate-x": `-${handleMatchRem(d)}` })],
        [/^slide-in-from-right-?(.+)?$/, ([, d]) => ({ "--un-enter-translate-x": handleMatchRem(d) })],
        [/^slide-out-to-top-?(.+)?$/, ([, d]) => ({ "--un-exit-translate-y": `-${handleMatchRem(d)}` })],
        [/^slide-out-to-bottom-?(.+)?$/, ([, d]) => ({ "--un-exit-translate-y": handleMatchRem(d) })],
        [/^slide-out-to-left-?(.+)?$/, ([, d]) => ({ "--un-exit-translate-x": `-${handleMatchRem(d)}` })],
        [/^slide-out-to-right-?(.+)?$/, ([, d]) => ({ "--un-exit-translate-x": handleMatchRem(d) })],
    ],

    safelist: ["min-h-dvh"],
    shortcuts: [
        // 版面容器：与原型 .container 等价（max 1160px + 两侧 gutter 内边距）
        ["wrap", "w-full max-w-1160px mx-auto px-[var(--gutter)]"],
        // 小标题：等宽大写 + 前置短横线
        [
            "eyebrow",
            "inline-flex items-center gap-10px c-accent font-mono text-11px font-600 tracking-[0.16em] leading-[1.4] uppercase before:(content-[''] w-22px h-1px bg-current)",
        ],
        ["page-title", "font-serif text-[clamp(42px,6vw,66px)] font-700 tracking-[-0.035em] leading-[1.02]"],
        ["section-title", "font-serif text-[clamp(22px,2.4vw,27px)] font-600 tracking-[-0.015em]"],
        ["card-title", "font-serif text-22px font-600 tracking-[-0.01em]"],
        ["lede", "max-w-36em c-ink2 text-[clamp(16px,1.5vw,18px)] leading-[1.85]"],
        ["card", "border border-line rounded-card bg-surface"],
        [
            "tag-pill",
            "inline-flex items-center h-26px px-9px border border-line rounded-full c-muted font-mono text-11px leading-none hover:(border-accent bg-accentSoft c-accent)",
        ],
        [
            "btn",
            "inline-flex items-center justify-center gap-8px h-42px px-18px border border-transparent rounded-ctrl text-14px font-600 leading-none whitespace-nowrap cursor-pointer transition-all",
        ],
        ["btn-primary", "btn bg-accent c-accentContrast hover:(bg-accentStrong -translate-y-1px)"],
        ["btn-ghost", "btn border-lineStrong c-ink hover:(border-ink2 bg-surface2)"],
        ["btn-sm", "h-34px px-12px text-12px"],
        [
            "icon-btn",
            "inline-flex items-center justify-center w-36px h-36px flex-none border border-transparent rounded-full c-ink2 transition-all hover:(bg-surface2 c-ink)",
        ],
        ["link-btn", "c-muted underline underline-offset-4 hover:c-accent"],
        ["dot", "w-4px h-4px rounded-full bg-current flex-none"],
        ["arrow-ic", "w-18px h-18px flex-none fill-none stroke-current"],
        ["meta-mono", "c-faint font-mono text-[10.5px] tracking-[0.03em]"],
    ],
    theme: {
        borderRadius: {
            card: "var(--radius-l)",
            ctrl: "var(--radius-s)",
            media: "var(--radius-m)",
            sheet: "var(--radius-xl)",
        },
        colors: {
            accent: "var(--accent)",
            accentContrast: "var(--accent-contrast)",
            accentSoft: "var(--accent-soft)",
            accentStrong: "var(--accent-strong)",
            bg: "var(--bg)",
            codeBg: "var(--code-bg)",
            codeInk: "var(--code-ink)",
            codeLine: "var(--code-line)",
            danger: "var(--danger)",
            faint: "var(--faint)",
            gold: "var(--gold)",
            ink: "var(--ink)",
            ink2: "var(--ink-2)",
            line: "var(--line)",
            lineStrong: "var(--line-strong)",
            muted: "var(--muted)",
            surface: "var(--surface)",
            surface2: "var(--surface-2)",
            surface3: "var(--surface-3)",
        },
        fontFamily: {
            mb: "var(--font-hand)",
            mono: "var(--font-mono)",
            sans: "var(--font-sans)",
            serif: "var(--font-serif)",
        },
    },
    transformers: [
        // @apply @screen @theme
        transformerDirectives(),
        // font-(light mono)
        transformerVariantGroup(),
    ],
})
