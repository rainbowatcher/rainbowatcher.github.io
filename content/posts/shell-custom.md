---
layout: Post
title: Shell 定制折腾记录
subtitle:
permalinkPattern: /post/:year/:month/:day/:slug/
date: 2022-06-12
useHeaderImage: true
headerImage: /img/shell.jpg
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [Shell, Zsh, Rust, CLI]
---

Rust 在命令行各个领域产生了很多优秀的 shell 替代产品，比如`exa、bat、ripgrep、fd、starship`等等，下面介绍我是怎么配置我的终端的。

<!-- more -->

## 优秀 Rust Shell 项目

先放几个项目链接

- [sharkdp/bat](https://github.com/sharkdp/bat): 文件查看工具，cat 命令的替代 ![GitHub Repo stars](https://img.shields.io/github/stars/sharkdp/bat?style=plastic)
- [sharkdp/fd](https://github.com/sharkdp/fd): find 命令的一个简单友好快速的替代 ![GitHub Repo stars](https://img.shields.io/github/stars/sharkdp/fd?style=plastic)
- [BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep): ripgrep 是 grep 的替代 ![GitHub Repo stars](https://img.shields.io/github/stars/BurntSushi/ripgrep?style=plastic)
- [starship/starship](https://github.com/starship/starship): 迷你、快速、自由定义的跨平台 shell 提示符! ![GitHub Repo stars](https://img.shields.io/github/stars/starship/starship?style=plastic)
- [uutils/coreutils](https://github.com/uutils/coreutils): 跨平台 Rust 重写 GNU coreutils ![GitHub Repo stars](https://img.shields.io/github/stars/uutils/coreutils?style=plastic)
- [rossmacarthur/sheldon](https://github.com/rossmacarthur/sheldon): 快速、可配置化的插件管理器 ![GitHub Repo stars](https://img.shields.io/github/stars/rossmacarthur/sheldon?style=plastic)
- [ajeetdsouza/zoxide](https://github.com/ajeetdsouza/zoxide): 更智能的 cd 命令。支持所有主要的 shell。![GitHub Repo stars](https://img.shields.io/github/stars/ajeetdsouza/zoxide?style=plastic)
- [Schniz/fnm](https://github.com/Schniz/fnm): 快速简单的 Node.js 版本管理器，内置 Rust ![GitHub Repo stars](https://img.shields.io/github/stars/Schniz/fnm?style=plastic)

[更多项目](https://github.com/rust-unofficial/awesome-rust)

## 软件安装

折腾了两天，整理一套自己的 zsh 配置，首先是必备的软件安装

```shell
brew install starship sheldon zoxide fnm
```

最终选用了 Rust 写的 [rossmacarthur/sheldon](https://github.com/rossmacarthur/sheldon) 项目来做 zsh 插件管理。看了很多 zsh 插件管理器，很多作者都几年没有更新了，甚至还有想 zinit 这种作者弃坑的开源项目，为了能找一个长久更新、有活力的插件管理器，就选了 sheldon，这个项目虽然 star 数量不多，但是他是使用 Rust (毕竟 Rust 才是未来:dog:) 编写的，有一定的学习价值，也希望这个项目能越来越好。

其他 shell 替换命令安装，如果不想替换可以不安装。

```shell
brew install bat fd ripgrep
```

## 配置

### Zoxide

使用方式很简单，在 `~/.zshrc` 中添加加载代码

```shell
eval "$(zoxide init zsh)"
```

::: tip
Sheldon 支持本地插件和行内插件，文中所有插件的加载统一使用了 [Sheldon 配置文件](#sheldon) 的形式。
:::

如果你有使用过 `autojump` 或者 `z` 之类的 zsh 插件，官方也有[导入数据的功能](https://github.com/ajeetdsouza/zoxide#step-4-import-your-data-optional)

```shell
zoxide import --from [z|autojump] path/to/db
```

| OS      | Path                                                                             | Example                                              |
| ------- | -------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Linux   | $XDG_DATA_HOME/autojump/autojump.txt or $HOME/.local/share/autojump/autojump.txt | /home/alice/.local/share/autojump/autojump.txt       |
| macOS   | \$HOME/Library/autojump/autojump.txt                                             | /Users/Alice/Library/autojump/autojump.txt           |
| Windows | %APPDATA%\autojump\autojump.txt                                                  | C:\Users\Alice\AppData\Roaming\autojump\autojump.txt |

### Starship

首先在 `~/.zshrc` 中配置以指明使用的 shell 客户端。

```shell
eval $(starship init zsh)
```

starship 中 gitstatus 的配置，默认存储位置在`~/.config/starship.toml`，我的配置如下：

```toml
[git_status]
conflicted = "!=${count}"
untracked = "[?${count}](blue)"
stashed = "[\\$$count](underline #666666)"
modified = "[!${count}](yellow)"
staged = "[+${count}](green)"
renamed = "[»${count}](underline yellow)"
deleted = "[✘${count}](red)"
# ahead_behind
up_to_date = ""
behind = "${count}"
ahead = "${count}"
diverged = "${ahead_count}${behind_count}"
```

### Sheldon

接下来是 Sheldon 的配置，~~默认存储位置在`~/.sheldon/plugins.toml`~~，`0.7.0`版本之后默认配置路径更改为`~/.config/sheldon/`以适配[XDG 基本目录规范](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)

```toml
shell = "zsh"

[templates]
defer = "{% for file in files %}zsh-defer source \"{{ file }}\"\n{% endfor %}"

[plugins.zsh-defer]
github = 'romkatv/zsh-defer'

[plugins.zsh-syntax-highlighting]
github = "zsh-users/zsh-syntax-highlighting"
apply = ["defer"]

[plugins.alias-tips]
github = "djui/alias-tips"
apply = ["defer"]

[plugins.zsh-autocomplete]
github = "marlonrichert/zsh-autocomplete"
apply = ["defer"]

[plugins.zsh-autosuggestions]
github = "zsh-users/zsh-autosuggestions"
apply = ["defer"]

[plugins.cd-ls]
github = "zshzoo/cd-ls"
apply = ["defer"]

[plugins.extract]
remote = "https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/plugins/extract/extract.plugin.zsh"
apply = ["defer"]

[plugins.starship]
inline = "eval \"$(starship init zsh)\""

[plugins.fnm]
inline = "eval \"$(fnm env --use-on-cd)\""

[plugins.zoxide]
inline = "eval \"$(zoxide init zsh --cmd cd)\""
```

### Bat

在 `~/.zshrc` 中加入下面的配置，Bat 自带了很多款主题，TowDark 是其中一款类似 OneDark 的主题

```shell
export BAT_THEME="TwoDark"
```

### Vim

使用 [onedark.vim](https://github.com/joshdick/onedark.vim) 主题，先执行下面的命令下载主题

```shell
mkdir ~/.vim/colors ~/.vim/autoload
curl -o ~/.vim/colors/onedark.vim https://raw.githubusercontent.com/joshdick/onedark.vim/main/colors/onedark.vim
curl -o ~/.vim/autoload/onedark.vim https://raw.githubusercontent.com/joshdick/onedark.vim/main/autoload/onedark.vim
```

接着在 `~/.vimrc` 中添加主题加载代码

```shell
colorscheme onedark
```

::: tip

目前使用 vim 的时间不长，以后熟练了争取出一篇相关文章

:::

## zsh 插件

- zsh-defer

  提供了异步加载插件的功能，使用方式`zsh-defer source /path/to/your/plugin.zsh`

- zsh-nvm

  nvm 是一个 node 版本管理工具，zsh-nvm 提供能力管理 nvm 的安装、升级等（因为 nvm 安装之后需要在`.zshrc`中添加加载代码，而这个加载代码比较占时间，会拖慢终端的启动速度），使用 zsh-defer 加 zsh-nvm 可以加速 nvm 的加载

- zsh-syntax-highlighting

  提供命令行语法高亮

- cd-ls

  在你使用`cd`命令之后自动触发`ls`

- alias-tips

  当你 shell 中存在相应的 alias 时进行提示

- zsh-autocomplete

  为 zsh 提供实时自动补全功能

  ![autocomplete](../../docs/.vuepress/public/img/2022/shell-custom/autocomplete.gif)

- zsh-autosuggestions

  自动提示上下文信息

- autojump

  自动跳转到目录

## zsh 配置

1. 配置 zsh 忽略注释代码

   ```shell
   setopt interactivecomments
   ```

2. 记录 zsh 加载日志

   ```shell
   zmodload zsh/zprof
   ```

## zsh 脚本

详情查看 [scripts 仓库](https://github.com/rainbowatcher/scripts)

## 最终效果演示

![demo](../../docs/.vuepress/public/img/2022/shell-custom/demo.gif)

<style>
  img {
    display: inline !important;
    margin: 0 !important;
  }
</style>
