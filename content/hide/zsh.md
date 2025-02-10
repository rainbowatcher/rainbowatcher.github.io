---
layout: post
title: zsh 速查手册
subtitle: 
date: 2024-11-26
# headerImage: /img/markdown.png
tags: [Shell, Zsh]
---

## 通用环境变量

| 环境变量名 | 默认值 | 描述                                |
| ---------- | ------ | ----------------------------------- |
| ZDOTDIR    | $HOME  | 搜索shell启动文件（.zshrc等）的目录 |

## 启动加载文件

ref[^1]

1. 读取 `/etc/zshenv`
2. 读取 `$ZDOTDIR/.zshenv`
3. 如果是登录 shell 则读取 `/etc/zprofile` 然后 `$ZDOTDIR/.zprofile`
4. 读取 `$ZDOTDIR/.zshrc`
5. 如果是登录 shell 则读取 `/etc/zlogin` 然后 `$ZDOTDIR/.zlogin`
6. shell 退出时读取 `$ZDOTDIR/.zlogout` 然后 `/etc/zlogout`

[^1]: https://zsh.sourceforge.io/Doc/Release/Files.html#Files-1
