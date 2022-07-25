---
layout: Post
title: 软件工程总结
subtitle: 总结一下工作中碰到的问题
headerImage: /img/2022/engineering/2.jpg
useHeaderImage: true
headerMask: rgba(100, 100, 100, .618)
date: 2022-05-04
permalinkPattern: /post/:year/:month/:day/:slug/
hide: true
tags:
  - 软件工程
  - 项目管理
---

最近写公司的项目，接需求、开发

<!-- more -->

## 头脑风暴

需求

1. 没有确定好需求的细节，在开发期间不断的对需求

测试

1. 没有测试团队，没有测试体系，一天给两条数据测来测去没有期限。

管理

1. 每个人都是超负荷，找谁都忙不过来。

环境

1. ElasticSearch 两套版本共存
2. 测试与生产环境不一致
3. 环境不稳定，包括 vpn、大数据集群、跳板机等，
4. 不断浪费时间在 vpn 重连调试。
5. 任务由于资源不够或者网络原因被下线，需要重新部署
6. 跳板机对于 mac 支持不够优化，浪费很多时间在修改客户端上，不改的话就要忍受本地 mac 环境开虚拟机连跳板机的恶心操作。

## 总结