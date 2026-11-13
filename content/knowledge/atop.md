---
title: atop 是什么，怎么用
subtitle: 实时看系统与进程负载，按天记录成二进制日志，事后按时间回放
date: 2026-11-13
tags: [Linux, CLI]
section: 系统
---

## 要点

atop 是 Linux 的系统和进程级性能监控工具，既能实时查看负载，也能把每次采样写成日志供事后回放。

- 系统级覆盖 CPU、内存与 swap、分页、磁盘、网卡；进程级能看到每个进程的 CPU、内存、磁盘读写，装 `netatop` 后还有网络。
- 三个入口：`atop` 实时看，`atop -w` 持续记录，`atop -r` 回放，`atopsar` 从日志或实时数据出周期报表。
- 默认 10 秒采样；发行版的后台日志默认 10 分钟一次、保留 28 天，排障时先看 `/var/log/atop/atop_YYYYMMDD`。

## 用法

### 安装与后台日志

```bash
sudo apt install atop   # Debian / Ubuntu
sudo dnf install atop   # RHEL / Fedora / Rocky
systemctl list-timers 'atop*'
```

安装后由 `atop-rotate.timer`（部分发行版用 cron）每天零点重启采集进程，日志写入 `/var/log/atop/atop_YYYYMMDD`。保留策略在 `/etc/default/atop`，RHEL 系在 `/etc/sysconfig/atop`：

```bash
LOGINTERVAL=600    # 采样间隔，单位秒
LOGGENERATIONS=28  # 日志保留天数
LOGPATH=/var/log/atop
```

### 实时查看

```bash
sudo atop        # 每 10 秒刷新
sudo atop 5      # 每 5 秒刷新
sudo atop -1 5   # 计数按每秒平均值显示
```

| 参数               | 作用                                     |
| ------------------ | ---------------------------------------- |
| `-a`               | 显示所有进程，而不只是区间内有活动的进程 |
| `-c`               | 显示完整命令行，定位同名进程             |
| `-d`               | 按进程看磁盘读写量                       |
| `-m`               | 按进程看内存占用                         |
| `-n`               | 按进程看网络收发，需要 `netatop`         |
| `-s`               | 看调度信息：状态、nice、优先级、所在 CPU |
| `-u` / `-p` / `-j` | 按用户 / 程序 / 容器汇总资源消耗         |
| `-y`               | 展开进程内的线程                         |
| `-P`               | 输出可解析的键值格式，便于脚本处理       |

### 交互按键

| 按键                                    | 作用                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| `g` / `m` / `d` / `n` / `s` / `v` / `c` | 切换通用 / 内存 / 磁盘 / 网络 / 调度 / 进程信息 / 命令行视图 |
| `C` / `M` / `D` / `N` / `A`             | 按 CPU / 内存 / 磁盘 / 网络 / 当前最忙资源排序               |
| `a`                                     | 在“仅活动进程”和“全部进程”之间切换                           |
| `f`                                     | 显示未活动资源的系统级行                                     |
| `l`                                     | 限制 CPU、磁盘、网卡各显示多少行                             |
| `i`                                     | 修改刷新间隔                                                 |
| `z`                                     | 暂停画面，便于翻看当前采样                                   |
| `t` / `T`                               | 回放时跳到下一个 / 上一个采样                                |
| `b`                                     | 回放时跳到指定时刻                                           |
| `q`                                     | 退出                                                         |

### 记录与回放

```bash
sudo atop -w /tmp/atop.raw 60 30    # 每 60 秒采样一次，共 30 次
sudo atop -r /tmp/atop.raw          # 回放，t/T 前后翻，b 跳到时刻
sudo atop -r y -b 14:00 -e 15:00    # 昨天的日志，只看 14:00 到 15:00
sudo atop -r 20261112               # 指定日期，读 /var/log/atop/atop_20261112
```

`-w` 写入的是压缩二进制文件；文件已存在时会追加新采样，不会覆盖。`-r` 不给文件名时默认读当天的日志，`y` 表示昨天、`yy` 表示前天，以此类推。

### 用 atopsar 出报表

```bash
atopsar                          # 今天到目前为止的 CPU 报告
atopsar -m -r 20261112 -b 10:00 -e 12:30
atopsar -d 5 10                  # 每 5 秒采一次，共 10 次，看磁盘
atopsar -A -r /tmp/atop.raw      # 一次输出所有报告
```

| 参数                      | 报告                                                |
| ------------------------- | --------------------------------------------------- |
| `-c` / `-p`               | CPU 利用率 / 负载均值与中断                         |
| `-m` / `-s` / `-B`        | 内存与 swap 占用 / 换页与 swap 活动 / PSI 压力      |
| `-d` / `-l` / `-f`        | 磁盘 / LVM / 软 RAID                                |
| `-i` / `-I`               | 网卡流量 / 网卡错误                                 |
| `-t` / `-T`               | TCP 流量 / TCP 错误                                 |
| `-P`                      | 进程与线程总数                                      |
| `-O` / `-G` / `-D` / `-N` | top 3 的 CPU / 内存 / 磁盘 / 网络进程，仅支持读日志 |
| `-A`                      | 全部报告                                            |

