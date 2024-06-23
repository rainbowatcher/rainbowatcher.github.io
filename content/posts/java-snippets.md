---
title: Java 小技巧
subtitle: 
date: 2022-08-27
headerImage: /img/java.png
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
