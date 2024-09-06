<script lang="ts" setup>
const md = `
## Editor

- Editor: [VSCode](https://code.visualstudio.com/)
- Theme: [One Dark Pro](https://github.com/Binaryify/OneDark-Pro.git)
- Icons: [Material Design Icons](https://github.com/material-extensions/vscode-material-icon-theme)
- Fonts:
    - [FiraCode](https://github.com/tonsky/FiraCode)
    - [Cascadia Code](https://github.com/microsoft/cascadia-code)
    - [0xProto](https://github.com/0xType/0xProto)
- Formatting & Linting: [@rainbowatcher/eslint-config](https://github.com/rainbowatcher/eslint-config)

## Chrome Extensions

- [Refined GitHub](https://chrome.google.com/webstore/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf) - No-brainer must-have
- [ViolentMonkey](https://github.com/violentmonkey/violentmonkey) - Run custom script in browser
- [GitHub File Icons](https://github.com/homerchen19/github-file-icons) - It looks very nice!
- [I Still Don't Care About Cookies](https://github.com/OhMyGuus/I-Still-Dont-Care-About-Cookies) - Not popup cookie notice
- [Sala Dict](https://github.com/crimx/ext-saladict) - Dictionary
- [Immersive Translate](https://github.com/immersive-translate/immersive-translate/)
- [Vimium C](https://github.com/gdh1995/vimium-c) - Operate browser through keyboard

## Applications

- [Raycast](https://raycast.com/) - Spotlight replacement
- [Alacritty](https://github.com/alacritty/alacritty) - OpenGL terminal emulator
- [Localsend](https://github.com/localsend/localsend) - An open-source cross-platform alternative to AirDrop

## Hardware

- MacBook Pro 13 inch 2020 16GB
- Mouse: Logitech G304
- Keyboard: Filco Majestouch Convertible 2 TKL - Cherry MX Red

## CLI

- [zsh](https://zsh.org/) - Shell
  - Config: [rainbowatcher/scripts](https://github.com/rainbowatcher/scripts)
- [pnpm](https://pnpm.io/) - Preferred package managers, also for monorepo
- [ni](https://github.com/antfu/ni) - Aliasing package managers
- [taze](https://github.com/antfu/taze) - Upgrade dependencies
- [bumpp](https://github.com/antfu/bumpp) - Bump package version version for new release
- [tsx](https://github.com/privatenumber/tsx) - Run TypeScript files without compilation
`
</script>

<template>
    <DevOnly>
        <PageProfileDisplay />
    </DevOnly>
    <div class="font-mb font-sans lt-md:mx-12 md:(mx-12 w-3xl) lg:w-5xl">
        <MDC :value="md" class="leading-4.5 [&_i]:vertical-mid" />
    </div>
</template>
