import{_ as a,r as e,o as t,c as p,b as o,d as n}from"./app.0c2bd0f0.js";const c={},i=n(`<h2 id="\u6D4B\u8BD5\u65B9\u6CD5\u6267\u884C\u987A\u5E8F" tabindex="-1"><a class="header-anchor" href="#\u6D4B\u8BD5\u65B9\u6CD5\u6267\u884C\u987A\u5E8F" aria-hidden="true">#</a> \u6D4B\u8BD5\u65B9\u6CD5\u6267\u884C\u987A\u5E8F</h2><p>JUnit5 \u63D0\u4F9B <code>@Order</code> \u548C <code>@TestMethodOrder</code> \u4E24\u4E2A\u6CE8\u89E3\u914D\u5408</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@TestMethodOrder</span><span class="token punctuation">(</span><span class="token class-name">MethodOrderer<span class="token punctuation">.</span>OrderAnnotation</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Test</span><span class="token punctuation">{</span>

  <span class="token annotation punctuation">@Test</span>
  <span class="token annotation punctuation">@Order</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token keyword">void</span> <span class="token function">testMethod1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token annotation punctuation">@Test</span>
  <span class="token annotation punctuation">@Order</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
  <span class="token keyword">void</span> <span class="token function">testMethod1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>MethodOrderer \u7C7B\u56FE</p>`,4),l=n(`<h2 id="custom-argument-provider" tabindex="-1"><a class="header-anchor" href="#custom-argument-provider" aria-hidden="true">#</a> Custom Argument Provider</h2><p>\u4F20\u9012\u6D4B\u8BD5\u53C2\u6570\u7684\u53E6\u4E00\u79CD\u9AD8\u7EA7\u65B9\u6CD5\u662F\u4F7F\u7528\u53EB\u505A argumentsProvider \u7684\u63A5\u53E3\u7684\u81EA\u5B9A\u4E49\u5B9E\u73B0\uFF1A</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@ParameterizedTest</span>
<span class="token annotation punctuation">@ArgumentsSource</span><span class="token punctuation">(</span><span class="token class-name">ArgProvider</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token keyword">void</span> <span class="token function">name</span><span class="token punctuation">(</span><span class="token class-name">String</span> str<span class="token punctuation">,</span> <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> clazz<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>clazz<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">ArgProvider</span> <span class="token keyword">implements</span> <span class="token class-name">ArgumentsProvider</span> <span class="token punctuation">{</span>

  <span class="token annotation punctuation">@Override</span>
  <span class="token keyword">public</span> <span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">extends</span> <span class="token class-name">Arguments</span><span class="token punctuation">&gt;</span></span> <span class="token function">provideArguments</span><span class="token punctuation">(</span><span class="token class-name">ExtensionContext</span> extensionContext<span class="token punctuation">)</span>
      <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span>
        <span class="token class-name">Arguments</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">&quot;US&quot;</span><span class="token punctuation">,</span> US<span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token class-name">Arguments</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">&quot;UK&quot;</span><span class="token punctuation">,</span> UK<span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token class-name">Arguments</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">&quot;CN&quot;</span><span class="token punctuation">,</span> CN<span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details class="custom-container details"><summary>Output</summary><pre style="padding:0;margin:0;border:0;">US
class com.example.US
UK
class com.example.UK
CN
class com.example.CN
</pre></details>`,5);function u(r,d){const s=e("Mermaid");return t(),p("div",null,[i,o(s,{id:"mermaid_382ee145","data-code":`classDiagram
  interface MethodOrderer
  class DisplayName
  class OrderAnnotation
  class MethodName
  class Random
  class Alphanumeric
  Random : -List~string~ messages

  MethodOrderer <|.. DisplayName    : \u5B9E\u73B0
  MethodOrderer <|.. Random         : \u5B9E\u73B0
  MethodOrderer <|.. OrderAnnotation: \u5B9E\u73B0
  MethodOrderer <|.. MethodName     : \u5B9E\u73B0
  MethodOrderer o-- DisplayName     : \u805A\u5408
  MethodOrderer o-- Random          : \u805A\u5408
  MethodOrderer o-- OrderAnnotation : \u805A\u5408
  MethodOrderer o-- MethodName      : \u805A\u5408
  MethodName    <|-- Alphanumeric   : \u7EE7\u627F`}),l])}var m=a(c,[["render",u],["__file","junit5-annotation.html.vue"]]);export{m as default};
