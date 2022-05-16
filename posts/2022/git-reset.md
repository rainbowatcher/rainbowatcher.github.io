---
layout: Post
title: "[reset] git撤回commit消息"
headerImage: /img/git.png
useHeaderImage: true
headerMask: rgba(100, 100, 100, .618)
date: 2022-05-04
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - Git
  - Command Line
---

使用 git 过程中经常会碰到提交 commit 过程中，手抖或者忽略了一些东西导致 commit 的结果是不理想的，这时候就要用到 `git reset`命令了。

<!-- more -->

## reset 命令

这个命令用于将 HEAD 重置为指定状态

```shell
git reset [--soft | --mixed | --hard] [HEAD]
```

参数：

| 参数      | 说明                                                                          |
| --------- | ----------------------------------------------------------------------------- |
| `--soft`  | 将 HEAD 引用指向给定提交，不改变索引（工作区）和工作目录                      |
| `--mixed` | HEAD 引用指向给定提交，并且索引（暂存区）内容也跟着改变，工作目录内容不变     |
| `--hard`  | HEAD 引用指向给定提交，索引（暂存区）内容和工作目录内容都会变给定提交时的状态 |

### 示例

前提：咱们国内有些公司把代码提交记录与绩效挂钩。

前一天我已经提交过了代码，晚一点的时候为了保存当前工作进度（防止误操作或者其他意外导致代码丢失），commit 了一次消息为 message。第二天为了公司的代码提交审查，又 commit 了一次，在 push 的时候看到昨天的 commit 还没有 push，这时候就需要 reset 最近的一次 commit ，仅推送昨天晚上的 commit 就好了。

```shell
git commit -m "message"
git commit -m "message1"
git reset --soft HEAD^
git push origin main
```

::: tip
`HEAD^` 的意思是上一个版本，也可以写成 `HEAD~1`
:::
