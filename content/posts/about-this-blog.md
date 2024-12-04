---
layout: post
title: 使用 Nuxt 构建静态博客
date: 2024-06-26
headerImage: /img/markdown.png
tags: [Nuxt]
---

最近几天 Vue 发布了 3.5, 又增加了挺多的新特性, Nuxt 也是在第一时间就发布了 3.13 版本作为跟进.

## 遇到的问题

1. tailwind-reset 中的行高默认为 1.5 ?
2. mask 直接应用在 button 上会导致 button 无法在 `focus-visible` 状态下显示outline
3. 字体在移动端似乎不生效

## 不喜欢的点

1. 启动慢, 给组件改名之后无法识别,要重启Nuxt
