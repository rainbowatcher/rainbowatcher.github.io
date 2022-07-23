import type { PluginFunction } from 'vuepress'
import { path } from '@vuepress/utils'
import type { ACodeCopyOptions } from '../shared/types'

export const copyCodePlugin = (
  options: Partial<ACodeCopyOptions> = {},
): PluginFunction => (_app) => {
  return {
    name: 'vuepress-plugin-copy-code',

    define: (): Record<string, unknown> => ({
      CODE_COPY_OPTIONS: options,
      // CODE_COPY_LOCALES: userCopyCodeLocales,
    }),

    clientConfigFile: path.resolve(__dirname, '../client/index.js'),
  }
}
