---
title: desync Go 库集成：分块、索引与带 seed 还原
date: 2026-11-20
tags: [存储, 去重]
section: 工具
subtitle: 根包就是库，产出的索引与 CLI 逐字节一致、可与命令行混用；代价是 Go 1.25+、24 个直接依赖、45MB 二进制，且没有子包可裁
---

## 要点

- 库入口就是根包 `github.com/folbricht/desync`，`cmd/desync` 只是它的一个使用者；库写出的 `.caibx` 与 `desync make` 逐字节相同，两边产物可以互喂。
- 只能整包引入：一次带上 S3 / GCS / OCI / SFTP / FUSE 全部后端，最小消费者实测 77 个 module、764 个包、45MB 二进制。
- 两个必踩的坑：`ProgressBar` 传 nil 会 panic；`desync.Digest` 是进程级全局变量，换算法会波及所有调用。

## 前置条件

| 条件     | 值                                                                   |
| -------- | -------------------------------------------------------------------- |
| Go 版本  | ≥ 1.25.0（v1.1.5 的 `go.mod` 声明）                                  |
| 模块代理 | 本机 `proxy.golang.org` 超时，用 `GOPROXY=https://goproxy.cn,direct` |
| 系统库   | 只有 `MountIndex` 要 FUSE（macOS 装 macFUSE），切块与还原不依赖      |

## 步骤

### 1. 拉依赖

```bash
go get github.com/folbricht/desync@v1.1.5
```

### 2. 切块入库并写索引

```go
store, err := desync.NewLocalStore("/srv/store", desync.StoreOptions{})
if err != nil { return err }
defer store.Close()

// 末位参数不能传 nil，见「回滚与失败」
idx, _, err := desync.IndexFromFile(ctx, src, 8, 16<<10, 64<<10, 256<<10, desync.NullProgressBar{})
if err != nil { return err }
if err := desync.ChopFile(ctx, src, idx.Chunks, store, 8, desync.NullProgressBar{}); err != nil {
    return err
}

f, err := os.Create(indexFile)
if err != nil { return err }
defer f.Close()
_, err = idx.WriteTo(f) // WriteTo 是指针接收者
```

### 3. 读索引、带 seed 还原

```go
f, err := os.Open(indexFile)
if err != nil { return err }
defer f.Close()
idx, err := desync.IndexFromReader(f)
if err != nil { return err }

seedIdx, err := desync.IndexFromReader(seedIndexReader)
if err != nil { return err }
seed, err := desync.NewIndexSeed(outFile, seedFile, seedIdx) // 目标路径、seed 数据文件、seed 索引
if err != nil { return err }

stats, err := desync.AssembleFile(ctx, outFile, idx, store,
    []desync.Seed{seed}, desync.AssembleOptions{N: 8}) // stats 字段与 CLI --print-stats 一致
```

`AssembleFile` **直接写目标文件**，边写边比对已有块（`chunks-in-place`）；CLI 默认的「临时文件 + rename」是 `cmd` 里的 `writeWithTmpFile`，没有导出，库里要自己套一层才不会写坏半成品。

## 验证

| 检查                | 实测结果                                                           |
| ------------------- | ------------------------------------------------------------------ |
| 索引与 CLI 产物比对 | `cmp` 通过，逐字节一致                                             |
| 带 v1 seed 还原 v3  | `chunks-from-seeds=3126`、`chunks-from-store=220`，输出 `cmp` 一致 |
| 交叉编译            | `GOOS=linux/arm64` 43MB、`GOOS=windows/amd64` 45MB，均通过         |

`go list -deps .` 764 个包、`go.mod` 77 个 module，是引入成本的直接读数。

## 回滚与失败

- 回滚：`go mod edit -droprequire github.com/folbricht/desync && go mod tidy`；数据格式不受影响，索引与 store 仍可交给 CLI 继续用。
- `panic: runtime error: invalid memory address or nil pointer dereference` 落在 `make.go` → `IndexFromFile` 的 `ProgressBar` 传了 nil → 改用 `desync.NullProgressBar{}`。
- `chunk <id> missing from store` → seed 只省下载、不减免 store 里的块，store 必须含完整版本，缺块先 `cache`/`chop` 补齐。
- `index file uses SHA256` → `desync.Digest` 与索引的摘要算法不一致；读取任何索引前确定算法，且一个进程只用一个。
- 二进制 45MB 起且无法裁剪：根包没有可用子包，想瘦身只能 fork 拆包，或改为调用外部 `desync` 二进制。

## 参考

- [pkg.go.dev 包文档](https://pkg.go.dev/github.com/folbricht/desync)：`Store`、`WriteStore`、`Seed`、`Index` 的完整签名。
- [desync 源码](https://github.com/folbricht/desync)：`doc.go` 说明包的职责边界，`cmd/desync` 是最完整的用法示例。
- 站内：[desync 增量分发与 chunk store 运维](desync.md)：命令、场景与 store 运维。
