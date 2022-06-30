---
layout: Post
title: Markdown进阶语法
subtitle: markdown语法功能测试
date: 2022-05-04
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/markdown.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
tags: [Markdown, Syntax]
---

## Sub & Sup 上下标

```markdown
H~2~O

x^2^ + y^2^ + 2xy = (x + y)^2^
```

H~2~O

x^2^ + y^2^ + 2xy = (x + y)^2^

## FootNote 脚注

```markdown
Java[^1]

[^1]: Java 是一门静态类型面向对象的语言。
```

Java[^1]

[^1]: Java 是一门静态类型面向对象的语言。

## Highlight 高亮

```markdown
==黄底黑字==
```

==黄底黑字==

## Anchor 锚

```markdown
[FootNote 脚注](#footnote-脚注)
```

[FootNote 脚注](#footnote-脚注)

## Table of content 目录

```markdown
[toc]

[[toc]]

[[_TOC_]]
```

[toc]

[[toc]]

[[_TOC_]]

## Define 定义

First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.

## Mermaid

### Flowchart 流程图

```mermaid
flowchart LR

a-->b
b---c

a1[H]-- Hello -->b1(world)
```

```mermaid
flowchart TB
    c1-->a2
    subgraph one
    a1-->a2
    end
    subgraph two
    b1-->b2
    end
    subgraph three
    c1-->c2
    end
    one --> two
    three --> two
    two --> c2
```

### Sequence diagram 序列图

```mermaid
sequenceDiagram
Alice ->> Bob: Hello Bob, how are you?
Bob-->>John: How about you John?
Bob--x Alice: I am good thanks!
Bob-x John: I am good thanks!
Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

Bob-->Alice: Checking with John...
Alice->John: Yes... John, how are you?
```

### Class diagram 类图

```mermaid
classDiagram
      Animal <|-- Duck
      Animal <|-- Fish
      Animal <|-- Zebra
      Animal : +int age
      Animal : +String gender
      Animal: +isMammal()
      Animal: +mate()
      class Duck{
          +String beakColor
          +swim()
          +quack()
      }
      class Fish{
          -int sizeInFeet
          -canEat()
      }
      class Zebra{
          +bool is_wild
          +run()
      }
```

### State diagram 状态图

```mermaid
stateDiagram-v2
    [*] --> First
    First --> Second
    First --> Third

    state First {
        [*] --> fir
        fir --> [*]
    }
    state Second {
        [*] --> sec
        sec --> [*]
    }
    state Third {
        [*] --> thi
        thi --> [*]
    }
```

```mermaid
stateDiagram
    direction LR
    [*] --> A
    A --> B
    B --> C
    state B {
      direction LR
      a --> b
    }
    B --> D
```

```mermaid
stateDiagram-v2
        State1: The state with a note
        note right of State1
            Important information! You can write
            notes.
        end note
        State1 --> State2
        note left of State2 : This is the note to the left.
```

### ER 图

```mermaid
erDiagram
    CAR ||--o{ NAMED-DRIVER : allows
    CAR {
        string registrationNumber
        string make
        string model
    }
    PERSON ||--o{ NAMED-DRIVER : is
    PERSON {
        string firstName
        string lastName
        int age
    }
```

### User journey Diagram 用户体验图

```mermaid
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me
```

### Gantt 甘特图

```mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
```

### Pie chart 饼图

```mermaid
pie showData
    title Key elements in Product X
    "Calcium" : 42.96
    "Potassium" : 50.05
    "Magnesium" : 10.01
    "Iron" :  5
```

### Requirement diagram 需求图

```mermaid
requirementDiagram

    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req
```

### Git 图

```mermaid
gitGraph
   commit
   commit
   branch develop
   commit
   commit
   commit
   checkout main
   commit
   commit
   merge develop
   commit
   commit
```

## Tex

```tex
$2^3$

$$2^3$$

$$
\begin{aligned}
\text{第一行：} & 1\\
\text{第二行：} & 2E
\end{aligned}
$$
```

$2^3$

$$2^3$$

$$
\begin{aligned}
\text{第一行：} & 1\\
\text{第二行：} & 2E
\end{aligned}
$$

```tex
$$
\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right)
= \left(\frac {y^{\omega}} {\omega}\right) \left\{(\log y)^r + \sum_{i=1}^r \frac {(-1)^i r \cdots (r-i+1) (\log y)^{r-i}} {\omega^i} \right\}
$$
```

$$
\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right)
= \left(\frac {y^{\omega}} {\omega}\right) \left\{(\log y)^r + \sum_{i=1}^r \frac {(-1)^i r \cdots (r-i+1) (\log y)^{r-i}} {\omega^i} \right\}
$$

### 对齐

```tex
$$
\begin{aligned}
x ={}& a+b+c+{} \\
&d+e+f+g
\end{aligned}
$$

$$
\begin{alignedat}{2}
   10&x+ &3&y = 2 \\
   3&x+&13&y = 4
\end{alignedat}
$$
```

$$
\begin{aligned}
x ={}& a+b+c+{} \\
&d+e+f+g
\end{aligned}
$$

$$
\begin{alignedat}{2}
   10&x+ &3&y = 2 \\
   3&x+&13&y = 4
\end{alignedat}
$$

### 分段函数

```tex
$$
y= \begin{cases}
-x,\quad x\leq 0 \\
x,\quad x>0
\end{cases}
$$
```

$$
y= \begin{cases}
-x,\quad x\leq 0 \\
x,\quad x>0
\end{cases}
$$


### 编号

```tex
$\tag{1} x+y^{2x}$

$\tag*{1} x+y^{2x}$
```

$$\tag{1} x+y^{2x}$$

$$\tag*{1} x+y^{2x}$$
