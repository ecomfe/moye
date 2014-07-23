{% target: FilterTip(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/FloatTip.less">

{% content: content %}

{% filter: markdown %}
# FilterTip 浮动提示

### DEMO
-----------------------

{% /filter%}
<div class="content">
  <button id="floattip-show">显示</button>
  <button id="floattip-hide">隐藏</button>
  <button id="floattip-dispose">销毁</button>
</div>
{% filter: markdown %}

### 源码
-----------------------

```html
<button id="floattip-show">显示</button>
<button id="floattip-hide">隐藏</button>
<button id="floattip-dispose">销毁</button>
```

```js
require(['FloatTip'], function (FloatTip) {
  var floattip = new FloatTip({
      content: '弹出提示层',
      left: '50%',
      top: '250px',
      fixed: 0
  });

  floattip.render();

  $('#floattip-show').on('click', function() {
      floattip.show();
  });

  $('#floattip-hide').on('click', function() {
      floattip.hide();
  });

  $('#floattip-dispose').on('click', function() {
      floattip.dispose();
  });

});
```
{% /filter %}
{% content: script %}
<script>
require(['FloatTip'], function (FloatTip) {
  var floattip = new FloatTip({
      content: '弹出提示层',
      left: '50%',
      top: '180px',
      fixed: 0
  });

  floattip.render();

  $('#floattip-show').on('click', function() {
      floattip.show();
  });

  $('#floattip-hide').on('click', function() {
      floattip.hide();
  });

  $('#floattip-dispose').on('click', function() {
      floattip.dispose();
  });

});
</script>