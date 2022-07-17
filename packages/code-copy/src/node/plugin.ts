import { PluginFunction } from "vuepress";
import { ACodeCopyOptions } from "../shared/types";
import { path } from "@vuepress/utils";

export const copyCodePlugin = (
  options: Partial<ACodeCopyOptions> = {}
): PluginFunction => (app) => {
  return {
    name: "vuepress-plugin-copy-code",

    define: (): Record<string, unknown> => ({
      CODE_COPY_OPTIONS: options,
      // CODE_COPY_LOCALES: userCopyCodeLocales,
    }),

    clientConfigFile: path.resolve(__dirname, "../client/index.ts"),
  };
};
