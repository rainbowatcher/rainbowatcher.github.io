---
layout: post
title: hc 父子终端：命令行之外的入口
subtitle: 从 JSON-RPC 的 caller 字段，到 Sheprd GUI、mods、automations 各自能建出什么
date: 2026-11-10
tags: [Herdr, CLI, Terminal]
---

## 结论先行

- 父子关系不是 `hc run` 的参数，而是 `terminal.run` 这个 **JSON-RPC 方法** 的字段：`parent` / `caller` / `no_parent` / `outlive_parent`。CLI 只是其中一种把字段填好的方式。
- 唯一"自动认父"的机制是 `caller`（CLI 里由 `$HC_TERMINAL_ID` 填入）。同一个方法不传 `caller`，建出来的终端 `parent` 就是 `null`——**父子靠客户端自报，核心不会猜**。
- 所以命令行之外真正能建出父子链的只有一条路：**自己说这套协议**（unix socket、`hc connect` 的 stdio、`ssh box hc connect`）。不需要 `hc` 可执行文件，也不需要是终端里的子进程。
- Sheprd GUI 能建终端（Herdr 2 标签、分屏），但本机上 20 个 hc 终端**全部** `parent: null`，其中 app 建的那些带 `herdr.space` / `herdr.tab` 标签。GUI 用的是标签与版面模型，和 hc 的父子是两套东西。
- herdr 1（0.9.5）的 API 里根本没有这条记录：128 个请求方法里 `parent` 命中 **0** 次，pane 列表是 `pane_id` / `tab_id` / `workspace_id` / `terminal_id` 平铺。
- mods、automations、`.herdr/worktree.toml` 脚本、`sheprd chat` 都能让 app 建出终端，但**都无法指定父**：mods 没有 IO/进程能力，automations 的 step 列表里没有这一项。

环境：macOS，`hc 0.1.19`（PATH）与 bundle 内 `hc 0.1.13`，`herdr 0.9.5`，Sheprd `20261104.1`。本文是本机环境下的探索记录，不是通用文档。

## 判定方法

分三步，每一步都留了可复现的命令：

1. 读协议：`hc schema`（OpenRPC）看字段，`herdr api schema --json` 看 herdr 1 有什么。
2. 绕过 CLI 直接调：向 `$HC_TERMINAL_SOCKET` 发新行分隔的 JSON-RPC，用 `hc get` 核对结果。
3. 看现状：`hc ls --all --json` 与 `hc get` 对比谁建的终端带 `parent`。

## 一、父子的载体是协议字段

`hc schema` 里 `terminal.run` 的参数字段（摘）：

| 字段              | 语义                                                                        | 缺省  |
| ----------------- | --------------------------------------------------------------------------- | ----- |
| `caller`          | 谁在调用（终端里就是 `HC_TERMINAL_ID`）                                     | 空    |
| `parent`          | 父终端；空则取"被启动时所在的终端"                                          | 空    |
| `no_parent`       | 就算从终端里启动也不给父                                                    | false |
| `outlive_parent`  | 父程序结束也留着它                                                          | false |
| `die_with_parent` | 注释原文：_Ignored: children end with their parent unless `outlive_parent`_ | false |
| `no_notify`       | 不往父终端里打关于它的提示                                                  | false |

注意 `die_with_parent` 是个只读出来的结果：请求里传 `true` 没用，真正的开关是 `outlive_parent`。

### 五组实测

同一条 socket，只改参数：

| 请求                                           | 结果                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| 只给 `argv`，无 `caller`                       | `parent: null`，`die_with_parent: false`，`cwd: "/"`（成了核心的 cwd） |
| `caller: "t1f"`                                | `parent: "t1f"`，`die_with_parent: true`                               |
| `caller: "t1f"` + `outlive_parent: true`       | `parent: "t1f"`，`die_with_parent: false`                              |
| `parent: "t999"`（不存在）                     | 报错 `not_found: no terminal "t999"`，不建                             |
| `caller` + `no_parent: true` + `parent: "t1f"` | `parent: "t1f"`，`die_with_parent: true`                               |

最后一条值得记：`no_parent` 只是压掉默认值，**显式 `parent` 赢**。所以"我要游离"和"我要认父"同时说时，认父生效。

## 二、途径一：直接说协议

### unix socket

不用 `hc`，std 库就够。新行分隔的 JSON-RPC，一问一答：

```python
import json, os, socket

s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
s.connect(os.environ["HC_TERMINAL_SOCKET"])
req = {
    "jsonrpc": "2.0", "id": 9, "method": "terminal.run",
    "params": {"argv": ["/bin/sh", "-c", "sleep 600"], "name": "sock-child", "caller": "t1f"},
}
s.sendall((json.dumps(req) + "\n").encode())
print(s.recv(65536))
```

回报里就是 `{"address": "t26", "name": "sock-child", "parent": "t1f", "die_with_parent": true}`。

