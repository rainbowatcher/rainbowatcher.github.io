/**
 * Code demo options
 */
export type CodeDemoOptions = {
    /**
   * Babel lib address
   *
   * Babel 库的地址
   *
   * @default "https://unpkg.com/@babel/standalone/babel.min.js"
   */
    babel: string

    /**
   * Whether to display CodePen button
   *
   * 是否显示 CodePen 按钮
   *
   * @default true
   */
    codepen?: boolean

    /**
   * CodePen Editor Display
   *
   * CodePen 编辑器显示情况
   *
   * @default "101"
   */
    codepenEditors: "001" | "010" | "011" | "100" | "101" | "110" | "111"

    /**
   * CodePen editor layout
   *
   * CodePen 编辑器布局
   *
   * @default "left"
   */
    codepenLayout: "left" | "right" | "top"

    /**
   * CSS Libray links
   *
   * 引入的 CSS 外部库链接
   */
    cssLib: string[]

    /**
   * JS Libray links
   *
   * 引入的 JS 外部库链接
   */
    jsLib: string[]

    /**
   * Whether to display JSFiddle button
   *
   * 是否显示 JSFiddle 按钮
   *
   * @default true
   */
    jsfiddle?: boolean

    /**
   * React lib address
   *
   * React 库的地址
   *
   * @default "https://unpkg.com/react/umd/react.production.min.js"
   */
    react: string

    /**
   * ReactDOM lib address
   *
   * ReactDOM 库的地址
   *
   * @default "https://unpkg.com/react-dom/umd/react-dom.production.min.js"
   */
    reactDOM: string

    /**
   * Whether to use babel to transpile to es5
   *
   * 是否使用 Babel 转义到 ES5
   *
   * @default false
   */
    useBabel: boolean

    /**
   * Vue lib address
   *
   * Vue 库的地址
   *
   * @default "https://unpkg.com/vue/dist/vue.global.prod.js"
   */
    vue: string
}
