{% target: City(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/City.less">
{% content: content %}

{% filter: markdown %}
# City 城市选择器

### 常规用法

```html
<label for="city">请选择城市</label>
<input id="city" type="text" />
```

```js
require(['ui/City'], function (City) {

    var $ = require('jquery');

    $('.city').each(function () {

        new City({
            name: 'city',
            main: this,
            readOnly: true,
            value: '北京'
        }).render();

    });

});
```

特性:

1. 带有初始值
2. 只能选择城市, 不可手工输入
3. 使用默认城市列表
4. 可指定`name`值, 可在直接`form`中使用

<div class="content line">
    <label for="city">请选择城市</label>
    <input id="city" type="text" class="city" />
</div>

<script>
require(['ui/City'], function (City) {

    var $ = require('jquery');

    $('.city').each(function () {

        new City({
            name: 'city',
            main: this,
            readOnly: true,
            value: '北京'
        }).render();

    });

});
</script>

### 自定义城市

```html
<div class="line">
    <label for="custom-city">请选择城市</label>
    <input id="custom-city" type="text" class="custom-city" />
</div>
```

```js
require(['ui/City'], function (City) {

    var $ = require('jquery');

    $('.custom-city').each(function () {

        var city = new City({
            main: this,
            // 需要隐藏的城市列表，半角逗号分隔
            hideCities: '北京,上海',
        });

        city.fill(''
            + '其他|'
            + '香港,澳门,台湾'
        );

        city.render();

    });

});
```

特性:
1. 屏蔽指定的城市: 北京, 上海
2. 在默认填充的城市列表后, 添加自定义的城市


<div class="content line">
    <label for="custom-city">请选择城市</label>
    <input id="custom-city" type="text" class="custom-city" />
</div>
<script>
require(['ui/City'], function (City) {

    var $ = require('jquery');

    $('.custom-city').each(function () {

        var city = new City({
            main: this,
            // 需要隐藏的城市列表，半角逗号分隔
            hideCities: '北京,上海',
        });

        city.fill(''
            + '其他|'
            + '香港,澳门,台湾'
        );

        city.render();

    });

});
</script>

### 不使用默认城市

```html
<label for="no-default-city">请选择城市</label>
<input id="no-default-city" type="text" class="no-default-city" />
```

```js
require(['ui/City'], function (City) {

    var $ = require('jquery');

    $('.no-default-city').each(function () {

        var city = new City({
            main: this,
            autoFill: false
        });

        city.fill(''
            + '其他|'
            + '香港,澳门,台湾'
        );

        city.render();

    });

});
```

<div class="content line">
    <label for="no-default-city">请选择城市</label>
    <input id="no-default-city" type="text" class="no-default-city" />
</div>
<script>
require(['ui/City'], function (City) {

    var $ = require('jquery');

    $('.no-default-city').each(function () {

        var city = new City({
            main: this,
            autoFill: false
        });

        city.fill(''
            + '其他|'
            + '香港,澳门,台湾'
        );

        city.render();

    });

});
</script>
{% /filter %}
