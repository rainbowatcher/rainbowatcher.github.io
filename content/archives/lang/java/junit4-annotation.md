---
layout: Post
title: JUnit4 注解使用案例
date: 2022-05-26
permalinkPattern: /post/:year/:month/:day/:slug/
useHeaderImage: true
headerImage: /img/junit.png
headerMask: rgba(0, 0, 0, .4)
catalog: false
hide: true
tags: [JUnit, Java, Test]
---

## 测试方法执行顺序

从 JUnit@4.11 版本开始 提供 @FixedMethodOrder 注解和 MethodSorters 类设置执行顺序。MethodSorters 有三个枚举值。

| 枚举值                       | 描述                                     |
| ---------------------------- | ---------------------------------------- |
| MethodSorters.DEFAULT        | 默认执行顺序，规则未知                   |
| MethodSorters.JVM            | 每次执行都由 JVM 指定随机顺序执行        |
| MethodSorters.NAME_ASCENDING | 按照方法名称的字典顺序对测试方法进行排序 |

示例：

```java {1}
@FixMethodOrder(MethodSorters.DEFAULT)
public class JUnit4TestOrder {
    @Test
    public void Testcase_3() {
        System.out.println("Testcase_3 executes");
    }

    @Test
    public void Testcase_1() {
        System.out.println("Testcase_1 executes");
    }

    @Test
    public void Testcase_2() {
    System.out.println("Testcase_2 executes ");
    }
}
```

源码：

```java {2}
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
public @interface FixMethodOrder {
    /**
      * Optionally specify <code>value</code> to have the methods executed in a particular order
      */
    MethodSorters value() default MethodSorters.DEFAULT;
}
```

不难看出默认采用`MethodSorters.DEFAULT`执行顺序
