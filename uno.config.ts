import { h } from "@unocss/preset-mini/utils"
import {
    defineConfig, presetAttributify, presetIcons, presetTypography, presetUno,
    transformerDirectives, transformerVariantGroup,
} from "unocss"

function handleMatchNumber(v: string, defaultVal = "0") {
    const num = h.bracket.cssvar.global.auto.fraction.number(v || defaultVal)

    if (!num) {
        return
    } else if (typeof num === "string") {
        return num.replace("%", "")
    } else if (typeof num === "number") {
        return num
    }
}

function handleMatchRem(v: string, defaultVal = "full") {
    return h.bracket.cssvar.global.auto.fraction.rem(v || defaultVal)
}

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
        presetTypography(),
    ],
    rules: [
        ["animate-in", {
            "--un-animate-duration": "150ms",
            "--un-enter-opacity": "initial",
            "--un-enter-rotate": "initial",
            "--un-enter-scale": "initial",
            "--un-enter-translate-x": "initial",
            "--un-enter-translate-y": "initial",
            "animation-duration": "var(--un-animate-duration)",
            "animation-name": "animate-enter",
            "animation-timing-function": "ease-in",
        }],
        ["animate-out", {
            "--un-animate-duration": "150ms",
            "--un-enter-opacity": "initial",
            "--un-enter-rotate": "initial",
            "--un-enter-scale": "initial",
            "--un-enter-translate-x": "initial",
            "--un-enter-translate-y": "initial",
            "animation-duration": "var(--un-animate-duration)",
            "animation-name": "animate-exit",
            "animation-timing-function": "ease-out",
        }],
        [/^fade-in-?(.+)?$/, ([, d]) => ({ "--un-enter-opacity": `${Number(handleMatchNumber(d) || 0) / 100}` })],
        [/^fade-out-?(.+)?$/, ([, d]) => ({ "--un-exit-opacity": `${Number(handleMatchNumber(d) || 0) / 100}` })],
        [/^zoom-in-?(.+)?$/, ([, d]) => ({ "--un-enter-scale": `${Number(handleMatchNumber(d) || 0) / 100}` })],
        [/^zoom-out-?(.+)?$/, ([, d]) => ({ "--un-exit-scale": `${Number(handleMatchNumber(d) || 0) / 100}` })],
        [/^spin-in-?(.+)?$/, ([, d]) => ({ "--un-enter-rotate": `${Number(handleMatchNumber(d) || 0)}deg` })],
        [/^spin-out-?(.+)?$/, ([, d]) => ({ "--un-exit-rotate": `${Number(handleMatchNumber(d) || 0)}deg` })],
        [/^slide-in-from-top-?(.+)?$/, ([, d]) => ({ "--un-enter-translate-y": `-${handleMatchRem(d)}` })],
        [/^slide-in-from-bottom-?(.+)?$/, ([, d]) => ({ "--un-enter-translate-y": handleMatchRem(d) })],
        [/^slide-in-from-left-?(.+)?$/, ([, d]) => ({ "--un-enter-translate-x": `-${handleMatchRem(d)}` })],
        [/^slide-in-from-right-?(.+)?$/, ([, d]) => ({ "--un-enter-translate-x": handleMatchRem(d) })],
        [/^slide-out-to-top-?(.+)?$/, ([, d]) => ({ "--un-exit-translate-y": `-${handleMatchRem(d)}` })],
        [/^slide-out-to-bottom-?(.+)?$/, ([, d]) => ({ "--un-exit-translate-y": handleMatchRem(d) })],
        [/^slide-out-to-left-?(.+)?$/, ([, d]) => ({ "--un-exit-translate-x": `-${handleMatchRem(d)}` })],
        [/^slide-out-to-right-?(.+)?$/, ([, d]) => ({ "--un-exit-translate-x": handleMatchRem(d) })],
    ],
    shortcuts: [],
    theme: {
        borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
        },
        colors: {
            accent: {
                DEFAULT: "var(--accent)",
                foreground: "var(--accent-foreground)",
            },
            background: "var(--background)",
            border: "var(--border)",
            card: {
                DEFAULT: "var(--card)",
                foreground: "var(--card-foreground)",
            },
            destructive: {
                DEFAULT: "var(--destructive)",
                foreground: "var(--destructive-foreground)",
            },
            foreground: "var(--foreground)",
            input: "var(--input)",
            muted: {
                DEFAULT: "var(--muted)",
                foreground: "var(--muted-foreground)",
            },
            popover: {
                DEFAULT: "var(--popover)",
                foreground: "var(--popover-foreground)",
            },
            primary: {
                DEFAULT: "var(--primary)",
                foreground: "var(--primary-foreground)",
            },
            ring: "var(--ring)",
            secondary: {
                DEFAULT: "var(--secondary)",
                foreground: "var(--secondary-foreground)",
            },
        },
    },
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
})
