---
title: apt 包里有哪些 systemd timer
subtitle: apt 自带两个 timer：一个刷新包索引，一个执行自动升级与清理
date: 2026-11-13
tags: [Linux, 运维]
section: 系统
---

## 要点

Debian / Ubuntu 的 `apt` 包自带两个 systemd timer，二者都通过 `/usr/lib/apt/apt.systemd.daily` 执行实际任务。

| Timer                                                   | 触发的服务                  | 职责                     | 触发时间（服务器本地时区）       |
| ------------------------------------------------------- | --------------------------- | ------------------------ | -------------------------------- |
| [`apt-daily.timer`](apt-daily-timer.md)                 | `apt-daily.service`         | 刷新包索引               | 每天 06:00、18:00，随机延迟 ≤12h |
| [`apt-daily-upgrade.timer`](apt-daily-upgrade-timer.md) | `apt-daily-upgrade.service` | 安装允许的更新并清理缓存 | 每天 06:00，随机延迟 ≤60min      |

表中的时间均为服务器本地时区；UTC / Asia/Shanghai 的换算和实际窗口见各自文章。

## 用法

### 共同点

- 两个 timer 都由 `apt` 包安装，属于系统级 systemd timer，不是用户 crontab。
- `OnCalendar` 未写时区时按系统本地时区解释，实际触发还要叠加 `RandomizedDelaySec`。
- 服务都带 `ConditionACPower=true`（电池供电跳过），timer 都带 `Persistent=true`（关机错过后补跑）。

### 查看

```bash
timedatectl show -p Timezone --value
systemctl list-timers 'apt-daily*'
systemctl cat apt-daily.timer apt-daily-upgrade.timer
```

`systemctl list-timers` 的 `NEXT` 列显示的是服务器本地时间；SSH 客户端与服务器时区不同时，以服务器上的 `timedatectl` 为准。

### 固定到某个时区

如果要求“北京时间 06:00”而不是“服务器本地时间 06:00”，给对应 timer 加 drop-in：

```bash
sudo systemctl edit apt-daily-upgrade.timer
```

```ini
[Timer]
OnCalendar=
OnCalendar=*-*-* 06:00:00 Asia/Shanghai
RandomizedDelaySec=0
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart apt-daily-upgrade.timer
```

`OnCalendar=` 空赋值会清掉原有表达式，再写入新的。`apt-daily.timer` 同理，只是要写两条 `OnCalendar=`（06:00 和 18:00）。

### 两个 timer 的详情

- [apt-daily.timer 什么时候触发](apt-daily-timer.md)
- [apt-daily-upgrade.timer 什么时候触发](apt-daily-upgrade-timer.md)

## 边界

- 这两个单元来自 Debian / Ubuntu 的 `apt` 包，其他发行版不一定有同名 timer。
- timer 只负责调度；`apt-daily-upgrade.timer` 是否真正安装包取决于 `unattended-upgrades` 的安装与配置。
- 容器、chroot 或没有以 systemd 作为 PID 1 的环境不会运行这些 timer。

## 参考

- [apt-daily.timer 单元文件](https://sources.debian.org/src/apt/latest/debian/apt-daily.timer/)
- [apt-daily-upgrade.timer 单元文件](https://sources.debian.org/src/apt/latest/debian/apt-daily-upgrade.timer/)
- [systemd.timer(5)](https://manpages.debian.org/bookworm/systemd/systemd.timer.5.en.html)
