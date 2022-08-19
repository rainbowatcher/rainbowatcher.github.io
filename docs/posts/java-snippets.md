```java
//获取调用该方法的方法名....
String method = Thread.currentThread().getStackTrace()[2].getMethodName();

//获取正在执行方法的方法名....
String method = Thread.currentThread().getStackTrace()[1].getMethodName();
```

## 参考

- [Java 获取正在执行的方法名 - 编程猎人](https://www.programminghunter.com/article/6092606190/)