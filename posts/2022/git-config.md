---
layout: Post
title: "[config] Git config 使用与常用的配置🚧"
date: 2022-05-24
useHeaderImage: true
headerImage: /img/git.png
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [Git, CLI]
---

## 安装

客户端可以在[Git 官网](https://git-scm.com/downloads/)选择对应的平台，按照官方的教程安装。

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

用户的 Git 配置文件存在 `~/gitconfig` 目录，可以使用编辑器打开手动修改。

查看配置可以直接打开配置文件，也可以使用命令 `git config --list`

## 默认编辑器

Git 默认编辑器是 Vim，通过 `git config --global core.editor emacs` 可以将默认编辑器改为 emacs。如果要将默认编辑器改为 Vscode，首先需要确认 `code` 命令可用，然后执行 `git config --global core.editor "code --wait"`

## 别名

通过 alias 可以设置命令别名，比如下面的代码

```shell
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
```

设置好之后执行 `git co` 就相当于与执行 `git checkout`。

```shell
$ git l
*   cc200b5 (HEAD -> master) Merge branch 'cat'
|\
| * 0d1d15d (cat) add cat 2
| * 0d392fb add cat 1
|/
* 657fce7 (origin/master, origin/HEAD) add container
* abb4f43 update index page
* cef6e40 create index page
* cc797cd init commit
```

```shell
$ git config --global alias.l "log --oneline --graph"
$ git config --global alias.ls 'log --graph --pretty=format:"%h <%an> %ar %s"'
\$ git ls

*   cc200b5 <Eddie Kao> 9 seconds ago Merge branch 'cat'
|\
| * 0d1d15d <Eddie Kao> 18 seconds ago add cat 2
| * 0d392fb <Eddie Kao> 20 seconds ago add cat 1
|/
* 657fce7 <Eddie Kao> 13 days ago add container
* abb4f43 <Eddie Kao> 13 days ago update index page
* cef6e40 <Eddie Kao> 2 weeks ago create index page
* cc797cd <Eddie Kao> 2 weeks ago init commit
```

这些 alias 也可以在 `~/.gitconfig` 里修改

```toml
[user]
        name = your name
        email = rainbow-w@qq.com
[core]
        autocrlf = input
        quotepath = false
        excludesfile = /Users/rainb/.gitignore_global
        editor = code --wait
[init]
        defaultBranch = main
[filter "lfs"]
        clean = git-lfs clean -- %f
        smudge = git-lfs smudge -- %f
        process = git-lfs filter-process
        required = true
[http]
        proxy = http://127.0.0.1:8889
[https]
        proxy = https://127.0.0.1:8889
[pull]
        rebase = true
```

## rebase

多⼈协作开发项⽬，在上传代码时通常会先拉⼀下远程代码，使本地与远程同步更新，但是如果远程此时与⾃⼰代码存在冲突，在解决冲突后提交有时会出现`Merge branch 'master' of …`这条信息。这是因为 pull 其本质是 `fetch + Merge` 的结合。通常会分为以下两种情况：

1. 远程分⽀超前于本地分⽀，并且本地没有 commit 操作

   此时 pull 会采⽤’fast-forward’模式，该模式不会产⽣合并节点，也即不产⽣`Merge branch 'master' of …`信息。

2. 如果本地有 commit 提交，此时若存在冲突。

   - pull 拉取代码时远程和本地会出现分叉，会进⾏分⽀合并，就会产⽣`Merge branch 'master' of …`信息。解决⽅法使⽤ `git pull --rebase` 命令。
   - 如果没有冲突,则会直接合并，如果存在冲突，⼿动解决冲突即可，不会再产⽣那条多余的信息。
   - 如果你不想每次都 rebase，可以在 git bash ⾥执⾏ git config --global pull.rebase true 这个配置就是告诉 git 在每次 pull 前先进⾏ rebase 操作

## 自用配置

```shell
git config --global alias.ls "log --oneline"
git config --global alias.ll 'log --graph --pretty=format:"%h <%an> %ar %s"'
git config --global pull.rebase true
git config --global core.editor "code --wait"
```
