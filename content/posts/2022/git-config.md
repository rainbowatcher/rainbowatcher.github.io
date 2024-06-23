---
layout: Post
title: Git 常用的配置项
subtitle:
date: 2022-05-24
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/git.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [Git, CLI]
---

## 用户设置

首次使用 Git 时需要设置用户名和邮箱地址

```shell
git config --global user.name "your name"
git config --global user.email "example@email.com"
```

针对个别项目不想使用全局设置可以单独设置用户名和邮箱

```shell
git config user.name "another name"
git config user.email "another@email.com"
```

## 查看配置

用户的 Git 配置文件存在 `~/gitconfig` 目录，可以使用编辑器打开手动修改

查看配置可以直接打开配置文件，也可以使用命令 `git config --list`

## 默认编辑器

Git 默认编辑器是 Vim，通过 `git config --global core.editor emacs` 可以将默认编辑器改为 emacs。如果要将默认编辑器改为 Vscode，首先需要确认 `code` 命令可用，然后执行 `git config --global core.editor "code --wait"`

## Fast-forward

```shell
git config --global --add merge.ff false
```

意思是使用 `git merge` 时不要使用 fast-forward（快进）模式

```shell
git config --global --add pull.ff only
```

意思是在 `git pull` 时仅支持 fast-forward 模式

fast-forward 的合并使追踪分支的历史记录变得更困难。因此在合并时应该避免使用 fast-forward 合并
但是，在大多数情况下，fast-forward 拉取并不会让情况变得复杂。所以推荐设置在拉取的时候仅使用 fast-forward

## 显示行号

在使用 `git grep` 时显示代码的行号

```shell
git config --global grep.lineNumber true
```

## 显示空白字符变更

```shell
git config diff.wsErrorHighlight all
```

## 全局 gitignore

```shell
git config --global core.excludesfile ~/.gitignore_global
```

可以让 `~/.gitignore_global` 中设置的忽略策略全局生效

## 别名

通过 alias 可以设置命令别名，比如下面的代码

```shell
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
```

设置好之后执行 `git co` 就相当于与执行 `git checkout`。

```shell
$ git config --global alias.l "log --oneline --graph"
$ git config --global alias.ls 'log --graph --pretty=format:"%h <%an> %ar %s"'
\$ git ls

* f5c469b <rainbowatcher> 4 days ago fix: 重新添加README文件 && 修改sidebar显示层数
* 0678f0f <rainbowatcher> 4 days ago feat: 优化目录结构，增加测试案例，自动生成sidebar
* 4d0f7b3 <rainbowatcher> 3 weeks ago rename
* fa8c1a7 <rainbowatcher> 3 weeks ago feat: disable github action
```

这些 alias 也可以在 `~/.gitconfig` 里修改

```ini [~/.gitconfig]
[user]
        name = your_name
        email = email_address@orgnization.com
[core]
        autocrlf = input
        quotepath = false
        excludesfile = /Users/username/.gitignore_global
        editor = code --wait
[init]
        defaultBranch = main
[filter "lfs"]
        clean = git-lfs clean -- %f
        smudge = git-lfs smudge -- %f
        process = git-lfs filter-process
        required = true
[pull]
        ff = only
[includeIf "gitdir:~/WorkSpace/"]
        path = ~/.config/git/.gitconfig_company
[http]
        proxy = http://127.0.0.1:8889
[https]
        proxy = https://127.0.0.1:8889
```

<!-- ## rebase

多⼈协作开发项⽬，在上传代码时通常会先拉⼀下远程代码，使本地与远程同步更新，但是如果远程此时与⾃⼰代码存在冲突，在解决冲突后提交有时会出现`Merge branch 'master' of …`这条信息。这是因为 pull 其本质是 `fetch + Merge` 的结合。通常会分为以下两种情况：

1. 远程分⽀超前于本地分⽀，并且本地没有 commit 操作

   此时 pull 会采⽤’fast-forward’模式，该模式不会产⽣合并节点，也即不产⽣`Merge branch 'master' of …`信息。

