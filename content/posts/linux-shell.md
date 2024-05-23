---
layout: Post
title: Unix Shell 基本语法
subtitle:
date: 2022-09-26
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/linux.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
# hide: true
tags: [Linux, Shell]
---

## 头部声明

可以在脚本的头部申明运行环境，比如使用 bash 运行可以在脚本头部添加如下代码

```shell
#!/bin/bash
```

shell 环境中提供 env 命令来指定运行环境

```shell
#!/usr/bin/env zsh
```

## 变量

### 定义

```shell
key="value" # 普通字符串变量
```

- 定义变量时等号两边不能有空格
- 没有数据类型声明

### 引用

```shell
echo ${key} # value
echo $key # value
```

### 变量默认值

| 表达式             | 含义                                                            |
| ------------------ | --------------------------------------------------------------- |
| `${var}`           | 变量 var 的值，与 `$var` 相同                                   |
| `${var-$DEFAULT}`  | 如果 var 没有被声明，那么就以 `$DEFAULT` 作为其值               |
| `${var:-$DEFAULT}` | 如果 var 没有被声明，或者其值为空，那么就以 `$DEFAULT` 作为其值 |
| `${var=$DEFAULT}`  | 如果 var 没有被声明，那么就以 `$DEFAULT` 作为其值               |
| `${var:=$DEFAULT}` | 如果 var 没有被声明，或者其值为空，那么就以 `$DEFAULT` 作为其值 |
| `${var+$OTHER}`    | 如果 var 声明了，那么其值就是 `$OTHER` , 否则就为 null 字符串   |
| `${var:+$OTHER}`   | 如果 var 被设置了，那么其值就是 `$OTHER` , 否则就为 null 字符串 |
| `${var?ERR_MSG}`   | 如果 var 没被声明，那么就打印 `$ERR_MSG`                        |
| `${var:?ERR_MSG}`  | 如果 var 没被设置，那么就打印 `$ERR_MSG`                        |
| `${!varprefix*}`   | 匹配之前所有以 varprefix 开头进行声明的变量 (zsh 中为 event)    |
| `${!varprefix@}`   | 匹配之前所有以 varprefix 开头进行声明的变量 (zsh 中为 event)    |

```shell
unset key
echo ${key-$SHELL} # /bin/zsh
key=
echo ${key-$SHELL} # ""
key="value"
echo ${key-$SHELL} # value

unset key
echo ${key:-$SHELL} # /bin/zsh
key=
echo ${key:-$SHELL} # /bin/zsh
key="value"
echo ${key:-$SHELL} # value

unset key
echo ${key+$SHELL} # ""
key=
echo ${key+$SHELL} # /bin/zsh
key="value"
echo ${key+$SHELL} # /bin/zsh

unset key
echo ${key:+$SHELL} # ""
key=
echo ${key:+$SHELL} # ""
key="value"
echo ${key:+$SHELL} # /bin/zsh

unset key
echo ${key?"not define"} # zsh: key: "not define"
key=
echo ${key?"not define"} # ""
key="value"
echo ${key?"not define"} # value

unset key
echo ${key:?"not define"} # zsh: key: "not define"
key=
echo ${key:?"not define"} # zsh: key: "not define"
key="value"
echo ${key:?"not define"} # value

echo ${!h*} # http_proxy https_proxy
```

### 位置变量

脚本中$1-$9，表示第一个到第九个参数

### 预定义变量

| 变量 | 说明                                                                  |
| ---- | --------------------------------------------------------------------- |
| `$#` | 参数的个数                                                            |
| `$*` | 所有的参数                                                            |
| `$?` | 上一条命令执行的结果，0：上一条命令正确执行，非 0：上一条命令执行失败 |

### 环境变量

全局环境变量：对所有用户生效

```shell
/etc/profile
```

系统环境变量

```shell
PATH=$PATH:$JAVA_HOME\bin
```

用户环境变量：每个用户拥有自己的环境变量，只对自己生效

每个用户在自己的家目录下有一个配置文件

```shell
~/.bash_profile
```

## 数据类型

### 数字

```shell
num=100
echo "$num+1" # 100+1

test $num -eq 100 && echo y || echo n # y
test $num = 100 && echo y || echo n # y
```

#### 算术表达式

```shell
a=1
b=2
echo $[ $a + $b ] # 3
echo `expr $a + $b` # 3
echo $(expr $b - $a) # 1
echo $(( $num + 1 )) # 2
echo $((a+b)) / $(($a+$b)) # 3 / 3
echo $(expr $((a+b)) / $(($a+$b))) # 1
```

### 字符串

```shell
str="foo"
```

#### 字符串操作

