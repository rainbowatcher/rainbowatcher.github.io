---
layout: Post
title: 正则表达式按 Unicode 类型匹配汉字、表情、拉丁文
subtitle:
date: 2022-07-03
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/regexp.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [RegExp]
---

正则表达式支持根据 unicode 属性类型进行匹配，Unicode 标准为多种语言的文字制定了通用的匹配脚本

- `\p{Han}` 匹配汉字字符
- `\p{Hangul}` 匹配韩文字符
- 标准中并未提供专门匹配日语的脚本，但是标准中提供了片假名 `\p{Katakana}`、平假名 `\p{Hiragana}` 的匹配脚本，所以日文需要通过 `(\p{Hiragana}|\p{Han}|\p{Katakana}|\p{Latin})` 组合脚本来匹配
- `\p{Common}` 该脚本匹配各类标点符号，包括中英文符号、空格、括号、横杠、斜杠和数字
- `\p{Latin}` 匹配所有拉丁字母，包括但不限于 26 个字母

::: tip

- 以上脚本都是大小写敏感的
- JavaScript 环境下可能需要将 `\p{Han}` 替换成 `\p{Script=Han}` 才能生效。

:::

## 参考

- [Notes - Anthony Fu](https://antfu.me/posts/match-chinese-characters)
- [Unicode property escapes - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes)
- [Regexp Tutorial - Unicode Characters and Properties](https://www.regular-expressions.info/unicode.html)
