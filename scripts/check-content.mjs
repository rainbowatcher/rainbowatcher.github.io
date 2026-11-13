/**
 * 做什么：校验 content/ 下已发布 markdown 的 frontmatter 与相对链接，跑 `pnpm content:check`。
 * 状态与生命周期：一次性脚本，读文件后逐条规则收集问题，有问题时 exit 1。
 * 取舍与不变量：只认本仓库实际使用的极简 YAML（key: value 与行内数组），不引入 yaml 依赖；
 * knowledge 的合法 section 从 app/utils/knowledge.ts 的 SECTION_ORDER 读取，避免两处枚举漂移。
 * 边界：不做 schema 级类型校验，不检查外链可达性（那是 `pnpm check` 的 lychee），
 * 也不检查 hide/ 下的草稿。
 */
import { createHash } from "node:crypto"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contentDir = path.join(root, "content")

/** 会发布并因此参与校验的集合；hide/ 是草稿，故意不在名单里。 */
const PUBLISHED = ["posts", "knowledge", "explore", "experience", "research"]

const REQUIRED = {
    experience: ["title", "tags", "date"],
    explore: ["title", "tags", "date"],
    knowledge: ["title", "section", "tags", "date"],
    posts: ["title", "tags", "date"],
    research: ["title", "tags", "date"],
}

const problems = []
const report = (file, message) => problems.push(`${path.relative(root, file)}: ${message}`)

function readSectionOrder() {
    const source = readFileSync(path.join(root, "app/utils/knowledge.ts"), "utf8")
    const match = source.match(/SECTION_ORDER\s*=\s*\[([^\]]*)]/)
    if (!match) throw new Error("无法从 app/utils/knowledge.ts 解析 SECTION_ORDER")
    return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1])
}

function walk(dir) {
    if (!existsSync(dir)) return []
    return readdirSync(dir).flatMap((entry) => {
        const full = path.join(dir, entry)
        return statSync(full).isDirectory() ? walk(full) : [full]
    })
}

function splitFrontmatter(raw) {
    if (!raw.startsWith("---\n")) return { body: raw, frontmatter: "" }
    const end = raw.indexOf("\n---\n", 3)
    if (end === -1) return { body: raw, frontmatter: "" }
    return { body: raw.slice(end + 5), frontmatter: raw.slice(4, end) }
}

function parseFrontmatter(frontmatter) {
    const data = {}
    for (const line of frontmatter.split("\n")) {
        const match = line.match(/^([\w-]+):\s*(.*)$/)
        if (!match) continue
        data[match[1]] = match[2].trim()
    }
    return data
}

/** 行内数组 `[a, b]` → 数组；支持 YAML 的带引号写法。 */
function parseTags(value) {
    if (!value) return []
    const inner = value.replace(/^\[|\]$/g, "").trim()
    if (!inner) return []
    return inner
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)
}

const sectionOrder = readSectionOrder()
const dateRE = /^\d{4}-\d{2}-\d{2}$/
const emojiRE = /[\p{Extended_Pictographic}]/u
const seenDigests = new Map()

for (const collection of PUBLISHED) {
    for (const file of walk(path.join(contentDir, collection)).filter((file) => file.endsWith(".md"))) {
        const raw = readFileSync(file, "utf8")
        const { body, frontmatter } = splitFrontmatter(raw)
        const data = parseFrontmatter(frontmatter)

        if (!frontmatter) {
            report(file, "缺少 frontmatter")
            continue
        }

        for (const key of REQUIRED[collection]) {
            if (!data[key]) report(file, `缺少必填字段 ${key}`)
        }

        if (data.title) {
            if (/^["']|["']$/.test(data.title)) report(file, `title 不应加引号：${data.title}`)
            if (emojiRE.test(data.title)) report(file, `title 不应含 emoji：${data.title}`)
        }

        if (data.date && (!dateRE.test(data.date) || Number.isNaN(new Date(data.date).valueOf()))) {
            report(file, `date 必须是 YYYY-MM-DD：${data.date}`)
        }

        if (collection === "knowledge" && data.section && !sectionOrder.includes(data.section)) {
            report(file, `section 只能是 ${sectionOrder.join(" / ")}：${data.section}`)
        }

        if (data.tags !== undefined) {
            const tags = parseTags(data.tags)
            if (tags.length === 0) report(file, "tags 不能为空数组")
            const duplicated = tags.filter((tag, index) => tags.indexOf(tag) !== index)
            if (duplicated.length > 0) report(file, `tags 重复：${duplicated.join(", ")}`)
        }

        // 同一篇正文出现在两个集合里是迁移遗留的双写，用正文哈希抓出来。
        const digest = createHash("sha1").update(body.replaceAll(/\s+/g, "")).digest("hex")
        const first = seenDigests.get(digest)
        if (first) report(file, `正文与 ${path.relative(root, first)} 完全相同`)
        else seenDigests.set(digest, file)

        for (const match of body.matchAll(/\]\(([^)\s]+)\)/g)) {
            const link = match[1]
            if (!link.endsWith(".md") || /^https?:/.test(link)) continue
            const target = path.normalize(path.join(path.dirname(file), link))
            if (!existsSync(target)) report(file, `相对链接指向不存在的文件：${link}`)
        }
    }
}

if (problems.length > 0) {
    console.error(`content 校验失败，共 ${problems.length} 项：`)
    for (const problem of problems) console.error(`  - ${problem}`)
    process.exit(1)
}

console.log(`content 校验通过：${PUBLISHED.join(" / ")} 的 frontmatter 与相对链接均合规。`)
