---
title: apt-daily-upgrade.timer 什么时候触发
subtitle: 名义上每天 06:00（服务器本地时区），随机延迟最多 60 分钟
date: 2026-11-13
tags: [Linux, 运维]
section: 系统
---

## 要点

`apt-daily-upgrade.timer` 是 apt 包自带的 systemd timer，触发自动升级与缓存清理；它不负责刷新包索引。

- `OnCalendar=*-*-* 6:00`，名义触发为每天 06:00，按服务器本地时区解释。
- UTC 服务器对应 06:00 UTC（北京时间 14:00）；Asia/Shanghai 服务器对应 06:00 北京时间。
- `RandomizedDelaySec=60m` 让实际触发落在 06:00–07:00；只有安装并启用 `unattended-upgrades` 才会真正安装包。

## 用法

### 触发时间

| 系统时区                 | 名义触发                    | 实际窗口                                |
| ------------------------ | --------------------------- | --------------------------------------- |
| `UTC`                    | 06:00 UTC（北京时间 14:00） | 06:00–07:00 UTC（北京时间 14:00–15:00） |
| `Asia/Shanghai`（UTC+8） | 06:00 北京时间              | 06:00–07:00 北京时间                    |

`OnCalendar` 不带时区后缀时按系统本地时区解释，规则见 [apt 包里有哪些 systemd timer](apt-timers.md)。

### 执行链

```text
apt-daily-upgrade.timer
  → apt-daily-upgrade.service
    → /usr/lib/apt/apt.systemd.daily install
      → unattended-upgrade
      → apt-get clean
```

`apt-daily-upgrade.service` 是 `Type=oneshot`，`After=apt-daily.service`，带 `ConditionACPower=true`；升级脚本最长可运行 12 小时（`TimeoutStartSec=12hours`）。

### 什么时候真的升级

- 已安装 `unattended-upgrades`，并且系统能找到 `unattended-upgrade` 命令；
- `/etc/apt/apt.conf.d/20auto-upgrades` 中 `APT::Periodic::Unattended-Upgrade` 不为 `0`；
- 机器没有使用电池供电；
- 待升级的包匹配 `/etc/apt/apt.conf.d/50unattended-upgrades` 的 `Origins-Pattern`。

Debian 模板的 `Origins-Pattern` 默认包含 `label=Debian` 和 `label=Debian-Security`，即稳定仓库与安全仓库，默认不包含第三方源。它不是无差别 `dist-upgrade`，默认也不会自动重启机器。没有 `unattended-upgrades` 时，`install` 分支不会安装包，最多执行缓存清理。

### 查看与关闭

```bash
systemctl list-timers apt-daily-upgrade.timer
systemctl cat apt-daily-upgrade.timer
systemctl status apt-daily-upgrade.service
journalctl -u apt-daily-upgrade.service -n 100 --no-pager

sudo systemctl disable --now apt-daily-upgrade.timer
sudo dpkg-reconfigure unattended-upgrades
```

只关 timer 不影响手动 `apt upgrade`；如果要保留 timer 但停止自动安装，用 `dpkg-reconfigure` 或在 `20auto-upgrades` 中把 `APT::Periodic::Unattended-Upgrade` 设为 `0`。

## 边界

- timer 存在不等于会自动升级；没有 `unattended-upgrades` 或配置为 `0` 时，它不会安装任何包。
- 它不刷新包索引，索引由 [apt-daily.timer 什么时候触发](apt-daily-timer.md) 负责；`After=apt-daily.service` 只是启动顺序，不是“索引一定已更新”的保证。
- 名义时间不是承诺：60 分钟随机延迟、默认 1 分钟的 `AccuracySec`、关机补跑、电池供电都会改变实际执行时间。
- 容器、chroot 或没有以 systemd 作为 PID 1 的环境不会运行。

## 参考

- [apt-daily-upgrade.timer 单元文件](https://sources.debian.org/src/apt/latest/debian/apt-daily-upgrade.timer/)
- [apt-daily-upgrade.service 单元文件](https://sources.debian.org/src/apt/latest/debian/apt-daily-upgrade.service/)
- [unattended-upgrade(8)](https://manpages.debian.org/bookworm/unattended-upgrades/unattended-upgrade.8.en.html)
- [systemd.timer(5)](https://manpages.debian.org/bookworm/systemd/systemd.timer.5.en.html)
