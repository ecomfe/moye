title: 浮层 / Popup
name: Popup
categories:
  - component
date: 2015-08-06 17:25:23
---

## 浮层 / Popup

`Popup`是一个工具控件, 用来完成浮出层的功能. 经常作为其他控件的子控件组合使用, 一般不直接使用.

`Popup`的主要参数是`triggers`, 用以指定触发`Popup`浮层. `triggers`是一个`jQuery`可以接受的`css selector`.

使用`target`属性来指定`Popup`的显示位置.

<iframe height='293' scrolling='no' src='//codepen.io/jinzhubaofu/embed/waNjEE/?height=293&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/waNjEE/'>waNjEE</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>


如果不指定`target`属性, 那么`Popup`会挂靠到当前的触发元素上

<iframe height='344' scrolling='no' src='//codepen.io/jinzhubaofu/embed/doaegW/?height=344&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/doaegW/'>doaegW</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>


可以通过指定`dir`参数来调整`Popup`挂靠的方向. 上例中 `dir`设定为`rc`, 表示`Popup`挂靠到目标元素的右侧中间位置.

<iframe height='480' scrolling='no' src='//codepen.io/jinzhubaofu/embed/jPdxeJ/?height=480&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/jPdxeJ/'>jPdxeJ</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

可以指定`liveTriggers`来限定一个容器, 在限容器内的所有`triggers`都可以触发`Popup`, 即使它们是在初始化之后被创建的.
