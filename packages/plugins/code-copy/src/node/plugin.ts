import url from "node:url"
import { path } from "@vuepress/utils"
import type { ACodeCopyOptions } from "../shared/types"
import type { PluginFunction } from "vuepress"

export function codeCopyPlugin(options: Partial<ACodeCopyOptions> = {}): PluginFunction {
    return (_app) => {
        return {
            clientConfigFile: path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "../client/index.js"),

            define: (): Record<string, unknown> => ({
                CODE_COPY_OPTIONS: options,

                // CODE_COPY_LOCALES: userCopyCodeLocales,
            }),

            name: "@rainbowatcher/vuepress-plugin-code-copy",
        }
    }
}
