import { h } from "@unocss/preset-mini/utils"
import {
    defineConfig, presetAttributify, presetIcons, presetUno,
    transformerDirectives, transformerVariantGroup,
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
        // presetTypography(),
    ],
    rules: [
        [/^animate-in-?(.+)?$/, ([, d]) => ({
            "--un-enter-opacity": "initial",
            "--un-enter-rotate": "initial",
            "--un-enter-scale": "initial",
            "--un-enter-translate-x": "initial",
            "--un-enter-translate-y": "initial",
            "animation-duration": `${Number(handleMatchNumber(d) ?? 150)}ms`,
            "animation-name": "animate-enter",
            "animation-timing-function": "ease-in-out",
        })],
        [/^animate-out-?(.+)?$/, ([, d]) => ({
            "--un-enter-opacity": "initial",
            "--un-enter-rotate": "initial",
            "--un-enter-scale": "initial",
            "--un-enter-translate-x": "initial",
            "--un-enter-translate-y": "initial",
            "animation-duration": `${Number(handleMatchNumber(d) ?? 150)}ms`,
            "animation-name": "animate-exit",
            "animation-timing-function": "ease-in-out",
        })],
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

    safelist: ["min-h-dvh", "i-line-md-clipboard", "i-line-md-clipboard-to-clipboard-check-transition"],
    shortcuts: [],
    theme: {
        borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
        },
        colors: {
            accent: {
                DEFAULT: "hsl(var(--accent))",
                foreground: "hsl(var(--accent-foreground))",
            },
            background: "hsl(var(--background))",
            border: "hsl(var(--border))",
            card: {
                DEFAULT: "hsl(var(--card))",
                foreground: "hsl(var(--card-foreground))",
            },
            destructive: {
                DEFAULT: "hsl(var(--destructive))",
                foreground: "hsl(var(--destructive-foreground))",
            },
            foreground: "hsl(var(--foreground))",
            input: "hsl(var(--input))",
            muted: {
                DEFAULT: "hsl(var(--muted))",
                foreground: "hsl(var(--muted-foreground))",
            },
            popover: {
                DEFAULT: "hsl(var(--popover))",
                foreground: "hsl(var(--popover-foreground))",
            },
            primary: {
                DEFAULT: "hsl(var(--primary))",
                foreground: "hsl(var(--primary-foreground))",
            },
            ring: "hsl(var(--ring))",
            secondary: {
                DEFAULT: "hsl(var(--secondary))",
                foreground: "hsl(var(--secondary-foreground))",
            },
        },
        fontFamily: {
            mb: "'鸿雷行书简体'",
            mono: "'Cascadia Code', '0xProto'",
            sans: "ui-sans, ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\", \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"",
            serif: "ui-serif, Georgia, Cambria, \"Times New Roman\", Times, serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"",
        },
    },
    transformers: [
        // @apply @screen @theme
        transformerDirectives(),
        // font-(light mono)
        transformerVariantGroup(),
    ],
})
