import type { GungnirThemeOptions } from 'vuepress-theme-gungnir'

const themeConfig: Partial<GungnirThemeOptions> = {
  repo: 'https://github.com/rainbowatcher/rainbowatcher.github.io',
  docsDir: 'docs',
  // repoLabel: '项目',
  // 编辑页面配置
  docsRepo: 'https://github.com/rainbowatcher/rainbowatcher.github.io',
  docsBranch: 'main',
  editLinkPattern: ':repo/edit/:branch/:path',
  editLinkText: '编辑页面',
  // 文章底部连接文字配置
  lastUpdated: true,
  lastUpdatedText: '最后更新',
  backToHome: '返回主页',
  // toggleDarkMode: '切换主题',
  notFound: ['页面走丢了', '没发现你要的页面', '没找到呢'],
  // mermaid: true,
  // katex: true,
  personalInfo: {
    name: 'Rainbow Watcher',
    avatar: '/img/avatar.jpg',
    description: '💖Bigdata engineer, love with programing',
    sns: {
      github: 'rainbowatcher', // Github
      email: 'rainbow-w@qq.com', // 邮箱
      notes: {
        icon: 'ri-book-mark-fill',
        link: 'https://notes-rainbowatcher.vercel.app', // 笔记
      },
    },
  },
  // 首页图片
  homeHeaderImages: [
    {
      path: '/img/home-bg/1.jpeg',
      mask: 'rgb(100, 100, 100, .1)',
    },
    {
      path: '/img/home-bg/2.jpeg',
      mask: 'rgb(100, 100, 100, .1)',
    },
    {
      path: '/img/home-bg/3.jpeg',
      mask: 'rgb(100, 100, 100, .1)',
    },
    {
      path: '/img/home-bg/4.jpg',
      mask: 'rgb(100, 100, 100, .1)',
    },
    {
      path: '/img/home-bg/5.jpeg',
      mask: 'rgb(100, 100, 100, .1)',
    },
  ],
  pages: {
    // 标签页配置
    tags: {
      title: '标签',
      // subtitle: "吼哇朋友们，这是标签页",
      bgImage: {
        path: '/img/home-bg/3.jpeg',
        mask: 'rgba(64, 118, 190, 0.5)',
      },
    },
    // 链接页配置
    links: {
      // subtitle: "吼哇朋友们，这是链接页",
      bgImage: {
        path: '/img/home-bg/2.jpeg',
        mask: 'rgba(64, 118, 190, 0.5)',
      },
    },
  },
  navbar: [
    {
      text: '标签',
      link: '/tags/',
    },
    {
      text: '链接',
      link: '/links/',
    },
    {
      text: '笔记',
      link: 'https://notes-rainbowatcher.vercel.app',
    },
  ],
  themePlugins: {
    search: {
      isSearchable: (page) => !page.frontmatter['hide'] as boolean,
      getExtraFields: (page) => page.frontmatter['tags'] as string[] ?? []
    },
  },
  // 页脚配置
  footer: `
  <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
  CC BY-NC-SA 4.0
  </a>
  <br />
  2022-PRESENT &copy; <a href="https://github.com/rainbowatcher" target="_blank">rainbowatcher</a><br />
  Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> & <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
`,
}

export default themeConfig
