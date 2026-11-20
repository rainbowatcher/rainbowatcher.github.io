---
title: desync 增量分发与 chunk store 运维
date: 2026-11-20
tags: [存储, 运维]
section: 工具
subtitle: 把大文件切成按哈希命名的块发布到任意静态目录，客户端用旧文件做 seed 只取缺块；适合设备群与镜像的整件增量分发，救不了压缩或加密载荷，也不是带元数据的通用 CAS
---

## 要点

- 三件东西搭起全部流程：`make` 按内容定义分块写进 store 并产出 `.caibx` 索引，`extract` 拿本地旧文件当 seed 只下载缺块，服务端不参与任何计算。
- 与 rsync 的分界在服务端：rsync 要两端都是活文件系统且由服务端算 delta；desync 是「发布一次、任意旧版本客户端自取差集」，store 退化成普通静态目录，能扛 CDN。
- 适用面是整件分发（镜像、根文件系统、目录树），不适合压缩/加密载荷（改一字节全变）、也不承担 `fileId → version → 索引` 这类元数据职责。

## 命令速查

| 命令                                                                                 | 作用                                 |
| ------------------------------------------------------------------------------------ | ------------------------------------ |
| `mkdir -p /srv/store && desync make -s /srv/store v1.img.caibx v1.img`               | 切块写入 store 并生成索引            |
| `desync make v1.img.caibx v1.img`                                                    | 只生成索引、不落块，先看成本         |
| `desync extract -s http://host:8080/ -c /var/cache/dsx v1.img.caibx v1.img`          | 冷装，顺带填本地缓存                 |
| `desync extract -s /srv/store --seed v1.img.caibx v2.img.caibx v2.img`               | 旧版本当 seed 做增量                 |
| `desync extract -k -s /srv/store --seed v1.img.caibx:/dev/sdc v2.img.caibx /dev/sdc` | 文件或块设备原地更新，中断可重跑     |
| `desync info --seed v1.img.caibx --format=json v2.img.caibx`                         | 算差集：缺多少块、多少字节           |
| `desync inspect-chunks -s /srv/store v2.img.caibx chunks.json`                       | 导出每块压缩后大小，供客户端估下载量 |
| `desync cache -s https://cdn/ -c /cache --ignore v1.img.caibx v2.img.caibx`          | 只拉新块进缓存，不落成文件           |
| `desync chop -s /srv/store v1.img.caibx v1.img`                                      | 目标机已有大文件，反向切块入 store   |
| `desync cat -s /srv/store blob.caibx`                                                | 流式还原到 STDOUT                    |
| `desync verify -s /srv/store`                                                        | 逐块校验哈希；`-r` 顺手删坏块        |
| `desync prune -s /srv/store -y a.caibx b.caibx`                                      | 只保留这些索引引用的块（破坏性）     |
| `desync tar -i -s /srv/store tree.caidx /dir`                                        | 目录树分块归档                       |
| `desync untar -i -s /srv/store tree.caidx /dir`                                      | 从索引还原目录树                     |
| `desync mtree -i -s /srv/store tree.caidx`                                           | 输出 mtree 清单，用于对账            |
| `desync chunk-server -s /srv/store -c /cache -l :8080`                               | 只读块服务，兼站点级缓存代理         |
| `desync index-server -s /idx -w -l :8081`                                            | 可写索引服务，`make` 可直接推到 URL  |
| `desync mount-index -s http://host/ v1.img.caibx /mnt/img`                           | FUSE 按需取块，需 macFUSE / FUSE     |

## 按任务

### 发布新版本

1. 先建目录：`mkdir -p /srv/store`，store 与 cache 都不会被自动创建。
2. `desync make -s /srv/store v2.img.caibx v2.img`；`-n -1` 按 CPU 并行分块、传输按网络自适应，`-m 16:64:256` 改块大小（KB）。
3. 每版推进同一个 store，旧块自动复用；`du -sh /srv/store` 只增长差额，砍历史靠 `prune`。

### 客户端冷装与增量

1. 冷装时给 `-c` 一份本地缓存，下次换版本能少下。
2. 增量只要 `--seed v1.img.caibx`，前提是同名的 `v1.img` 就在索引旁边；放在别处用 `--seed v1.img.caibx:/path/v1.img`。
3. 多个旧版本可给多个 `--seed`，或 `--seed-dir` 一把带上整目录的索引。

### 估算一次更新的下载量

1. 服务端 `desync inspect-chunks -s /srv/store v2.img.caibx chunks.json`，把该文件发布出去。
2. 客户端 `desync info --seed v1.img.caibx --chunks-info chunks.json --format=json v2.img.caibx`。
3. 读 `dedup-size-not-in-seed-nor-cache-compressed`（压缩态）或 `-dedup-size-not-in-seed-nor-cache`（未压缩态）。

### 服务端与边缘缓存

