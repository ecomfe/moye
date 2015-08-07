{% target: Dialog(master=base) %}
{% content: style%}
<link rel="stylesheet" href="../src/css/Dialog.less">
<style>
  .content {
    margin: 20px 0;
  }
</style>
{% content: content%}
{%filter: markdown%}

# Dialog 窗口

## 普通窗口

```html
<button id="newDialog">普通青年(呃，普通窗口)</button>
```

```js
var dialog = new Dialog({
  title: '普通青年有一个普通标题',
  content: ''
    + '<h3>普通青年背古诗...</h3>'
    + '<br>'
    + '君不见孤雁关外发，酸嘶度扬越。<br> '
    + '空城客子心肠断，幽闺思妇气欲绝。<br>'
    + '凝霜夜下拂罗衣，浮云中断开明月。<br>'
    + '夜夜遥遥徒相思，年年望望情不歇。<br>'
    + '寄我匣中青铜镜，倩人为君除白发。<br>'
    + '行路难，行路难，<br>'
    + '夜闻南城汉使度，使我流泪忆长安！<br>'
}).render();

$('#dialog').on('click', $.proxy(dialog.show, dialog));
```

<div class="content">
  <button id="dialog">普通青年(呃，普通窗口)</button>
</div>

<script>
require(['jquery', 'ui/Dialog'], function ($, Dialog) {

  var dialog = new Dialog({
    content: ''
      + '<h3>普通青年背古诗...</h3>'
      + '<br>'
      + '君不见孤雁关外发，酸嘶度扬越。<br> '
      + '空城客子心肠断，幽闺思妇气欲绝。<br>'
      + '凝霜夜下拂罗衣，浮云中断开明月。<br>'
      + '夜夜遥遥徒相思，年年望望情不歇。<br>'
      + '寄我匣中青铜镜，倩人为君除白发。<br>'
      + '行路难，行路难，<br>'
      + '夜闻南城汉使度，使我流泪忆长安！<br>',
    title: '普通青年有一个普通标题'
  }).render();
  $('#dialog').on('click', $.proxy(dialog.show, dialog));
});
</script>

## 会自毁的窗口

```js
$('#auto-dispose').on('click', function () {

  new Dialog({
    content: '会自毁的窗口' + (++i),
    title: '会自毁的窗口',
    hideDispose: true
  }).render().show();

});
```

当窗口被隐藏时自动销毁

<div class="content">
  <button id="auto-dispose">会自毁的窗口</button>
</div>

<script>
require(['jquery', 'ui/Dialog'], function ($, Dialog) {

  var i = 0;

  $('#auto-dispose').on('click', function () {

    new Dialog({
      content: '会自毁的窗口' + (++i),
      title: '会自毁的窗口',
      hideDispose: true
    }).render().show();

  });

});
</script>

```js
var dialog = new Dialog({
  content: '设定`buttons`参数来添加脚注中的按钮',
  title: '带按钮的窗口',
  buttons: [{
    text: '嘿嘿, 我是一个按钮',
    part: 'big-button'
  }]
}).render().on('buttonclick', function (e) {
  // e.part => big-button
  this.hide();
});

$('#footer-buttons').on('click', $.proxy(dialog.show, dialog));
```

## 带按钮的窗口

首先, 我们提供`buttons`参数. 通过这个参数, 可以很方便地添加脚注中的按钮

<div class="content">
  <button id="footer-buttons">带按钮的窗口</button>
</div>

<script>
require(['jquery', 'ui/Dialog'], function ($, Dialog) {
  var dialog = new Dialog({
    content: '设定`buttons`参数来添加脚注中的按钮',
    title: '带按钮的窗口',
    buttons: [{
      text: '好',
      part: 'big',
      skin: 'mini'
    }]
  })
  .render()
  .on('big', function (e) {
    this.hide();
  });

  $('#footer-buttons').on('click', $.proxy(dialog.show, dialog));
});
</script>

```js
var dialog = new Dialog({
  content: '带按钮的窗口',
  title: '带按钮的窗口',
  footer: '<button>ok</button>'
}).render().on('click', function (e) {
  if ($(e.target).is('button')) {
    this.hide();
  }
});

$('#footer').on('click', $.proxy(dialog.show, dialog));
```

还可以通过设定`footer`的值, 来构建自定义脚注, 自行添加按钮

