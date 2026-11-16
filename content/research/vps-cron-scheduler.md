---
title: VPS 上的轻量定时任务调度器选型
date: 2026-11-16
tags: [运维, Docker, Linux]
summary: 单台 1C1G–2C2G VPS 跑爬虫脚本时，按「要不要 Web UI」和「脚本在宿主机还是容器里」两条轴收敛：纯脚本用 systemd timer + healthchecks，要执行历史与手动触发用 dagu，容器化爬虫用 ofelia，面板式脚本托管用白虎面板；青龙与 Cronicle 在低配机器上偏重。
---

单台 VPS 跑几个爬虫脚本，`cron` 只负责触发，缺执行历史、失败重试、手动触发与日志检索。候选按「单机、常驻内存小、不引入外部数据库」筛过一遍。

- 不要 UI：`supercronic` / `go-crond` / `ofelia`，单二进制或单容器，配置仍是 crontab 或 INI。
- 要 UI 与执行历史：`dagu` 最省，单二进制无 DB；`Cronicle`、`青龙`、`白虎` 功能多但常驻更重。
- 只管「任务有没有按时跑」：`healthchecks` 只做监控告警，不负责调度。

## 问题

- 判据：常驻内存 < 100MB、单文件或单容器可装、无需 Postgres/Redis、能看历史日志、失败能告警。
- 爬虫的失败模式是超时、反爬拦截、解析报错，需要重试与告警，而不是只看进程退出码。
- 1C1G 机器上，面板类工具的 Node/Python 常驻进程本身就可能吃掉大半内存。

## 候选

| 工具                                                  | 形态                  | 调度来源            | UI / 历史              | 备注                                                    |
| ----------------------------------------------------- | --------------------- | ------------------- | ---------------------- | ------------------------------------------------------- |
| systemd timer                                         | 系统自带              | `OnCalendar`        | 无                     | 零依赖，`journalctl` 看日志，无重试                     |
| [supercronic](https://github.com/aptible/supercronic) | 单 Go 二进制          | crontab             | 无                     | 容器友好，支持秒级、`-inotify` 热加载                   |
| [go-crond](https://github.com/webdevops/go-crond)     | 单 Go 二进制          | crontab + run-parts | 无                     | 带 Prometheus 指标，GPL-2.0                             |
| [ofelia](https://github.com/mcuadros/ofelia)          | 单二进制 / 容器       | INI 或 Docker label | 无                     | 可 `exec` 进运行中的容器，mail/slack 告警，`no-overlap` |
| [dagu](https://github.com/dagucloud/dagu)             | 单 Go 二进制 + Web UI | YAML 里的 cron      | 有，含重试与运行图     | 文件存储无 DB，GPL-3.0                                  |
| [Cronicle](https://github.com/jhuckaby/Cronicle)      | Node.js + Web UI      | 事件表              | 有，含插件体系         | 作者已转向 xyOps，Cronicle 只做维护                     |
| [白虎面板](https://github.com/engigu/baihu-panel)     | Go + Vue 单容器       | Cron 表达式         | 有，含在线编辑器与推送 | 集成 Mise 管多语言运行时，对标青龙                      |
| [青龙](https://github.com/whyour/qinglong)            | Node 容器             | Cron 表达式         | 有，功能最全           | 1C1G 上偏重（社区反馈，未验证）                         |

## 当前判断

- 宿主机脚本、只要可靠触发与告警：`systemd timer` 写任务 + `healthchecks` 收 ping，最省资源，也不多一个要维护的进程。
- 需要「手动重跑 + 历史日志 + 失败重试」：`dagu start-all`，YAML 描述步骤，`overlap_policy: skip` 防爬虫堆叠。
- 爬虫已打包成镜像：`ofelia` 用 label 就近声明任务，不必再给宿主机装 Python 环境。
- 要面板式脚本托管（在线编辑、依赖管理、多渠道推送）：`白虎面板`；`青龙` 功能更全但在 1C1G 上要接受内存与磁盘 IO 压力。
- `Cronicle` 不建议新上：核心能力已被 `dagu` 覆盖，上游明确把新特性放进 xyOps。

## 下一步

- 在目标 VPS 上跑 `dagu start-all --dags .`，用一个 `echo` 步骤测 RSS 与镜像体积，确认落在 100MB 以内。
- 同一台机器对比 `ofelia` 的 label 配置成本，确认爬虫是否需要容器隔离。
- 验证告警链路：`dagu` 的 `handler_on.failure` 走 webhook，或 `healthchecks` 的 ping 超时通知。

## 参考

- [dagu 文档](https://docs.dagu.sh/)
- [supercronic README](https://github.com/aptible/supercronic)
- [ofelia README](https://github.com/mcuadros/ofelia)
- [healthchecks README](https://github.com/healthchecks/healthchecks)
