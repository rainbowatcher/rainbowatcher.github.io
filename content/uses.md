---
title: 在用
description: 按场景分组的工具、硬件与命令行清单

sections:
    - id: editor
      title: 编辑器
      note: "01"
      items:
          - name: VS Code
            desc: 主力编辑器, 现在看代码还是习惯用这个, 虽然基本不手动写代码了
            side: Editor
            href: https://code.visualstudio.com/
          - name: One Dark Pro
            desc: 用了很多年的主题，深色下对比度刚好
            side: Theme
            href: https://github.com/Binaryify/OneDark-Pro
          - name: Material Icon Theme
            desc: 文件图标，辨识度比默认高
            side: Icons
            href: https://github.com/material-extensions/vscode-material-icon-theme
          - name: Cascadia Code / 0xProto
            desc: 带连字的等宽字体，终端和编辑器统一
            side: Fonts
            href: https://github.com/microsoft/cascadia-code
          - name: "@rainbowatcher/eslint-config"
            desc: 格式化与 lint 的唯一入口
            side: Lint
            href: https://github.com/rainbowatcher/eslint-config
    - id: browser
      title: 浏览器扩展
      note: "02"
      items:
          - name: Refined GitHub
            desc: 给 GitHub 补上很多本该有的细节
            side: Chrome
            href: https://github.com/refined-github/refined-github
          - name: Violentmonkey
            desc: 在浏览器里跑自定义脚本
            side: Chrome
            href: https://violentmonkey.github.io/
          - name: kiss-translator
            desc: 简约翻译，读英文文档时很省力
            side: Chrome
            href: https://kiss-translator.rayjar.com/
          - name: Vimium C
            desc: 用键盘操作浏览器
            side: Chrome
            href: https://github.com/gdh1995/vimium-c
          - name: Sala Dict
            desc: 划词翻译与词典
            side: Chrome
            href: https://github.com/crimx/ext-saladict
    - id: apps
      title: 应用
      note: "03"
      items:
          - name: Raycast
            desc: Spotlight 的替代，窗口管理与快捷指令都靠它
            side: macOS
            href: https://raycast.com/
          - name: Ghostty
            desc: OpenGL 终端，启动快、配置简单
            side: Terminal
            href: https://ghostty.org/
          - name: LocalSend
            desc: 跨平台局域网传文件，不经过云端
            side: Utility
            href: https://localsend.org/
    - id: hardware
      title: 硬件
      note: "04"
      items:
          - name: "MacBook Pro 14英寸，M5 Pro"
            desc: 64GB 内存，主力开发机
            side: Computer
          - name: Magic Mouse
            desc: 标配吧
            side: Mouse
          - name: Filco Majestouch Convertible 2 TKL
            desc: Cherry MX Red，用了很久依然顺手
            side: Keyboard
    - id: cli
      title: 命令行
      note: "05"
      items:
          - name: zsh
            desc: Shell，配置放在 rainbowatcher/scripts
            side: Shell
            href: https://zsh.org/
          - name: pnpm
            desc: 首选包管理器，monorepo 也用它
            side: Package
            href: https://pnpm.io/
          - name: ni
            desc: 自动识别项目该用哪个包管理器
            side: CLI
            href: https://github.com/antfu/ni
          - name: taze
            desc: 依赖升级检查，比手动翻 changelog 快
            side: CLI
            href: https://github.com/antfu/taze
          - name: bat / fd / ripgrep
            desc: cat、find、grep 的现代替代
            side: CLI
---
