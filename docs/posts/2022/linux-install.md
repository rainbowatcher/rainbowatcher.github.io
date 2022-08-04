---
layout: Post
title: Linux 系统的安装（Window双系统）
subtitle:
date: 2022-08-03
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/linux.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
# hide: true
tags: [Linux]
---

在之前使用 windows 过程中，觉得安装双系统是一件很酷的事情，且处于对 linux 系统的喜爱折腾过不少次，在这里记录下之前的安装经验。

<!-- more -->

## 刻录软件

- Win32DiskImager
- UltraISO
- rufus
- Etcher
- 深度 U 盘助手

## Windows 设置

1. 取消快速启动

   电源选项->选择电源按钮的功能->取消快速启动

2. 取消安全启动

   重启电脑进入 UEFI 界面找到 secure boot 选择 disable

## 分区推荐

| 挂载点 | 挂载点中文名     | 文件系统     | 大小                                |
| ------ | ---------------- | ------------ | ----------------------------------- |
| /      | 根分区（必选）   | EXT4（推荐） | 最少 10G                            |
| /home  | 家目录（推荐）   | EXT4（推荐） | 最少 10G                            |
| /swap  | 交换分区（可选） | 不设置       | 4G 内存以下分配 2G，4G 以上可不分配 |
| /boot  | 引导分区（可选） | EXT4（推荐） | 128MB 左右                          |

## 启动引导器

uefi 模式下，存在 uefi 分区管理引导启动分区

文件格式如下：

```shell
- uefi/
    - bootx64.efi
- microsoft/
    - boot/
    - efi/
- ubuntu/
    - grub*.efi
```

默认计算机会读取 uefi 下的 bootx64.efi 文件作为系统引导

## 安装常见问题

### 1. Centos nouveau 显示驱动与 NVIDIA 显卡冲突

```shell
X startup failed，falling back to text mode
```

解决方案：

在 install Centos 出现的界面按 e 在第二行（linuxefi 所在行）结尾添加

```shell
nouveau.modeset=0
```

### 2. 找不到 U 盘路径

```shell
dracut-initqueue[624]:Warning:Could not boot.
dracut-initqueue[624]:Warning:/dev/root does not exist.
Starting Dracut EmergencyShell...
Warning:/dev/root does not exist
```

解决方案：

改

```shell
linuxefi /images/pxeboot/vmlinuz inst.stage2=he:LABEL=CentOs\x207\x20x\86_64 quiet
```

为

```shell
linuxefi /images/pxeboot/vmlinuz initrd=initrd.img linux dd quiet
```

### 3. 重启进入安装过程碰到的问题：

1.  直接进入 dracut 界面

```shell
dracut:/#
```

原因分析：
无法识别 u 盘名称找不到路径文件。

解决：

1. 在安装界面按下 tab 键或者提示的按键，修改参数，把路径改正确。 
2. 使用 win32 disk imager 制作 u 盘镜像。

## 参考资料

- [安装 Ubuntu Linux 分区的推荐方案和方法 - 博客园](https://www.cnblogs.com/sinferwu/p/7953853.html)
- [Deepin 安装指南 - 深度系统](https://www.deepin.org/installation/)
- [UEFI+GPT、Legacy+MBR 引导模式介绍 & 引导修复 - 百度贴吧](http://tieba.baidu.com/p/5003454493?pid=104792401528&cid=0#104792401528)
- [计算机的启动过程](http://blog.szm.me/misc/the_starting_process_of_a_computer/)
- [UEFI/GPT 模式下安装的 Windows-ArchWiki-Grub](<https://wiki.archlinux.org/index.php/GRUB_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)#UEFI/GPT_%E6%A8%A1%E5%BC%8F%E4%B8%8B%E5%AE%89%E8%A3%85%E7%9A%84_Windows>)
- [使用 Windows 进行双启动 #Windows UEFI 和 BIOS 启动的局限 - ArchWiki](https://wiki.archlinux.org/index.php/Dual_boot_with_Windows#Windows_UEFI_vs_BIOS_limitations)
- [使用 Windows 进行双启动 #UEFI / BIOS 启动管理器的局限 - ArchWiki](https://wiki.archlinux.org/index.php/Dual_boot_with_Windows#Bootloader_UEFI_vs_BIOS_limitations)
