import{_ as n,o as a,c as s,d as e}from"./app.0c2bd0f0.js";const i={},t=e(`<h2 id="\u5143\u6CE8\u89E3" tabindex="-1"><a class="header-anchor" href="#\u5143\u6CE8\u89E3" aria-hidden="true">#</a> \u5143\u6CE8\u89E3</h2><p>\u610F\u601D\u7C7B\u4F3C\u5143\u6570\u636E\uFF0C\u5C31\u662F\u63CF\u8FF0\u6CE8\u89E3\u7684\u6CE8\u89E3\u3002</p><h3 id="target" tabindex="-1"><a class="header-anchor" href="#target" aria-hidden="true">#</a> @Target</h3><p>\u8868\u660E\u6CE8\u89E3\u80FD\u5728\u54EA\u4E9B\u5730\u65B9\u4F7F\u7528\uFF0C\u4E0B\u9762\u662FTarget\u7684\u6E90\u7801</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@Documented</span>
<span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span>RUNTIME<span class="token punctuation">)</span>
<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>ANNOTATION_TYPE<span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token annotation punctuation">@interface</span> <span class="token class-name">Target</span> <span class="token punctuation">{</span>
    <span class="token class-name">ElementType</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a href="https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html" target="_blank" rel="noopener noreferrer">Oracle \u5B98\u65B9 Java docs - ElementType</a></p><p>value\u503C\u4E2DElementType\u7684\u6E90\u7801\uFF1A</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">enum</span> <span class="token class-name">ElementType</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/** Class, interface (including annotation type), or enum declaration */</span>
    TYPE<span class="token punctuation">,</span>

    <span class="token doc-comment comment">/** Field declaration (includes enum constants) */</span>
    FIELD<span class="token punctuation">,</span>

    <span class="token doc-comment comment">/** Method declaration */</span>
    METHOD<span class="token punctuation">,</span>

    <span class="token doc-comment comment">/** Formal parameter declaration */</span>
    PARAMETER<span class="token punctuation">,</span>

    <span class="token doc-comment comment">/** Constructor declaration */</span>
    CONSTRUCTOR<span class="token punctuation">,</span>

    <span class="token doc-comment comment">/** Local variable declaration */</span>
    LOCAL_VARIABLE<span class="token punctuation">,</span>

    <span class="token doc-comment comment">/** Annotation type declaration */</span>
    ANNOTATION_TYPE<span class="token punctuation">,</span>

    <span class="token doc-comment comment">/** Package declaration */</span>
    PACKAGE<span class="token punctuation">,</span>

    <span class="token doc-comment comment">/**
     * Type parameter declaration
     *
     * <span class="token keyword">@since</span> 1.8
     */</span>
    TYPE_PARAMETER<span class="token punctuation">,</span>

    <span class="token doc-comment comment">/**
     * Use of a type
     *
     * <span class="token keyword">@since</span> 1.8
     */</span>
    TYPE_USE
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),c=[t];function l(o,p){return a(),s("div",null,c)}var u=n(i,[["render",l],["__file","java-meta-annotation.html.vue"]]);export{u as default};