2. 如果本地有 commit 提交，此时若存在冲突。

   - pull 拉取代码时远程和本地会出现分叉，会进⾏分⽀合并，就会产⽣`Merge branch 'master' of …`信息。解决⽅法使⽤ `git pull --rebase` 命令。
   - 如果没有冲突,则会直接合并，如果存在冲突，⼿动解决冲突即可，不会再产⽣那条多余的信息。
   - 如果你不想每次都 rebase，可以在 git bash ⾥执⾏ git config --global pull.rebase true 这个配置就是告诉 git 在每次 pull 前先进⾏ rebase 操作 -->

## 条件配置

Git 提供 includeIf 选项来指定条件配置，在切换多个项目工作的情况下非常有用

```ini [~/.gitconfig]
...you global config...
[includeIf "gitdir:~/WorkSpace/"]
        path = ~/.config/git/.gitconfig_company
```

`~/.gitconfig` 中的配置为全局配置，当条件符合 `includeIf` 选项中的判断条件时将 path 对应的配置文件加载到项目配置

- `gitdir`: Git 项目路径规则
- `gitdir/i`: 与 gitdir 相似，只是不区分大小写
- `onbranch`: 在指定分支下应用的规则
- `hasconfig:remote.*.url:`: 关键字为`hasconfig`，意为包含某些配置时应用规则

示例配置：

```ini [~/.gitconfig]
# Core variables
[core]
	; Don't trust file modes
	filemode = false

# Our diff algorithm
[diff]
	external = /usr/local/bin/diff-wrapper
	renames = true

[branch "devel"]
	remote = origin
	merge = refs/heads/devel

# Proxy settings
[core]
	gitProxy="ssh" for "kernel.org"
	gitProxy=default-proxy ; for the rest

[include]
	path = /path/to/foo.inc ; include by absolute path
	path = foo.inc ; find "foo.inc" relative to the current file
	path = ~/foo.inc ; find "foo.inc" in your `$HOME` directory

; include if $GIT_DIR is /path/to/foo/.git
[includeIf "gitdir:/path/to/foo/.git"]
	path = /path/to/foo.inc

; include for all repositories inside /path/to/group
[includeIf "gitdir:/path/to/group/"]
	path = /path/to/foo.inc

; include for all repositories inside $HOME/to/group
[includeIf "gitdir:~/to/group/"]
	path = /path/to/foo.inc

; relative paths are always relative to the including
; file (if the condition is true); their location is not
; affected by the condition
[includeIf "gitdir:/path/to/group/"]
	path = foo.inc

; include only if we are in a worktree where foo-branch is
; currently checked out
[includeIf "onbranch:foo-branch"]
	path = foo.inc

; include only if a remote with the given URL exists (note
; that such a URL may be provided later in a file or in a
; file read after this file is read, as seen in this example)
[includeIf "hasconfig:remote.*.url:https://example.com/**"]
	path = foo.inc
[remote "origin"]
	url = https://example.com/git
```

更多配置方式参考[官方配置文档](https://git-scm.com/docs/git-config#_includes)

## 我的配置

Git 提供的 alias 很好，但是我更喜欢 shell 自带的 alias

```shell
alias gst='git status'
alias gl='git log --oneline --cherry'
alias gll='git log --graph --cherry --pretty=format:"%h <%an> %ar %s"'
alias gp='git push'
alias gpl='git pull'
alias gcf='git config -l'
alias gaa='git add .'
alias gcf='git config --list'
alias gba='git branch -a'
alias gbd='git branch --delete'
alias gbrn='git branch -m'
alias gho='git hash-object'
alias gcat='git cat-file'
```

## 参考

<!-- - [如何在一台电脑上配置多个 GitHub 账号 - HowToStartOpenSource](https://eryajf.github.io/HowToStartOpenSource/pages/8658cd/#%E4%B8%8D%E5%90%8C%E6%89%98%E7%AE%A1%E7%AB%99) -->

- [官方配置文档](https://git-scm.com/docs/git-config#_includes)