这条路径的意义：**任何进程都能建父子**，只要它知道地址。编辑器插件、CI 脚本、面板程序不必 fork 一个 `hc`，也不必身处终端。

### stdio 与 ssh

`hc connect` 把这套协议接到 stdin/stdout，`ssh box hc connect` 是它的远程版本：父终端可以在另一台机器上（逻辑上），协议不变。

### 代价

- 客户端自己负责地址管理：`parent` 不存在会被 `not_found` 拒绝，没有"自动找最近终端"这种便利。
- 不传 `cwd` 时子终端落在**核心**的 cwd（实测 `"/"`），不是调用者的 cwd。CLI 帮你填了，裸协议没有。

## 三、途径二：环境变量继承

hc 给每个终端都注入 `$HC_TERMINAL_ID` 与 `$HC_TERMINAL_SOCKET`。用一个探针终端确认：

```sh
hc run --bg --name envprobe /bin/sh -c 'echo "id=$HC_TERMINAL_ID socket=$HC_TERMINAL_SOCKET" > /tmp/envprobe.txt; sleep 30'
cat /tmp/envprobe.txt   # id=t27 socket=/Users/.../herdr-core/default/default.sock
```

于是凡是在终端里跑起来的东西——npm script、make 目标、编辑器 task、automation 的 `sh`、mod 触发的 shell——只要它调 `hc run`，**不需要任何参数**就自动成父。这是最省事的一条隐式链。

反过来也能证明父子全靠这个自报。把变量抹掉再跑 CLI：

```sh
env -u HC_TERMINAL_ID hc run --bg --name noparent-cli /bin/sh -c "sleep 600"
hc get noparent-cli --json   # parent: null, die_with_parent: false
```

同一台机器、同一个 CLI、同一秒，只差一个环境变量，结果从"认父"变成"游离"。

## 四、途径三：模板

`hc run <模板名> <任务>` 时 `argv[0]` 被当作模板名：模板的 `command` 起程序，模板正文加任务作为第一条消息。本机 `hc templates` 是空的，模板目录 `~/.config/herdr-core/templates/` 里没有文件。

模板不改变父子：父仍由启动者（`caller` 或 `parent`）决定。它省的是"起什么命令、第一句话说什么"，不是"挂在谁下面"。

## 五、Sheprd GUI：能建终端，但不建父子

GUI 侧和终端有关的命令一望即知（`sheprd commands`）：

```text
new_tab  split_right  split_down  new_workspace  new_worktree  new_window
```

这些既能按快捷键触发，也能被 `sheprd run split_down` 当命令面板一样调用，还能被 mod 的 `herdr.run("split_down")` 在一个按钮点击后触发。

配置里有关键一项：

```toml
# New tabs run in herdr-core (Herdr 2), whose terminals Sheprd draws and
# splits into native panes, instead of in Herdr 1.
herdr_2_terminals = false
```

也就是说 app 确实会往 herdr-core 里起终端。那这些终端有父吗？看现状：

| 终端 | 创建时间    | parent | die_with_parent | 标签                                           |
| ---- | ----------- | ------ | --------------- | ---------------------------------------------- |
| t10  | 11-09 13:17 | null   | false           | `herdr.seen` `herdr.space` `herdr.tab` `where` |
| t1y  | 11-10 11:11 | null   | false           | 同上                                           |
| t1z  | 11-10 13:19 | null   | false           | 同上                                           |
| t20  | 11-10 15:24 | null   | false           | 同上                                           |
| t21  | 11-10 15:49 | null   | false           | 同上                                           |

`hc ls --all --json` 那 20 个终端，`parent` 全为 `null`。带 `herdr.space` / `herdr.tab` 这类 app 打的标签的，同样没有父。结论：**GUI 建的是"标签里的终端"，是 hc 模型里的游离节点**；分屏、tab 都是版面关系，落在 `herdr.space` / `herdr.tab` 上，不落在 `parent` 上。

想让 GUI 里的终端进入 hc 的树，只有一招：在那个终端里跑 `hc run`（此时 `$HC_TERMINAL_ID` 是它自己的地址）。树从那里往下长，往上没有。

需要说明：这一段是**观察证据**，不是受控实验。翻转 `herdr_2_terminals` 做 A/B 会改动窗口与会话，没有做。另外 bundle 里的 `herdr-core` 是 `hc 0.1.13`，PATH 上是 `0.1.19`，两个客户端对着同一个 socket，理论上也可能有行为差异，没验证。

## 六、herdr 1：模型里没有这条记录

对 herdr 1 做同样的取证：

```sh
herdr api schema --json > /tmp/herdr-full.json
grep -c -i parent /tmp/herdr-full.json    # 0
```

