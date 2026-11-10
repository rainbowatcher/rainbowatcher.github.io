/**
 * 做什么：原型的内容数据源，文章取自仓库 content/，其余为展示用示例。
 * 取舍：只保留 UI 需要的最小字段；正文仅少数文章提供完整 HTML。
 * 边界：不参与真实站点构建，正式实现仍读取 /_content/。
 */

export const posts = [
    {
        slug: "about-this-blog",
        title: "使用 Nuxt 构建静态博客",
        subtitle: "从内容管线到预渲染，记录这个站点是怎么长出来的。",
        date: "2024-06-26",
        tags: ["Nuxt"],
        excerpt: "Vue 3.5 与 Nuxt 3.13 之后，我重新梳理了整站的内容管线与呈现层。",
        minutes: 8,
        body: `
<p>最近几天 Vue 发布了 3.5，又增加了挺多新特性，Nuxt 也是在第一时间发布了 3.13 版本作为跟进。趁着这次升级，我把整个站点从零重新梳理了一遍：内容仍然留在 Markdown 里，但呈现层换了新的骨架。</p>
<p>这篇文章记录三件事：为什么还是 Nuxt、内容管线怎么走、以及这次重做时踩到的几个坑。</p>
<div class="callout"><div class="callout-title">读之前</div><p>这不是一篇 Nuxt 入门教程，更像一份改版手记。代码片段来自本站的真实配置，省略了与主题无关的部分。</p></div>
<h2 id="why-nuxt">为什么还是 Nuxt</h2>
<p>静态博客的可选方案很多，从纯手写 HTML 到 Astro、Hugo、Eleventy 都能工作。继续留在 Nuxt 的理由其实很具体：</p>
<ul>
<li>内容与页面共用一套 Vue 组件，交互组件不必再引入第二个运行时；</li>
<li>预渲染之后就是一组静态文件，部署到任何静态托管都不需要额外服务；</li>
<li>生态里的 MDC、Shiki、UnoCSS 能把 Markdown 直接编译成带样式的 Vue 节点。</li>
</ul>
<p>代价也很明显：构建链更长，依赖升级时的噪音更多。对于一年只改几次的个人站点，这个代价可以接受。</p>
<h2 id="pipeline">内容管线：Markdown 是唯一事实来源</h2>
<p>站点里所有文章都放在 <code>content/</code> 下，构建期由一个 Nuxt 模块扫描并编译成 <code>public/_content/*.json</code>。页面只读取生成的 JSON，不在运行时解析 Markdown。</p>
<div class="code-block"><div class="code-head"><span>modules/static-content.ts</span><button class="code-copy" data-copy>复制</button></div><pre><code><span class="tok-comment">// 扫描 markdown，输出可预渲染的内容清单</span>
<span class="tok-key">const</span> files = <span class="tok-key">await</span> <span class="tok-fn">glob</span>(<span class="tok-string">"content/**/*.md"</span>)
<span class="tok-key">const</span> manifest = { posts: [], research: [] }

<span class="tok-key">for</span> (<span class="tok-key">const</span> file <span class="tok-key">of</span> files) {
  <span class="tok-key">const</span> { data, body } = <span class="tok-key">await</span> <span class="tok-fn">parse</span>(file)
  manifest[data.section].<span class="tok-fn">push</span>({ ...data, body })
}

<span class="tok-key">await</span> <span class="tok-fn">writeFile</span>(<span class="tok-string">"public/_content/manifest.json"</span>, <span class="tok-fn">JSON.stringify</span>(manifest))</code></pre></div>
<p>这样做的好处是页面侧足够简单：列表页只拿元信息，文章页拿对应的 AST，预渲染时一次性生成 HTML。坏处是内容 schema 需要自己维护，字段缺失只会在构建时暴露。</p>
<h3>预渲染与路由</h3>
<p>文章使用固定的 permalink，因此构建时需要把 manifest 里的每一条路径都喂给 Nitro。漏掉一条，线上就是一个 404——这类错误最好在 CI 里失败，而不是等部署后才发现。</p>
<h2 id="problems">遇到的问题</h2>
<ol>
<li>tailwind-reset 默认行高与中文正文的节奏打架，最后重写了 <code>line-height</code>；</li>
<li>把 <code>mask</code> 直接应用在 button 上，会导致 <code>focus-visible</code> 的 outline 不显示；</li>
<li>自定义字体在移动端因为字体文件过大而没有生效，后来改成子集化再加载。</li>
</ol>
<h3>行高与 reset</h3>
<p>中文正文需要比英文更松的行高。经过几轮对比，最终把正文设为 <strong>1.9</strong>，标题设为 <strong>1.15</strong>，并在段落之间留出约 <code>1.1em</code> 的距离。这个组合在 17px 左右阅读最舒服。</p>
<blockquote><p>排版不是让页面“看起来更满”，而是让眼睛知道下一句在哪里。</p></blockquote>
<h2 id="dislikes">不喜欢的点</h2>
<p>也有一些至今没解决的问题：</p>
<div class="table-wrap"><table><thead><tr><th>问题</th><th>影响</th><th>现状</th></tr></thead><tbody><tr><td>冷启动慢</td><td>改组件名后需要重启</td><td>忍着</td></tr><tr><td>依赖体积大</td><td>安装与构建时间偏长</td><td>定期清理</td></tr><tr><td>主题切换闪烁</td><td>首屏可能出现一帧浅色</td><td>内联脚本兜底</td></tr></tbody></table></div>
<h2 id="summary">小结</h2>
<p>这次改版没有换框架，也没有重写内容，只是把“读”这件事重新放回第一位：更稳定的对比度、更清楚的层级、更克制的装饰。技术选型会过时，但一篇文章读起来是否舒服，读者立刻就能感觉到。</p>
<p>如果你也在维护一个内容不多的个人站点，我的建议是：先把内容管线做简单，再把视觉做慢一点。剩下的，交给时间。</p>
`,
    },
    {
        slug: "linux-shell",
        title: "Unix Shell 基本语法",
        subtitle: "变量、管道、重定向与常用命令，一份可以随时翻的速查笔记。",
        date: "2022-09-26",
        tags: ["Shell", "Linux"],
        excerpt: "把 shell 里最容易忘的语法收在一页里：引号、变量、管道、重定向与退出码。",
        minutes: 6,
    },
    {
        slug: "java-snippets",
        title: "Java 小技巧",
        subtitle: "那些不常用、但用一次就能省半小时的 Java 写法。",
        date: "2022-08-27",
        tags: ["Java"],
        excerpt: "从 Optional 到 Stream，再到几个容易踩坑的集合操作。",
        minutes: 5,
    },
    {
        slug: "elasticsearch-restapi",
        title: "ElasticSearch REST API 使用示例",
        subtitle: "用 curl 跑通索引、查询与聚合的常用接口。",
        date: "2022-08-19",
        tags: ["Elasticsearch", "API"],
        excerpt: "索引管理、文档写入、布尔查询和聚合分析的命令清单。",
        minutes: 7,
    },
    {
        slug: "mysql-intro",
        title: "Mysql 基本概念介绍",
        subtitle: "从 SQL、DDL 到存储引擎，把零散的概念放回一张图里。",
        date: "2022-08-15",
        tags: ["Database", "Mysql"],
        excerpt: "SQL、表、索引、事务与存储引擎，面向日常开发的数据库基础。",
        minutes: 9,
    },
    {
        slug: "docker-quick-start",
        title: "Docker 常用的容器启动命令",
        subtitle: "镜像、端口、挂载与重启策略，日常够用的那一组参数。",
        date: "2022-08-12",
        tags: ["Docker", "CLI"],
        excerpt: "docker run 的常用参数组合，以及容器排障时的几条命令。",
        minutes: 4,
    },
    {
        slug: "oracle-common-sql",
        title: "Oracle 常用语句",
        subtitle: "数据字典、分页与日期处理，Oracle 的日常查询清单。",
        date: "2022-08-02",
        tags: ["Oracle", "Database", "SQL"],
        excerpt: "user_tables、all_source、ROWNUM 分页与日期格式化的常用写法。",
        minutes: 7,
    },
    {
        slug: "maven-bom",
        title: "使用 Maven Bom 管理项目依赖",
        subtitle: "让多个项目的依赖版本只有一个事实来源。",
        date: "2022-07-30",
        tags: ["Java", "Maven"],
        excerpt: "当多个项目共用一组依赖时，用 BOM 把版本收敛到一处。",
        minutes: 5,
    },
    {
        slug: "bubble-sort",
        title: "冒泡排序及鸡尾酒排序算法",
        subtitle: "从最朴素的交换排序，看到双向扫描带来的那一点改进。",
        date: "2022-07-17",
        tags: ["Algorithm"],
        excerpt: "用 TypeScript 实现冒泡排序与鸡尾酒排序，并比较两者的扫描路径。",
        minutes: 4,
    },
    {
        slug: "regexp-unicode",
        title: "正则表达式按 Unicode 类型匹配汉字、表情、拉丁文",
        subtitle: "\\p{Han}、\\p{Latin} 与组合脚本的用法整理。",
        date: "2022-07-03",
        tags: ["RegExp"],
        excerpt: "利用 Unicode property escapes 精确匹配汉字、假名、表情与标点。",
        minutes: 5,
    },
    {
        slug: "datawarehouse",
        title: "数据仓库、数据湖、湖仓一体以及他们的区别",
        subtitle: "三种数据架构的边界，以及它们各自解决的问题。",
        date: "2022-06-25",
        tags: ["Data"],
        excerpt: "从 schema-on-write 到 schema-on-read，再到湖仓一体的折中方案。",
        minutes: 8,
    },
    {
        slug: "git-objects",
        title: "理解 Git 中的对象",
        subtitle: "blob、tree、commit、tag：把 .git 目录拆开看看。",
        date: "2022-06-22",
        tags: ["Git"],
        excerpt: "一次 commit 背后到底存了什么？用底层命令把对象一个个读出来。",
        minutes: 6,
    },
    {
        slug: "shell-custom",
        title: "Shell 定制折腾记录",
        subtitle: "从 exa 到 starship，一次终端环境的重建。",
        date: "2022-06-12",
        tags: ["Shell", "Zsh", "Rust", "CLI"],
        excerpt: "bat、fd、ripgrep、starship 等 Rust 工具，以及我的 zsh 配置。",
        minutes: 7,
    },
    {
        slug: "npm-check-update",
        title: "npm 包升级检测工具 ncu 介绍",
        subtitle: "比 npm update 更彻底地检查依赖版本。",
        date: "2022-06-08",
        tags: ["Npm", "CLI"],
        excerpt: "npm-check-updates 的常用参数，以及它与 taze 的取舍。",
        minutes: 4,
    },
    {
        slug: "flink-label-design",
        title: "Flink 任务的程序设计和思考",
        subtitle: "从算子拆分到状态管理，一次任务设计的复盘。",
        date: "2022-05-27",
        tags: ["Flink", "Data"],
        excerpt: "把业务规则从算子中抽出来，让 Flink 任务更容易测试和演进。",
        minutes: 8,
    },
    {
        slug: "git-config",
        title: "Git 常用的配置项",
        subtitle: "别名、换行、代理与那些值得一次性配好的选项。",
        date: "2022-05-24",
        tags: ["Git"],
        excerpt: "一份可以直接抄进 ~/.gitconfig 的常用配置与别名。",
        minutes: 4,
    },
    {
        slug: "dns-records",
        title: "域名购买和DNS设置过程记录",
        subtitle: "从注册商到解析记录，把站点接上自己的域名。",
        date: "2022-05-21",
        tags: ["DNS", "Network"],
        excerpt: "A、CNAME、MX、TXT 记录分别做什么，以及部署时的解析流程。",
        minutes: 5,
    },
    {
        slug: "about-blog-2022",
        title: "关于这个博客搭建过程的点滴",
        subtitle: "第一版博客的取舍、踩坑与留下来的东西。",
        date: "2022-05-20",
        tags: ["Nuxt", "Blog"],
        excerpt: "从 Hexo 迁到 Nuxt 的第一版，记录主题、部署与内容组织的选择。",
        minutes: 6,
    },
    {
        slug: "git-working-area",
        title: "Git 工作区和暂存区🚧",
        subtitle: "工作区、暂存区与版本库之间到底发生了什么。",
        date: "2022-05-16",
        tags: ["Git"],
        excerpt: "用一张图解释 add、commit 与 checkout 在三个区域之间的移动。",
        minutes: 5,
    },
    {
        slug: "markdown-advance",
        title: "Markdown进阶语法",
        subtitle: "表格、脚注、容器与 MDC 组件的一点点扩展。",
        date: "2022-05-04",
        tags: ["Markdown"],
        excerpt: "在基础语法之外，补齐写长文时真正会用到的那些写法。",
        minutes: 5,
    },
    {
        slug: "markdown-basic",
        title: "Markdown简明语法",
        subtitle: "十分钟写完一篇结构清楚的 Markdown。",
        date: "2022-05-04",
        tags: ["Markdown", "Syntax"],
        excerpt: "标题、强调、链接、图片、列表与代码块的最小集合。",
        minutes: 4,
    },
    {
        slug: "git-regret",
        title: "Git 后悔药，如何撤回/重新编辑 commit 消息",
        subtitle: "reset、revert、amend 与 reflog 的正确打开方式。",
        date: "2022-05-04",
        tags: ["Git"],
        excerpt: "提交信息写错、提交早了、推到远端之后，分别应该怎么办。",
        minutes: 5,
    },
]

