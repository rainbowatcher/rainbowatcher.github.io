---
title: 专用小模型的分工地图：八个任务族的选型顺序
date: 2026-11-18
tags: [LLM, OpenSource, License]
subtitle: 2026 年可本地部署的专用小模型已覆盖嵌入、重排、OCR、ASR、TTS、翻译、内容守卫与时序预测，参数从 1.5M 到 3.4B；多数由 0.3–2B 小语言模型后训练而来。选型先按许可排除，再按输入输出形态定族，最后用 100 条自有样本验收，榜单名次只用来缩小候选。
---

专用小模型不是一族，而是按输入输出形态切开的八条产品线。

- 共同点：任务固定、参数 1.5M–3.4B、单卡或 CPU 可跑，失败模式可枚举。
- 选型顺序：许可 → 形态（标签 / 自由文本 / 时间戳）→ 自有样本验收。
- 2026 年的分水岭：多数专用模型从 0.3–2B 小语言模型后训练而来，纯编码器退到重排、注入检测这类固定 I/O 任务。

## 问题

- 通用 30B+ 模型做 OCR、转写、分类这些固定任务，单次成本、首字延迟与并发都不划算；0.6–3.4B 专用模型通常更准。
- 但版本按月更新、榜单饱和、许可混杂；选错任务族比选错型号代价更大。
- 领域专用（医疗、法律、金融）的公开权重更少、许可更严，通常不如拿 0.8–4B 基座在自己的数据上微调。

## 候选

| 任务族      | 首选（许可）                                                                                                      | 备选 / 轻量（许可）                                                                                                                               | 边界                                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 嵌入        | [EmbeddingGemma-2](https://huggingface.co/google/embeddinggemma-2) 740M（Apache-2.0，文本+图+音+视频，768 维）    | [Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)（Apache-2.0，100+ 语言，指令感知）；BGE-M3 568M（MIT，稀疏+稠密+多向量） | 纯文本先比 Qwen3 与 BGE-M3；要跨模态再上 EmbeddingGemma-2；jina-v5 小模型是 CC-BY-NC                              |
| 重排        | [Qwen3-Reranker-0.6B](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B)（Apache-2.0）                              | bge-reranker-v2-m3 568M（Apache-2.0，生态成熟）；jina-reranker-v3.5 597M（CC-BY-NC）                                                              | 交叉编码器延迟随候选数线性涨，先召回 50–100 条再重排                                                              |
| OCR         | [PaddleOCR-VL-1.6](https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6) 0.96B（Apache-2.0，版面/表格/公式/印章） | [GLM-OCR](https://huggingface.co/zai-org/GLM-OCR) 1.3B（MIT，卡称 OmniDocBench v1.5 94.62）；PP-OCRv6 1.5–34.5M（Apache-2.0，检测+识别流水线）    | 整页结构化用 VLM；行级识别与端侧用 PP-OCRv6；长文档解析看 DeepSeek-OCR-2 与 Unlimited-OCR-2（3.3B，Apache / MIT） |
| ASR         | [Qwen3-ASR-0.6B](https://huggingface.co/Qwen/Qwen3-ASR-0.6B)（Apache-2.0，30 语言+22 中文方言，流式/离线）        | Parakeet-TDT-0.6B-v3（CC-BY-4.0，25 语言，欧洲为主）；Whisper-large-v3-turbo 809M（MIT，99 语言，生态最全）                                       | 流式且多语种可看 Nemotron-3.5-ASR-streaming-0.6B（OpenMDW-1.1）                                                   |
| TTS         | [Qwen3-TTS-0.6B](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-Base)（Apache-2.0，10 语言，3 秒克隆）           | Kokoro-82M（Apache-2.0，8 语言，CPU 可跑）；Orpheus-3B（Apache-2.0，情感标签）                                                                    | 要情感/非语言提示看 Orpheus，要极致轻量看 Kokoro；许可不明的克隆模型先排除                                        |
| 翻译        | TranslateGemma-4B（Gemma 许可）                                                                                   | HY-MT1.5-1.8B（许可待确认，36 语言，中文优先）；Tower-Plus-2B（CC-BY-NC-SA）                                                                      | 没有干净的 Apache 线；商用先读条款，或直接用 Qwen3.5-4B 自测                                                      |
| 内容守卫    | [Qwen3Guard-Gen-0.6B](https://huggingface.co/Qwen/Qwen3Guard-Gen-0.6B)（Apache-2.0，119 语言，三级严重度）        | Llama-Prompt-Guard-2-86M（许可需确认，注入检测）；Granite Guardian 2B（Apache-2.0）                                                               | 生成式守卫可解释但慢；只做注入检测用 86M 分类器                                                                   |
| 时序 / 表格 | Chronos-Bolt small 47M（Apache-2.0，零样本预测）                                                                  | TimesFM 3.0 330M（非商用）；TabFM 1.0（非商用，表格分类/回归）                                                                                    | 非商用许可只能评估；生产要换 Apache 模型或自训                                                                    |

## 当前判断

- 规模分三档：分类与守卫 22M–300M、嵌入与语音 0.08–1.7B、OCR/VLM 0.9–3.4B；视觉 token 决定 OCR 的下限，纯文本任务不必上解码器。
- 许可先于榜单：嵌入、重排、ASR、TTS、守卫都有完整的 Apache/MIT 线；翻译、时序、jina v5 仍是自定义或 NC；Gemma、Llama、OpenMDW 要逐条读。
- 专用架构通常胜“小通用模型加提示”：固定标签用编码器或任务头，延迟差一个数量级；输出是自由文本（OCR、翻译、TTS）才用解码器。
- OCR 分两条路：整页结构化（VLM，版面/表格/公式）与行级识别（检测+识别流水线，端侧/批量）；先定输出 schema 再选族。
- 榜单已饱和：OmniDocBench、MTEB 的头部差距常小于业务侧噪声；验收看 100 条自有样本的字段级准确率、显存、吞吐与许可，不看名次。

## 下一步

- 做两条 POC：中文 RAG（EmbeddingGemma-2 vs Qwen3-Embedding-0.6B，配 Qwen3-Reranker-0.6B）、中文文档（PaddleOCR-VL-1.6 vs GLM-OCR），各 100 条。
- 记录单卡显存、首字延迟、批量吞吐；OCR 按字段准确率评，不看 CER。
- 选型表写死版本号与许可，不用 latest；下一季度重新核对 Qwen3.5 小模型与 1–3B 档 OCR VLM。

## 参考

- [EmbeddingGemma 2](https://huggingface.co/google/embeddinggemma-2)
- [Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)
- [Qwen3-Reranker-0.6B](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B)
- [PaddleOCR-VL-1.6](https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6)
- [GLM-OCR](https://huggingface.co/zai-org/GLM-OCR)
- [Qwen3-ASR-0.6B](https://huggingface.co/Qwen/Qwen3-ASR-0.6B)
- [Qwen3-TTS-12Hz-0.6B-Base](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-Base)
- [Qwen3Guard-Gen-0.6B](https://huggingface.co/Qwen/Qwen3Guard-Gen-0.6B)
- [Chronos-Bolt small](https://huggingface.co/amazon/chronos-bolt-small)
