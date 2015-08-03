{% target: Button(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Count.less">
{% content: content %}

{% filter: markdown %}


### Count

```html
<div id="Count1"></div>
```

```js
require(['ui/Count'], function (Count) {
    new Count({
        target: '#Count1',
        start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00'
    })
    .render();
});
```

`Count`是一个工具控件, 用来完成倒计时的功能.

`Count`的主要参数是`end`, 用以指定`Count`结束的时间. `start`用以指定`Count`开始计算的时间，是可选项.

使用`target`属性来指定`Count`的显示位置.`target`是一个`jQuery`可以接受的`css selector`.

<div id="Count1"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        target: '#Count1',
        start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00'
    })
    .render();
});
</script>



```html
<div id="Count2"></div>
```

```js
require(['ui/Count'], function (Count) {
    new Count({
        target: '#Count2',
        start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00'
    })
    .render();
});
```




省略`start`将以客户端当前时间作为倒计时开始计算的时间


<div id="Count2"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        target: '#Count2',
        end: '2015-08-31-00-00-00'
    })
    .render();
});
</script>




```html
<div id="Count3"></div>
```

```js
require(['ui/Count'], function (Count) {
    new Count({
        target: '#Count3',
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

<div id="Count3"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        target: '#Count3',
        // start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00',
        isDay: false,
        isSecond: true
    })
    .render();
});
</script>




```html
<div id="Count4"></div>
```

```js
require(['ui/Count'], function (Count) {
    new Count({
        target: '#Count4',
        // start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00',
        isDay: true,
        isSecond: false
    })
    .render();
});
```

示例：不计算秒

<div id="Count4"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        target: '#Count4',
        // start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00',
        isDay: true,
        isSecond: false
    })
    .render();
});
</script>
{%/filter%}
