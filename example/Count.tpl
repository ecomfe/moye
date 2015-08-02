{% target: Button(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Count.less">
{% content: content %}

{% filter: markdown %}


### Count

```html
<div class="content"></div>
```

```js
require(['ui/Count'], function (Count) {
    new Count({
        target: '.content',
        // start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00'
    })
    .render();
});
```

`Count`是一个工具控件, 用来完成倒计时的功能.

`Count`的主要参数是`end`, 用以指定`Count`结束的时间. `start`用以指定`Count`开始计算的时间，是可选项.

使用`target`属性来指定`Count`的显示位置.`triggers`是一个`jQuery`可以接受的`css selector`.

<div class="content"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        target: '.content',
        // start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00'
    })
    .render();
});
</script>





```html
<div class="content-noday"></div>
```

```js
require(['ui/Count'], function (Count) {
    new Count({
        target: '.content',
        // start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00',
        isDay: false,
        isSecond: true
    })
    .render();
});
```


`Count`的其他可选参数有`isDay`, 用以指定`Count`是否计算天. `isSecond`用以指定`Count`是否计算秒.

时和分是必计算项，不可自定义.

示例：不计算天

<div class="content-noday"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        target: '.content-noday',
        // start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00',
        isDay: false,
        isSecond: true
    })
    .render();
});
</script>




```html
<div class="content-nosecond"></div>
```

```js
require(['ui/Count'], function (Count) {
    new Count({
        target: '.content-nosecond',
        // start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00',
        isDay: true,
        isSecond: false
    })
    .render();
});
```

示例：不计算秒

<div class="content-nosecond"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        target: '.content-nosecond',
        // start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00',
        isDay: true,
        isSecond: false
    })
    .render();
});
</script>
{%/filter%}
