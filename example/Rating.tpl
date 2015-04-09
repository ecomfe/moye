{% target: Rating(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Rating.less">
{% content: content %}

{% filter: markdown %}
# Rating 打分组件

### DEMO

```html
<div class="content">
    等级：<span id="level"></span>
    <div id="rating"></div>
    <div class="btn-bar">
        <button id="disable">disable()</button>
        <button id="enable">enable()</button>
        <button id="minus">-</button>
        <button id="add">+</button>
    </div>
</div>
```

```js
require(['ui/Rating'], function (Rating) {
    var levels = ['低', '较低', '中', '较高', '高'];
    var g = function (id) {
        return document.getElementById(id);
    };
    var value = 2;
    var level = g('level');

    level.innerHTML = levels[value - 1];

    var rating = new Rating({
        main: document.getElementById('rating'),
        value: value,
        onChange: function (e) {
            value = e.value;
            level.innerHTML = levels[e.value - 1];
            // console.log(e.value);
        },
        onHover: function (e) {
            level.innerHTML = levels[e.value - 1];
            // console.log(e.value);
        }
    }).render();
    
    g('disable').onclick = function () {
        rating.disable();
    }
    g('enable').onclick = function () {
        rating.enable();
    }
    g('minus').onclick = function () {
        if (value > 0) {
            // 此处setValue()不触发change事件
            rating.setValue(--value);
        }
    }
    g('add').onclick = function () {
        if (value < 5) {
            // 此处setValue()触发change事件
            rating.setValue(++value, true);
        }
    }
});
```

<div class="content">
    等级：<span id="level"></span>
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
    var levels = ['低', '较低', '中', '较高', '高'];
    var g = function (id) {
        return document.getElementById(id);
    };
    var value = 2;
    var level = g('level');

    level.innerHTML = levels[value - 1];

    var rating = new Rating({
        main: g('rating'),
        value: value,
        onChange: function (e) {
            value = e.value;
            level.innerHTML = levels[e.value - 1];
            // console.log(e.value);
        },
        onHover: function (e) {
            level.innerHTML = levels[e.value - 1];
            // console.log(e.value);
        }
    }).render();
    
    g('disable').onclick = function () {
        rating.disable();
    }
    g('enable').onclick = function () {
        rating.enable();
    }
    g('minus').onclick = function () {
        if (value > 0) {
            // 此处setValue()不触发change事件
            rating.setValue(--value);
        }
    }
    g('add').onclick = function () {
        if (value < 5) {
            // 此处setValue()触发change事件
            rating.setValue(++value, true);
        }
    }
});
</script>

### 说明

当鼠标移动到星星上时，星星会暂时地指向鼠标所在的星星；此时移出星星，那么组件会恢复到原有值。只有在星星点击一下，值才会被固定下来，移出时不再恢复。

{% /filter %}
