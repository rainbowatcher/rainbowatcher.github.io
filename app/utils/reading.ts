/**
 * 做什么：按正文纯文本长度估算阅读时长，用于文章页的「N 分钟阅读」。
 * 状态与生命周期：纯函数，无状态；入参是 MDC 解析出的 AST 或任意节点。
 * 取舍与不变量：按 400 字/分钟、最少 1 分钟估算；中英文混排按字符数计，不区分词边界，
 * 只用于给出量级，不做分词统计。
 * 边界：不读取文件、不解析 Markdown，也不包含代码块与图片的额外耗时。
 */
const CHARS_PER_MINUTE = 400

function textLength(node: unknown): number {
    if (!node || typeof node !== "object") return 0
    const record = node as { type?: string; value?: unknown; children?: unknown[] }
    if (record.type === "text" && typeof record.value === "string") return record.value.length
    if (!Array.isArray(record.children)) return 0
    return record.children.reduce((sum: number, child) => sum + textLength(child), 0)
}

export function readingMinutes(body: unknown): number {
    const length = textLength(body)
    return Math.max(1, Math.round(length / CHARS_PER_MINUTE))
}
