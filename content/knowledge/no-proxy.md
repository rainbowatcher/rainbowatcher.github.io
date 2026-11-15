---
title: NO_PROXY 代理绕过名单的作用与匹配
subtitle: 客户端发请求前查的直连名单：按 URL 里的 host 字符串匹配，命中就跳过 HTTP_PROXY/HTTPS_PROXY，不读它的程序完全不受影响
date: 2026-11-13
updated: 2026-11-15
tags: [代理, HTTP, 网络]
section: 工具
---

## 要点

`NO_PROXY` 是客户端的一份直连名单，请求的 host 命中名单就不再走代理。

- 它只做减法：命中即跳过 `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY`，自身不提供路由、不建隧道。
- 匹配对象是 URL 里的 host 字符串，不是解析后的 IP，也不做 DNS 反查。
- 生效与否取决于客户端：curl、Go、Python、Node 各写一套解析，JVM 默认完全不读环境变量。

## 用法

### 变量分工

| 变量          | 作用                                                |
| ------------- | --------------------------------------------------- |
| `HTTP_PROXY`  | `http://` 请求的代理，请求行带完整 URL              |
| `HTTPS_PROXY` | `https://` 请求的代理，先 `CONNECT host:443` 建隧道 |
| `ALL_PROXY`   | 没有协议专用变量时的兜底，部分客户端才认            |
| `NO_PROXY`    | 逗号分隔的直连名单，优先级高于上面三个              |

前三个回答「出去找谁」，`NO_PROXY` 回答「哪些目的地不去找它」。它们只是环境变量，客户端可以不理：命令行参数、工具自己的配置文件、代码里的代理设置都能盖过。

### 匹配规则

- 逗号分隔，条目只写 host 或带前导点的域，不带协议、路径；逗号后不留空格。
- 比较发生在 host 字符串层面：写 `localhost` 覆盖不了 `127.0.0.1`，反之亦然；用 IP 访问时写域名同样没用。
- `*` 表示全部直连，等价于禁用代理。
- 前导点、子域连带匹配、端口与 CIDR 的支持度各家不同，见「边界」。
- 命中后由本机解析域名，`/etc/hosts` 里的临时条目才生效；走代理时解析发生在代理机上。

### 判定顺序

```
不读代理变量          → 直连
host 命中 NO_PROXY    → 直连
https + HTTPS_PROXY   → CONNECT 到代理
http  + HTTP_PROXY    → 把完整 URL 发给代理
否则                  → 直连
```

### 有代理、名单没命中

```bash
export HTTP_PROXY=http://proxy.corp.example:8080
curl -v http://localhost:3000/api/health
```

curl 连的是 `proxy.corp.example:8080`，请求行是 `GET http://localhost:3000/api/health HTTP/1.1`，代理在**它自己的机器上**解析 `localhost`。本机服务活得好好的，回来的却是：

- `curl: (56) CONNECT tunnel failed, response 502`（HTTPS 场景）
- `curl: (7) Failed to connect to proxy.corp.example port 8080`
- 一直卡到 `curl: (28) Connection timed out`
- 代理机上恰好有同名端口，收到另一个服务的响应

连带失效：本地 OAuth 回调、`pip` 连 devpi、`npm` 连 verdaccio、`git clone http://localhost/...`、`docker build` 里的 `RUN curl`、Terraform/AWS CLI 连 LocalStack 的 `:4566`。

### 回环地址三种写法都要列

| 条目        | 典型 URL                | 说明                                                                       |
| ----------- | ----------------------- | -------------------------------------------------------------------------- |
| `localhost` | `http://localhost:3000` | 主机名，解析到 `127.0.0.1` 还是 `::1` 取决于 `getaddrinfo` 与 `/etc/hosts` |
| `127.0.0.1` | `http://127.0.0.1:8080` | IPv4 回环字面量，URL 里写成 `localhost` 时不会命中                         |
| `::1`       | `http://[::1]:8080`     | IPv6 回环；名单里写 `::1`，方括号只属于 URL                                |

写 URL 的一方常常不受你控制：服务文档、SDK 默认值、测试夹具、健康检查脚本各写各的，三个都列的成本几乎为零，省掉大量「本地服务一会儿通一会儿不通」的排查。

### 没有 HTTP_PROXY

- 全部直连，`NO_PROXY` 是 no-op，不报错也没有副作用。
- 只能经代理出网的环境里表现为 DNS 失败、连接超时、`TLS handshake timeout`——请求根本没到代理。
- 只设 `HTTPS_PROXY` 时 `https://` 通、`http://` 不通，是最难查的一类。

| `HTTP_PROXY` | `NO_PROXY` 含 `localhost` | `curl http://localhost:3000` |
| ------------ | ------------------------- | ---------------------------- |
| 无           | 无                        | 直连                         |
| 无           | 有                        | 直连（`NO_PROXY` 无用）      |
| 有           | 无                        | 走代理，502 / 超时           |
| 有           | 有                        | 直连                         |

### 排查

```bash
env | grep -i proxy                        # 当前 shell 到底有什么
curl -v http://localhost:3000 2>&1 | head  # Uses proxy env variable 还是 Connected to 127.0.0.1
curl --noproxy '*' http://localhost:3000    # 强制绕过，做对照
python3 -c "import urllib.request; print(urllib.request.getproxies())"
```

### 推荐写法

```bash
export HTTP_PROXY=http://proxy.corp.example:8080
export HTTPS_PROXY=$HTTP_PROXY
export NO_PROXY="localhost,127.0.0.1,::1,.corp.example"
export no_proxy=$NO_PROXY
```

## 边界

- 没有标准，行为按客户端实现：
    - curl ≥ 7.86.0 支持 CIDR，但不支持 `host:port` 条目
    - Go 支持 `*`、CIDR、`host:port`、`[::1]:port` 与 `<local>`
    - Python `urllib`/`requests` 只做主机名字符串匹配，**不支持 CIDR**，`10.0.0.0/8` 等于没写
    - JVM 默认不读环境变量，用 `-Dhttp.proxyHost` / `-Dhttp.nonProxyHosts`；Node 核心默认不读，24 起可用 `NODE_USE_ENV_PROXY=1`
- 大小写：`no_proxy` 与 `NO_PROXY` 都设；curl 在 CGI/setuid 下忽略大写 `HTTP_PROXY`（httpoxy）。
- 不读变量的程序照样走代理，`NO_PROXY` 拦不住，因为先要看客户端认不认这套变量。
- `export` 只影响当前 shell 的子进程；`sudo` 默认 `env_reset` 会清掉，需要 `sudo -E` 或 `env_keep`。
- 只是客户端的自觉行为，不是防火墙，也不是全局开关。

## 参考

- [curl: CURLOPT_NOPROXY](https://curl.se/libcurl/c/CURLOPT_NOPROXY.html)
- [Go: httpproxy](https://pkg.go.dev/golang.org/x/net/http/httpproxy)
- [Python: urllib.request.proxy_bypass_environment](https://docs.python.org/3/library/urllib.request.html#urllib.request.proxy_bypass_environment)
- [httpoxy（CVE-2016-5385）](https://httpoxy.org/)
