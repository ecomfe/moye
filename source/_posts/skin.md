title: 皮肤 / skin
categories:
  - introduction
date: 2015-08-07 17:46:10
---

## 皮肤

皮肤机制为 `moye` 控件提供强大的样式自定义能力，可以支持 `自定义样式` 与 `换肤` / `风格主题` 。

### 功能特点：

1. 首先，每个控件都有一个基础样式类型: `ui-{type}`，其中`{type}`表示控件的主类型；
2. 其次，控件可以设定皮肤参数，并可以指定多个皮肤。每个皮肤设定都会添加两个样式类型: `skin-{skin}` 与 `skin-{skin}-{type}`， 其中 `{skin}` 表示设定的皮肤。

### 生效时机：

皮肤是由 `Control` 的 `render` 方法统一处理的，在调用 `Control.prototype.render()` 时会自动按照上述规则生成样式，并添加到主元素。

### 示例

```js
var Button = require('moye/Button');
var button = new Button({
  main: document.getElementById('button'),
  skin: ['jinrong', 'small']
});
button.render();
```

使用以上代码 `moye` 会为元素button添加以下样式类型：

1. `ui-button` 类型样式
2. `skin-jinrong` 与 `skin-jinrong-button` 金融皮肤样式
3. `skin-small` 与 `skin-small-button` 小体积皮肤样式


### 特别说明：

目前， 皮肤是只读属性，不能通过`repaint`来重绘。
