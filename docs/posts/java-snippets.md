---
layout: Post
title: Java 小技巧
subtitle: 
date: 2022-08-27
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/java.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: true
tags: [Java]
---

```java
//获取调用该方法的方法名....
String method = Thread.currentThread().getStackTrace()[2].getMethodName();

//获取正在执行方法的方法名....
String method = Thread.currentThread().getStackTrace()[1].getMethodName();
```

## 参考

...
