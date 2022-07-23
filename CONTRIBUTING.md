# Contribution Guides

This repository employs a [monorepo](https://en.wikipedia.org/wiki/Monorepo) setup with [pnpm workspaces](https://pnpm.io/workspaces). It hosts Blog for Rainbow Watcher and a number of plugins for [VuePress 2](https://v2.vuepress.vuejs.org/).

## Pre-requirements

- [Node.js](http://nodejs.org/) **version 14+**
- [pnpm](https://pnpm.io/) **version 7+**

## Development

Clone the repo and install dependencies:

```bash
pnpm install
```

Build source code:

```bash
pnpm build
```

Start developing the documentation site:

```bash
pnpm docs:dev
```

Main tools that used in this project:

- [TypeScript](https://www.typescriptlang.org/) as the development language
- [ESLint](https://eslint.org/) for code linting and formatting
