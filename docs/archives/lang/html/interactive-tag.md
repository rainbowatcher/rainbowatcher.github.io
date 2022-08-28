---
layout: Post
title: "[HTML]交互类标签"
subtitle: html 中用户交互相关的组件的使用和演示
date: 2022-07-30
permalinkPattern: /post/:year/:month/:day/:slug/
headerImage: /img/html.png
useHeaderImage: true
headerMask: rgba(0, 0, 0, .4)
hide: false
tags: [HTML]
---

## 折叠列表

::: normal-demo 演示

```html
<details>
  <summary>Details</summary>
  Something small enough to escape casual notice.
</details>
```

:::

默认打开的折叠列表

::: normal-demo 演示

```html
<details open>
  <summary>Details</summary>
  Something small enough to escape casual notice.
</details>
```

:::

没有 summary 标签时默认根据地区显示 Details 的翻译，如下。

::: normal-demo 演示

```html
<details>
  <p>
    Requires a computer running an operating system. The computer must have some
    memory and ideally some kind of long-term storage. An input device as well
    as some form of output device is recommended.
  </p>
</details>
```

:::

存在一个 `toggle` 事件,可以在点击折叠列表时触发。

```javascript
details.addEventListener("toggle", (event) => {
  if (details.open) {
    /* the element was toggled open */
  } else {
    /* the element was toggled closed */
  }
});
```

## 按钮

::: normal-demo 演示

```html
<button name="button">Click me</button>
```

:::

### 属性

全部属性参见[官方文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button)。

- autofocus <Badge text="HTML5"/>: 一个布尔属性，用于指定当页面加载时按钮必须有输入焦点，除非用户重写，例如通过不同控件键入。只有一个表单关联元素可以指定该属性。

- form <Badge text="HTML5"/>: 表示 button 元素关联的 form 元素（它的表单拥有者）。此属性值必须为同一文档中的一个`<form>`元素的 id 属性。如果此属性未指定，`<button>`元素必须是 form 元素的后代。利用此属性，你可以将`<button>`元素放置在文档内的任何位置，而不仅仅是作为他们 form 元素的后代。

- formaction <Badge text="HTML5"/>: 表示程序处理 button 提交信息的 URI。如果指定了，将重写 button 表单拥有者的 action 属性。

- name: button 的名称，与表单数据一起提交。

- type: button 的类型。可选值：

  - submit: 此按钮将表单数据提交给服务器。如果未指定属性，或者属性动态更改为空值或无效值，则此值为默认值。
  - reset: 此按钮重置所有组件为初始值。
  - button: 此按钮没有默认行为。它可以有与元素事件相关的客户端脚本，当事件出现时可触发。
  - menu: 此按钮打开一个由指定`<menu>`元素进行定义的弹出菜单。

- value: button 的初始值。它定义的值与表单数据的提交按钮相关联。当表单中的数据被提交时，这个值便以参数的形式被递送至服务器。

## 输入控件

::: normal-demo 演示

```html
<label>输入框：</label> <input type="text" />
```

:::

### 获取输入值

::: normal-demo 演示

```html
<label>选择你最喜欢的前端框架：</label>
<input id="favorite-language" list="language" />
<datalist id="language">
  <option>Vue</option>
  <option>React</option>
  <option>Angular</option>
</datalist>
<output id="output"></output>
```

```js
const input = document.getElementById('favorite-language')
input.addEventListener('input', (event) => {
  const output = document.getElementById('output')
  output.innerHTML = `你最喜欢的前端框架是：${event.target.value}`
})
```

:::

### 输入控件的类型

