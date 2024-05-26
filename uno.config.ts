import {
    defineConfig, presetAttributify, presetIcons, presetTypography, presetUno,
    presetWebFonts, transformerDirectives, transformerVariantGroup,
} from "unocss"

export default defineConfig({
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            scale: 1.2,
        }),
        presetTypography(),
        presetWebFonts({}),
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
