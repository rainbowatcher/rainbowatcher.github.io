import type { PluginFunction } from '@vuepress/core'
import { path } from '@vuepress/utils'
import { ensureEndingSlash } from '@vuepress/shared'
import type { CodeDemoOptions } from '../shared'
import {
  CODE_DEMO_DEFAULT_SETTING,
  normalDemo,
  reactDemo,
  vueDemo,
} from './codeDemo'

const CLIENT_FOLDER = ensureEndingSlash(path.resolve(__dirname, '../client'))

export const codeDemoPlugin = (options?: CodeDemoOptions): PluginFunction =>
  (app) => {
    if (app.env.isDebug && options)
    // eslint-disable-next-line no-console
      console.log(`Options: ${options.toString()}`)

    return {
      name: 'vuepress-plugin-md-enhance',

      define: (): Record<string, unknown> => ({
        MARKDOWN_ENHANCE_DELAY: 500,
        CODE_DEMO_OPTIONS: {
          ...CODE_DEMO_DEFAULT_SETTING,
          ...options,
        },
      }),

      extendsMarkdown: (md): void => {
        md.use(normalDemo)
        md.use(vueDemo)
        md.use(reactDemo)
      },

      clientConfigFile: async (app) => {
        return await app.writeTemp(
          'md-enhance/config.js',
            `import { defineClientConfig } from "@vuepress/client";
            import CodeDemo from "${CLIENT_FOLDER}components/CodeDemo";
        
            export default defineClientConfig({
              enhance: ({ app }) => {
                app.component("CodeDemo", CodeDemo);
              }
            });`,
        )
      },
    }
  }
