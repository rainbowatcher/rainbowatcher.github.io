---
layout: Post
title: Shell 定制折腾记录
subtitle:
date: 2022-06-12
useHeaderImage: true
headerImage: /img/2022/shell-custom/shell.png
headerMask: rgba(0, 0, 0, .4)
hide: hide
tags: [Shell, Zsh, Rust, CLI]
---

Rust 在命令行各个领域产生了很多优秀的 shell 替代产品，比如`exa、bat、ripgrep、fd、starship`等等

<!-- more -->

## 优秀 Rust Shell 项目

先放几个项目链接

- [sharkdp/bat](https://github.com/sharkdp/bat): 文件查看工具，cat 命令的替代 ![GitHub Repo stars](https://img.shields.io/github/stars/sharkdp/bat?style=plastic)
- [sharkdp/fd](https://github.com/sharkdp/fd): find 命令的一个简单友好快速的替代 ![GitHub Repo stars](https://img.shields.io/github/stars/sharkdp/fd?style=plastic)
- [BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep): ripgrep 是 grep 的替代 ![GitHub Repo stars](https://img.shields.io/github/stars/BurntSushi/ripgrep?style=plastic)
- [starship/starship](https://github.com/starship/starship): 迷你、快速、自由定义的跨平台 shell 提示符! ![GitHub Repo stars](https://img.shields.io/github/stars/starship/starship?style=plastic)
- [uutils/coreutils](https://github.com/uutils/coreutils): 跨平台 Rust 重写 GNU coreutils ![GitHub Repo stars](https://img.shields.io/github/stars/uutils/coreutils?style=plastic)
- [rossmacarthur/sheldon](https://github.com/rossmacarthur/sheldon): 快速、可配置化的插件管理器 ![GitHub Repo stars](https://img.shields.io/github/stars/rossmacarthur/sheldon?style=plastic)

[更多项目](https://github.com/rust-unofficial/awesome-rust)

## 软件安装

折腾了两天，整理一套自己的 zsh 配置，首先是必备的软件安装

```shell
brew install starship sheldon
```

最终选用了 Rust 写的 [rossmacarthur/sheldon](https://github.com/rossmacarthur/sheldon) 项目来做 zsh 插件管理。看了很多 zsh 插件管理器，很多作者都几年没有更新了，甚至还有想 zinit 这种作者弃坑的开源项目，为了能找一个长久更新、有活力的插件管理器，就选了 sheldon，这个项目虽然 star 数量不多，但是他是使用 Rust (毕竟 Rust 才是未来:dog:) 编写的，有一定的学习价值，也希望这个项目能越来越好。

其他 shell 替换命令安装，如果不想替换可以不安装。

```shell
brew install bat fd ripgrep
```

## 配置

starship 中 gitstatus 的配置，默认存储位置在`~/.config/starship.toml`

```toml
[git_status]
conflicted = "!=${count} "
untracked = "[?${count}](bright-red) "
stashed = "[\\$$count](underline #666666) "
modified = "[!${count}](bright-yellow) "
staged = "[+${count}](bright-blue) "
renamed = "[»${count}](yellow) "
deleted = "[✘${count}](red) "
# ahead_behind
up_to_date = "✅"
behind = "⏬${count}"
ahead = "⏫${count}"
diverged = "⏫${ahead_count}⏬${behind_count}"
```

[![asciicast](https://asciinema.org/a/7ow4rkwLvSBkjkRlAwRO4oJ3j.svg)](https://asciinema.org/a/7ow4rkwLvSBkjkRlAwRO4oJ3j)

接下来是 Sheldon 的配置，默认存储位置在`~/.sheldon/plugins.toml`

```toml
shell = "zsh"

[templates]
defer = { value = 'zsh-defer source "{{ file }}"', each = true }

[plugins.zsh-defer]
github = 'romkatv/zsh-defer'

[plugins.zsh-nvm]
github = "lukechilds/zsh-nvm"
apply = ["defer"]

[plugins.zsh-syntax-highlighting]
github = "zsh-users/zsh-syntax-highlighting"
apply = ["defer"]

[plugins.auto-ls]
github = 'desyncr/auto-ls'
apply = ["defer", "source"]

[plugins.alias-tips]
github = "djui/alias-tips"
apply = ["defer"]

[plugins.zsh-autocomplete]
github = "marlonrichert/zsh-autocomplete"
apply = ["defer"]

[plugins.zsh-autosuggestions]
github = "zsh-users/zsh-autosuggestions"
apply = ["defer"]

[plugins.autojump]
github = "wting/autojump"
dir = "bin"
apply = ["defer", "PATH", "source"]
```

### zsh-defer

这个插件提供了异步加载插件的功能，使用方式`zsh-defer source /path/to/your/plugin.zsh`

### zsh-nvm

nvm 是一个 node 版本管理工具，zsh-nvm 提供能力管理 nvm 的安装、升级等（因为 nvm 安装之后需要在`.zshrc`中添加加载代码，而这个加载代码比较占时间，会拖慢终端的启动速度），使用 zsh-defer 加 zsh-nvm 可以加速 nvm 的加载

### zsh-syntax-highlighting

语法高亮插件

### auto-ls

在你使用`cd`命令之后自动触发`ls`

### alias-tips

当你 shell 中存在相应的 alias 时进行提示

### zsh-autocomplete

为zsh提供实时自动补全功能

![autocomplete](../../.vuepress/public/img/2022/shell-custom/autocomplete.gif)

### zsh-autosuggestions

### autojump



<style>
  img {
    display: inline !important;
    margin: 0 !important;
  }
</style>
