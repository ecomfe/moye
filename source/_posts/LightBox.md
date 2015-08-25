title: 查看大图 / LightBox
name: LightBox
categories:
  - component
date: 2015-08-25 11:30:45
---


### 点击图片查看大图

`LightBox`的一个重要参数是`triggers`, 用以指定点击触发`LightBox`浮层的元素，默认是`[data-role=lightbox-image]`。
`triggers`元素上可以指定显示图片的一些参数：
`data-lightbox-url`: 图片的地址 ***必须***
`data-lightbox-title`: 图片的标题信息，会显示在浮层上（可选）
`data-lightbox-width`: 图片的宽度（可选）
`data-lightbox-height`: 图片的高度（可选）

<iframe height='570' scrolling='no' src='//codepen.io/cxtom/embed/rVbEjy/?height=570&theme-id=17729&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/cxtom/pen/rVbEjy/'>rVbEjy</a> by chenxiao (<a href='http://codepen.io/cxtom'>@cxtom</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>


### 全部配置参数
------------------------

| 属性名        |类型        |   说明   |   默认   |
| :--------    |:--------- | :------ | :------ |
| triggers     |string    |  触发显示的元素的选择器  | `'[data-role="lightbox-image"]'` |
| mask         |boolean     |  是否显示覆盖层  | `true` |
| showLoading        |boolean     |  是否显示加载动画  | `true` |
| showPage      |boolean     |  是否显示页码  | `true` |
| autoScale   |boolean    |  是否根据浏览器可视区域缩放，不超过窗口高度的80%  | `true` |
| maskClickClose    |boolean     |  当遮罩被点击时, 相当于点击close  | `true` |
| level        |number     |  当前LightBox的z-index  | `10` |
| cyclic       |boolean     |  是否循环播放，最后一张点击下一页回到第一张  | `false` |
| errorMessage         |string     |  图片加载错误时显示的内容  | `'图片加载失败，请稍后重试'` |

在浮层切换的时候可以绑定回调事件`onChange`。
