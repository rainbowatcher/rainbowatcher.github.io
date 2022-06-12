---
layout: Post
title: Git 后悔药，如何撤回/重新编辑 commit 消息
headerImage: /img/git.png
useHeaderImage: true
headerMask: rgba(100, 100, 100, .618)
date: 2022-05-04
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - Git
  - CLI
---

使用 git 过程中经常会碰到提交 commit 过程中，手抖或者忽略了一些东西导致 commit 的结果是不理想的，这时候就要用到 `git reset`命令了。

<!-- more -->

> 参考: [如何撤销 Git 操作？ - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2019/12/git-undo.html)

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

## revert 命令

```shell
git revert [--[no-]edit] [-n] [-m parent-number] [-s] [-S[<keyid>]] <commit>...

       <commit>...
           Commits to revert. For a more complete list of ways to spell commit names, see gitrevisions(7). Sets of commits can also be given but no traversal is done by default, see
           git-rev-list(1) and its --no-walk option.

       -e, --edit
           With this option, git revert will let you edit the commit message prior to committing the revert. This is the default if you run the command from a terminal.

       -m parent-number, --mainline parent-number
           Usually you cannot revert a merge because you do not know which side of the merge should be considered the mainline. This option specifies the parent number (starting
           from 1) of the mainline and allows revert to reverse the change relative to the specified parent.

           Reverting a merge commit declares that you will never want the tree changes brought in by the merge. As a result, later merges will only bring in tree changes introduced
           by commits that are not ancestors of the previously reverted merge. This may or may not be what you want.

           See the revert-a-faulty-merge How-To[1] for more details.

       --no-edit
           With this option, git revert will not start the commit message editor.

       --cleanup=<mode>
           This option determines how the commit message will be cleaned up before being passed on to the commit machinery. See git-commit(1) for more details. In particular, if the
           <mode> is given a value of scissors, scissors will be appended to MERGE_MSG before being passed on in the case of a conflict.

       -n, --no-commit
           Usually the command automatically creates some commits with commit log messages stating which commits were reverted. This flag applies the changes necessary to revert the
           named commits to your working tree and the index, but does not make the commits. In addition, when this option is used, your index does not have to match the HEAD commit.
           The revert is done against the beginning state of your index.

           This is useful when reverting more than one commits' effect to your index in a row.

       -S[<keyid>], --gpg-sign[=<keyid>], --no-gpg-sign
           GPG-sign commits. The keyid argument is optional and defaults to the committer identity; if specified, it must be stuck to the option without a space.  --no-gpg-sign is
           useful to countermand both commit.gpgSign configuration variable, and earlier --gpg-sign.

       -s, --signoff
           Add a Signed-off-by trailer at the end of the commit message. See the signoff option in git-commit(1) for more information.

       --strategy=<strategy>
           Use the given merge strategy. Should only be used once. See the MERGE STRATEGIES section in git-merge(1) for details.

       -X<option>, --strategy-option=<option>
           Pass the merge strategy-specific option through to the merge strategy. See git-merge(1) for details.

       --rerere-autoupdate, --no-rerere-autoupdate
           Allow the rerere mechanism to update the index with the result of auto-conflict resolution if possible.
```

| 参数 | 描述 |
| ------- | ------- |
`--no-edit`|不弹出编辑器界面
`--no-commit`|通常revert命令会自动进行一次提交，设置该参数会将

## 场景

### 撤销 commit

前提：咱们国内有些公司把代码提交记录与绩效挂钩。

前一天我已经提交过了代码，晚一点的时候为了保存当前工作进度（防止误操作或者其他意外导致代码丢失），commit 了一次消息为 message。第二天为了公司的代码提交审查，又 commit 了一次，在 push 的时候看到昨天的 commit 还没有 push，这时候就需要 reset 最近的一次 commit ，仅推送昨天晚上的 commit 就好了。

```shell
git commit -m "message"
git commit -m "message1"
git reset --soft HEAD~2
git push origin main
```

::: tip
`HEAD~1` 和 `HEAD^` 的意思一样，都是上一个版本。
:::

### 撤销 push

```shell
git commit -m 'message'
git push origin main
```

```shell
git log
```

<pre style="border: 1px solid black;padding: 20px;background-color: #eee">
fcf4a7baf498f0a4df3a8c10c1013c157bbdb243 (HEAD -> main, origin/main, origin/HEAD) del: README
cb9a7c6d249c9966ae249af49dd8997ae3953579 post blog
bded190b1e7ca629ab47e5cc3bef26250859e45b ✨ feat: update dependency version to lastest
12b12df137500e96a6affb896a0181ae980c6f2f chore: 链接地址修正
</pre>

```shell
git reset --hard bded190b1e7ca629ab47e5cc3bef26250859e45b
git push origin main --force
```

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
