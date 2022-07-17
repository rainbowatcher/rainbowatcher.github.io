---
layout: Post
title: OGG配置同步数据到Kafka
subtitle:
date: 2022-07-13
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/markdown.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: true
tags: [OGG, Kafka]
---

# ogg to kafka

| 组件    | 版本           |
| ------- | -------------- |
| sqlplus | 11.2.0.3.0     |
| oracle  | 11g 11.2.0.3.0 |
| ogg     | 12.3.0.1.4     |

## 软件下载

- https://edelivery.oracle.com/osdc/faces/SoftwareDelivery
- http://www.oracle.com/technetwork/middleware/goldengate/downloads/index.html

## 步骤说明

- 源端目标端配置ogg管理器（mgr）；
- 源端配置extract进程进行Oracle日志抓取；
- 源端配置pump进程传输抓取内容到目标端；
- 目标端配置replicate进程复制日志到Kafka集群；

## oracle 配置

### 设置环境变量

```shell
echo "export OGG_HOME=/ogg
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:/usr/lib
export PATH=$OGG_HOME:$PATH" >> ~/.bashrc && source ~/.bashrc
```

### 开启归档模式

```shell {4}
$ echo "archive log list" | sqlplus / as sysdba

SQL> Database log mode         Archive Mode
Automatic archival             Enabled
Archive destination            /u01/app/oracle/logdata/amro/archivelog/log1
Oldest online log sequence     141856
Next log sequence to archive   141860
Current log sequence           141860
```

若 Automatic archival 为 Enabled 则为已启用。若显示为 Disabled 则使用下面的方式启动

```shell
echo 'shutdown immediate
startup mount
alter database archivelog
alter database open
alter system archive log start' | sqlplus / as sysdba
```

| 命令                             | 描述                           |
| -------------------------------- | ------------------------------ |
| `shutdown immediate`             | 立即关闭数据库                 |
| `startup mount`                  | 启动实例并加载数据库，但不打开 |
| `alter database archivelog`      | 更改数据库为归档模式           |
| `alter database open`            | 打开数据库                     |
| `alter system archive log start` | 启用自动归档                   |

### 启用辅助日志

```shell
$ echo 'select
force_logging,
supplemental_log_data_min,
supplemental_log_data_all
from v$database;' | sqlplus / as sysdba

SQL>   2    3    4    5
FOR SUPPLEME SUP
--- -------- ---
YES YES      YES
```

若显示为 NO 则通过下面的命令开启

```shell
echo 'alter database force logging
alter database add supplemental log data' | sqlplus / as sysdba
```

上面只是开启了最小辅助日志，即 null 值不会显示在日志中，若要开启全列辅助日志需要

```shell
echo 'alter database add supplemental log data(all) columns;' | sqlplus / as sysdba
```

::: warning

开启全列补充日志会导致磁盘快速增长，LGWR 进程繁忙，不建议使用。

:::

### 创建复制用户

这里记得要替换成自己想要的用户名和密码

```shell
echo "
create tablespace oggtbs datafile '/oracledata/data/tablespace/dbsrv2/oggtbs01.dbf' size 1000M autoextend on;
create user ogg identified by 123456 default tablespace oggtbs;
grant dba to ogg;
" | sqlplus / as sysdba
```

## 源端配置

### Oracle

若已存在需同步的表则跳过这一步，下面代码只为测试

```shell
echo "
create user test_ogg identified by test_ogg default tablespace users;
grant dba to test_ogg;
conn test_ogg/test_ogg;
create table test_ogg(id int,name varchar(20),sex varchar(4),primary key(id));
" | sqlplus / as sysdba
```

### OGG

初始化

```shell
$ echo "create subdirs" | ggsci
Creating subdirectories under current directory /ogg

Parameter files                /ogg/dirprm: created
Report files                   /ogg/dirrpt: created
Checkpoint files               /ogg/dirchk: created
Process status files           /ogg/dirpcs: created
SQL script files               /ogg/dirsql: created
Database definitions files     /ogg/dirdef: created
Extract data files             /ogg/dirdat: created
Temporary files                /ogg/dirtmp: created
Stdout files                   /ogg/dirout: created
```

## 目标端

```shell
echo "export OGG_HOME=/data/apps/ogg
export LD_LIBRARY_PATH=$JAVA_HOME/jre/lib/amd64:$JAVA_HOME/jre/lib/amd64/server:$JAVA_HOME/jre/lib/amd64/libjsig.so:$JAVA_HOME/jre/lib/amd64/server/libjvm.so:$OGG_HOME/lib
export PATH=$OGG_HOME:$PATH" >> ~/.bashrc && source ~/.bashrc
```

初始化OGG

```shell
echo 'create subdirs' | sqlplus / as sysdba
```

配置全局变量

```shell
echo 'oggschema ggs' >> 
```


```shell
$ ./ggsci
> edit param mgr
port 7788
DYNAMICPORTLIST 7810-7909
autorestart extract *,waitminutes 2,retries 5
purgeoldextracts /ogg/dirdat/*,usecheckpoints,minkeephours 1,frequencyminutes 30
```
