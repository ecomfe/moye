{% target: Rating(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Rating.less">
{% content: content %}

{% filter: markdown %}
# Rating 打分组件

### DEMO

```html
<div class="content">
    <div id="rating"></div>
</div>
```

```js
require(['ui/Rating'], function (Rating) {
    var rating = new Rating({
        main: document.getElementById('rating'),
        value: 2,
        onChange: function (e) {
            // console.log(e.value);
        },
        onHover: function (e) {
            // console.log(e.value);
        }
    }).render();

    // rating.disable();
});
```

<div class="content">
    <div id="rating"></div>
    <div class="btn-bar">
        <button id="disable">disable()</button>
        <button id="enable">enable()</button>
        <button id="minus">-</button>
        <button id="add">+</button>
    </div>
</div>
<script>
require(['ui/Rating'], function (Rating) {
    var rating = new Rating({
        main: document.getElementById('rating'),
        value: 2,
        onChange: function (e) {
            // console.log(e.value);
        },
        onHover: function (e) {
            // console.log(e.value);
        }
    }).render();
    var value = 2;
    var g = function (id) {
        return document.getElementById(id);
    };
    g('disable').onclick = function () {
        rating.disable();
    }
    g('enable').onclick = function () {
        rating.enable();
    }
    g('minus').onclick = function () {
        if (value > 0) {
            rating.setValue(--value);
        }
    }
    g('add').onclick = function () {
        if (value < 5) {
            rating.setValue(++value, true);
        }
    }
});
</script>

### 说明

当鼠标移动到星星上时，星星会暂时地指向鼠标所在的星星；此时移出星星，那么组件会恢复到原有值。只有在星星点击一下，值才会被固定下来，移出时不再恢复。

{% /filter %}
