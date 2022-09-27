import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from 'vuepress'
import { gungnirTheme } from 'vuepress-theme-gungnir'
import codeDemoPlugin from 'vuepress-plugin-code-demo'
import codeCopyPlugin from 'vuepress-plugin-code-copy'
import docsearchPlugin from '@vuepress/plugin-docsearch'
import themeConfig from './theme'

export default defineUserConfig({
  title: 'ClubSheep',
  lang: 'zh-CN',
  description: 'Sheep Sheep Sheep',
  theme: gungnirTheme(themeConfig),
  head: [['link', { rel: 'icon', href: '/sheep.svg' }], ['meta', { name: 'docsearch:language', content: 'zh' }]],
  markdown: {
    code: {
      lineNumbers: true,
    },
  },
  alias: {},
  bundler: viteBundler(),
  plugins: [
    codeCopyPlugin(),
    codeDemoPlugin(),
    // algorithmVisualizerPlugin(),
    docsearchPlugin({
      appId: '3BGNB9V5MC',
      indexName: 'rainbowatcher',
      apiKey: 'f757c625852758ee96aaf2268959166e',
      placeholder: 'Search',
    }),
  ],
})
