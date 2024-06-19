---
layout: Post
title: Linux 常用命令
subtitle:
date: 2022-08-11
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/linux.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [Linux, CLI]
---

## 帮助

| 命令 | 全称   | 描述                                                                                       | 示例       |
| ---- | ------ | ------------------------------------------------------------------------------------------ | ---------- |
| man  | manual | Linux 下的帮助指令，通过 man 指令可以查看 Linux 中的指令帮助、配置文件帮助和编程帮助等信息 | `man echo` |
| help |        | 用于显示 shell 内部命令的帮助信息                                                          | `help cd`  |

## 系统信息

| 命令          | 全称                        | 描述                   | 示例             |
| ------------- | --------------------------- | ---------------------- | ---------------- |
| lsb_release   | Linux Standard Base Release | 显示发行版本信息       | `lsb_release -a` |
| uname         |                             | 显示 Linux 系统信息    | `uname -a`       |
| kernelversion | Kernel Version              | 显示内核版本信息       |                  |
| top           |                             | 显示或管理执行中的程序 |

有的发行版会在下面的目录中存放版本信息

```shell
cat /proc/version
cat /etc/os-release
cat /etc/issue
```

## 文件管理

文件系统通常分为目录和文件，但是 linux 中一切都是文件，所以这里列出操作文件的命令和可以同时操作文件和目录的命令。

| 命令    | 全称                            | 描述                             | 示例                          |
| ------- | ------------------------------- | -------------------------------- | ----------------------------- |
| touch   |                                 | 创建文件                         | `touch filename`              |
| rm      | remove                          | 删除文件或目录                   | `rm filename`                 |
| cp      | copy                            | 复制文件到指定目录               | `cp source target`            |
| mv      | move                            | 移动文件到指定目录               | `mv source target`            |
| find    |                                 | 从指定目录查找文件               | `find /home -name "\\\*.txt"` |
| whereis |                                 | 用于查看某个命令和帮助文档的位置 | `whereis ls`                  |
| which   |                                 | 查找并显示给定命令的绝对路径     | `which ls`                    |
| ln      | link                            | 创建硬连接和符号链接             | `ln source target`            |
| du      | display file space usage        | 显示每个文件和目录的磁盘使用空间 | `du -h .`                     |
| df      | display file system space usage | 显示磁盘的相关信息               | `df -h`                       |

### 硬链接与软链接

> Linux 链接分两种，一种被称为硬链接（Hard Link），另一种被称为软链接，即符号链接（Symbolic Link）。
>
> 在 Linux 的文件系统中，保存在磁盘分区中的文件不管是什么类型都给它分配一个编号，这个编号被称之为索引节点号（Inode Index），也就是常说的 inode 号。Inode 号上与文件名关联，下与用户数据库（data block）关联。
>
> 硬链接指文件名与索引节点号（即 inode 号）的链接（所以创建一个新的文件，该文件使用 stat 命令查看时，links 显示的是 1），索引节点号（inode 号）可以对应一个或多个文件名，并且这些文件名可以在同一或不同目录。
>
> 由于硬链接是直接将文件名与索引节点号（即 inode 号）链接，因此硬链接存在以下几个特点： 1、文件有相同的 inode 号及 data block，这使得修改其中一个硬链接文件属性或文件数据时，其他硬链接文件都会发生相应修改；2、只能对已存在的文件进行创建；3、不能跨文件系统（即分区）进行创建；4、不能对目录文件进行创建；5、删除其中一个硬链接文件时，不会对其他硬链接文件产生影响。

参考资料：

- [鸟哥的 Linux 私房菜 - Link](https://linux.vbird.org/linux_basic/centos7/0230filesystem.php#link)
- [快乐的 Linux 命令行 - 操作文件和目录](http://billie66.github.io/TLCL/book/chap05.html)

### 读文件

| 命令 | 全称                        | 描述                                                                | 示例                |
| ---- | --------------------------- | ------------------------------------------------------------------- | ------------------- |
| more |                             | more 命令是一个基于 vi 编辑器文本过滤器，支持 vi 中的关键字定位操作 | `more filename`     |
| less |                             | 与 more 十分相似，不同的是 less 命令允许用户向前或向后浏览文件      | `less filename`     |
| head |                             | 查看文件的头部内容                                                  | `head -10 filename` |
| tail |                             | 查看文件的尾部内容                                                  | `tail -10 filename` |
| cat  | concatenate files and print | 连接文件并打印，通常用来一次性打印文件内的所有内容                  | `cat filename`      |

### 写文件

| 命令   | 全称 | 描述                 | 示例          |
| ------ | ---- | -------------------- | ------------- |
| vi/vim |      | 内置文本编辑器       | `vi filename` |
| >      |      | 输出重定向，覆盖输出 |               |
| >>     |      | 输出重定向，追加输出 |               |

## 目录

| 命令  | 全称                 | 描述                 | 示例             |
| ----- | -------------------- | -------------------- | ---------------- |
| ls    | list                 | 列举一个目录或者文件 | `ls -l`          |
| cd    | change directory     | 切换工作目录         | `cd target_path` |
| pwd   | print work directory | 打印当前工作目录     | `pwd`            |
| mkdir | make directory       | 创建文件夹           | `mkdir die_name` |

## 终端相关

| 命令    | 全称            | 描述                              | 示例                        |
| ------- | --------------- | --------------------------------- | --------------------------- |
| clear   |                 | 用于清屏,同快捷键`ctrl+l`         | `clear`                     |
| history |                 | 用于查看自己运行过的命令          | `history`                   |
| echo    |                 | 输出内容到终端                    | `echo hello`                |
| printf  | print formatted | 格式化输出内容到终端              | `printf "hello %s\n" world` |
| declare |                 | 用于声明或显示已存在的 shell 变量 | `declare key="value"`       |
| command |                 | 调用并执行命令                    | `command -v zsh`            |
| time    |                 | 统计命令运行的时间                | `time zsh -i -c exit`       |
| unset   | undo set        | 删除指定的 shell 变量或函数       | `unset var`                 |

## 设备管理

:exclamation: 操作设备相对危险

| 命令  | 全称             | 描述                                                 | 示例                            |
| ----- | ---------------- | ---------------------------------------------------- | ------------------------------- |
| mount |                  | 用于挂载 Linux 系统外的文件                          | `mount /dev/sdb1 /primary_part` |
| fdisk |                  | 查看磁盘使用情况和磁盘分区，命令执行会进入交互式界面 | `fdisk /dev/sdb`                |
| mkfs  | make file system | 用于在设备上创建 Linux 文件系统                      | `mkfs -t ext3 /dev/sda6`        |

## 服务管理

| 命令      | 全称 | 描述               | 示例                                 |
| --------- | ---- | ------------------ | ------------------------------------ |
| systemctl |      | 系统服务管理器指令 | `systemctl list-units –type=service` |

## 网络管理

| 命令     | 全称 | 描述                          | 示例             |          |
| -------- | ---- | ----------------------------- | ---------------- | -------- |
| ifconfig |      | 用于查看和配置网络信息        | `ifconfig -a`    |          |
| route    |      | 显示并设置 Linux 中静态路由表 |                  |          |
| netstat  |      | 查看 Linux 中网络系统状态信息 | `netstat -atunlp | grep 22` |

## 进程管理

| 命令 | 全称 | 描述                   | 示例         |
| ---- | ---- | ---------------------- | ------------ |
| kill |      | 删除执行中的工作或进程 | `kill 12345` |