<div class="content">
  <button id="footer">带按钮的窗口</button>
</div>

<script>
require(['jquery', 'ui/Dialog'], function ($, Dialog) {
  var dialog = new Dialog({
    content: '带按钮的窗口',
    title: '带按钮的窗口',
    footer: '<button>ok</button>'
  }).render().on('click', function (e) {
    if ($(e.target).is('button')) {
      this.hide();
    }
  });

  $('#footer').on('click', $.proxy(dialog.show, dialog));
});
</script>

> 注意: `footer`与`buttons`的优先级. 如果, `footer`与`buttons`同时存在, 那么`footer`会覆盖`buttons`.

是不是觉得自己拼`按钮`很麻烦呢? 来, 我们内置一些常用的带按钮的窗口~

## 内置的窗口们

```js
var i = 0;

$('#alert-dialog').on('click', function () {

  var me = this;

  Dialog.alert({
    title: 'WARNING',
    content: '狼来啦, 大王快跑呀~!',
    buttons: [{
      text: '傻呀, 当然跑啊'
    }]
  }).then(function () {
    me.innerHTML = '狼来啦~' + (++i) + '次';
  });

});
```

### 警告窗口 `Dialog.alert()`

<div class="content">
  <button id="alert-dialog">狼来啦~</button>
</div>

<script>
require(['jquery', 'ui/Dialog'], function ($, Dialog) {

  var i = 0;

  $('#alert-dialog').on('click', function () {

    var me = this;

    Dialog.alert({
      title: 'WARNING',
      content: '狼来啦, 大王快跑呀~!',
      buttons: [{
        text: '傻呀, 当然跑啊'
      }]
    }).then(function () {
      me.innerHTML = '狼来啦~' + (++i) + '次';
    });

  });

});
</script>

### 确认窗口 `Dialog.confirm()`

```js
$('#confirm-dialog').on('click', function () {

  var me = this;

  Dialog.confirm({
    title: ' ', // 小trick, 有标题, 但是没有字...
    content: '大王, 狼来了, 约吗? 啊不, 跑吗~!?',
    buttons: [{
      text: '约约约'
    }, {
      text: '约你妹'
    }]
  }).then(function () {
    me.innerHTML = '狼来啦~约了' + (++i) + '次, 不约' + j + '次';
  }, function () {
    me.innerHTML = '狼来啦~约了' + i + '次, 不约' + (++j) + '次';
  });

});
```
<div class="content">
  <button id="confirm-dialog">狼来啦~</button>
</div>

<script>
require(['jquery', 'ui/Dialog'], function ($, Dialog) {

  var i = 0;
  var j = 0;

  $('#confirm-dialog').on('click', function () {

    var me = this;

    Dialog.confirm({
      title: ' ', // 小trick, 有标题, 但是没有字...
      content: '大王, 狼来了, 约吗? 啊不, 跑吗~!?',
      buttons: [{
        text: '约约约'
      }, {
        text: '约你妹'
      }]
    }).then(function () {
      me.innerHTML = '狼来啦~约了' + (++i) + '次, 不约' + j + '次';
    }, function () {
      me.innerHTML = '狼来啦~约了' + i + '次, 不约' + (++j) + '次';
    });

  });

});
</script>

### 内置的窗口们的特性

1. `Dialog.alert()`和`Dialog.confirm()`会返回`promise`. 即这两个操作是异步的, 会返回预期结果. 用户只能在我们限定的选项中做出一个选择. 当`promise`被`resolved`或`rejected`, 会带有按钮的标识`part`.
2. 都是没有关闭按钮的. 原因是关闭按钮在这里是多余的. 关闭按钮在`alert`中表达的`确认`, 与`确认`按钮一致; 在`confirm`中表达的意图是`取消`, 与`取消`按钮一致. 因此, 关闭按钮是重复的, 不展现这个按钮. 这也与`window.alert()`和`window.confirm()`的交互相一致.
3. 都是会自毁的. 这与window.alert()和window.confirm()是一致的.
4. `Dialog.alert()`产生的窗口带有样式类`.skin-alert-dialog`, 也可以添加其他的`skin`来丰富样式效果.
5. `Dialog.confirm()`产生的窗口带有样式类`.skin-confirm-dialog`, 也可以添加其他的`skin`来丰富样式效果.
6. 点击`mask`不会关闭窗口, 原因与2一致.

{%/filter%}