### 看懂系统级输出

| 行            | 含义                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| `PRC`         | 进程与线程总数、running / sleeping 数量、退出进程数                           |
| `CPU` / `cpu` | 全部 CPU 与单核利用率：`sys`、`user`、`irq`、`idle`、`wait`、`steal`、`guest` |
| `CPL`         | load average、上下文切换、中断次数                                            |
| `MEM` / `SWP` | 内存与 swap 占用、page cache、slab、overcommit                                |
| `PAG`         | 页扫描、换入换出、`oomkill`                                                   |
| `PSI`         | CPU、内存、I/O 的压力停顿百分比                                               |
| `DSK`         | 磁盘 `busy`、读写次数与吞吐、队列深度 `avq`、平均延迟 `avio`                  |
| `NET`         | TCP / UDP / IP 计数与各网卡流量                                               |

### 典型排障路径

| 现象                    | 先看什么                                                               |
| ----------------------- | ---------------------------------------------------------------------- |
| CPU 高                  | `atop` 里按 `C` 排序；`atop -y` 看是哪个线程                           |
| 内存持续上涨或开始 swap | `atop -m`，再看 `PAG` 的 `swout`、`oomkill` 与 `PSI` 的 `memfull`      |
| 磁盘慢                  | `atop -d`，结合 `DSK` 的 `busy`、`avq`、`avio` 判断是忙还是单次 I/O 慢 |
| 网络慢                  | `atop -n`（需 `netatop`）看进程，或 `atopsar -i` 看网卡                |
| 进程跑完就消失          | 启用 `atopacct` 进程记账，退出进程默认会留在列表里，按 `v` 看退出码    |

## 与其他 top 类命令的区别

top / htop / btop 只看当下的进程，vmstat / iostat / sar 只看系统级聚合，atop 是默认就把系统级与进程级一起落盘、事后能按时刻回放的那个。

| 工具            | 层级 | 历史记录               | 进程级磁盘 / 网络  | 典型用途                          |
| --------------- | ---- | ---------------------- | ------------------ | --------------------------------- |
| `top`           | 进程 | 无                     | 无 / 无            | 任何机器都有的应急查看            |
| `htop` / `btop` | 进程 | 无                     | 有 / 无            | 交互更顺的实时排查                |
| `vmstat`        | 系统 | 无                     | —                  | 换页、上下文切换、CPU，一行一采样 |
| `iostat`        | 设备 | 无                     | —                  | 每块盘的吞吐与延迟                |
| `sar` / `sadf`  | 系统 | 有，发行版同样定时采集 | 无 / 无            | 事后看系统级曲线、导出 CSV        |
| `pidstat`       | 进程 | 无                     | 有 / 无            | 按进程出 CPU、IO、page fault      |
| `atop`          | 两者 | 有，默认留 28 天       | 有 / 有（netatop） | 事后定位是哪个进程造成的抖动      |

- 只问“现在谁在吃 CPU、内存”：top、htop、btop 足够，依赖更少、开销更低，但采样只在内存里，关掉就没了。
- 只问“盘、网卡、内存是不是瓶颈”：vmstat、iostat、sar 更合适，一行一样本，直接进脚本和图表；它们没有进程维度。
- 要回答“昨天 14:20 那次抖动是谁造成的”：sar 只能给系统级曲线，pidstat 得当时就开着抓，只有 atop 这类带进程维度的落盘工具能直接翻到那个时刻的进程列表。
- 已经上了 Prometheus、netdata、PCP：atop 补的是单机进程级的事后取证，不是它们的替代品。

## 边界

- 日志是压缩二进制且格式随版本变化，跨版本先用 `atopconvert` 转换；跨机器分析最好保持 atop 版本一致。
- 后台日志默认 10 分钟一次，会抹平秒级尖峰；抓短时抖动要临时用 `atop -w /tmp/atop.raw 1` 或直接 `atop 1`。
- 非 root 运行是受限视图：读不到全部系统计数、进程级磁盘读写和已退出进程信息。
- 进程级网络统计依赖 `netatop` 内核模块；进程级磁盘统计依赖内核 storage accounting（2.6.20 起，现代发行版默认开启）。
- 磁盘 `busy` 对 SSD、NVMe、RAID 不代表性能上限，要结合 `avio`、`avq` 和业务延迟一起看。
- atop 只负责采集与查看，不做告警和长期时序存储；需要告警、跨机汇总时接 Prometheus、PCP 等。

## 参考

- [atop 官方站点](https://www.atoptool.nl/)
- [atop(1) man page](https://manpages.debian.org/bookworm/atop/atop.1.en.html)
- [atopsar(1) man page](https://manpages.debian.org/bookworm/atop/atopsar.1.en.html)
- [atop 源码仓库](https://github.com/Atoptool/atop)
