# 概述

关于 Linux 的介绍见[百科词条](https://baike.baidu.com/item/Linux)，常见发行版可以参考[DistroWatch 的点击排行榜](https://distrowatch.com/dwres.php?resource=popularity)。一般来说商用 Linux 主要采用 RedHat 系和 Oracle 系。

## 相关资料

- [Linux Tutorials](https://www.linux.org/forums/#linux-tutorials.122)
- [CS-Notes Linux](https://www.cyc2018.xyz/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80/Linux/Linux.html)
- [鸟哥的 Linux 私房菜](https://linux.vbird.org/)
- [Linus Shell](http://billie66.github.io/TLCL/book/)

## 目录结构

参考：

- [Linux 目录结构|菜鸟教程](https://www.runoob.com/linux/linux-system-contents.html)
- [快乐的 Linux 命令行|探究操作系统](http://billie66.github.io/TLCL/book/chap04.html)

## 环境变量 PATH

可以在环境变量 PATH 中声明可执行文件的路径，路径之间用 : 分隔。

```
/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/dmtsai/.local/bin:/home/dmtsai/bin
```

## sudo

sudo 允许一般用户使用 root 可执行的命令，不过只有在 /etc/sudoers 配置文件中添加的用户才能使用该指令。

## 包管理工具

RPM 和 DPKG 为最常见的两类软件包管理工具：

- RPM 全称为 Redhat Package Manager，最早由 Red Hat 公司制定实施，随后被 GNU 开源操作系统接受并成为许多 Linux 系统的既定软件标准。YUM 基于 RPM，具有依赖管理和软件升级功能。
- 与 RPM 竞争的是基于 Debian 操作系统的 DEB 软件包管理工具 DPKG，全称为 Debian Package，功能方面与 RPM 相似。

## 管道指令

管道是将一个命令的标准输出作为另一个命令的标准输入，在数据需要经过多个步骤的处理之后才能得到我们想要的内容时就可以使用管道。

## 一切皆文件

> Not only is that digital photo that you uploaded to your computer a file, but your monitor is a file too! You see, in Linux, everything is a file!
> -- [In Linux, Everything is a File](https://www.linux.org/threads/in-linux-everything-is-a-file.4251/)

在 Linux 里，不仅你上传到电脑的照片是文件，你的显示器同样是一个文件，所有的东西都是文件。
