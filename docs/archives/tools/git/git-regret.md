---
layout: Post
title: Git 后悔药，如何撤回/重新编辑 commit 消息
headerImage: /img/git.png
useHeaderImage: true
headerMask: rgba(100, 100, 100, .618)
date: 2022-05-04
permalinkPattern: /post/:year/:month/:day/:slug/
tags: [Git, CLI]
---

使用 Git 过程中经常会碰到提交过程中，手抖或者忽略了一些东西导致提交的结果是不理想的，后悔了要怎么办呢？

<!-- more -->

## 撤销提交

```shell
❯ git log --oneline
82ba9d4 (HEAD -> main) docs: git is awesome
2b25ff6 (tag: 0.0.1, origin/main) add: docs
```

我们在 `82ba9d4` 这次提交中修改了 `README.md` 文件中的内容，假设我们对提交 `82ba9d4` 不满意，我们使用 `revert` 命令撤回上次的提交

```shell
❯ git revert 82ba9d4
hint: Waiting for your editor to close the file...
```

这时会弹出一个编辑器，里面的内容是下面这样

```shell
Revert "docs: git is awesome"

This reverts commit 82ba9d423a4a2b1a996e6f73b726c22875664a05.

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch main
# Your branch is ahead of 'origin/main' by 1 commit.
#   (use "git push" to publish your local commits)
#
# Changes to be committed:
#	modified:   README.md
#
```

根据注释里的描述，未注释的内容为本次提交的消息，可以在编辑器内直接修改，如果留空则会撤销本次 `revert` 操作，我们不作任何修改退出编辑该文件。再来看 Git 提交记录

```shell
❯ git log --oneline
530b198 (HEAD -> main) Revert "docs: git is awesome"
82ba9d4 docs: git is awesome
2b25ff6 (tag: 0.0.1, origin/main) add: docs
```

这样对 README.md 文件的修改就被 530b198 提交还原了。

::: tip 提示

- 提供 `--no-edit` 参数不弹出编辑器，直接使用默认消息提交
- 提供 `--no-commit` 或者 `-n` 参数可以取消默认的提交操作
- 可以指定撤回到哪个 commit 的状态，`git revert 530b198..2b25ff6`

:::

## 丢弃提交

revert 方式会产生新的提交来回退之前的提交内容，如果不想产生提交，而是直接丢弃某个或多个提交记录，那么就应该使用 `reset` 命令

这里我们在 `/docs/intro.md` 中添加了一些内容，提交之后状态如下

```shell
# add some content to /docs/intro.md
❯ git commit -m "docs: git intro"

❯ git log --oneline
a1fa5ca (HEAD -> main) docs: git intro
530b198 (origin/main) Revert "docs: git is awesome"
82ba9d4 docs: git is awesome
2b25ff6 (tag: 0.0.1) add: docs
```

让我们使用 `reset` 命令取消掉上面的提交

```shell
❯ git reset --soft HEAD~1

❯ git log --oneline
530b198 (HEAD -> main) Revert "docs: git is awesome"
82ba9d4 docs: git is awesome
2b25ff6 (tag: 0.0.1) add: docs

❯ git status
On branch main
Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.
  (use "git pull" to update your local branch)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   docs/intro.md
```

可以看出来，使用 `reset` 命令之后，之前的提交 `a1fa5ca` 被从暂存区中丢弃了，但是工作区中的修改还在，也就是说本地的状态被还原到了 `git commit -m "docs: git intro"` 命令执行前的状态。

::: tip

`HEAD~1` 和 `HEAD^` 的意思一样，都是上一个版本。也可以说输入 `HEAD~3` 来指定上多个版本，或者直接指定提交记录的 `SHA-1` 码。

:::

### 丢弃远程提交记录

我们把提交推送到远程仓库

```shell
❯ git log --oneline
a1fa5ca (HEAD -> main) docs: git intro
530b198 (origin/main) Revert "docs: git is awesome"
82ba9d4 docs: git is awesome
2b25ff6 (tag: 0.0.1) add: docs

❯ git push origin main

❯ git log --oneline
a1fa5ca (HEAD -> main, origin/main) docs: git intro
530b198 Revert "docs: git is awesome"
82ba9d4 docs: git is awesome
2b25ff6 (tag: 0.0.1) add: docs
```

接下来我们把状态恢复到 `530b198` 提交时的状态

```shell
❯ git reset --hard 530b198
HEAD is now at 530b198 Revert "docs: git is awesome"

❯ git push origin main --force

❯ git log --oneline
530b198 (HEAD -> main) Revert "docs: git is awesome"
82ba9d4 docs: git is awesome
2b25ff6 (tag: 0.0.1) add: docs
```

