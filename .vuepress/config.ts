import { defineUserConfig } from "vuepress";
import type { GungnirThemeOptions } from "vuepress-theme-gungnir";
import themeConfig from "./theme";

export default defineUserConfig<GungnirThemeOptions>({
  title: "Plum Sheep",
  lang: "zh-CN",
  description: "Sheep Sheep Sheep",
  theme: "gungnir",
  themeConfig: themeConfig,
  plugins: [
    ["@renovamen/vuepress-plugin-katex"],
    [
      "@renovamen/vuepress-plugin-mermaid",
      {
        token: "mermaid",
        theme: "forest",
      },
    ],
    [
      "@renovamen/vuepress-plugin-md-plus",
      {
        all: true,
      },
    ],
    // https://giscus.app/zh-CN
    [
      "vuepress-plugin-giscus",
      {
        repo: "with-rainbow/with-rainbow.github.io",
        repoId: "R_kgDOHBYFAg",
        category: "Announcements",
        categoryId: "DIC_kwDOHBYFAs4CPGQS",
      },
    ],
  ],
});
