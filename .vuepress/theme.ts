import { GungnirThemeOptions } from "vuepress-theme-gungnir";

const themeConfig: Partial<GungnirThemeOptions> = {
  // logo: '/logo.ico',
  // logoDark: "",
  // navbar: [{ text: "笔记", link: "https://with-rainbow.github.io/notes" }],
  repo: "https://github.com/with-rainbow/with-rainbow.github.io",
  repoLabel: '项目',
  // 编辑页面配置
  docsRepo: "https://github.com/with-rainbow/with-rainbow.github.io",
  docsBranch: "main",
  // docsDir: "posts",
  editLinkPattern: ":repo/edit/:branch/:path",
  editLinkText: "编辑页面",
  lastUpdated: true,
  lastUpdatedText: "最后更新",
  // contributors: true,
  // contributorsText: "作者",
  backToHome: "返回主页",
  toggleDarkMode: "切换主题",
  // toggleSidebar: "switch",
  notFound: ["页面走丢了", "没发现你要的页面", "没找到呢"],
  mermaid: true,
  katex: true,
  // navbarTitle: "test",
  personalInfo: {
    name: "with-rainbow",
    avatar: "/img/avatar.jpg",
    description: "BigData engineer, love with programing",
    sns: {
      github: "with-rainbow", // Github
      email: "renovamenzxh@gmail.com", // 邮箱
      rss: "/rss.xml", // RSS 文件的链接
    },
  },
  // 首页图片
  homeHeaderImages: [
    {
      path: "/img/home-bg/1.jpg",
      mask: "rgb(100, 100, 100, .1)",
    },
    {
      path: "/img/home-bg/2.jpg",
      mask: "rgb(100, 100, 100, .1)",
    },
    {
      path: "/img/home-bg/3.jpg",
      mask: "rgb(100, 100, 100, .1)",
    },
    {
      path: "/img/home-bg/4.jpg",
      mask: "rgb(100, 100, 100, .1)",
    },
  ],
  pages: {
    // 标签页配置
    tags: {
      title: "标签",
      // subtitle: "吼哇朋友们，这是标签页",
      bgImage: {
        path: "/img/home-bg/3.jpg",
        mask: "rgba(64, 118, 190, 0.5)",
      },
    },
    // 链接页配置
    links: {
      // subtitle: "吼哇朋友们，这是链接页",
      bgImage: {
        path: "/img/home-bg/2.jpg",
        mask: "rgba(64, 118, 190, 0.5)",
      },
    },
  },
  navbar: [
    {
      text: "标签",
      link: "/tags/",
    },
    {
      text: "链接",
      link: "/links/",
    },
    {
      text: "笔记",
      link: "https://notes-with-rainbow.vercel.app",
    },
  ],
  // 页脚配置
  footer: `
  &copy; <a href="https://github.com/with-rainbow" target="_blank">with-rainbow</a> 2018-2022
  <br>
  Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> &
  <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
`,
};

export default themeConfig;
