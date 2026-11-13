---
title: apt-daily.timer 什么时候触发
subtitle: 名义上每天 06:00、18:00（服务器本地时区），随机延迟最多 12 小时
date: 2026-11-13
tags: [Linux, 运维]
section: 系统
---

## 要点

`apt-daily.timer` 是 apt 包自带的 systemd timer，负责定时刷新包索引，不安装任何包。

- `OnCalendar=*-*-* 6,18:00`，名义触发为每天 06:00、18:00，按服务器本地时区解释。
- UTC 服务器对应 06:00、18:00 UTC（北京时间 14:00、次日 02:00）；Asia/Shanghai 服务器对应 06:00、18:00 北京时间。
- `RandomizedDelaySec=12h` 让实际触发落在名义点之后 0–12 小时内；`Persistent=true` 关机补跑。

## 用法

### 触发时间

| 系统时区                 | 名义触发                                       | 实际窗口                              |
| ------------------------ | ---------------------------------------------- | ------------------------------------- |
| `UTC`                    | 06:00、18:00 UTC（北京时间 14:00、次日 02:00） | 06:00–18:00 UTC、18:00–次日 06:00 UTC |
| `Asia/Shanghai`（UTC+8） | 06:00、18:00 北京时间                          | 06:00–18:00、18:00–次日 06:00         |

`OnCalendar` 不带时区后缀时按系统本地时区解释，规则见 [apt 包里有哪些 systemd timer](apt-timers.md)。

### 执行链

```text
apt-daily.timer
  → apt-daily.service
    → /usr/lib/apt/apt.systemd.daily update
      → apt-get update
```

`apt-daily.service` 是 `Type=oneshot`，`TimeoutSec=30min`，带 `ConditionACPower=true`；启动顺序上排在 `network.target` 等网络单元之后。它只运行 `apt-get update`，不执行 `upgrade`。

### 查看

```bash
systemctl list-timers apt-daily.timer
systemctl cat apt-daily.timer
systemctl status apt-daily.service
journalctl -u apt-daily.service -n 50 --no-pager
```

### 关闭

```bash
sudo systemctl disable --now apt-daily.timer
```

只关这个 timer 会停止自动刷新索引，不影响手动 `apt update`。升级逻辑在 [apt-daily-upgrade.timer 什么时候触发](apt-daily-upgrade-timer.md)。

## 边界

- 配置 `APT::Periodic::Update-Package-Lists "0"` 时，timer 仍会触发，但服务里的脚本会跳过更新。
- 名义时间不是承诺：12 小时随机延迟、默认 1 分钟的 `AccuracySec`、关机补跑、电池供电都会改变实际执行时间。
- 它不会安装或升级包。

## 参考

- [apt-daily.timer 单元文件](https://sources.debian.org/src/apt/latest/debian/apt-daily.timer/)
- [apt-daily.service 单元文件](https://sources.debian.org/src/apt/latest/debian/apt-daily.service/)
- [systemd.timer(5)](https://manpages.debian.org/bookworm/systemd/systemd.timer.5.en.html)
