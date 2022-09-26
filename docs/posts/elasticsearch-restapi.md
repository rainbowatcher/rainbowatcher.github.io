---
layout: Post
title: ElasticSearch REST API 使用示例
subtitle: 
date: 2022-08-19
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/elasticsearch.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [ElasticSearch, Example]
---

## Index Api

### 创建 Index

```http
PUT /index_name/
```

### 删除 Index

```http
DELETE /index_name
```

## Document Api

### 删除

```http
DELETE /index_name/label/N310108198708302043
```

### 批量删除

```http
POST /index_name/_delete_by_query
{
  "query": {
    "match": {
      "field_name": "field_value"
    }
  }
}
```

### 添加

```http
POST /index_name/label/N310108198708302043
{
  "UNITED_CIB_MILES": 0,
  "CNX_1YEAR_RATIO": 0,
  "PVG6_8_CNT": 0,
  "MFM_1YEAR_RATIO": 0,
  "ACTUAL_YEAR_DIS": 0.15,
  "IDCARD_AGE": "65",
  "LATELY_DAY": 221,
  "PVG21_24_CNT": 0,
  "PRICE_SENSITIVE_FLAG": "是",
  "UNITED_ABC_MILES": 0,
  "BUSINESS_RATIO": 0
}
```

### 增量更新字段

```http
POST /index_name/label/N310108198708302043/_update
{
  "doc": {
    "TOTAL_REFUND_CNT": 1
  }
}
```

## Search Api

### Range

```http
POST /index_name/_search/
{
  "query": {
    "constant_score": {
      "filter": {
        "range": {
          "PK_MEMBER_ID": {
            "gt": 230,
            "lt": 240,
            "relation": "CONTAINS"
          }
        }
      }
    }
  },
  "size": 50
}
```

参数：

| 参数 key  | 参数说明                                     |
| --------- | -------------------------------------------- |
| gt        | 大于                                         |
| gte       | 大于等于                                     |
| lt        | 小于                                         |
| lte       | 小于等于                                     |
| format    | 日期格式化                                   |
| relation  | 对于 range 对象的匹配规则                    |
| time_zone | 例如 +01:00 或 -08:00 或 America/Los_Angeles |
| boost     | 用于减少或增加查询相关性分数的浮点数         |

relation：

- INTERSECTS（默认）匹配具有与查询范围相交的范围字段值的文档。
- CONTAINS 匹配具有完全包含查询范围的范围字段值的文档。
- WITHIN 匹配具有完全在查询范围内的范围字段值的文档。

### Regexp

```http
POST /index_name/_search/
{
  "query": {
    "regexp": {
      "PK_MEMBER_ID": {
        "value": "23.",
        "flags": "ALL",
        "max_determinized_states": 10000,
        "rewrite": "constant_score"
      }
    }
  }
}
```

### 筛选字段

```http
POST /index_name/_search/
{
  "_source": [
    "IS_MEMBER_FLAG",
    "REGIST_DATE",
    "IS_UNITED_CARD_FLAG",
    "MEMBER_LEVEL_CODE",
    "SOURCE_NAME",
    "PK_MEMBER_ID",
    "LEVEL_NAME1",
    "LEVEL_NAME2",
    "UPDATE_AT"
  ],
  "query": {
    "regexp": {
      "PK_MEMBER_ID": {
        "value": "23.",
        "flags": "ALL",
        "max_determinized_states": 10000,
        "rewrite": "constant_score"
      }
    }
  },
  "sort": [
    "PK_MEMBER_ID"
  ]
}
```

### Exists

```http
GET /index_name/_search
{
  "query": {
    "exists": {
      "field": "KC_EMPHASIS"
    }
  }
}
```

## 更新 mapping

```http
PUT /index_name/_mapping
{
  "properties": {
    "name": {
      "type": "text"
    },
    "age": {
      "type": "integer"
    },
    "address": {
      "type": "keyword"
    }
  }
}
```



