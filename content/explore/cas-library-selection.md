---
title: CAS 库选型：整文件存储与分块去重
date: 2026-11-18
tags: [存储, 去重]
subtitle: 整文件 CAS 用 cacache 或百行自写；跨版本去重看 desync（Go）与 iroh-blobs（Rust）；casync 2020 年后事实停更，Python 侧只有小体量库；CAS 只解决内容存放，版本元数据仍需自建。
---

CAS 库分「整文件」与「分块 CDC」两档，前者多数场景自写即可；`casync` 最后发布 2020 年、事实停更，Python 侧只有小体量实现。

- 整文件：Node 用 `cacache`（SRI 校验、并发安全），否则 100 行哈希 + 原子 rename。
- 分块：`desync`（Go，兼容 casync 格式）、`iroh-blobs`（Rust，BLAKE3 verified streaming）。

## 问题

CAS 只负责「内容存哪」，`fileId → version → hash` 的元数据、权限、保留策略要另建；整文件差的点是原子写、并发与校验，分块差的点是分块算法、index 格式与压缩。

## 候选

| 语言   | 库                                                                                            | 形态                          | 状态           |
| ------ | --------------------------------------------------------------------------------------------- | ----------------------------- | -------------- |
| Node   | [cacache](https://www.npmjs.com/package/cacache)                                              | 库，SRI 校验 + 并发安全       | npm 自用，成熟 |
| Node   | [content-addressable-blob-store](https://github.com/mafintosh/content-addressable-blob-store) | 库，可换 fs/S3 后端           | 多年未维护     |
| Go     | [desync](https://github.com/folbricht/desync)                                                 | CLI + 库，兼容 casync         | Debian 收录    |
| Go     | [orcas](https://pkg.go.dev/github.com/orcastor/orcas)                                         | 单二进制 CAS 服务             | 较新，v0.2.x   |
| Rust   | [iroh-blobs](https://crates.io/crates/iroh-blobs)                                             | 库，BLAKE3 verified streaming | 0.35 生产可用  |
| C      | [casync](https://github.com/systemd/casync)                                                   | CLI + 库                      | 2020 后停更    |
| Python | [kitsuyui.content-addr](https://pypi.org/project/kitsuyui.content-addr/)                      | hasher/store 解耦的小库       | 0.8.x          |

## 当前判断

- 只存整文件：自写 100~150 行（流式哈希 → 临时文件 → `rename` → 前缀分片，读时校验 + GC），或 Node 用 `cacache`。
- 大文件跨版本去重：`desync`（可复用 casync 生态）或 `iroh-blobs`（按块范围传输）；存储已上 S3 则 key 用哈希 + `If-None-Match`，不必引库。

## 下一步

- 写最小 Node 实现并补测试，与 `cacache` 对比代码量；再用 1GB 级样本对比 `desync` 的去重率与写入耗时。

## 参考

- [cacache](https://github.com/zkat/cacache)、[desync](https://github.com/folbricht/desync)、[iroh-blobs](https://crates.io/crates/iroh-blobs)、[casync](https://github.com/systemd/casync)
