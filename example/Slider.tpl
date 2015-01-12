{% target: Slider(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Slider.less">
<style>
  .content {
    padding: 20px 0;
  }
  .ui-slider {
    margin: 30px auto;
  }

</style>
{% content: content %}

{% filter: markdown %}
# Slider 轮播组件

{% /filter%}
<div class="content">
  <div id="slider-container-default" class="ui-slider">
    <div class="ui-slider-stage">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>

<script>
require(['ui/Slider'], function (Slider) {
  new Slider({
    main: document.getElementById('slider-container-default'),
    anim: 'slide',
    auto: false,
    capacity: 4
  }).render();
});
</script>

{%filter: markdown%}
```html
<div id="slider-container-default" class="ui-slider">
  <div class="ui-slider-stage">
    <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
</div>
```

```js
require(['ui/Slider'], function (Slider) {
  new Slider({
    main: document.getElementById('slider-container-default'),
    anim: 'slide',
    auto: false,
    capacity: 4
  }).render();
});
```

#### 自动轮播

设置参数`auto`为`true`, 控件会在完成`render`后开始`播放`, 即开始轮播.

或者调用`slider.play()`/`slider.stop()`来开始/暂停播放

{%/filter%}

<div class="content">
  <div id="auto-play" class="ui-slider">
    <div class="ui-slider-stage">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>

<script>
require(['ui/Slider'], function (Slider) {
  new Slider({
    main: document.getElementById('auto-play'),
    anim: 'slide',
    auto: true,
    capacity: 4
  }).render();
});
</script>

{%filter: markdown%}

```html
<div id="auto-play" class="ui-slider">
  <div class="ui-slider-stage">
    <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
</div>
```

```js
new Slider({
  main: document.getElementById('auto-play'),
  anim: 'slide',
  auto: true,
  capacity: 4
}).render();
```

## 各种切换动画效果

### 滑动(slide)垂直方向切换

{%/filter%}

<div id="vertical" class="ui-slider">
  <div class="ui-slider-stage">
    <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
</div>

<script>
require(['ui/Slider'], function (Slider) {
  new Slider({
    main: document.getElementById('vertical'),
    anim: 'slide',
    auto: true,
    animOptions: {
      direction: 'vertical'
    },
    capacity: 4
  }).render();
});
</script>

{%filter: markdown%}

```html
<div id="vertical" class="ui-slider">
  <div class="ui-slider-stage">
    <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
</div>
```

```js
new Slider({
  main: document.getElementById('vertical'),
  anim: 'slide',
  auto: true,
  animOptions: {
    direction: 'vertical'
  },
  capacity: 4
}).render();
```

### 透明渐变

{%/filter%}

<div class="content">
  <div id="opacity" class="ui-slider">
    <div class="ui-slider-stage">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>

<script>
require(['ui/Slider'], function (Slider) {
  new Slider({
    main: document.getElementById('opacity'),
    anim: 'opacity',
    auto: true,
    capacity: 4
  }).render();
});
</script>
{%filter: markdown%}

```html
<div class="content">
  <div id="opacity" class="ui-slider">
    <div class="ui-slider-stage">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>
```

```js
new Slider({
  main: document.getElementById('opacity'),
  anim: 'opacity',
  auto: true,
  capacity: 4
}).render();
```
{%/filter%}