加入 `--hard` 参数执行会将 `a1fa5ca` 提交的内容丢弃掉，工作区和暂存区会被恢复到 530b198 提交之后的状态。如果使用 `--soft` 则是恢复到 `a1fa5ca` 提交前的状态。

::: warning

`--force` 是很危险的操作，多人协作开发的时候要谨慎使用。

:::

## 编辑上一次提交

提交 commit 消息的时候手抖多敲了几个奇怪的符号，该如何撤回呢，`--amend`可以编辑上次提交的消息。

```shell
git commit -m 'message？'
git commit --amend -m "message"
```

当你想把某个文件加入到上一次的提交时也可以使用`--amend`参数

```shell
git commit -m "message"
git add index.html
git commit --amend --no-edit
```

`--no-edit`是不弹出编辑器的意思，不加这个参数的情况下会启动默认编辑器。

## 撤销文件修改

如果想撤销对 `/docs/intro.md` 文件的修改，可以使用 checkout 命令，从本地仓库中拉取 HEAD 指向的提交中的文件到工作区。

```shell
❯ git checkout /docs/intro.md
```

## 撤销添加文件

我们将工作区的文件添加到暂存区是使用 `add` 命令，相应的如果想取消加入暂存区的操作，则使用 `rm` 命令。

```shell
❯ git rm --cached /docs/intro.md
```

## 重新整理提交消息

查看当前日志

```shell
❯ git log --oneline
a1fa5ca (HEAD -> main, origin/main) docs: git intro
530b198 Revert "docs: git is awesome"
82ba9d4 docs: git is awesome
2b25ff6 (tag: 0.0.1) add: docs
```

由于 530b198 和 82ba9d4 一个是添加内容，一个是撤销前者的内容，所以我们希望将他们删除掉，使用 `rebase` 命令

```shell
❯ git rebase -i 82ba9d4 530b198
hint: Waiting for your editor to close the file...
```

弹出编辑器内容如下

```shell
pick 82ba9d4 docs: git is awesome
pick 530b198 Revert "docs: git is awesome"
pick a1fa5ca docs: git intro

# Rebase 2b25ff6..a1fa5ca onto 2b25ff6 (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified); use -c <commit> to reword the commit message
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#

```

先看下提示信息

- `p，pick <commit>` = 使用提交
- `r，reword <commit>` = 使用提交，但编辑提交消息
- `e，edit <commit>` = 使用提交，但停止修改
- `s，squash <commit>` = 使用提交，但融合到之前的提交
- `f, fixup [-C | -c] <commit>` = 类似于 "squash" 但只保留前一次提交的日志消息，除非使用 -C，在这种情况下只保留这次提交的消息； -c 与 -C 相同，但打开编辑器
- `x，exec <command>` = 使用 shell 运行命令（行的其余部分）
- `b，break` = 在此处停止（稍后使用 'git rebase --continue' 继续变基）
- `d， drop <commit>` = 删除提交
- `l，label <label>` = 使用名称标记当前 HEAD
- `t，reset <label>` = 将 HEAD 重置为标签
- `m，merge [-C <commit> | -c <commit>] <label> [# <oneline>]`

  使用原始合并提交的创建合并提交
  消息（或单行，如果没有原始合并提交
  指定的）;使用 `-c <commit>` 改写提交信息

这些行可以重新排序；它们是从上到下执行的。如果您在此处删除一行，则 COMMIT 将丢失。但是，如果您删除所有内容，rebase 将被中止。

由于我们是想删除提交记录，所以使用 drop 指令就好了，将内容修改成下面的样子，并且保存关闭。

```shell
d 82ba9d4 docs: git is awesome
d 530b198 Revert "docs: git is awesome"
pick a1fa5ca docs: git intro
```

关闭编辑器之后查看一下 git 日志

```shell
❯ git log --oneline
749685a (HEAD -> main) docs: git intro
2b25ff6 (tag: 0.0.1) add: docs
```

这样就把两条提交记录从远程仓库删掉了。这里我们的提交已经推送到了远程仓库，所以当我们 rebase 之后 commit 的 SHA-1 码是重新生成了的，所以会导致本地和远程的提交记录不一致。所以 rebase 命令最好在本地未提交到远程仓库的时候使用，如果想我现在的状况就只能 `push --force` 强制推送都远程仓库了。

## 参考

- [如何撤销 Git 操作？ - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2019/12/git-undo.html)
