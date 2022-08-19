---
layout: Post
title: 使用 Maven Bom 管理项目依赖
subtitle: 
date: 2022-07-30
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/java.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [Java, Maven]
---

当你有多个项目在开发的时候，要如何让他们依赖的版本保持一致呢？例如这些应用都使用了同一个数据库服务，那么他们需要与数据库的驱动版本保持一致，在更新所有这些应用中的依赖版本会很繁琐。

<!-- more -->

## 介绍

我们以一个 CLI 应用程序的依赖关系为例


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>my-cli-app</artifactId>
    <version>1.0-SNAPSHOT</version>
    <dependencies>
        <dependency>
            <groupId>org.mongodb</groupId>
            <artifactId>mongodb-driver-sync</artifactId>
            <version>4.1.0</version>
        </dependency>
        <dependency>
            <groupId>info.picocli</groupId>
            <artifactId>picocli</artifactId>
            <version>4.4.0</version>
        </dependency>
    </dependencies>
</project>
```

让我们创建一个依赖BOM来管理这两个依赖项

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>sample-BOM</artifactId>
    <version>1.0.0</version>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.mongodb</groupId>
                <artifactId>mongodb-driver-sync</artifactId>
                <version>4.1.0</version>
            </dependency>
            <dependency>
                <groupId>info.picocli</groupId>
                <artifactId>picocli</artifactId>
                <version>4.4.0</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

然后将它导入到现有的项目中

```diff
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>my-cli-app</artifactId>
    <version>1.0-SNAPSHOT</version>

+   <dependencyManagement>
+       <dependencies>
+           <dependency>
+               <groupId>org.example</groupId>
+               <artifactId>sample-BOM</artifactId>
+               <version>1.0.0</version>
+               <type>pom</type>
+               <scope>import</scope>
+           </dependency>
+       </dependencies>
+   </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.mongodb</groupId>
            <artifactId>mongodb-driver-sync</artifactId>
-           <version>4.4.0</version>
        </dependency>
        <dependency>
            <groupId>info.picocli</groupId>
            <artifactId>picocli</artifactId>
-           <version>4.4.0</version>
        </dependency>
    </dependencies>
</project>
```

这样主需要在sample-BOM项目中修改依赖的版本，所有导入了sample-BOM的项目的版本就会随之而改变了。

## 参考

- [Efficiently manage dependencies thanks to maven BOM - Dev Community](https://dev.to/jbebar/effectively-manage-dependencies-thanks-to-maven-bom-449f)