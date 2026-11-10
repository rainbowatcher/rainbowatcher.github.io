---
layout: post
title: herdr-core（hc）父子终端实践
subtitle: 从 herdr-tui 的标题关联，到 hc 真正挂在数据模型上的父子关系
date: 2026-11-09
tags: [Herdr, CLI, Terminal]
---

## 结论先行

- `herdr`（旧的 TUI/多路复用器）只能做到**布局切分**，pane 之间没有父子语义；`herdr pane layout` 里的 `splits[]` 嵌套只是矩形区域嵌套，换个 tab 就散了。
- `hc`（herdr-core）的父子关系是**数据模型**上的：每个终端有 `parent` 字段和 `die_with_parent` 标记，且**父终端的程序结束时子终端被级联回收**。
- 建关系只有三条路：默认继承 `$HC_TERMINAL_ID`、显式 `--parent <终端>`、`--no-parent` 断链；再用 `--outlive-parent` 取消生命周期绑定。
- `hc ls` 没有树视图，父子只能从 `hc ls --all --json` 的 `parent` 字段自己还原。

环境：macOS，`hc 0.1.19`，`herdr 0.9.5`，Sheprd `20261104.1`。

## 起因：机器上同时跑着两套 herdr 会话

这是整件事的第一个坑。当时想"在某个 pane 下开子 pane"，结果 `herdr pane split` 和 `sheprd run split_down` 切出来的东西，跟终端实际所在的位置对不上。排查下来是两套互不相通的会话：

| 会话         | socket                                           | 里面有什么                       | 谁在用                                 |
| ------------ | ------------------------------------------------ | -------------------------------- | -------------------------------------- |
| herdr server | `~/.config/herdr/herdr.sock`                     | 13 个 workspace，31 个 pane      | `herdr` CLI；Sheprd 窗口显示的就是这套 |
| herdr-core   | `~/.local/state/herdr-core/default/default.sock` | 另一批终端，带 `spc…`/`tb…` 标签 | `hc` CLI；agent 实际跑在这里           |

判定方法：

```sh
# 我自己的地址
echo "$HC_TERMINAL_ID"            # t1f
hc get "$HC_TERMINAL_ID"          # where: rainbowatcher.github.io / 2

# herdr CLI 那套里根本没有我这个 cwd
herdr pane get t1f                # {"error":{"code":"pane_not_found"}}
```

推论：agent 在自己会话里用 `herdr pane split` 造东西，用户的屏幕上不会出现；要动用户眼前那套，得走 `sheprd run split_down`（作用于"当前窗口"）。这也是为什么 herdr-tui 时代的"父子"看起来只有标题关联——**它压根没有这条记录**。

## hc 的父子定义

`hc --skill` 里一句话把模型说清楚了：

> `$HC_TERMINAL_ID` is your address. Terminals you start are your children. They end when you end, unless started with `--outlive-parent`.

对应到数据上，`hc get <t>` 里两个字段：

```sh
hc get pc-child | jq '{address, name, parent, die_with_parent}'
```

```json
{
    "address": "t1h",
    "name": "pc-child",
    "parent": "t1g",
    "die_with_parent": true
}
```

`hc ls --all --json` 里也有 `parent`，但**没有** `die_with_parent` 和 `labels`，要细节还得 `hc get`。

## 四个开关

| 写法                                | `parent`          | `die_with_parent` | 语义                   |
| ----------------------------------- | ----------------- | ----------------- | ---------------------- |
| `hc run --bg …`（从终端里跑，默认） | `$HC_TERMINAL_ID` | `true`            | 自动认父               |
| `hc run --bg --parent <T> …`        | `<T>`             | `true`            | 显式认父，可跨层"收养" |
| `hc run --bg --no-parent …`         | `null`            | `false`           | 完全游离               |
| `hc run --bg --outlive-parent …`    | 保留              | `false`           | 记着爹，但爹死了也活着 |

注意 `--no-parent` 会顺带把 `die_with_parent` 置为 `false`，不只是抹掉 `parent`。

## 实测一：三层链，每层由上一层自己拉起

关键是**不要从顶层一次性指定全链条**，而是让子终端自己去起孙终端，这样每层的 `parent` 才是真的上一级：

```sh
# t1f（我）→ pc-parent
hc run --bg --name pc-parent

# pc-parent → pc-child
hc send pc-parent 'hc run --bg --name pc-child'

# pc-child → pc-grandchild
hc send pc-child 'hc run --bg --name pc-grandchild'

# 显式跨层收养
hc run --bg --name pc-adopted --parent pc-grandchild
```

结果：

| name          | address | parent | die_with_parent |
| ------------- | ------- | ------ | --------------- |
| pc-parent     | t1g     | t1f    | true            |
| pc-child      | t1h     | t1g    | true            |
| pc-grandchild | t1j     | t1h    | true            |
| pc-adopted    | t1r     | t1j    | true            |
| pc-survivor   | t1q     | t1g    | false           |
| pc-orphan     | t1p     | null   | false           |

