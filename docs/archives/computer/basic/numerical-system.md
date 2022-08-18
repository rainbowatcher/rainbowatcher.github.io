---
layout: Post
title: 表示数值的方法-进制转换
subtitle: 
date: 2022-08-12
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/computer.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [Computer]
---

## 数的表示

### 其他进制转为十进制

二进制

$$
\begin{aligned}
10100.01 &= 1 \times 2^4 + 1 \times 2^2 + 1\times 2^{-2}\\
&= 20.25
\end{aligned}
$$

知识点：[负数次方](https://baike.baidu.com/item/%E8%B4%9F%E6%AC%A1%E6%96%B9/172035)

$$
2^{-2} = (\frac12)^2
$$

七进制

$$
605.01 = 6 \times 7^2 + 5 \times 7 ^0 + 1 \times (\frac17)^2
$$

知识点：任何除 0 以外的数的 0 次方都是 1

十六进制

$$
\begin{aligned}
3E0 &= 3 \times 16^2 + 14 \times 16\\
&= 992
\end{aligned}
$$

十六进制表述

| 二进制   | 0~9 | A   | B   | C   | D   | E   | F   |
| -------- | --- | --- | --- | --- | --- | --- | --- |
| 十六进制 | 0~9 | 10  | 11  | 12  | 13  | 14  | 15  |

### 十进制转换其他进制

二进制

十进制转换任意进制都可以使用此方法，例如这里使用 94 除以 2 直到除尽，将最终的余数组合起来便是二进制的数了。

$$
\begin{aligned}
& 2 | 94 &\to 0 \\
& 2 | 47 &\to 1 \\
& 2 | 23 &\to 1 \\
& 2 | 11 &\to 1 \\
& 2 | 5  &\to 1 \\
& 2 | 2  &\to 0 \\
& 1
\end{aligned}\\
\text{结果：}1011110
$$

### 二进制转换其他进制

八进制本质是将二进制数字分成三个一组，十进制则是将其分为 4 个数一组。

$$
\begin{array}{l}
\text{二进制}
& \color {navy} 100
& \color {green} 101
& 001\\
\text{八进制}
& \color {navy} 4
& \color {green} 5
& 1
\end{array}
$$

$$
\begin{array}l
\text{二进制}
&\color {navy} 0001
&\color {green} 0010
&1001\\
\text{十进制}
&\color {navy} 1
&\color {green} 2
&9
\end{array}
$$