export const researchReports = [
    {
        slug: "hc-parent-child",
        title: "hc 父子终端：命令行之外的入口",
        subtitle: "从 JSON-RPC 的 caller 字段，到 Sheprd GUI、mods、automations 各自能建出什么。",
        date: "2026-11-10",
        tags: ["Herdr", "CLI", "Terminal"],
        excerpt: "父子关系不是 hc run 的参数，而是 terminal.run 这个 JSON-RPC 方法的字段。",
        minutes: 12,
        body: `
<div class="callout is-warn"><div class="callout-title">环境说明</div><p>本文基于本机环境：macOS，<code>hc 0.1.19</code>（PATH）与 bundle 内 <code>hc 0.1.13</code>，<code>herdr 0.9.5</code>，Sheprd <code>20261104.1</code>。结论依赖当时的机器状态与工具版本，换台机器未必复现。</p></div>
<h2 id="conclusion">结论先行</h2>
<ul>
<li>父子关系不是 <code>hc run</code> 的参数，而是 <code>terminal.run</code> 这个 JSON-RPC 方法的字段：<code>parent</code> / <code>caller</code> / <code>no_parent</code> / <code>outlive_parent</code>。</li>
<li>唯一“自动认父”的机制是 <code>caller</code>（CLI 里由 <code>$HC_TERMINAL_ID</code> 填入）。不传 <code>caller</code>，建出来的终端 <code>parent</code> 就是 <code>null</code>。</li>
<li>命令行之外真正能建出父子链的只有一条路：自己说这套协议——unix socket、<code>hc connect</code> 的 stdio、<code>ssh box hc connect</code>。</li>
</ul>
<h2 id="method">判定方法</h2>
<ol>
<li>读协议：<code>hc schema</code>（OpenRPC）看字段，<code>herdr api schema --json</code> 看 herdr 1 有什么。</li>
<li>绕过 CLI 直接调：向 <code>$HC_TERMINAL_SOCKET</code> 发新行分隔的 JSON-RPC，用 <code>hc get</code> 核对结果。</li>
<li>看现状：<code>hc ls --all --json</code> 与 <code>hc get</code> 对比谁建的终端带 <code>parent</code>。</li>
</ol>
<h2 id="protocol">父子的载体是协议字段</h2>
<p><code>hc schema</code> 里 <code>terminal.run</code> 的参数字段（摘）：</p>
<div class="table-wrap"><table><thead><tr><th>字段</th><th>语义</th><th>缺省</th></tr></thead><tbody><tr><td><code>caller</code></td><td>谁在调用（终端里就是 <code>HC_TERMINAL_ID</code>）</td><td>空</td></tr><tr><td><code>parent</code></td><td>父终端；空则取“被启动时所在的终端”</td><td>空</td></tr><tr><td><code>no_parent</code></td><td>就算从终端里启动也不给父</td><td>false</td></tr><tr><td><code>outlive_parent</code></td><td>父程序结束也留着它</td><td>false</td></tr><tr><td><code>die_with_parent</code></td><td>只读结果：真正的开关是 <code>outlive_parent</code></td><td>false</td></tr></tbody></table></div>
<h2 id="socket">途径一：直接说协议</h2>
<p>不用 <code>hc</code>，标准库就够。新行分隔的 JSON-RPC，一问一答：</p>
<div class="code-block"><div class="code-head"><span>spawn_child.py</span><button class="code-copy" data-copy>复制</button></div><pre><code><span class="tok-key">import</span> json, os, socket

s = socket.<span class="tok-fn">socket</span>(socket.AF_UNIX, socket.SOCK_STREAM)
s.<span class="tok-fn">connect</span>(os.environ[<span class="tok-string">"HC_TERMINAL_SOCKET"</span>])
req = {
    <span class="tok-string">"jsonrpc"</span>: <span class="tok-string">"2.0"</span>, <span class="tok-string">"id"</span>: <span class="tok-number">9</span>, <span class="tok-string">"method"</span>: <span class="tok-string">"terminal.run"</span>,
    <span class="tok-string">"params"</span>: {<span class="tok-string">"argv"</span>: [<span class="tok-string">"/bin/sh"</span>, <span class="tok-string">"-c"</span>, <span class="tok-string">"sleep 600"</span>], <span class="tok-string">"caller"</span>: <span class="tok-string">"t1f"</span>},
}
s.<span class="tok-fn">sendall</span>((json.<span class="tok-fn">dumps</span>(req) + <span class="tok-string">"\\n"</span>).<span class="tok-fn">encode</span>())
<span class="tok-fn">print</span>(s.<span class="tok-fn">recv</span>(<span class="tok-number">65536</span>))</code></pre></div>
<p>回报里就是 <code>{"address": "t26", "name": "sock-child", "parent": "t1f", "die_with_parent": true}</code>。任何进程都能建父子，只要它知道地址。</p>
<h2 id="env">途径二：环境变量继承</h2>
<p>hc 给每个终端都注入 <code>$HC_TERMINAL_ID</code> 与 <code>$HC_TERMINAL_SOCKET</code>。凡是在终端里跑起来的东西，只要它调 <code>hc run</code>，不需要任何参数就自动成父。</p>
<div class="code-block"><div class="code-head"><span>terminal</span><button class="code-copy" data-copy>复制</button></div><pre><code><span class="tok-comment"># 抹掉环境变量，同一台机器、同一个 CLI，结果从“认父”变成“游离”</span>
env -u HC_TERMINAL_ID hc run --bg --name noparent-cli /bin/sh -c <span class="tok-string">"sleep 600"</span>
hc get noparent-cli --json   <span class="tok-comment"># parent: null</span></code></pre></div>
<h2 id="summary">小结</h2>
<p>把“父子”从 CLI 的隐式行为里拿出来看，会发现它只是一个普通的协议字段：客户端自报，核心不猜。理解这一点之后，GUI、mods、automations 的边界也就清楚了——它们能建终端，但都不能指定父。</p>
`,
    },
]

