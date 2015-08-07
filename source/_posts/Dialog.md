title: 对话框 / Dialog
name: Dialog
categories:
  - component
date: 2015-08-06 10:34:40
---

# Dialog 窗口

## 普通窗口

<iframe height='361' scrolling='no' src='//codepen.io/jinzhubaofu/embed/xGMWKz/?height=361&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/xGMWKz/'>xGMWKz</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

## 会自毁的窗口

<iframe height='266' scrolling='no' src='//codepen.io/jinzhubaofu/embed/mJvxbZ/?height=266&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/mJvxbZ/'>mJvxbZ</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

## 带按钮的窗口

通过我们提供`buttons`参数. 通过这个参数, 可以很方便地添加脚注中的按钮

<iframe height='266' scrolling='no' src='//codepen.io/jinzhubaofu/embed/WvPzNx/?height=266&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/WvPzNx/'>WvPzNx</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>


还可以通过设定`footer`的值, 来构建自定义脚注, 自行添加按钮

<iframe height='266' scrolling='no' src='//codepen.io/jinzhubaofu/embed/xGMWbJ/?height=266&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/xGMWbJ/'>xGMWbJ</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

这里可以给`Dialog`中任意的`DOM`元素添加`data-action`属性。在用户点击了一个带有`data-action`的元素时，`Dialog`会根据`data-action`所指定的动作来释放事件。比如上边例子里，我们给脚注中的按钮添加了`close`的动作标识。`Dialog`中有一个默认的动作处理动作`close`。所有带有 `close`动作标识的元素，被点击之后，`Dialog`都会自动关闭哟。

> 注意: `footer`与`buttons`的优先级. 如果, `footer`与`buttons`同时存在, 那么`footer`会覆盖`buttons`.


是不是觉得自己拼`按钮`很麻烦呢? 来, 我们内置一些常用的带按钮的窗口~

## 内置的窗口们

### 内置的窗口们的特性

1. 对于警告窗口和确认窗口，它们属于用户必须响应的交互，而且这种响应一定有固定的结果。因此，我们把它们的返回结果进行了 `Promise`封装。也就是说，`Dialog.alert()`和`Dialog.confirm()`会返回`promise`. 即这两个操作是异步的, 会返回预期结果. 用户只能在我们限定的选项中做出一个选择. 当`promise`被`resolved`或`rejected`, 会带有按钮的标识`part`.

2. 都是没有关闭按钮的. 原因是关闭按钮在这里是多余的. 关闭按钮在`alert`中表达的`确认`, 与`确认`按钮一致; 在`confirm`中表达的意图是`取消`, 与`取消`按钮一致. 因此, 关闭按钮是重复的, 不展现这个按钮. 这也与`window.alert()`和`window.confirm()`的交互相一致.

3. 都是会自毁的. 这与window.alert()和window.confirm()是一致的.

4. `Dialog.alert()`产生的窗口带有样式类`.skin-alert-dialog`, 也可以添加其他的`skin`来丰富样式效果.

5. `Dialog.confirm()`产生的窗口带有样式类`.skin-confirm-dialog`, 也可以添加其他的`skin`来丰富样式效果.

6. 点击`mask`不会关闭窗口, 原因与2一致.

### 警告窗口 `Dialog.alert()`

<iframe height='266' scrolling='no' src='//codepen.io/jinzhubaofu/embed/pJGLgw/?height=266&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/pJGLgw/'>pJGLgw</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

### 确认窗口 `Dialog.confirm()`

<iframe height='266' scrolling='no' src='//codepen.io/jinzhubaofu/embed/LVqdGM/?height=266&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/LVqdGM/'>LVqdGM</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>
