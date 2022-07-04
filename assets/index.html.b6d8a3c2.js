import{_ as n,r as s,o as t,c as i,b as d,d as a}from"./app.0c2bd0f0.js";const r={},c=a('<h2 id="\u4E09\u4E2A\u533A\u57DF" tabindex="-1"><a class="header-anchor" href="#\u4E09\u4E2A\u533A\u57DF" aria-hidden="true">#</a> \u4E09\u4E2A\u533A\u57DF</h2><p>Git \u91CC\u4E3B\u8981\u5206\u6210 Working Directory\u3001Staging Area\u3001Repository \u4E09\u4E2A\u533A\u57DF</p><table><thead><tr><th>\u540D\u79F0</th><th>\u522B\u79F0</th><th>\u63CF\u8FF0</th></tr></thead><tbody><tr><td>\u5DE5\u4F5C\u76EE\u5F55</td><td>-</td><td>\u5373\u5F53\u524D\u672C\u5730\u6253\u5F00\u7684\u76EE\u5F55</td></tr><tr><td>\u6682\u5B58\u533A</td><td>\u7D22\u5F15</td><td>\u4FDD\u5B58\u4E86\u4E0B\u6B21\u5C06\u63D0\u4EA4\u7684\u6587\u4EF6\u5217\u8868\u4FE1\u606F</td></tr><tr><td>\u5B58\u50A8\u5E93</td><td>\u7248\u672C\u5E93\u3001\u672C\u5730\u7248\u672C\u5E93</td><td>\u9690\u85CF\u76EE\u5F55 <code>.git</code>\uFF0C\u7528\u4E8E\u672C\u5730\u5B58\u50A8\u63D0\u4EA4\u7684\u8BB0\u5F55</td></tr><tr><td>\u8FDC\u7A0B\u5B58\u50A8\u5E93</td><td>-</td><td>\u7528\u4E8E\u63A5\u6536\u672C\u5730\u5B58\u50A8\u5E93\u4E2D\u7684\u63D0\u4EA4</td></tr></tbody></table><h2 id="\u5173\u7CFB\u56FE" tabindex="-1"><a class="header-anchor" href="#\u5173\u7CFB\u56FE" aria-hidden="true">#</a> \u5173\u7CFB\u56FE</h2><p>\u2757 \u8FD9\u4E2A\u56FE\u8BF4\u660E\u4E86 Git \u4E2D\u5404\u7C7B\u64CD\u4F5C\u5F62\u6210\u7684\u6570\u636E\u6D41\u8F6C\uFF0C\u7406\u89E3\u8FD9\u4E2A\u56FE\u5BF9\u5B66\u4E60 Git \u5341\u5206\u91CD\u8981</p>',5),o=a(`<h2 id="\u65B0\u5EFA\u9879\u76EE" tabindex="-1"><a class="header-anchor" href="#\u65B0\u5EFA\u9879\u76EE" aria-hidden="true">#</a> \u65B0\u5EFA\u9879\u76EE</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> git-test <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> git-test
<span class="token function">git</span> init
<span class="token builtin class-name">echo</span> <span class="token string">&quot;.vscode&quot;</span> <span class="token operator">&gt;</span> .gitignore
<span class="token builtin class-name">echo</span> <span class="token string">&quot;# Introduce&quot;</span> <span class="token operator">&gt;</span> README.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u8FDE\u63A5\u5230\u8FDC\u7A0B\u4ED3\u5E93" tabindex="-1"><a class="header-anchor" href="#\u8FDE\u63A5\u5230\u8FDC\u7A0B\u4ED3\u5E93" aria-hidden="true">#</a> \u8FDE\u63A5\u5230\u8FDC\u7A0B\u4ED3\u5E93</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> remote <span class="token function">add</span> origin https://github.com/username/reponame.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="\u63D0\u4EA4\u53D8\u66F4\u5230\u6682\u5B58\u533A" tabindex="-1"><a class="header-anchor" href="#\u63D0\u4EA4\u53D8\u66F4\u5230\u6682\u5B58\u533A" aria-hidden="true">#</a> \u63D0\u4EA4\u53D8\u66F4\u5230\u6682\u5B58\u533A</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
<span class="token function">git</span> commit -m <span class="token string">&quot;init&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u63A8\u9001\u5230\u8FDC\u7A0B\u4ED3\u5E93" tabindex="-1"><a class="header-anchor" href="#\u63A8\u9001\u5230\u8FDC\u7A0B\u4ED3\u5E93" aria-hidden="true">#</a> \u63A8\u9001\u5230\u8FDC\u7A0B\u4ED3\u5E93</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> push origin main
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="\u62C9\u53D6\u53D8\u66F4" tabindex="-1"><a class="header-anchor" href="#\u62C9\u53D6\u53D8\u66F4" aria-hidden="true">#</a> \u62C9\u53D6\u53D8\u66F4</h2><p>pull</p><h2 id="\u514B\u9686\u4ED3\u5E93\u5230\u672C\u5730" tabindex="-1"><a class="header-anchor" href="#\u514B\u9686\u4ED3\u5E93\u5230\u672C\u5730" aria-hidden="true">#</a> \u514B\u9686\u4ED3\u5E93\u5230\u672C\u5730</h2><p>clone</p><h2 id="\u4ECE\u672C\u5730\u5B58\u50A8\u5E93\u540C\u6B65" tabindex="-1"><a class="header-anchor" href="#\u4ECE\u672C\u5730\u5B58\u50A8\u5E93\u540C\u6B65" aria-hidden="true">#</a> \u4ECE\u672C\u5730\u5B58\u50A8\u5E93\u540C\u6B65</h2><p>checkout</p>`,14);function l(h,p){const e=s("Mermaid");return t(),i("div",null,[c,d(e,{id:"mermaid_382ee202","data-code":`flowchart LR

subgraph remote
  direction BT
  D[("\u8FDC\u7A0B\u4ED3\u5E93(Remote)")]
end

subgraph local
  direction TB
  A>"\u5DE5\u4F5C\u76EE\u5F55(Working Directory)"]
  B[("\u6682\u5B58\u533A(Stage|Index)")]
  C[("\u5B58\u50A8\u5E93(Repository)")]
end

A-->|add|B
B-->|commit|C
C-->|push|D
D-->|"fetch|clone"|C
C-->|checkout|A
D-->|pull|A`}),o])}var m=n(r,[["render",l],["__file","index.html.vue"]]);export{m as default};
