### 这里放的是爬虫脚本

使用官方提供的 docsearch-scraper python实现的爬虫项目将博客内容提交到 algolia 索引。

- [官方爬虫配置文档](https://docsearch.algolia.com/docs/legacy/run-your-own#set-up-your-environment)
- [官方页面爬虫 - docsearch-scraper](https://github.com/algolia/docsearch-scraper)
- [官方的配置示例仓库 - docsearch-configs](https://github.com/algolia/docsearch-configs/blob/master/configs/vuepress.json)

### 使用方式

确保你完成了下面这些事情：

- 安装docker
- 配置好了`.env`和`algolia.json`

OK，下面的命令需要在`.env`文件所在目录执行

```shell
id=$(docker ps -aqf 'name=docsearch');[ $id ] && docker rm $id;docker run -it --name docsearch --env-file=.env -e "CONFIG=$(cat algolia.json | jq -r tostring)" algolia/docsearch-scraper
```