{% target: Slider(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Slider.less">
<style>
  .content {
    padding: 20px 0;
  }
  .ecl-ui-slider {
    width: 423px;
    margin: 0 auto;
  }
</style>
{% content: content %}

{% filter: markdown %}
# Slider 轮播组件

#### 静态的轮播组件
--------------------

{% /filter%}
<div class="content">
  <div id="slider-container-default" class="ecl-ui-slider">
    <i id="ecl-ui-slider-prev" class="ecl-ui-slider-prev">&lt;</i>
    <i id="ecl-ui-slider-next" class="ecl-ui-slider-next">&gt;</i>
    <div class="ecl-ui-slider-index">
      <i></i><i></i><i></i><i></i>
    </div>
    <div class="ecl-ui-slider-stage">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>
{%filter: markdown%}



```html
<div class="content">
  <div id="slider-container-default" class="ecl-ui-slider">
    <i id="ecl-ui-slider-prev" class="ecl-ui-slider-prev">&lt;</i>
    <i id="ecl-ui-slider-next" class="ecl-ui-slider-next">&gt;</i>
    <div class="ecl-ui-slider-index">
      <i></i><i></i><i></i><i></i>
    </div>
    <div id="ecl-ui-slider-stage" class="ecl-ui-slider-stage">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>
```

```js
var def = new Slider({
  main: $('#slider-container-default')[0],
  anim: 'no',
  auto: false,
  onChange: function(e) {
    if(window.console) {
      console.log(e);
    }
  }
});
def.render();
```

#### 水平方向轮播组件
--------------------

{%/filter%}

<div class="content">
  <div id="slider-container-horizontal" class="ecl-ui-slider">
    <i id="ecl-ui-slider-prev" class="ecl-ui-slider-prev">&lt;</i>
    <i id="ecl-ui-slider-next" class="ecl-ui-slider-next">&gt;</i>
    <div class="ecl-ui-slider-index">
      <i></i><i></i><i></i><i></i>
    </div>
    <div id="ecl-ui-slider-stage" class="ecl-ui-slider-stage">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>

{%filter: markdown%}

```js
var slider = new Slider({
  main: lib.g('slider-container'),
  anim: 'slide',
  animOptions: {
    easing:'easing', //easing, backIn, backOut, backBoth, lineer, bounce
    interval: 200,
    rollCycle: true
  },
  onChange: function(e) {
    console.log(e);
  }
});

slider.render();
```

#### 垂直方向的轮播组件
--------------------

{%/filter%}

<div class="content">
  <div id="slider-container-vertical" class="ecl-ui-slider">
    <i id="ecl-ui-slider-prev" class="ecl-ui-slider-prev">&lt;</i>
    <i id="ecl-ui-slider-next" class="ecl-ui-slider-next">&gt;</i>
    <div class="ecl-ui-slider-index">
      <i></i><i></i><i></i><i></i>
    </div>
    <div id="ecl-ui-slider-stage" class="ecl-ui-slider-stage ecl-ui-slider-stage-vertical">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>

{%filter: markdown%}

```html
<div class="content">
  <div id="slider-container-vertical" class="ecl-ui-slider">
    <i id="ecl-ui-slider-prev" class="ecl-ui-slider-prev">&lt;</i>
    <i id="ecl-ui-slider-next" class="ecl-ui-slider-next">&gt;</i>
    <div class="ecl-ui-slider-index">
      <i></i><i></i><i></i><i></i>
    </div>
    <div id="ecl-ui-slider-stage" class="ecl-ui-slider-stage ecl-ui-slider-stage-vertical">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>
```

```js
var verticalSlider = new Slider({
  main: lib.g('slider-container-vertical'),
  anim: 'slide',
  animOptions: {
    direction: 'vertical',
    easing:'bounce',
    interval: 500
  }
});

verticalSlider.render();
```
#### 透明渐变的轮播组件
--------------------

{%/filter%}

<div class="content">
  <div id="slider-container-opacity" class="ecl-ui-slider">
    <i id="ecl-ui-slider-prev" class="ecl-ui-slider-prev">&lt;</i>
    <i id="ecl-ui-slider-next" class="ecl-ui-slider-next">&gt;</i>
    <div class="ecl-ui-slider-index">
      <i></i><i></i><i></i><i></i>
    </div>
    <div id="ecl-ui-slider-stage" class="ecl-ui-slider-stage ecl-ui-slider-stage-abs">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>

{%filter: markdown%}


```html
<div class="content">
  <div id="slider-container-opacity" class="ecl-ui-slider">
    <i id="ecl-ui-slider-prev" class="ecl-ui-slider-prev">&lt;</i>
    <i id="ecl-ui-slider-next" class="ecl-ui-slider-next">&gt;</i>
    <div class="ecl-ui-slider-index">
      <i></i><i></i><i></i><i></i>
    </div>
    <div id="ecl-ui-slider-stage" class="ecl-ui-slider-stage ecl-ui-slider-stage-abs">
      <img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f6005808aa20.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929284f60058013da9.jpg"><img src="http://pic.hefei.cc/newcms/2012/03/14/13316929294f600581a07e5.jpg"></div>
  </div>
</div>
```

```js
var opacitySlider = new Slider({
    main: lib.g('slider-container-opacity'),
    anim: 'opacity',
    animOptions: {
      easing:'easing',
      interval: 500
    },
    auto: true
  });

  opacitySlider.render();
```
{%/filter%}

{% content: script %}
<script>
require(['lib', 'Slider'], function (lib, Slider) {

  var staticSlider = new Slider({
    main: lib.g('slider-container-default'),
    anim: 'no',
    auto: false,
    onChange: function(e) {
      if(window.console) {
        console.log(e);
      }
    }
  }).render();

  var horizontalSlider = new Slider({
    main: $('#slider-container-horizontal')[0],
    anim: 'slide',
    animOptions: {
      easing:'easing', //easing, backIn, backOut, backBoth, lineer, bounce
      interval: 200,
      rollCycle: true
    },
    onChange: function(e) {
      console.log(e);
    }
  }).render();

  var verticalSlider = new Slider({
    main: lib.g('slider-container-vertical'),
    anim: 'slide',
    animOptions: {
      direction: 'vertical',
      easing:'bounce',
      interval: 500
    }
  }).render();

  var opacitySlider = new Slider({
    main: lib.g('slider-container-opacity'),
    anim: 'opacity',
    animOptions: {
      easing:'easing',
      interval: 500
    },
    auto: true
  }).render();


});
</script>