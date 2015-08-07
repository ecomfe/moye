title: 提示 / Tip
name: Tip
categories:
  - component
date: 2015-08-06 19:13:48
---

# Tip 组件

### 如何标识目标

只需要给目标 DOM 添加样式类`tooltips`即可

<iframe height='763' scrolling='no' src='//codepen.io/jinzhubaofu/embed/KpJeGM/?height=763&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/KpJeGM/'>KpJeGM</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

### 方位关系

你可以通过将目标元素添加`data-tooltips`属性来指定`Tip`的定位关系

Tip 支持多种定位关系，大体上分为两个部分：

1. Tip 位于目标的哪个方位，也就是 top / bottom / left / right，简写为 t / b / l / r；
2. Tip 如何与目标对齐，也就是 left / center / right，或者是 top /center / bottom, 简写就是 l / c / r 和 t / c / b；

将这两个简写定位合并起来就是`Tip`的定位标识。

例子1：tc，就是 top + center，也就是`Tip`位于目标的顶部，居中对齐

例子1：lb，就是 left + bottom，也就是`Tip`位于目标的左侧，底部对齐

效果如下边这个效果：

<p data-height="655" data-theme-id="17600" data-slug-hash="zGeaWz" data-default-tab="result" data-user="jinzhubaofu" class='codepen'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/zGeaWz/'>zGeaWz</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

### 静态模式

这个模式是只能通过`javascript`来控制`Tip`的显示或隐藏，也就是说鼠标的`hover`动作不管用了。这种模式可以作为表单元素校验出错的提示信息。

<iframe height='266' scrolling='no' src='//codepen.io/jinzhubaofu/embed/QbYxzy/?height=266&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/jinzhubaofu/pen/QbYxzy/'>QbYxzy</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>
