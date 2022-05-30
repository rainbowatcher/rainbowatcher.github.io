---
layout: Post
title: 关于这个博客搭建过程的点滴
subtitle: 考虑到我的小伙伴们可能好奇这个博客的搭建过程，就写了个小攻略
headerImage: /img/2022/about-this-post/blog.jpg
useHeaderImage: true
headerMask: rgba(0,0,0,0.4)
date: 2022-05-20
permalinkPattern: /post/:year/:month/:day/:slug/
tags: [Blog, VuePress, Github Pages, Vercel]
---

## 缘起

在倒腾博客之前用 VuePress 做了一个[笔记项目](https://notes-with-rainbow.vercel.app)，由于我希望这个笔记项目的内容是比较规范的，所以在写笔记的时候一直都放不开手脚，觉得似乎少了一个可以打草稿的地方，自然而然想到了做博客，那博客比起笔记项目在风格上就自(hua)由(shao)很多，这样才符合博客的态度 😋。

## 为什么是 VuePress

之前在工作中接触过 Nuxt.js 写的数据标签管理界面，算是初次认识到了 Vue 这个框架。之后在 Vue3 发布的时候没忍住学了一把，用 NaiveUI 写了一个 demo，算是入了门也种草 Vue 友好的开发体验。VuePress 对我来说有诸多的有点，下面列一下：

1. 由 Vue 驱动

   由于我学了 Vue，而且 Vue 的开发对于新手友好，在需要定制主题或者组件的时候使用 Vue 开发会很方便。

2. 基于 Vite 构建

   如果你切身体验过 Vite 和 Webpack，你应该知道孰优孰劣。

3. 内置默认主题开箱即用（懒人友好）
4. 丰富的主题
5. 丰富的插件

::: warning 缺点

主要的缺点就是当前的版本还是 Beta，大部分插件和主题还没有适配 2.x 新版本 😝。
在选用 VuePress 的时候对比了 GoLang 下的 HuGo、Facebook 的 Docusaurus、Rust 的 Zola。
还有很多没试用过的 Hexo/Docsify/GitBook/WordPress/Jekyll 等等。

:::

废话说的够多了，开始进入正题了。

## 环境准备

其实跟着[官网教程](https://v2.vuepress.vuejs.org/zh/guide/getting-started.html)走就行。

1.  创建目录

```shell
mkdir vuepress-starter
cd vuepress-starter
```

2.  初始化项目

<CodeGroup>
<CodeGroupItem title="YARN">

```shell
git init
yarn init
```

</CodeGroupItem>
<CodeGroupItem title="NPM">

```shell
git init
npm init
```

</CodeGroupItem>
</CodeGroup>

3.  添加 VuePress 依赖

<CodeGroup>
<CodeGroupItem title="YARN">

```shell
yarn add -D vuepress@next
```

</CodeGroupItem>
<CodeGroupItem title="NPM">

```shell
npm i -D vuepress@next
```

</CodeGroupItem>
</CodeGroup>

4.  配置 Git 忽略 VuePress 的临时文件

```shell
echo 'node_modules' >> .gitignore
echo '.temp' >> .gitignore
echo '.cache' >> .gitignore
```

5.  添加 Npm 运行脚本到 `package.json`

```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

::: info 吐槽

这里吐槽一下,完全可以添加一些命令行的 init 命令或 create 命令。类似`tsc --init`会自动生成 tsconfig.json 配置文件一样。
前 5 步都是可以自动生成的。

:::

## 博客主题安装

经过上面的步骤你的 VuePress 就可以正常运行了，但是还没有内容，同时还不是一个博客。

VuePress 内置了 theme-default 主题，这个主题不是我们要的，我们要去挑选一个博客主题，先看看我们有什么主题。

::: link {/img/icon/awesome-vuepress.jpg} [Awesome VuePress - V2 Themes](https://github.com/vuepress/awesome-vuepress/blob/main/v2.md#themes)

Awesome VuePress 列表

:::

我的博客就选择了其中的`vuepress-theme-gungnir`主题。我们可以去[主题的文档页](https://v2-vuepress-theme-gungnir.vercel.app/zh/docs/basic/intro.html)看看如何安装这个主题。

第一步当让是添加依赖

<CodeGroup>
<CodeGroupItem title="PNPM">

```shell
pnpm add -D vuepress-theme-gungnir@next
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```shell
yarn add -D vuepress-theme-gungnir@next
```

</CodeGroupItem>
<CodeGroupItem title="NPM">

```shell
npm install -D vuepress-theme-gungnir@next
```

</CodeGroupItem>
</CodeGroup>

## 主题配置

然后在 `.vuepress/config.js` 或 `.vuepress/config.ts`（如果你在使用 TypeScript 的话）中指定主题：

<CodeGroup>
<CodeGroupItem title="JS" active>

```js{7}
// .vuepress/config.js

const { gungnirTheme } = require("vuepress-theme-gungnir");

module.exports = {
  ...
  theme: gungnirTheme({
    // 你的主题配置
  })
}
```

</CodeGroupItem>

<CodeGroupItem title="TS">

```ts{8}
// .vuepress/config.ts

import { defineUserConfig } from "vuepress";
import { gungnirTheme } from "vuepress-theme-gungnir";

export default defineUserConfig({
  ...
  theme: gungnirTheme({
    // 你的主题配置
  })
});
```

</CodeGroupItem>
</CodeGroup>

这时候博客主页还不会显示任何东西，仍需要进行一些[基本配置](https://vuepress-theme-gungnir-with-rainbow.vercel.app/zh/docs/basic/config.html)

### 作者信息

```javascript
// .vuepress/config.js

module.exports = {
  theme: gungnirTheme({
    personalInfo: {
      // 必须：名称，将在首页、移动端侧边栏和文章作者信息处显示
      name: "Cool Dragon",

      // 必须：头像，将在首页和移动端侧边栏显示
      avatar: "/img/avatar.jpeg",

      // 必须：个人简介，将在首页显示
      description: "A cool dragon lost in human world.",
      
      // 可选：社交平台账号，将在首页和移动端侧边栏显示
      sns: {
        github: "Renovamen",  // Github
        linkedin: "xiaohan-zou-55bba0160",  // 领英
        facebook: "renovamen.zou",  // Facebook
        twitter: "renovamen_zxh",  // 推特
        zhihu: "chao-neng-gui-su",  // 知乎
        weibo: "your-weibo-id",  // 新浪微博
        email: "renovamenzxh@gmail.com",  // 邮箱
        rss: "/rss.xml",  // RSS 文件的链接
        // 添加其他的社交平台
        bilibili: {  // 随便什么名字
          icon: "ri-bilibili-line",  // 社交平台的图标
          link: "https://www.bilibili.com/"  // 主页链接
        }
        // ...
      }
    }
  })
}
```

