import { defineUserConfig, viteBundler } from "vuepress";
import { gungnirTheme } from "vuepress-theme-gungnir";
import katexPlugin from "@renovamen/vuepress-plugin-katex";
import mermaidPlugin from "@renovamen/vuepress-plugin-mermaid";
import mdPlusPlugin from "@renovamen/vuepress-plugin-md-plus";
import giscusPlugin from "vuepress-plugin-giscus";
import themeConfig from "./theme";

export default defineUserConfig({
  title: "ClubSheep",
  lang: "zh-CN",
  description: "Sheep Sheep Sheep",
  theme: gungnirTheme(themeConfig),
  head: [["link", { rel: "icon", href: "sheep.svg" }]],
  markdown: {
    code: {
      lineNumbers: true,
    },
  },
  plugins: [
    katexPlugin(),
    mermaidPlugin({
      token: "mermaid",
      theme: "classic",
    }),
    mdPlusPlugin({
      all: true,
    }),
    // https://giscus.app/zh-CN
    giscusPlugin({
      repo: "rainbowatcher/rainbowatcher.github.io",
      repoId: "R_kgDOHBYFAg",
      category: "Announcements",
      categoryId: "DIC_kwDOHBYFAs4CPGQS",
    }),
  ],
});
