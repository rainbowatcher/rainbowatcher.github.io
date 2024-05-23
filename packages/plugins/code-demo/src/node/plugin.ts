import { ensureEndingSlash } from "@vuepress/shared"
import { path } from "@vuepress/utils"
import {
    CODE_DEMO_DEFAULT_SETTING,
    normalDemo,
    reactDemo,
    vueDemo,
} from "./codeDemo"
import type { CodeDemoOptions } from "../shared"
import type { PluginFunction } from "@vuepress/core"

const CLIENT_FOLDER = ensureEndingSlash(path.resolve(import.meta.dirname, "../client"))

export function codeDemoPlugin(options?: CodeDemoOptions): PluginFunction {
    return (app) => {
        // eslint-disable-next-line ts/no-base-to-string, ts/restrict-template-expressions
        if (app.env.isDebug && options) console.log(`Options: ${options}`)

        return {
            clientConfigFile: async (app) => {
                return await app.writeTemp(
                    "md-enhance/config.js",
                    `import { defineClientConfig } from "@vuepress/client";
            import CodeDemo from "${CLIENT_FOLDER}components/CodeDemo";
        
            export default defineClientConfig({
              enhance: ({ app }) => {
                app.component("CodeDemo", CodeDemo);
              }
            });`,
                )
            },

            define: (): Record<string, unknown> => ({
                CODE_DEMO_OPTIONS: {
                    ...CODE_DEMO_DEFAULT_SETTING,
                    ...options,
                },
                MARKDOWN_ENHANCE_DELAY: 500,
            }),

            extendsMarkdown: (md): void => {
                md.use(normalDemo)
                md.use(vueDemo)
                md.use(reactDemo)
            },

            name: "vuepress-plugin-md-enhance",
        }
    }
}