128 个请求方法（`pane.*`、`tab.*`、`workspace.*`、`agent.*`……）里，没有一处提到父。`herdr pane list` 的 JSON 也是平的：`pane_id`、`tab_id`、`workspace_id`、`terminal_id`，没有谁是谁的父。`herdr pane split` 只是切矩形，`herdr agent start` / `herdr pane run` 只是往已有 pane 里起进程。

| 维度            | herdr / herdr-tui                    | hc / herdr-core                       |
| --------------- | ------------------------------------ | ------------------------------------- |
| 关系载体        | `pane layout` 的 `splits[]` 矩形嵌套 | 终端的 `parent` 字段                  |
| 跨 tab / 换布局 | 关系消失                             | 关系不变                              |
| 生命周期耦合    | 无，关 pane 不影响别的               | 父程序结束 → 子孙全部 `reason=killed` |
| 主动断链        | 无此概念                             | `no_parent`                           |
| 反向解绑        | 无                                   | `outlive_parent`                      |
| 能否枚举        | 只有矩形，没有"谁是谁的子"           | `parent` 直接给链                     |
| 建链成本        | 得先让 pane 存在，再切               | 起终端时 `caller`/`parent` 一行字段   |

一句话没变：herdr-tui 的父子是**画出来的**，hc 的父子是**记下来的**。前者能看不能查，后者能查也能回收。

## 七、mods / automations / 脚本 / chat：只能触发创建

| 入口                                       | 能建出什么                                                                               | 能指定父吗                                                                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| mods（Luau，`~/.config/herdr/gpui-mods/`） | 只能 `herdr.run("COMMAND")` 在点击或命令面板选择后触发 app 命令（如 `split_down`）       | 不能：没有 `os`/`io`/进程/网络，连 `print` 都没有                                               |
| automations（`.herdr/automations/*.luau`） | 定时的 `agent { harness, prompt, worktree }` 在新 worktree 起 agent；`sh` / `run` 跑脚本 | 不能：step 只有 `pull`/`run`/`sh`/`worktree`/`agent`/`notify`，没有终端字段；改脚本还要重新审批 |
| `sheprd scripts setup\|run`                | 在调用者 workspace 的**新 tab** 里跑 `.herdr/worktree.toml` 脚本                         | 不能                                                                                            |
| `sheprd chat new AGENT`                    | 开 tab 跑 `sheprd-acp`，或在 Herdr 2 tab 里把当前 pane 分给 chat                         | 不能                                                                                            |
| 编辑器跳转（`Cmd` 点击路径）               | 在打印该路径的 pane 旁边开一个 split                                                     | 不能：那是相邻 pane，不是子终端                                                                 |

共同点：它们都是**让 app 去建**，而 app 建终端时不带 `caller`。所以这些入口造出来的是游离终端，再在里面跑 `hc run` 才有树。

## 八、没验证的，和踩到的坑

没验证：

- **跨机器的父**：`hc machine ls` 是空的（`{"machines":[]}`），`--on <machine>` 配合 `parent: "machine/t7"` 没测过。协议里地址确实支持 `machine/t7`，但父能否跨机器没有证据。
- **GUI 的 A/B**：见上一节。
- **多核心**：`hc connect --session <name>` 指向另一个核心时，父引用是否跨核心有效，没测。

踩到的坑（与命令行无关，但都会让"父子"看起来不对）：

- 裸协议不填 `cwd`，子终端落在核心的 cwd（实测 `/`），不是你以为的调用者目录。
- `parent` 写错不会被宽容处理：`not_found`，直接失败。
- `no_parent` 不覆盖显式 `parent`，两者同传时是认父。
- `hc ls --all --json` 不给 `die_with_parent`、不给 `labels`、也不给 `created_ms`；要细节只能 `hc get` 一个个看。`hc ls` 也始终没有树视图，链要从 `parent` 自己还原。
- `hc rm` 一次只收一个参数。
- 父不存在时不会退化成游离，而是报错——这比静默建出一棵断树好，但脚本里要处理。

## 九、复现与清理

```sh
# 1. 现状：谁有父
hc ls --all --json | python3 -c 'import json,sys; [print(t["address"], t.get("parent")) for t in json.load(sys.stdin)["terminals"]]'

# 2. 协议直调（不需要 hc 可执行文件的版本见正文）
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"terminal.run","params":{"argv":["/bin/sh","-c","sleep 600"],"name":"probe","caller":"'"$HC_TERMINAL_ID"'"}}' | hc connect --json

# 3. 反证：抹掉环境变量就游离
env -u HC_TERMINAL_ID hc run --bg --name probe2 /bin/sh -c "sleep 600"

# 4. 收尾
for t in probe probe2; do hc kill "$t"; hc rm "$t"; done
```

顺带一提：那次实验还往本仓库塞过 `.herdr/automations/` 的自动化脚本和 `.herdr/worktree.toml`，事后已删除并 `sheprd-automate repo remove`，因为"定时触发"和"父子终端"是两件事——前者是 worktree + agent 的新会话，后者只是 hc 的终端树。