## 实测二：级联回收

另起一条 `t1k → t1m → t1n` 的独立链，只杀最顶层：

```sh
hc run --bg --name tst-top
hc send tst-top 'hc run --bg --name tst-mid'
hc send tst-mid 'hc run --bg --name tst-leaf'

hc kill tst-top
```

三秒后：

| name     | address | parent | state    | exit | reason |
| -------- | ------- | ------ | -------- | ---- | ------ |
| tst-top  | t1k     | t1f    | finished | 1    | killed |
| tst-mid  | t1m     | t1k    | finished | 1    | killed |
| tst-leaf | t1n     | t1m    | finished | 1    | killed |

中、孙都在没被点名的情况下跟着死了，`reason` 也是 `killed`——这就是"关系挂在模型上"和"只是标题像"的区别。

## 实测三：父死子活

```sh
hc run --bg --name sp-top
hc send sp-top 'hc run --bg --name sp-survivor --outlive-parent'
hc kill sp-top
hc get sp-survivor      # state 仍然是 live
```

`parent` 字段还留着 `t1s`（记录没被抹掉），但生命周期解绑了。

## 几个容易踩的点

- **`where` 标签会自动继承**。`pc-adopted` 什么都没传，也拿到了 `where: rainbowatcher.github.io / 2`；但自定义标签不继承，`demo=parentchild` 必须每层自己传 `--label`。
- **子终端没有 `herdr.space` / `herdr.tab`**。这两个标签是 UI 层打的，`hc run` 起的新终端里不存在。所以"出现在同一个 tab 里"和"是同一个 tab 的子终端"是两件事，别混。
- **`hc rm` 一次只收一个参数**，`hc rm t1k t1m` 会报 `unexpected argument`。
- **`hc ls` 没有树视图**，`--all --json` 也不给 `die_with_parent` / `labels`。
- **`hc run` 默认 180 秒超时**，超时只打印 `[hc] still running as tN` 并退 124，程序继续跑，别重复启动。
- **`parent` 不是唯一入口**：从非终端进程（比如 CI、脚本）起终端时没有 `$HC_TERMINAL_ID`，必须显式 `--parent`，否则就是游离的。

## 把树打出来

`hc` 自己不给树，用 `parent` 字段重建一个就够（不落盘，用完即弃）：

```bash
hc ls --all --json | python3 -c '
import json,sys
ts={t["address"]:t for t in json.load(sys.stdin)["terminals"]}
kids={}
for a,t in ts.items(): kids.setdefault(t.get("parent"),[]).append(a)
def draw(a,pre):
    ch=sorted(kids.get(a,[]))
    for i,c in enumerate(ch):
        last=i==len(ch)-1
        print(f"{pre}{chr(9492) if last else chr(9500)}{chr(9472)} {c:<5} {str(ts[c].get('name') or ts[c].get('agent')):<16} {ts[c]['state']}")
        draw(c, pre+("   " if last else "|  "))
for r in sorted(a for a,t in ts.items() if t.get("parent") not in ts):
    t=ts[r]
    print(f"{r:<5} {str(t.get('name') or t.get('agent')):<16} {t['state']}")
    draw(r,"")
'
```

当时的输出（只留我们这一支）：

```text
t1f   pi                  live
└─ t1g  pc-parent        live
   ├─ t1h pc-child       live
   │  └─ t1j pc-grandchild live
   │     └─ t1r pc-adopted live
   └─ t1q pc-survivor    live

t1p   pc-orphan          live
```

## 和 herdr-tui 那套的对照

| 维度            | herdr / herdr-tui                    | hc / herdr-core                       |
| --------------- | ------------------------------------ | ------------------------------------- |
| 关系载体        | `pane layout` 的 `splits[]` 矩形嵌套 | 终端的 `parent` 字段                  |
| 跨 tab / 换布局 | 关系消失                             | 关系不变                              |
| 生命周期耦合    | 无，关 pane 不影响别的               | 父程序结束 → 子孙全部 `reason=killed` |
| 主动断链        | 无此概念                             | `--no-parent`                         |
| 反向解绑        | 无                                   | `--outlive-parent`                    |
| 能否枚举        | 只有矩形，没有"谁是谁的子"           | `parent` 直接给链                     |
| 建链成本        | 得先让 pane 存在，再切               | 起终端时一行 `--parent`               |

一句话：herdr-tui 的父子是**画出来的**，hc 的父子是**记下来的**。前者能看不能查，后者能查也能回收。

## 收尾清理

```sh
# 演示链路：按名字一次性杀掉最顶层即可级联
hc kill pc-parent

# 剩下的游离终端单独处理
for t in pc-orphan pc-survivor; do hc kill "$t"; hc rm "$t"; done
```

顺带记录：那次实验还往本仓库塞过 `.herdr/automations/` 的自动化脚本和 `.herdr/worktree.toml`，事后已删除并 `sheprd-automate repo remove`，因为"定时触发"和"父子终端"是两件事——前者是 worktree + agent 的新会话，后者只是 hc 的终端树。
