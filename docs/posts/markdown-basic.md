---
layout: Post
title: Markdown简明语法
subtitle: markdown语法功能测试
headerImage: /img/markdown.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
date: 2022-05-04
permalinkPattern: /post/:year/:month/:day/:slug/
tags: [Markdown, Syntax]
---

## Heading 标题

# Heading level 1 一级标题

## Heading level 2 二级标题

### Heading level 3 三级标题

#### Heading level 4 四级标题

##### Heading level 5 五级标题

###### Heading level 6 六级标题

## Font 字体

```markdown
_斜体_

**粗体**

~~删除~~

**_粗斜体_**
```

_斜体_

**粗体**

~~删除~~

**_粗斜体_**

## List 列表

### Disorder list 无序列表

```markdown
- JDK
  - JRE
  - JVM
- Tomcat
- Netty
```

- JDK
  - JRE
  - JVM
- Tomcat
- Netty

### Order list 有序列表

```md
1. JDK
   1. JRE
   1. JVM
1. Tomcat
1. Netty

---

1. JavaScript
   1. Vue
   2. React
2. JQuery
3. Bootstrap
```

1. JDK
   1. JRE
   1. JVM
1. Tomcat
1. Netty

---

1. JavaScript
   1. Vue
   2. React
2. JQuery
3. Bootstrap

::: warning 注意
这里有序列表的缩进是 3 个空格才生效,而无无列表只需要两个空格。
:::

### Task list 任务列表

```markdown
- [x] 吃饭
- [x] 睡觉
- [ ] 写 bug
```

- [x] 吃饭
- [x] 睡觉
- [ ] 写 bug

## Emoji 表情

```markdown
真好笑！ :joy:
```

真好笑！ :joy:

::: tip 提示
更多表情参考[表情符号简码列表](https://gist.github.com/rxaviers/7360908)。
:::

## Inline code 行内代码

```markdown
you can type this command `git clone <repo-addr>` to clone the repository locally.
```

you can type this command `git clone <repo-addr>` to clone the repository locally.

## CodeBlock 代码块

````markdown
```js
export default {
  markdown: {
    lineNumbers: true,
  },
};
```
````

```js
export default {
  markdown: {
    lineNumbers: true,
  },
}
```

## Link 链接

### Markdown 链接

```markdown
[Github](http://github.com/rainbowatcher)
```

[Github](http://github.com/rainbowatcher)

### 原始链接

```markdown
<http://www.example.com>
```

<http://www.example.com>

## Image 图片

```markdown
![Github](https://github.com/fluidicon.png)
```

![Github](https://github.com/fluidicon.png)

## Container 容器

```markdown
::: info
消息容器
:::
```

::: info
消息容器
:::

```markdown
::: warning
警告容器
:::
```

::: warning
警告容器
:::

```markdown
::: danger
错误容器
:::
```

::: danger
错误容器
:::

```markdown
::: details
详情容器
:::
```

::: details
详情容器
:::

```markdown
::: tip
提示容器
:::
```

::: tip
提示容器
:::

```markdown
::: warning
::: info
嵌套容器
:::
```

::: warning
::: info
内部嵌套容器会自动关闭
:::

```markdown
:::: info
this block is closed with 5 markers below

::::: tip
auto-closed block

:::::
```

:::: info
this block is closed with 5 markers below

::: tip
自动关闭容器

::::

## Divider 分割线

```markdown
---
```

---

## Table 表格

|  居中  | 左对齐     | 右对齐 |
| :----: | :--------- | -----: |
|  Rust  | Dart       |  Flink |
| Python | Java       |   Rust |
|  Node  | Javascript |    Vue |

## Quote 引用

```markdown
> 这是一个引用
>
> > 另一个引用
```

> 这是一个引用
>
> > 另一个引用
