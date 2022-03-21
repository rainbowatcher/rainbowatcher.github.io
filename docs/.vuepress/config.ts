import { defineUserConfig } from "vuepress";

export default defineUserConfig({
  title: "看彩虹的人",
  lang: "zh-CN",
  description: "小彩虹的个人主页",
  themeConfig: {
    // logo: '/logo.ico',
    logoDark: "",
    navbar: [
      { text: "foo", link: "/notes" },
      { text: "bar", link: "/" },
    ],
    repo: "https://github.com/with-rainbow/with-rainbow.github.io",
    // repoLabel: '项目'
    // 编辑页面配置
    docsRepo: "https://github.com/with-rainbow/with-rainbow.github.io",
    docsBranch: "main",
    docsDir: "docs",
    editLinkPattern: ":repo/edit/:branch/:path",
    editLinkText: "编辑页面",
    lastUpdated: true,
    lastUpdatedText: "最后更新",
    contributors: true,
    contributorsText: "作者",
    backToHome: "返回主页",
    toggleDarkMode: "切换主题",
    toggleSidebar: "switch",
    notFound: ["页面走丢了", "没发现你要的页面", "没找到呢"],
  },
  plugins: [],
});