export const projects = [
    {
        name: "@rainbowatcher/eslint-config",
        mark: "ES",
        status: "维护中",
        description: "可组合的 ESLint 预设，统一多个项目里的代码风格与规则边界。",
        tags: ["ESLint", "TypeScript"],
        link: "https://github.com/rainbowatcher/eslint-config",
    },
    {
        name: "scripts",
        mark: "SH",
        status: "持续更新",
        description: "日常使用的 shell 配置与脚本集合，换机器时只需要一条命令。",
        tags: ["Zsh", "Shell"],
        link: "https://github.com/rainbowatcher/scripts",
    },
    {
        name: "rainbowatcher.github.io",
        mark: "RW",
        status: "重构中",
        description: "这个站点：Nuxt 静态生成、自建内容管线，以及一套正在重做的主题。",
        tags: ["Nuxt", "TypeScript", "UnoCSS"],
        link: "https://github.com/rainbowatcher/rainbowatcher.github.io",
    },
]

export const usesSections = [
    {
        id: "editor",
        title: "编辑器",
        note: "01",
        items: [
            {
                name: "VS Code",
                desc: "主力编辑器，配置同步到 GitHub。",
                side: "Editor",
                href: "https://code.visualstudio.com/",
            },
            {
                name: "One Dark Pro",
                desc: "用了很多年的主题，深色下对比度刚好。",
                side: "Theme",
                href: "https://github.com/Binaryify/OneDark-Pro",
            },
            {
                name: "Material Icon Theme",
                desc: "文件图标，辨识度比默认高。",
                side: "Icons",
                href: "https://github.com/material-extensions/vscode-material-icon-theme",
            },
            {
                name: "Cascadia Code / 0xProto",
                desc: "带连字的等宽字体，终端和编辑器统一。",
                side: "Fonts",
                href: "https://github.com/microsoft/cascadia-code",
            },
            {
                name: "@rainbowatcher/eslint-config",
                desc: "格式化与 lint 的唯一入口。",
                side: "Lint",
                href: "https://github.com/rainbowatcher/eslint-config",
            },
        ],
    },
    {
        id: "browser",
        title: "浏览器扩展",
        note: "02",
        items: [
            {
                name: "Refined GitHub",
                desc: "给 GitHub 补上很多应该有的细节。",
                side: "Chrome",
                href: "https://github.com/refined-github/refined-github",
            },
            {
                name: "Violentmonkey",
                desc: "在浏览器里跑自定义脚本。",
                side: "Chrome",
                href: "https://violentmonkey.github.io/",
            },
            {
                name: "Immersive Translate",
                desc: "对照式翻译，读英文文档时很省力。",
                side: "Chrome",
                href: "https://immersivetranslate.com/",
            },
            {
                name: "Vimium C",
                desc: "用键盘操作浏览器。",
                side: "Chrome",
                href: "https://github.com/gdh1995/vimium-c",
            },
            {
                name: "Sala Dict",
                desc: "划词翻译与词典。",
                side: "Chrome",
                href: "https://github.com/crimx/ext-saladict",
            },
        ],
    },
    {
        id: "apps",
        title: "应用",
        note: "03",
        items: [
            {
                name: "Raycast",
                desc: "Spotlight 的替代，窗口管理与快捷指令都靠它。",
                side: "macOS",
                href: "https://raycast.com/",
            },
            {
                name: "Alacritty",
                desc: "OpenGL 终端，启动快、配置简单。",
                side: "Terminal",
                href: "https://github.com/alacritty/alacritty",
            },
            {
                name: "LocalSend",
                desc: "跨平台局域网传文件，不经过云端。",
                side: "Utility",
                href: "https://localsend.org/",
            },
        ],
    },
    {
        id: "hardware",
        title: "硬件",
        note: "04",
        items: [
            { name: 'MacBook Pro 13" 2020', desc: "16GB 内存，主力开发机。", side: "Computer" },
            { name: "Logitech G304", desc: "轻、无线、换电池方便。", side: "Mouse" },
            { name: "Filco Majestouch Convertible 2 TKL", desc: "Cherry MX Red，用了很久依然顺手。", side: "Keyboard" },
        ],
    },
    {
        id: "cli",
        title: "命令行",
        note: "05",
        items: [
            { name: "zsh", desc: "Shell，配置放在 rainbowatcher/scripts。", side: "Shell", href: "https://zsh.org/" },
            { name: "pnpm", desc: "首选包管理器，monorepo 也用它。", side: "Package", href: "https://pnpm.io/" },
            { name: "ni", desc: "自动识别项目该用哪个包管理器。", side: "CLI", href: "https://github.com/antfu/ni" },
            {
                name: "taze",
                desc: "依赖升级检查，比手动翻 changelog 快。",
                side: "CLI",
                href: "https://github.com/antfu/taze",
            },
            { name: "bat / fd / ripgrep", desc: "cat、find、grep 的现代替代。", side: "CLI" },
        ],
    },
]
