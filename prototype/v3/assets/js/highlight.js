/**
 * 做什么：给 v3 代码块做极小的语法着色，把源码转成带 token 类的安全 HTML。
 * 状态与生命周期：页面加载后由 mountHighlight 写入一次；未着色时 pre 里的纯文本仍可读。
 * 取舍与不变量：只识别字符串、注释、数字、关键字、常量、函数名与 shell 变量，不做完整语法解析。
 * 边界：不定义颜色，也不负责复制按钮与代码块外框。
 */

const KEYWORDS = {
    python: new Set([
        "import",
        "from",
        "as",
        "def",
        "class",
        "return",
        "if",
        "elif",
        "else",
        "for",
        "in",
        "while",
        "with",
        "try",
        "except",
        "finally",
        "raise",
        "lambda",
        "yield",
        "and",
        "or",
        "not",
        "is",
        "pass",
        "break",
        "continue",
        "async",
        "await",
        "print",
    ]),
    sh: new Set([
        "if",
        "then",
        "else",
        "elif",
        "fi",
        "for",
        "in",
        "do",
        "done",
        "while",
        "case",
        "esac",
        "function",
        "return",
        "local",
        "export",
        "unset",
        "echo",
        "printf",
        "cd",
        "set",
        "eval",
        "exec",
    ]),
    json: new Set(["true", "false", "null"]),
    toml: new Set(["true", "false"]),
}

const CONSTANTS = new Set(["None", "True", "False", "true", "false", "null", "nil", "undefined"])

const TOKEN = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\/\/[^\n]*|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*/g

function escapeHtml(text) {
    return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")
}

function classify(word, source, offset, lang) {
    const safe = escapeHtml(word)
    let kind = ""

    if (word.startsWith('"') || word.startsWith("'")) kind = "string"
    else if (word.startsWith("#") || word.startsWith("//")) kind = "comment"
    else if (/^\d/.test(word)) kind = "number"
    else if (KEYWORDS[lang]?.has(word)) kind = "keyword"
    else if (CONSTANTS.has(word)) kind = "constant"
    else if (word.startsWith("$") || source[offset - 1] === "$") kind = "variable"
    else if (source[offset + word.length] === "(") kind = "function"

    return kind ? `<span class="tok-${kind}">${safe}</span>` : safe
}

export function highlight(source, lang) {
    const words = KEYWORDS[lang] ? lang : "sh"
    let out = ""
    let last = 0

    for (const match of source.matchAll(TOKEN)) {
        out += escapeHtml(source.slice(last, match.index))
        out += classify(match[0], source, match.index, words)
        last = match.index + match[0].length
    }
    return out + escapeHtml(source.slice(last))
}

export function mountHighlight() {
    document.querySelectorAll(".code-block pre[data-lang]").forEach((pre) => {
        const code = pre.querySelector("code") ?? pre
        code.innerHTML = highlight(code.textContent, pre.dataset.lang)
    })
}