| 表达式                             | 含义                                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `${#string}`                       | `$string` 的长度                                                                             |
| `${string:position}`               | 在 `$string` 中，从位置 `$position` 开始提取子串                                             |
| `${string:position:length}`        | 在 `$string` 中，从位置 `$position` 开始提取长度为 `$length` 的子串                          |
| `${string#substring}`              | 从变量 `$string` 的开头，删除最短匹配 `$substring` 的子串                                    |
| `${string##substring}`             | 从变量 `$string` 的开头，删除最长匹配 `$substring` 的子串                                    |
| `${string%substring}`              | 从变量 `$string` 的结尾，删除最短匹配 `$substring` 的子串                                    |
| `${string%%substring}`             | 从变量 `$string` 的结尾，删除最长匹配 `$substring` 的子串                                    |
| `${string/substring/replacement}`  | 使用 `$replacement` , 来代替第一个匹配的 `$substring`                                        |
| `${string//substring/replacement}` | 使用 `$replacement` , 代替所有匹配的 `$substring`                                            |
| `${string/#substring/replacement}` | 如果 `$string` 的前缀匹配 `$substring` , 那么就用 `$replacement` 来代替匹配到的 `$substring` |
| `${string/%substring/replacement}` | 如果 `$string` 的后缀匹配 `$substring` , 那么就用 `$replacement` 来代替匹配到的 `$substring` |

### 数组

```shell
arr=(a b c)
# 只给第 3、5、10 个元素赋值，数组长度为 3
arr=([3]=24 [5]=19 [10]=12)
```

数组操作

```shell
# 取出数组值
echo ${arr[1]} # a
# 数组切片
echo ${arr[1,2]} # a b
echo ${arr[*]:1:2} # H c  不推荐
# 数组长度
echo ${#arr[@]} # 3
# 输出数组为字符串
echo "$arr" # zsh 中输出整个数组 a b c  bash 中数组第一个元素 a
# 输出数组中的每个元素
echo ${arr[@]}
# 数组赋值
arr[2]="H"
echo ${arr[@]} # a H c
# 删除元素
unset arr[1] # 仅 bash 中生效
echo ${arr[@]} # H c
# 合并数组
arr1=(23 56)
arr2=(99 "shell")
arr_new=(${arr1[@]} ${arr2[*]})
echo ${arr_new[@]} # 23 56 99 shell
```

::: tip
zsh 中数组下标从 1 开始，而 bash 中数组下标从 0 开始
:::

### Map

```shell
declare -A myMap=(
    [one]="first"
    [two]="second"
)

for item in ${myMap[*]}; do
        echo $item
done
# first
# second
```

## 分支

### if 语句

```shell
# 单分支 if 语句
if [ condition ];then
  #body
fi

# 多分支 if 语句
if [ condition ]
then
  #body
else
  #body
fi

if [ condition ]
then
  #body
elif [ condition ]
then
  #body
else
  #body
fi

# 且关系
if [ condition1 ] && [ condition2 ]; then
  #body
fi

if [ condition1 -a condition2 ]; then
  #body
fi

# 或关系
if [ condition1 ] || [ condition2 ]; then
  #body
fi

if [ condition1 -o condition2]; then
  #body
fi
```

#### 条件表达式

类 Unix 系统提供 test 命令来测试条件表达式

```shell
if test 1 -eq 1; then
  echo "equal"
else
  echo "not equal"
fi

# equal
```

其效果等同于

```shell
if [ 1 -eq 1 ]; then
  echo "equal"
else
  echo "not equal"
fi

# 高级条件表达式 支持 ==、!=、>=、<=、>、< 操作符
if ((1==1)); then
  echo "equal"
else
  echo "not equal"
fi
```

下面是常用的条件操作符

| 操作符 | 描述           |
| ------ | -------------- |
| `-eq`  | 等于           |
| `-ne`  | 不等于         |
| `-gt`  | 大于           |
| `-ge`  | 大于等于       |
| `-lt`  | 小于           |
| `-le`  | 小于等于       |
| `-f`   | 是否是一个文件 |
| `-d`   | 是否是一个目录 |
| `-e`   | 是否存在       |
| `-z`   | 是否为空       |
| `-n`   | 是否不为空     |
| `-w`   | 是否可写       |
| `-r`   | 是否可读       |
| `-x`   | 是否可执行     |

### switch 语句

```shell
case "${item}" in
  1)
    echo "item = 1"
  ;;
  2|3)
    echo "item = 2 or item = 3"
  ;;
  *)
    echo "default (none of above)"
  ;;
esac
```

## 循环

### for 循环

```shell
# 遍历集合
for item in {a,b,c}; do
  echo $item
done

# 遍历数组
for item in ${arr[@]}; do
  echo $item
done

# 指定循环次数
for((i=1;i<10;i++))
do
    执行的命令
done

# 使用序列
for num in $(seq 1 5); do
 printf $num
done
```

### while 循环

```shell
while [ condition ]; do
  # body
done
```

## 操作符

| 操作符 | 描述                                         | 示例                          |
| ------ | -------------------------------------------- | ----------------------------- |
| `.`    | 表示当前目录                                 | `./foo.sh`                    |
| `..`   | 表示上一级目录                               | `../foo.sh`                   |
| `~`    | 代表家目录                                   | `cd ~`                        |
| `\|`   | 管道符，上一个命令的输出作为下一个命令的输入 | `echo "hello world" \| wc -w` |
| \      | 通常放在行末，用来连接下一行                 |

## 脚本的执行

- [ ] TODO

## 参考

- [Shell 数组 - 菜鸟教程](https://www.runoob.com/linux/linux-shell-array.html)