1. 纯静态托管已经够用：`python3 -m http.server` 或 nginx 指向 store 目录即可被 `extract` 消费。
2. 需要代理或加密传输时用 `chunk-server`：`-s` 上游、`-c` 本地缓存、`-l :8080`，站点里块只穿 WAN 一次。
3. 长跑进程用 `--store-file` 加 SIGHUP 换上游，不必重启；`--authorization` 可要求固定 Authorization 头。

### 校验与回收

1. `desync verify-index v1.img.caibx v1.img` 确认索引与文件对得上。
2. `desync verify -s /srv/store` 扫块；`-r` 删除校验失败的块，之后再 `cache` 补回。
3. `prune` 只按传入索引做可达性判断，删前先把要保留的历史索引凑齐。

### 原地更新与块设备

1. 单副本设备：`desync extract -k -s /mnt/store --seed v1.img.caibx:/dev/sdc v2.img.caibx /dev/sdc`，已在正确位置的块不写，挪位的块在目标内部重排。
2. 内部重排会把部分块暂存在内存，用 `GOMEMLIMIT=256MiB` 设上限，装不下的回 store 取。

## 参数与输出

| 参数或字段                                | 作用                                                  |
| ----------------------------------------- | ----------------------------------------------------- |
| `-s`                                      | 可重复，按序尝试；`a\|b` 表示同内容 failover 组       |
| `-c`                                      | 缓存 store，先查缓存再打上游，缺的块取回后写入        |
| `-n`                                      | 并发；`-1` 交给 desync 自适应（1.1.5 起传输最高 128） |
| `--seed` / `--seed-dir` / `-k`            | 文件 seed、目录 seed、原地更新                        |
| `--print-stats`                           | 输出复用与下载明细                                    |
| `--digest`                                | 全局摘要算法，`sha512-256`（默认）或 `sha256`         |
| `chunks-from-seeds` / `chunks-from-store` | 分别来自 seed 与 store 的块数，判断复用率             |
| `bytes-cloned-from-seeds`                 | reflink 克隆量，非 btrfs/xfs 上恒为 0                 |
| `not-in-seed-nor-cache`                   | 必须下载的块数                                        |

块文件落在 store 里是 `<前两位哈希>/<完整哈希>.cacnk`，zstd 压缩；开加密后后缀变成 `.cacnk.xchacha20-poly1305-<keyid>`，块名仍是明文哈希。索引约 40 字节/块，256MB 镜像约 130KB。

口径：本机 macOS arm64、desync v1.1.5、256MB 镜像（含 64MB 全零区）三个版本。

| 操作                  | 结果                                     |
| --------------------- | ---------------------------------------- |
| `make` 一个镜像       | 0.34s，3321 块，索引 130KB               |
| 单版本 store          | 198MB，3067 个唯一块（零区被 zstd 吃掉） |
| 三版本共用一个 store  | 213MB，原始 768MB                        |
| v2 相对 v1            | 146 个新块，解压前 15.3MB、压缩后 10.7MB |
| 冷装（HTTP，无 seed） | 3118 块，0.63s                           |
| 带 v1 seed 更新到 v3  | 220 块，0.38s                            |
| `-k` 原地更新         | store 143 块 + 内部挪 3 块，0.28s        |

## 边界

- **去重率不等于改动量**：实测约 8MB 改动要下 15.3MB，改写点周围会重新切块。
- **压缩或加密载荷几乎不去重**：要增量就先把去重放在未压缩层，别再套一层压缩/加密。
- **`--digest` 一次定死**：同一 store 混用 sha256 与 sha512-256 会把同一份内容存两遍（实测 3067 + 3119 → 6186 块）。
- **`prune` 是破坏性的**：漏传一个旧索引，那个版本就永久缺块，提取时直接报 `chunk ... missing from store`。
- **加密只护块内容**：块名与索引仍是明文，元数据（块 ID、大小、偏移）可被观察。
- **reflink 只在 btrfs/xfs**：APFS 上退化为拷贝，只省网络与 CPU，不省磁盘。
- **casync 只兼容格式不兼容命令行**：参数不同；反向用 `CASYNC_REMOTE_PATH=desync` 让 casync 走 SSH 只读取块。
- **`mount-index` 依赖系统 FUSE**：缺 macFUSE 时报 `no FUSE mount utility found`，命令存在但不可用。
- **macOS 导出 catar 到 GNU tar 流会失败**：带 xattr 时 `untar --output-format=gnu-tar` 报 PAX 头错误，这一步放 Linux 侧做。
- **元数据要自建**：索引、版本表、权限、保留策略都在 desync 之外。

## 参考

- [desync README](https://github.com/folbricht/desync)：定位、与 rsync/zsync/OCI 的对比、实测更新成本表。
- [Concepts](https://github.com/folbricht/desync/blob/master/docs/concepts.md)：分块与并行、seed 与 reflink、tar 互操作。
- [Cookbook](https://github.com/folbricht/desync/blob/master/docs/cookbook.md)：提取、缓存、服务端、用量估算的完整命令。
- [casync 设计背景](http://0pointer.net/blog/casync-a-tool-for-distributing-file-system-images.html)：CDC 分块与索引格式的来源。
