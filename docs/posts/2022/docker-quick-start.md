---
layout: Post
title: Docker 常用的容器启动命令
subtitle: 
date: 2022-08-12
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/docker.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [Docker, Container]
---

## MySQL [<Badge type="tip" text="tags" vertical="middle"/>](https://hub.docker.com/_/mysql?tab=tags)

```shell
id=$(docker ps -aqf 'name=mysql5.7');[ $id ] && docker rm $id
docker run -tid \
  --name mysql5.7 \
  -v ~/DockerVolumes/mysql:/var/lib/mysql \
  -v ~/DockerVolumes/mysql-conf:/etc/mysql/conf.d/ \
  -p 3306:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=123123 \
  -d mysql:5.7
```

## Portainer [<Badge type="tip" text="tags" vertical="middle"/>](https://hub.docker.com/_/portainer?tab=tags)

[portainer.io](http://portainer.io/) 一个可视化的 Docker 管理工具

```bash
docker volume create portainer_data
docker run -d \
  -p 8000:8000 \
  -p 9000:9000 \
  -e TZ=Asia/Shanghai \
  --name=portainer \
  --restart=always \
  -v ~/DockerVolumes/portainer_data/docker.sock:/var/run/docker.sock \
  -v ~/DockerVolumes/portainer_data:/data \
  portainer/portainer-ce
```

update：

```sh
docker stop portainer
docker rm portainer
docker pull portainer/portainer-ce:latest
docker run -d \
  -p 8000:8000 \
  -p 9000:9000 \
  -e TZ=Asia/Shanghai \
  --name=portainer \
  --restart=always \
  -v ~/DockerVolumes/portainer_data/docker.sock:/var/run/docker.sock \
  -v ~/DockerVolumes/portainer_data:/data \
  portainer/portainer-ce
```

## Redis [<Badge type="tip" text="tags" vertical="middle"/>](https://hub.docker.com/_/redis?tab=tags)

```shell
docker run -tid \
  --name redis \
  -e TZ=Asia/Shanghai \
  -p 6379:6379 \
  redis
```

## ElasticSearch [<Badge type="tip" text="tags" vertical="middle"/>](https://hub.docker.com/_/elasticsearch?tab=tags)

```shell
docker network create elk
docker run -d \
  --name elasticsearch7 \
  --net elk \
  -e TZ=Asia/Shanghai \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  elasticsearch:7.7.0
```

## Kibana [<Badge type="tip" text="tags" vertical="middle"/>](https://hub.docker.com/_/kibana?tab=tags)

```shell
# 7.7.0
docker run -d \
  --name kibana7 \
  --net elk \
  -e TZ=Asia/Shanghai \
  -p 5601:5601 \
  -v ~/DockerVolumes/elk7/kibana/config:/usr/share/kibana/config \
  kibana:7.7.0
```

## Uptime-kuma [<Badge type="tip" text="Github" vertical="middle"/>](https://github.com/louislam/uptime-kuma)

Uptime-kuma 是一款自托管的可视化监控工具。

```shell
docker pull louislam/uptime-kuma:1
docker stop uptime-kuma
docker rm uptime-kuma

docker run -d \
  -p 3001:3001 \
  -e TZ=Asia/Shanghai \
  -v ~/DockerVolumes/uptime-kuma:/app/data \
  --name uptime-kuma \
  louislam/uptime-kuma:1
```

## OpenGrok

OpenGrok 是一个源代码查看的工具，感觉优势主要是轻量吧。

```shell
docker run -d \
  -v ~/DockerVolumes/opengrok/src:/opengrok/src \
  -p 8080:8080 \
  -e TZ=Asia/Shanghai \
  --name opengrok \
  opengrok/docker:latest
```