类型使用见[官方文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input#%3Cinput%3E_types)。

下面举例几个常用的类型

- button / submit / reset

  ::: normal-demo 演示

  ```html
  <!-- 没有默认的行为的按钮 -->
  <input type="button" value="按钮" />
  <!-- 提交表单内容 -->
  <input type="submit" value="提交" />
  <!-- 重置按钮会重置表单中所有的元素的内容 -->
  <input type="reset" value="重置" />
  ```

  :::

- checkbox

  ::: normal-demo 演示

  ```html
  <input type="checkbox" id="cbox1" value="选项" />
  <label for="cbox1">选项1</label>
  <input type="checkbox" id="cbox2" value="选项" checked />
  <label for="cbox2">选项2</label>
  ```

  :::

- color

  ::: normal-demo 演示

  ```html
  <input type="color" value="#ff0000" />
  ```

  :::

  有两个和值的改变相关的事件，input 和 change:

  每次颜色变更都会触发元素上的 input 事件。
  用户关闭选色器之后会触发 change 事件。
  对于这两个事件，都可以通过 value 属性获取新值。

  ```javascript
  colorPicker.addEventListener("input", updateFirst, false);
  colorPicker.addEventListener("change", watchColorPicker, false);

  function watchColorPicker(event) {
    document.querySelectorAll("p").forEach(function (p) {
      p.style.color = event.target.value;
    });
  }
  ```

  **选取值**

  如果浏览器的实现不支持为"color"类型的`<input>`元素提供选色器而只有一个文本框，可以使用`select()`方法选取输入内容。如果浏览器提供了选色器，`select()`方法将会什么也不做。因此，需要留心这两种情况下方法行为的差异。

  ```javascript
  colorWell.select();
  ```

- date

  ::: normal-demo 演示

  ```html
  <input type="date" />
  ```

  :::

  指定默认值

  ::: normal-demo 演示

  ```html
  <input id="date" type="date" value="2017-06-01" />
  ```

  :::

- radio

  ::: normal-demo 演示

  ```html
  <input type="radio" id="huey" name="drone" value="huey" checked />
  <label for="huey">Huey</label>
  <br />
  <input type="radio" id="dewey" name="drone" value="dewey" />
  <label for="dewey">Dewey</label>
  ```

  :::

  :heavy_check_mark: 你可以用 label 元素把 input 元素包裹起来，这样就可以把 input 元素的 label 和 input 元素分开了。

  ::: normal-demo 演示

  ```html
  <input type="radio" id="huey" name="drone" value="huey" checked />
  <label for="huey">Huey</label>
  <br />
  <input type="radio" id="dewey" name="drone" value="dewey" />
  <label for="dewey">Dewey</label>
  ```

  :::

### 事件

输入控件有两个通用的事件 input 和 change ，分别代表输入数据和改变数据两种事件类型。

```javascript
input.addEventListener("input", updateValue);

function updateValue(e) {
  // do something
}

input.addEventListener("change", (event) => {
  // do something
});
```

## 对话框

会在页面弹出一个对话框，可以是表单或者其他交互式组件。

::: normal-demo 演示

```html
<dialog id="favDialog">
  <form method="dialog">
    <p>
      <label
        >Favorite animal:
        <select>
          <option value="default">Choose...</option>
          <option>Brine shrimp</option>
          <option>Red panda</option>
          <option>Spider monkey</option>
        </select>
      </label>
    </p>
    <div>
      <button value="cancel">Cancel</button>
      <button id="confirmBtn" value="default">Confirm</button>
    </div>
  </form>
</dialog>
<p>
  <button id="updateDetails">Update details</button>
</p>
<output></output>
```

```javascript
const updateButton = document.getElementById("updateDetails");
const favDialog = document.getElementById("favDialog");
const outputBox = document.querySelector("output");
const selectEl = favDialog.querySelector("select");
const confirmBtn = favDialog.querySelector("#confirmBtn");

// If a browser doesn't support the dialog, then hide the
// dialog contents by default.
if (typeof favDialog.showModal !== "function") {
  favDialog.hidden = true;
  /* a fallback script to allow this dialog/form to function
    for legacy browsers that do not support <dialog>
    could be provided here.
  */
}
// "Update details" button opens the <dialog> modally
updateButton.addEventListener("click", function onOpen() {
  if (typeof favDialog.showModal === "function") {
    favDialog.showModal();
  } else {
    outputBox.value =
      "Sorry, the <dialog> API is not supported by this browser.";
  }
});
// "Favorite animal" input sets the value of the submit button
selectEl.addEventListener("change", function onSelect(e) {
  confirmBtn.value = selectEl.value;
});
// "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
favDialog.addEventListener("close", function onClose() {
  outputBox.value =
    favDialog.returnValue + " button clicked - " + new Date().toString();
});
```

:::

## 菜单

:warning: 这是一个实验中的功能

::: normal-demo 演示

```html
<menu type="toolbar" id="popup-menu">
  <menuitem>Action</menuitem>
  <menuitem>Another action</menuitem>
  <hr />
  <menuitem>Separated action</menuitem>
</menu>
```

:::

## 输出标签

`<output>` 标签表示计算或用户操作的结果，语义化标签

::: normal-demo 演示

```html
<output>一些输出内容</output>
```

:::

## 选项列表

可以配合 input 标签实现下拉菜单的效果，并带有过滤功能。此元素没有私有属性。

::: normal-demo 演示

```html
<label for="ice-cream-choice">Choose a flavor:</label>
<input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" />
<div>
  <datalist id="ice-cream-flavors">
    <option value="Chocolate" />
    <option value="Coconut" />
    <option value="Mint" />
    <option value="Strawberry" />
    <option value="Vanilla" />
  </datalist>
</div>
```

:::

## 选项列表

这个元素用于对表单中的控制元素进行分组

::: normal-demo 演示

```html
<form>
  <fieldset>
    <legend>Choose your favorite monster</legend>

    <input type="radio" id="kraken" name="monster" />
    <label for="kraken">Kraken</label><br />

    <input type="radio" id="sasquatch" name="monster" />
    <label for="sasquatch">Sasquatch</label><br />

    <input type="radio" id="mothman" name="monster" />
    <label for="mothman">Mothman</label>
  </fieldset>
  <fieldset>
    <legend>Choose your favorite monster</legend>
    <input type="radio" id="kraken" name="monster" />
    <label for="kraken">Kraken</label><br />
    <input type="radio" id="sasquatch" name="monster" />
    <label for="sasquatch">Sasquatch</label><br />
    <input type="radio" id="mothman" name="monster" />
    <label for="mothman">Mothman</label>
  </fieldset>
</form>
```

:::

## 表单

::: normal-demo 演示

```html
<form action="" method="get" class="form-example">
  <div class="form-example">
    <label for="name">Enter your name: </label>
    <input type="text" name="name" id="name" required />
  </div>
  <div class="form-example">
    <label for="email">Enter your email: </label>
    <input type="email" name="email" id="email" required />
  </div>
  <div class="form-example">
    <input type="submit" value="Subscribe!" />
  </div>
</form>

<style>
  form.form-example {
    display: table;
  }
  div.form-example {
    display: table-row;
  }
  .form-example label,
  input {
    display: table-cell;
    margin-bottom: 10px;
  }
  .form-example label {
    padding-right: 10px;
  }
</style>
```

:::

### 属性

详细属性与行为请参考[官方文档-form](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form)。

- name: 表单的名称。HTML 4 中不推荐（应使用 id）。在 HTML 5 中，该值必须是所有表单中独一无二的，而且不能是空字符串。

关于提交表单的属性

- action: 处理表单提交的 URL。这个值可被 `<button>`、`<input type="submit">` 或 `<input type="image">` 元素上的 formaction 属性覆盖。

- enctype: 当 method 属性值为 post 时，enctype 就是将表单的内容提交给服务器的 MIME 类型 。可能的取值有：

    - application/x-www-form-urlencoded：未指定属性时的默认值。
    - multipart/form-data：当表单包含 type=file 的 `<input>` 元素时使用此值。
    - text/plain：出现于 HTML5，用于调试。

    这个值可被 `<button>`、`<input type="submit">` 或 `<input type="image">` 元素上的 formenctype 属性覆盖。

- method: 浏览器使用这种 HTTP 方式来提交 表单. 可能的值有：

    - post：指的是 HTTP POST 方法；表单数据会包含在表单体内然后发送给服务器.
    - get：指的是 HTTP GET 方法；表单数据会附加在 action 属性的 URL 中，并以 '?' 作为分隔符，没有副作用 时使用这个方法。
    - dialog：如果表单在 `<dialog>` 元素中，提交时关闭对话框。

    此值可以被 `<button>`、`<input type="submit">` 或 `<input type="image">` 元素中的 formmethod 属性覆盖。

- target: 表示在提交表单之后，在哪里显示响应信息。在 HTML 4 中, 这是一个 frame 的名字/关键字对。在 HTML5 里，这是一个浏览上下文 的名字/关键字（如标签页、窗口或 iframe）。下述关键字有特别含义：

    - _self：默认值。在相同浏览上下文中加载。
    - _blank：在新的未命名的浏览上下文中加载。
    - _parent：在当前上下文的父级浏览上下文中加载，如果没有父级，则与 _self 表现一致。
    - _top：在最顶级的浏览上下文中（即当前上下文的一个没有父级的祖先浏览上下文），如果没有父级，则与 _self 表现一致。

    此值可以被 `<button>`、 `<input type="submit">` 或 `<input type="image">` 元素中的 formtarget 属性覆盖。
