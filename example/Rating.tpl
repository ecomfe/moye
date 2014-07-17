{% target: filter(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Rating.less">
{% content: content %}

{% filter: markdown %}
# Rating 打分组件

### DEMO
-----------------------

{% /filter%}
<div class="content">
    <div class="ecl-ui-rating" id="rating"></div>
</div>
{% filter: markdown %}

### 说明

当鼠标移动到星星上时，星星会暂时地指向鼠标所在的星星；此时移出星星，那么组件会恢复到原有值。只有在星星点击一下，值才会被固定下来，移出时不再恢复。

### 源码
-----------------------

```html
<div class="content">
    <div class="ecl-ui-rating" id="rating"></div>
</div>
```

```js
require(['Rating'], function (Rating) {
    var rating = new Rating({
        main: document.getElementById('rating'),
        value: 1,
        onRated: function (e) {
            // console.debug(e);
        }
    }).render();

    // rating.disable();
});
```
{% /filter %}
{% content: script %}
<script>
require(['Rating'], function (Rating) {
    var rating = new Rating({
        main: document.getElementById('rating'),
        value: 1,
        onRated: function (e) {
            // console.debug(e);
        }
    }).render();

    // rating.disable();
});
</script>