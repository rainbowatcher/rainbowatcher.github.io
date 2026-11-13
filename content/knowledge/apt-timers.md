---
title: apt 的自动更新定时器在什么时候触发
subtitle: OnCalendar 按系统本地时区解释，名义时间之外还有最长 12 小时的随机延迟
date: 2026-11-13
tags: [Linux, 运维]
section: 系统
---

## 要点

Debian / Ubuntu 的 apt 自动更新由两个 systemd timer 驱动，触发时间都按系统本地时区解释，不是固定 UTC。

- `apt-daily.timer`：名义上每天 06:00、18:00 触发，负责 `apt-get update` 刷新包索引；随机延迟最多 12 小时。
- `apt-daily-upgrade.timer`：名义上每天 06:00 触发，负责调用 `unattended-upgrade` 安装允许的更新并清理缓存；随机延迟最多 60 分钟。
- 实际执行时间还受时区、`Persistent=true`（关机补跑）和 `ConditionACPower=true`（电池供电跳过）影响。

## 用法

### 触发时间

`OnCalendar` 里没有写时区时，systemd 按系统本地时区解释。下面先给名义时间，再给常见时区换算。

| Timer                     | `OnCalendar`    | 随机延迟 | 名义触发（系统本地时区） | 实际窗口（本地时区）          |
| ------------------------- | --------------- | -------- | ------------------------ | ----------------------------- |
| `apt-daily.timer`         | `*-*-* 6,18:00` | `12h`    | 每天 06:00、18:00        | 06:00–18:00、18:00–次日 06:00 |
| `apt-daily-upgrade.timer` | `*-*-* 6:00`    | `60m`    | 每天 06:00               | 06:00–07:00                   |

| 系统时区                           | `apt-daily.timer` 名义触发                     | `apt-daily-upgrade.timer` 名义触发 |
| ---------------------------------- | ---------------------------------------------- | ---------------------------------- |
| `UTC`                              | 06:00、18:00 UTC（北京时间 14:00、次日 02:00） | 06:00 UTC（北京时间 14:00）        |
| `Asia/Shanghai`（UTC+8，北京时间） | 06:00、18:00（北京时间）                       | 06:00（北京时间）                  |

关键：`OnCalendar` 里的 06:00 是服务器本地时间，不是 UTC。云镜像常把时区设为 UTC，此时 06:00 实际是北京时间 14:00。

查看当前机器的时区和下次触发：

```bash
timedatectl show -p Timezone --value
systemctl list-timers 'apt-daily*'
```

`systemctl list-timers` 的 `NEXT` 列已经是系统本地时间；如果 SSH 客户端和服务器时区不同，以服务器上的 `timedatectl` 为准。

### 两个 timer 的分工

```text
apt-daily.timer
  → apt-daily.service
    → /usr/lib/apt/apt.systemd.daily update
      → apt-get update

apt-daily-upgrade.timer
  → apt-daily-upgrade.service
    → /usr/lib/apt/apt.systemd.daily install
      → unattended-upgrade
      → apt-get clean
```

`apt-daily.timer` 只刷新索引，不安装包。`apt-daily-upgrade.timer` 才执行安装，但只有同时满足以下条件才会真正升级：

- 安装了 `unattended-upgrades`；
- `/etc/apt/apt.conf.d/20auto-upgrades` 中 `APT::Periodic::Unattended-Upgrade` 不为 `0`；
- 当前不是电池供电（服务带 `ConditionACPower=true`）。

升级范围由 `/etc/apt/apt.conf.d/50unattended-upgrades` 的 `Origins-Pattern` 决定：Debian 模板默认匹配 Debian 稳定仓库和 Debian-Security，不是无差别 `dist-upgrade`，也不会升级第三方源。

### 为什么实际时间会偏

- `RandomizedDelaySec`：systemd 在名义时间后随机挑一个延迟，避免同一镜像的机器同时打更新。`apt-daily.timer` 最多推迟 12 小时，`apt-daily-upgrade.timer` 最多推迟 60 分钟。
- `Persistent=true`：如果触发时机器关机，下次启动后会补跑一次，实际时间就是启动时间。
- `ConditionACPower=true`：笔记本用电池时服务被跳过，timer 仍按下一个周期再触发。
- `AccuracySec` 默认 1 分钟，也会带来最多 1 分钟的误差。

### 固定到某个时区

如果业务要求“北京时间凌晨 6 点”而不是“服务器本地时间 6 点”，可以给 timer 加 drop-in，显式写时区：

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

`OnCalendar=` 空赋值会清掉原有日历表达式，再写入新的。`apt-daily.timer` 同理；如果保留随机延迟，把 `RandomizedDelaySec=0` 换成需要的值。

### 查看与关闭

```bash
systemctl cat apt-daily.timer apt-daily-upgrade.timer
systemctl status apt-daily-upgrade.timer
journalctl -u apt-daily.service -u apt-daily-upgrade.service -n 100 --no-pager

sudo systemctl disable --now apt-daily-upgrade.timer   # 只关自动升级
sudo systemctl disable --now apt-daily.timer           # 连索引刷新一起关
```

只关 timer 不影响手动执行 `apt update` / `apt upgrade`。要持久关闭自动升级，也可以运行 `sudo dpkg-reconfigure unattended-upgrades`，或把 `20auto-upgrades` 里的值改为 `0`。

## 边界

- 这套 timer 来自 Debian / Ubuntu 的 `apt` 包；其他发行版不一定有同名单元。
- `apt-daily-upgrade.timer` 存在不等于会自动升级；没有 `unattended-upgrades` 或配置为 `0` 时，它不会安装任何包。
- 容器、chroot 或没有以 systemd 作为 PID 1 的环境不会运行这些 timer。
- 名义时间不是承诺：随机延迟、关机补跑、电源条件和依赖服务都会让实际执行时间偏离。

## 参考

- [apt-daily.timer 单元文件](https://sources.debian.org/src/apt/latest/debian/apt-daily.timer/)
- [apt-daily-upgrade.timer 单元文件](https://sources.debian.org/src/apt/latest/debian/apt-daily-upgrade.timer/)
- [apt-daily-upgrade.service 单元文件](https://sources.debian.org/src/apt/latest/debian/apt-daily-upgrade.service/)
- [systemd.timer(5)](https://manpages.debian.org/bookworm/systemd/systemd.timer.5.en.html)
- [unattended-upgrade(8)](https://manpages.debian.org/bookworm/unattended-upgrades/unattended-upgrade.8.en.html)
