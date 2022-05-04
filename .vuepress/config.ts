import { defineUserConfig } from "vuepress";
import type { GungnirThemeOptions } from "vuepress-theme-gungnir";

export default defineUserConfig<GungnirThemeOptions>({
  title: "Plum Sheep",
  lang: "zh-CN",
  description: "Sheep Sheep Sheep",
  theme: "gungnir",
  themeConfig: {
    mermaid: true,
    katex: true,
    navbarTitle: "test",
    personalInfo: {
      // 必须：名称，将在首页、移动端侧边栏和文章作者信息处显示
      name: "with-rainbow",
      // 必须：头像，将在首页和移动端侧边栏显示
      avatar: "/img/avatar.jpg",
      // 必须：个人简介，将在首页显示
      description: "",
      // 可选：社交平台账号，将在首页和移动端侧边栏显示
      sns: {
        github: "with-rainbow", // Github
        email: "renovamenzxh@gmail.com", // 邮箱
        rss: "/rss.xml", // RSS 文件的链接
        // 添加其他的社交平台
        // bilibili: {
        //   // 随便什么名字
        //   icon: "ri-bilibili-line", // 社交平台的图标
        //   link: "https://www.bilibili.com/", // 主页链接
        // },
        // ...
      },
    },
    // 首页图片
    homeHeaderImages: [
      // 图 1
      {
        path: "/img/home-bg/1.jpg",
        mask: "rgba(40, 57, 101, .4)",
      },
      // 图 2
      {
        path: "/img/home-bg/2.jpg",
        mask: "rgb(251, 170, 152, .2)",
      },
      {
        path: "/img/home-bg/3.jpg",
        mask: "rgb(251, 170, 152, .2)",
      },
    ],
    pages: {
      // 标签页配置
      tags: {
        title: "标签",
        // 可选：标签页副标题
        // subtitle: "吼哇朋友们，这是标签页",

        // 可选：标签页封面图路径和蒙版
        bgImage: {
          path: "/img/pages/tags.jpg",
          mask: "rgba(211, 206, 237, .7)",
        },
      },

      // 链接页配置
      links: {
        // 可选：链接页副标题
        subtitle: "吼哇朋友们，这是链接页",

        // 可选：链接页封面图路径和蒙版
        bgImage: {
          path: "/img/pages/links.jpg",
          mask: "rgba(64, 118, 190, 0.5)",
        },
      },
    },
    navbar: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "标签",
        link: "/tags/",
      },
      {
        text: "链接",
        link: "/links/",
      },
      {
        text: "Github",
        link: "http://github.com/with-rainbow",
      },
    ],
    // 页脚配置
    footer: `
    &copy; <a href="https://github.com/Renovamen" target="_blank">Renovamen</a> 2018-2022
    <br>
    Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> &
    <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
  `,
    // logo: '/logo.ico',
    // logoDark: "",
    // navbar: [{ text: "笔记", link: "https://with-rainbow.github.io/notes" }],
    // repo: "https://github.com/with-rainbow/with-rainbow.github.io",
    // // repoLabel: '项目'
    // // 编辑页面配置
    // docsRepo: "https://github.com/with-rainbow/with-rainbow.github.io",
    // docsBranch: "main",
    // docsDir: "docs",
    // editLinkPattern: ":repo/edit/:branch/:path",
    // editLinkText: "编辑页面",
    // lastUpdated: true,
    // lastUpdatedText: "最后更新",
    // contributors: true,
    // contributorsText: "作者",
    // backToHome: "返回主页",
    // toggleDarkMode: "切换主题",
    // toggleSidebar: "switch",
    // notFound: ["页面走丢了", "没发现你要的页面", "没找到呢"],
  },
  plugins: [
    ["@renovamen/vuepress-plugin-katex"],
    [
      "@renovamen/vuepress-plugin-mermaid",
      {
        token: "mermaid",
        theme: "neutral",
      },
    ],
  ],
});
