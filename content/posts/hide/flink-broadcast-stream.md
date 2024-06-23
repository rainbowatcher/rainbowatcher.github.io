---
title: Flink 广播流使用
subtitle: 
date: 2022-08-30
headerImage: /img/flink.png
tags: [Flink]
---

## 代码

```java
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
// ...env setting

// Source
KafkaSource<SourceValue> kafkaSource =
    KafkaSource.<>builder()
        .setBootstrapServers(BOOTSTRAP_SERVERS)
        .setTopics(TOPIC)
        .build();
DataStreamSource<SourceValue> source =
    env.fromSource(kafkaSource, WatermarkStrategy.noWatermarks(), "sourceName");

// Broadcast
MapStateDescriptor<Key, Value> state =
    new MapStateDescriptor<>("state", Key.class, Value.class);
BroadcastStream<Value> broadcastStream = env.addSource().broadcast(state);

// Process
source.connect(broadcastStream)
    .process(new MyProcessFunction())
    .addSink(new MySinkFunction());

env.execute();
```

## 思考

Flink 中的广播流适合维度表不常变化的场景，因为一旦广播流算子将上游表的数据读取完成便会进入FINISHED状态

## 参考

[The Broadcast State Pattern - Apache Flink](https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/fault-tolerance/broadcast_state/)
