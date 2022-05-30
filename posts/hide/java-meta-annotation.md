---
layout: Post
title: Java 元注解源码解析
date: 2022-05-26
useHeaderImage: true
headerImage: /img/java-logo.png
headerMask: rgba(0, 0, 0, .4)
catalog: false
hide: true
tags: [Java, Annotation]
---

## 元注解

意思类似元数据，就是描述注解的注解。

### @Target

表明注解能在哪些地方使用，下面是Target的源码

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Target {
    ElementType[] value();
}
```

[Oracle 官方 Java docs - ElementType](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html)

value值中ElementType的源码：

```java
public enum ElementType {
    /** Class, interface (including annotation type), or enum declaration */
    TYPE,

    /** Field declaration (includes enum constants) */
    FIELD,

    /** Method declaration */
    METHOD,

    /** Formal parameter declaration */
    PARAMETER,

    /** Constructor declaration */
    CONSTRUCTOR,

    /** Local variable declaration */
    LOCAL_VARIABLE,

    /** Annotation type declaration */
    ANNOTATION_TYPE,

    /** Package declaration */
    PACKAGE,

    /**
     * Type parameter declaration
     *
     * @since 1.8
     */
    TYPE_PARAMETER,

    /**
     * Use of a type
     *
     * @since 1.8
     */
    TYPE_USE
}
```

