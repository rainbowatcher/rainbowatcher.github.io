import { defineUserConfig } from 'vuepress'
import { gungnirTheme } from 'vuepress-theme-gungnir'
import katexPlugin from '@renovamen/vuepress-plugin-katex'
import mermaidPlugin from '@renovamen/vuepress-plugin-mermaid'
import mdPlusPlugin from '@renovamen/vuepress-plugin-md-plus'
import giscusPlugin from 'vuepress-plugin-giscus'
import codeDemoPlugin from 'vuepress-plugin-code-demo'
import codeCopyPlugin from 'vuepress-plugin-code-copy'
import docsearchPlugin from '@vuepress/plugin-docsearch'
import themeConfig from './theme'

export default defineUserConfig({
  title: 'ClubSheep',
  lang: 'zh-CN',
  description: 'Sheep Sheep Sheep',
  theme: gungnirTheme(themeConfig),
  head: [['link', { rel: 'icon', href: 'sheep.svg' }]],
  markdown: {
    code: {
      lineNumbers: true,
    },
  },
  plugins: [
    katexPlugin(),
    mermaidPlugin({
      token: 'mermaid',
      theme: 'classic',
    }),
    mdPlusPlugin({
      all: true,
    }),
    // https://giscus.app/zh-CN
    giscusPlugin({
      repo: 'rainbowatcher/rainbowatcher.github.io',
      repoId: 'R_kgDOHBYFAg',
      category: 'Announcements',
      categoryId: 'DIC_kwDOHBYFAs4CPGQS',
    }),
    codeCopyPlugin(),
    codeDemoPlugin(),
    docsearchPlugin({
      appId: 'PWK0GS2RV3',
      apiKey: '717c1b6e81a459e928476df7c6eb16a5',
      indexName: 'posts',
      placeholder: 'Search',
      // disableUserPersonalization: true,
    }),
  ],
})
