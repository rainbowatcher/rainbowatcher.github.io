import{_ as l,r as t,o as a,c as i,a as n,b as d,d as e,e as c}from"./app.0c2bd0f0.js";const o={},r=e(`<p>\u5728 Git \u91CC\uFF0C\u6709\u56DB\u4E2A\u5F88\u91CD\u8981\u7684\u5BF9\u8C61\uFF0C\u5206\u5225\u662F Blob(Binary Large Object) \u5BF9\u8C61\u3001Tree \u5BF9\u8C61\u3001Commit \u5BF9\u8C61\u4EE5\u53CA Tag \u5BF9\u8C61\u3002</p><h2 id="blob-\u5BF9\u8C61" tabindex="-1"><a class="header-anchor" href="#blob-\u5BF9\u8C61" aria-hidden="true">#</a> Blob \u5BF9\u8C61</h2><p>\u6211\u4EEC\u4ECE\u4E00\u4E2A\u7A7A\u9879\u76EE\u5F00\u59CB\uFF0C\u5148\u5728\u6839\u76EE\u5F55\u4E0B\u65B0\u5EFA\u4E00\u4E2A README.md \u6587\u4EF6\uFF0C\u5E76\u628A\u5B83\u6DFB\u52A0\u5230\u6682\u5B58\u533A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> git-test <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> git-test
<span class="token function">git</span> init
<span class="token builtin class-name">echo</span> <span class="token string">&quot;# hello git&quot;</span> <span class="token operator">&gt;</span> README.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u770B\u4E00\u4E0B Git \u7684\u72B6\u6001</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F <span class="token function">git</span> status
On branch main

No commits yet

Untracked files:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to include <span class="token keyword">in</span> what will be committed<span class="token punctuation">)</span>
        README.md

nothing added to commit but untracked files present <span class="token punctuation">(</span>use <span class="token string">&quot;git add&quot;</span> to track<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8FD9\u65F6\u5019 README.md \u6587\u4EF6\u8FD8\u662F\u672A\u88AB\u8FFD\u8E2A\u7684\u72B6\u6001\uFF0C\u6211\u4EEC\u628A\u5B83\u6DFB\u52A0\u5230\u6682\u5B58\u533A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>\u5728 add \u547D\u4EE4\u6267\u884C\u7684\u65F6\u5019\uFF0CGit \u9996\u5148\u4F1A\u8BA1\u7B97 README.md \u6587\u4EF6\u7684\u5185\u5BB9\u7684 SHA-1 \u503C\uFF0C\u7136\u540E\u5728 .git/objects \u4E2D\u4EE5 SHA-1 \u503C\u547D\u540D\u5B58\u653E\u8FD9\u4E2A\u6587\u4EF6\u3002\u6211\u4EEC\u770B\u4E00\u4E0B git/objects \u957F\u4EC0\u4E48\u6837\u5B50</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F tree .git/objects
.git/objects
\u251C\u2500\u2500 c1
\u2502  \u2514\u2500\u2500 668483a7504a3ea10cf89b2885b526368fe2d2
\u251C\u2500\u2500 info
\u2514\u2500\u2500 pack
</code></pre><div class="highlight-lines"><br><br><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u53EF\u4EE5\u770B\u5230\u5728 objects \u76EE\u5F55\u4E0B\u6709\u4E00\u4E2A c1 \u76EE\u5F55\uFF0C\u91CC\u9762\u5B58\u653E\u4E86\u4E00\u4E2A\u540D\u5B57\u5F88\u957F\u7684\u6587\u4EF6\u3002\u6211\u4EEC\u53EF\u4EE5\u901A\u8FC7 <code>git hash-object</code> \u547D\u4EE4\u6765\u770B\u4E00\u4E0B README.md \u6587\u4EF6\u7684 SHA-1 \u503C</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F <span class="token function">git</span> hash-object README.md
c1668483a7504a3ea10cf89b2885b526368fe2d2
</code></pre><div class="highlight-lines"><br><div class="highlight-line">\xA0</div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>\u6216\u8005\u4E5F\u53EF\u4EE5\u8FD9\u6837</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F <span class="token builtin class-name">echo</span> <span class="token string">&quot;# hello git&quot;</span> <span class="token operator">|</span> <span class="token function">git</span> hash-object --stdin
c1668483a7504a3ea10cf89b2885b526368fe2d2
</code></pre><div class="highlight-lines"><br><div class="highlight-line">\xA0</div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4E0D\u96BE\u770B\u51FA <code>git hash-object</code> \u547D\u4EE4\u662F\u5BF9 README.md \u6587\u4EF6\u7684\u5185\u5BB9\u8BA1\u7B97\u7684 SHA-1 \u503C\uFF0C\u5E76\u4E14\u4F7F\u7528\u4E86\u524D\u4E24\u4E2A\u5B57\u7B26\u4F5C\u4E3A\u76EE\u5F55\u540D\uFF0C\u540E\u9762\u7684 38 \u4F4D\u4F5C\u4E3A\u6587\u4EF6\u540D\u3002</p><p>\u90A3\u8FD9\u4E2A\u6587\u4EF6\u53C8\u5B58\u653E\u4E86\u4EC0\u4E48\u5462\uFF1F\u6211\u4EEC\u7528 <code>git cat-file</code> \u547D\u4EE4\u770B\u4E00\u4E0B</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F <span class="token function">git</span> cat-file -t c1668483a7504a3ea10cf89b2885b526368fe2d2
blob

\u276F <span class="token function">git</span> cat-file -p c1668483a7504a3ea10cf89b2885b526368fe2d2
<span class="token comment"># hello git</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>-t \u8868\u793A\u67E5\u770B\u6587\u4EF6\u7684\u7C7B\u578B\uFF0C-p \u8868\u793A\u67E5\u770B\u6587\u4EF6\u5185\u5BB9\uFF0C\u53EF\u4EE5\u770B\u5230\u8FD9\u4E2A\u6587\u4EF6\u7684\u7C7B\u578B\u4E3A blob\uFF0C\u5185\u5BB9\u4E3A<code># hello git</code></p><h2 id="tree-\u548C-commit-\u5BF9\u8C61" tabindex="-1"><a class="header-anchor" href="#tree-\u548C-commit-\u5BF9\u8C61" aria-hidden="true">#</a> Tree \u548C Commit \u5BF9\u8C61</h2><p>\u6211\u4EEC\u65B0\u5EFA\u4E00\u4E2A docs \u76EE\u5F55</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> docs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>\u7136\u540E\u770B\u4E00\u4E0B Git \u7684\u72B6\u6001</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F <span class="token function">git</span> status
On branch main

No commits yet

Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git rm --cached &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        new file:   README.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u989D\uFF0CGit \u5E76\u6CA1\u6709\u53D1\u73B0\u8FD9\u4E2A\u76EE\u5F55\uFF0C\u4E4B\u524D\u6DFB\u52A0 README.md \u6587\u4EF6\u7684\u65F6\u5019\u4F1A\u663E\u793A\u72B6\u6001\u4E3A\u672A\u8FFD\u8E2A\uFF0C\u8FD9\u91CC\u600E\u4E48\u5C31\u6CA1\u6709\u4E86\u5462\uFF1F\u539F\u56E0\u5176\u5B9E\u662F Git \u8FDB\u884C SHA-1 \u503C\u662F\u9488\u5BF9\u6587\u4EF6\u5185\u5BB9\u8BA1\u7B97\u7684\uFF0C\u76EE\u5F55\u6CA1\u6709\u5185\u5BB9\u81EA\u7136\u5C31\u65E0\u6CD5\u8BA1\u7B97\u3002</p>`,24),b={class:"custom-container info"},m={viewBox:"0 0 25 25",xmlns:"http://www.w3.org/2000/svg","xml:space":"preserve",style:{"fill-rule":"evenodd","clip-rule":"evenodd","stroke-linejoin":"round","stroke-miterlimit":"2"}},v=n("path",{d:"M13 1.188C6.477 1.188 1.188 6.477 1.188 13S6.477 24.813 13 24.813 24.813 19.523 24.813 13c0-6.523-5.29-11.812-11.813-11.812Zm2.459 18.307c-.608.24-1.092.422-1.455.548a3.838 3.838 0 0 1-1.262.189c-.736 0-1.309-.18-1.717-.539a1.74 1.74 0 0 1-.611-1.367c0-.215.015-.435.045-.659a8.23 8.23 0 0 1 .147-.759l.761-2.688c.067-.258.125-.503.171-.731.046-.23.068-.441.068-.633 0-.342-.071-.582-.212-.717-.143-.135-.412-.201-.813-.201-.196 0-.398.029-.605.09-.205.063-.383.12-.529.176l.201-.828c.498-.203.975-.377 1.43-.521a4.225 4.225 0 0 1 1.29-.218c.731 0 1.295.178 1.692.53.395.353.594.812.594 1.376 0 .117-.014.323-.041.617a4.129 4.129 0 0 1-.152.811l-.757 2.68a7.582 7.582 0 0 0-.167.736 3.892 3.892 0 0 0-.073.626c0 .356.079.599.239.728.158.129.435.194.827.194.185 0 .392-.033.626-.097.232-.064.4-.121.506-.17l-.203.827Zm-.134-10.878a1.807 1.807 0 0 1-1.275.492c-.496 0-.924-.164-1.28-.492a1.57 1.57 0 0 1-.533-1.193c0-.465.18-.865.533-1.196a1.812 1.812 0 0 1 1.28-.497c.497 0 .923.165 1.275.497.353.331.53.731.53 1.196 0 .467-.177.865-.53 1.193Z",style:{fill:"#157ffb","fill-rule":"nonzero"},transform:"translate(-1.257 -1.257) scale(1.0582)"},null,-1),u=[v],p=n("p",{class:"custom-container-title"},"\u62D3\u5C55",-1),g=n("p",null,"\u7531\u4E8E\u4E0A\u8FF0\u89C4\u5219\uFF0C\u5BFC\u81F4 Git \u5BF9\u4E8E\u7A7A\u76EE\u5F55\u662F\u65E0\u611F\u7684\uFF0C\u6240\u4EE5\u5728\u5F88\u591A\u65F6\u5019\uFF0C\u5982\u679C\u60F3\u8981\u628A\u8FD9\u4E2A\u76EE\u5F55\u8BA9 Git \u611F\u77E5\u5230\uFF0C\u901A\u5E38\u4E60\u60EF\u662F\u5728\u8FD9\u4E2A\u76EE\u5F55\u4E0B\u65B0\u5EFA\u4E00\u4E2A .keep \u6587\u4EF6\u3002",-1),h=e(`<p>\u63A5\u4E0B\u6765\u5728\u6587\u4EF6\u5939\u4E0B\u65B0\u5EFA\u4E00\u4E2A\u6587\u4EF6</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token string">&quot;# welcome&quot;</span> <span class="token operator">&gt;</span> docs/intro.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>\u8FD9\u662F\u6211\u4EEC\u518D\u6765\u770B Git \u7684\u72B6\u6001</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>On branch main

No commits yet

Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git rm --cached &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        new file:   README.md

Untracked files:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to include <span class="token keyword">in</span> what will be committed<span class="token punctuation">)</span>
        docs/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Git \u80FD\u68C0\u6D4B\u5230 docs \u76EE\u5F55\u4E86\uFF0C\u6211\u4EEC\u628A\u5B83 add \u5230\u6682\u5B58\u533A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> <span class="token function">add</span> docs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>\u8FD9\u65F6\u5019 .git/objects \u76EE\u5F55\u4E0B\u591A\u4E86\u4E00\u4E2A\u76EE\u5F55\u548C\u4E00\u4E2A\u6587\u4EF6</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F tree .git/objects
.git/objects
\u251C\u2500\u2500 4c
\u2502  \u2514\u2500\u2500 0e618703add9755261e3d5d3b1cb8bac6bcbde
\u251C\u2500\u2500 c1
\u2502  \u2514\u2500\u2500 668483a7504a3ea10cf89b2885b526368fe2d2
\u251C\u2500\u2500 info
\u2514\u2500\u2500 pack
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4F7F\u7528 <code>git cat-file</code> \u67E5\u770B\u6587\u4EF6\u7C7B\u578B\u548C\u5185\u5BB9</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F <span class="token function">git</span> cat-file -t 4c0e618703add9755261e3d5d3b1cb8bac6bcbde
blob

\u276F <span class="token function">git</span> cat-file -p 4c0e618703add9755261e3d5d3b1cb8bac6bcbde
<span class="token comment"># welcome</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u63A5\u4E0B\u6765\u6211\u4EEC\u8FDB\u884C Commit \u770B\u770B\u4F1A\u6709\u4EC0\u4E48\u53D8\u5316</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F <span class="token function">git</span> commit -m <span class="token string">&#39;add: docs&#39;</span>
<span class="token punctuation">[</span>main <span class="token punctuation">(</span>root-commit<span class="token punctuation">)</span> 2b25ff6<span class="token punctuation">]</span> add: docs
 <span class="token number">2</span> files changed, <span class="token number">2</span> insertions<span class="token punctuation">(</span>+<span class="token punctuation">)</span>
 create mode <span class="token number">100644</span> README.md
 create mode <span class="token number">100644</span> docs/intro.md

\u276F <span class="token function">ls</span> -T .git/objects
.git/objects
\u251C\u2500\u2500 2b
\u2502  \u2514\u2500\u2500 25ff61544283df6dc06b62a9d88262a87f2dc9
\u251C\u2500\u2500 4c
\u2502  \u2514\u2500\u2500 0e618703add9755261e3d5d3b1cb8bac6bcbde
\u251C\u2500\u2500 <span class="token number">88</span>
\u2502  \u2514\u2500\u2500 e4e6006360e47ce9531e9586e1692ad9bb3feb
\u251C\u2500\u2500 c1
\u2502  \u2514\u2500\u2500 668483a7504a3ea10cf89b2885b526368fe2d2
\u251C\u2500\u2500 f7
\u2502  \u2514\u2500\u2500 3c29d62672bab41f605dcd5ff27ddb158af753
\u251C\u2500\u2500 info
\u2514\u2500\u2500 pack
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u591A\u51FA\u6765\u5F88\u591A\u6587\u4EF6\u548C\u76EE\u5F55\uFF0C\u6211\u4EEC\u4F9D\u6B21\u770B\u770B\u90FD\u662F\u4EC0\u4E48</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F <span class="token function">git</span> cat-file -t 2b25ff61544283df6dc06b62a9d88262a87f2dc9
commit

\u276F <span class="token function">git</span> cat-file -p 2b25ff61544283df6dc06b62a9d88262a87f2dc9
tree 88e4e6006360e47ce9531e9586e1692ad9bb3feb
author rainbowatcher <span class="token operator">&lt;</span>rainbow-w@qq.com<span class="token operator">&gt;</span> <span class="token number">1655625464</span> +0800
committer rainbowatcher <span class="token operator">&lt;</span>rainbow-w@qq.com<span class="token operator">&gt;</span> <span class="token number">1655625464</span> +0800

add: docs

\u276F <span class="token function">git</span> cat-file -t 88e4e6006360e47ce9531e9586e1692ad9bb3feb
tree

\u276F <span class="token function">git</span> cat-file -p 88e4e6006360e47ce9531e9586e1692ad9bb3feb
<span class="token number">100644</span> blob c1668483a7504a3ea10cf89b2885b526368fe2d2    README.md
040000 tree f73c29d62672bab41f605dcd5ff27ddb158af753    docs

\u276F <span class="token function">git</span> cat-file -t f73c29d62672bab41f605dcd5ff27ddb158af753
tree

\u276F <span class="token function">git</span> cat-file -p f73c29d62672bab41f605dcd5ff27ddb158af753
<span class="token number">100644</span> blob 4c0e618703add9755261e3d5d3b1cb8bac6bcbde    intro.md
</code></pre><div class="highlight-lines"><div class="highlight-line">\xA0</div><br><br><div class="highlight-line">\xA0</div><br><br><br><br><br><br><div class="highlight-line">\xA0</div><br><br><div class="highlight-line">\xA0</div><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u65B0\u51FA\u6765\u7684\u4E24\u4E2A tree \u5BF9\u8C61\u548C\u4E00\u4E2A commit \u5BF9\u8C61\uFF0C\u6211\u4EEC\u7528\u4E00\u5F20\u56FE\u8868\u793A\u5F53\u524D\u4ED3\u5E93\u7684\u72B6\u6001</p>`,15),f=e(`<p>\u56FE\u4E2D\u7684\u5B9E\u7EBF\u7BAD\u5934\u8868\u793A\u7C7B\u4F3C\u6307\u9488\u7684\u6982\u5FF5\uFF0C\u8868\u793A A \u6307\u5411 B\uFF0C\u5982 2b25ff \u662F\u4E00\u4E2A commit \u5BF9\u8C61\uFF0C\u5B83\u6307\u5411\u9879\u76EE\u6839\u8DEF\u5F84 88e4e6\u3002commit \u5BF9\u8C61\u4F1A\u6307\u5411\u6839\u76EE\u5F55\u7684 tree \u5BF9\u8C61\uFF0C\u800C tree \u5BF9\u8C61\u4F1A\u6307\u5411\u5176\u4ED6 tree \u5BF9\u8C61\u6216\u8005 blob \u5BF9\u8C61\u3002</p><h2 id="tag-\u5BF9\u8C61" tabindex="-1"><a class="header-anchor" href="#tag-\u5BF9\u8C61" aria-hidden="true">#</a> Tag \u5BF9\u8C61</h2><p>tag \u5BF9\u8C61\u4E0D\u4F1A\u5728 commit \u8FC7\u7A0B\u4E2D\u4EA7\u751F\uFF0C\u800C\u9700\u8981\u624B\u52A8\u6307\u5B9A\u67D0\u4E2A commit \u6765\u8BBE\u5B9A tag\u3002\u6211\u4EEC\u8BD5\u7740\u5236\u9020\u4E00\u4E2A tag\u3002</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> tag -a <span class="token number">0.0</span>.1 -m <span class="token string">&quot;first tag&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>\u8FD9\u65F6\u5728 .git/objects \u76EE\u5F55\u4E0B\u591A\u4E86 8e/3366c70256c1ca695505a83fbb5cc47369a251 \u6587\u4EF6\uFF0C\u7528 <code>git cat-file</code> \u67E5\u770B\u4E00\u4E0B</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>\u276F <span class="token function">git</span> cat-file -t 8e3366c70256c1ca695505a83fbb5cc47369a251
tag

\u276F <span class="token function">git</span> cat-file -p 8e3366c70256c1ca695505a83fbb5cc47369a251
object 2b25ff61544283df6dc06b62a9d88262a87f2dc9
<span class="token builtin class-name">type</span> commit
tag <span class="token number">0.0</span>.1
tagger rainbowatcher <span class="token operator">&lt;</span>rainbow-w@qq.com<span class="token operator">&gt;</span> <span class="token number">1655632524</span> +0800

first tag
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8FD9\u65F6\u6211\u4EEC\u7684 Git \u56FE\u5C31\u53D8\u6210\u4E86\u4E0B\u9762\u7684\u6837\u5B50</p>`,7),k=n("p",null,[c("\u672C\u6587\u5927\u91CF\u53C2\u8003\u9AD8\u89C1\u9F99\u5148\u751F\u7684"),n("a",{href:"https://gitbook.tw/",target:"_blank",rel:"noopener noreferrer"},"\u300A\u4E3A\u4F60\u81EA\u5DF1\u5B66 Git\u300B"),c("\u3002")],-1);function E(x,w){const s=t("Mermaid");return a(),i("div",null,[r,n("div",b,[(a(),i("svg",m,u)),p,g]),h,d(s,{id:"mermaid_382ee23d","data-code":`flowchart LR

classDef tree    fill:#fb923c,stroke:#000,stroke-width:2px;
classDef blob    fill:#22c55e,stroke:#000,stroke-width:2px;
classDef tag     fill:#fcd34d,stroke:#000,stroke-width:2px;
classDef commit  fill:#f87171,stroke:#000,stroke-width:2px;
classDef comment stroke-width:0px;

subgraph content
  root(88e4e6):::tree
  README(c16684):::blob
  docs(f73c29):::tree
  intro(4c0e61):::blob
  commit1(2b25ff):::commit

  D("/README.md"):::comment-.->README
  commit1-->root
  root-->docs & README
  docs-->intro
  A("HEAD master add: docss"):::comment-.->commit1
  B("/"):::comment-.->root
  C("docs"):::comment-.->docs
  E("intro.md"):::comment-.->intro
end

subgraph tips
  commit(commit):::commit
  tag(tag):::tag
  blob(blob):::blob
  tree(tree):::tree
  comment(comment):::comment
end`}),f,d(s,{id:"mermaid_64a570da","data-code":`flowchart LR

classDef tree    fill:#fb923c,stroke:#000,stroke-width:2px;
classDef blob    fill:#22c55e,stroke:#000,stroke-width:2px;
classDef tag     fill:#fcd34d,stroke:#000,stroke-width:2px;
classDef commit  fill:#f87171,stroke:#000,stroke-width:2px;
classDef comment stroke-width:0px;

subgraph content
  root(88e4e6):::tree
  README(c16684):::blob
  docs(f73c29):::tree
  intro(4c0e61):::blob
  commit1(2b25ff):::commit

  D("/README.md"):::comment-.->README
  commit1-->root
  root-->docs & README
  docs-->intro
  A("HEAD master add: docs"):::comment-.->commit1
  B("/"):::comment-.->root
  C("docs"):::comment-.->docs
  E("intro.md"):::comment-.->intro
  F("0.0.1"):::tag-.->commit1
end

subgraph tips
  commit(commit):::commit
  tag(tag):::tag
  blob(blob):::blob
  tree(tree):::tree
  comment(comment):::comment
end`}),k])}var D=l(o,[["render",E],["__file","index.html.vue"]]);export{D as default};
