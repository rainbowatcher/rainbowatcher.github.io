---
title: NO_PROXY 为什么要同时写 localhost、127.0.0.1 和 ::1
subtitle: 代理变量只对读取它的客户端生效，回环地址要按 URL 里的 host 原样列
date: 2026-11-13
tags: [代理, HTTP, 网络]
section: 工具
---

## 要点

- `NO_PROXY` 是客户端的直连白名单：命中就跳过 `HTTP_PROXY`/`HTTPS_PROXY` 直连；不读这个变量的程序完全不受影响。
- 三个值对应回环地址的三种写法，缺一个就有一类请求被送进代理，表现为 502、超时，或连到代理机上的同名服务。
- 匹配看 URL 里的 host 字符串，不看解析后的 IP：写 `localhost` 覆盖不了 `127.0.0.1`，反之亦然。

## 用法

### 变量分工

| 变量          | 作用                                                |
| ------------- | --------------------------------------------------- |
| `HTTP_PROXY`  | `http://` 请求的代理，请求行带完整 URL              |
| `HTTPS_PROXY` | `https://` 请求的代理，先 `CONNECT host:443` 建隧道 |
| `ALL_PROXY`   | 没有协议专用变量时的兜底，部分客户端才认            |
| `NO_PROXY`    | 逗号分隔的直连名单，优先级高于上面三个              |

### 三个值分别覆盖什么

| 条目        | 典型 URL                | 说明                                                                       |
| ----------- | ----------------------- | -------------------------------------------------------------------------- |
| `localhost` | `http://localhost:3000` | 主机名，解析到 `127.0.0.1` 还是 `::1` 取决于 `getaddrinfo` 与 `/etc/hosts` |
| `127.0.0.1` | `http://127.0.0.1:8080` | IPv4 回环字面量，host 为 `localhost` 时不会命中                            |
| `::1`       | `http://[::1]:8080`     | IPv6 回环；列表里写 `::1`，方括号只属于 URL                                |

三个都写，是因为写 URL 的一方不受你控制：服务文档、SDK 默认值、测试夹具、健康检查脚本各写各的。成本几乎为零，能省掉大量「本地服务一会儿通一会儿不通」的排查。

### 客户端的判定顺序

```
不读代理变量          → 直连
host 命中 NO_PROXY    → 直连
https + HTTPS_PROXY   → CONNECT 到代理
http  + HTTP_PROXY    → 把完整 URL 发给代理
否则                  → 直连
```

### 有代理、没有 NO_PROXY

```bash
export HTTP_PROXY=http://proxy.corp.example:8080
curl -v http://localhost:3000/api/health
```

curl 连的是 `proxy.corp.example:8080`，请求行是 `GET http://localhost:3000/api/health HTTP/1.1`，代理在**它自己的机器上**解析 `localhost`。你的服务在本机活得好好的，返回的却是：

- `curl: (56) CONNECT tunnel failed, response 502`（HTTPS 场景）
- `curl: (7) Failed to connect to proxy.corp.example port 8080`
- 一直卡到 `curl: (28) Connection timed out`
- 代理机上恰好有同名端口，收到另一个服务的响应

连带失效：本地 OAuth 回调、`pip` 连 devpi、`npm` 连 verdaccio、`git clone http://localhost/...`、`docker build` 里的 `RUN curl`、Terraform/AWS CLI 连 LocalStack 的 `:4566`。

另一个后果：走代理时本地不做 DNS 解析，`/etc/hosts` 的临时条目失效，由代理解析。

### 没有 HTTP_PROXY

- 全部直连，`NO_PROXY` 是 no-op，不报错，也没有副作用。
- 只能经代理出网的环境里，表现为 DNS 失败、连接超时、`TLS handshake timeout`——请求根本没到代理。
- 只设 `HTTPS_PROXY` 时 `https://` 通、`http://` 不通，是最难查的一类。

| `HTTP_PROXY` | `NO_PROXY` 含 `localhost` | `curl http://localhost:3000` |
| ------------ | ------------------------- | ---------------------------- |
| 无           | 无                        | 直连                         |
| 无           | 有                        | 直连（`NO_PROXY` 无用）      |
| 有           | 无                        | 走代理，502 / 超时           |
| 有           | 有                        | 直连                         |

### 排查

```bash
env | grep -i proxy                       # 当前 shell 到底有什么
curl -v http://localhost:3000 2>&1 | head # 看 Uses proxy env variable 还是 Connected to 127.0.0.1
curl --noproxy '*' http://localhost:3000   # 强制绕过，做对照
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
- `*` 表示全部直连，等于禁用代理。
- `NO_PROXY` 里不要写协议、路径与端口，也不要留逗号后的空格。
- `export` 只影响当前 shell 的子进程；`sudo` 默认 `env_reset` 会清掉，需要 `sudo -E` 或 `env_keep`。
- 按 host 字符串匹配，不做 DNS 反查：用 IP 访问时写域名没用。
- 只是客户端的自觉行为，不是防火墙；不读变量的程序照样直连。

## 参考

- [curl: CURLOPT_NOPROXY](https://curl.se/libcurl/c/CURLOPT_NOPROXY.html)
- [Go: httpproxy](https://pkg.go.dev/golang.org/x/net/http/httpproxy)
- [Python: urllib.request.proxy_bypass_environment](https://docs.python.org/3/library/urllib.request.html#urllib.request.proxy_bypass_environment)
- [httpoxy（CVE-2016-5385）](https://httpoxy.org/)
