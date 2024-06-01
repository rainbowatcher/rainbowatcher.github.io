/* eslint-disable unicorn/no-empty-file */
// import { ensureEndingSlash } from '@vuepress/shared'
// import { hash, path } from '@vuepress/utils'
// import type { PluginFunction } from 'vuepress'
// import type MarkdownIt from 'markdown-it'
// import type Token from 'markdown-it/lib/token'
// import type { PluginWithOptions } from 'markdown-it'
// import { container } from './container'

// const CLIENT_FOLDER = ensureEndingSlash(path.resolve(__dirname, '../client'))

// export const algorithmVisualizerPlugin = (): PluginFunction =>
//   (_app) => {
//     const plugin = (name: string): PluginWithOptions => (md: MarkdownIt) =>
//       container(md, {
//         name,
//         openRender: (tokens: Token[], index: number): string => {
//           // const title = tokens[index].info.trimStart().slice(name.length).trim()

//           // get chart option and commands
//           // const config = ''
//           const code = ''

//           for (let i = index; i < tokens.length; i++) {
//             const { type, content /* ,info */ } = tokens[i]

//             if (type === `container_${name}_close`)
//               break
//             if (!content)
//               continue
//             if (type === 'fence') {
//               /* if (info === 'json')
//                 config = encodeURIComponent(content)
//               else  */
//               // code = content
//               if (content) {
//                 // eslint-disable-next-line no-eval
//                 eval(content)

//                 // console.log(content)
//               }
//             }
//           }

//           // const options = encodeURIComponent(JSON.stringify(bar.toJson()))
//           // const commands = encodeURIComponent(JSON.stringify(bar.getCommands()))

//           // return `
//           //   <Visualizer id="algorithm-visualizer-${hash(code)}"
//           //   options="${options}"
//           //   commands="${commands}">
//           //   `
//         },
//         closeRender: () => '</Visualizer>',
//       })

//     return {
//       name: 'vuepress-plugin-algorithm-visualizer',

//       // define: () => {},

//       extendsMarkdown: (md) => {
//         md.use(plugin('visualizer'))
//       },

//       clientConfigFile: async (app) => {
//         return await app.writeTemp('algorithm-visualizer/config.js', `
//         import { defineClientConfig } from "@vuepress/client";
//         import Visualizer from "${CLIENT_FOLDER}components/Visualizer.vue";

//         export default defineClientConfig({
//           enhance: ({ app }) => {
//             app.component("Visualizer", Visualizer);
//           }
//         });
//       `)
//       },
//     }
//   }
