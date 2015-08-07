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
        main: '#Count1',
        start: new Date(2015,7,9,12,0,0),
        end: new Date(2015,8,31,0,0,0),
        skin: 'default',
        output: 'WEEK-DAY-HOUT-MINUTE-SECOND' 
    })
    .render();
});
```

`Count`是一个工具控件, 用来完成倒计时的功能.

`Count`的主要参数是`end`, 用以指定`Count`结束的时间. `start`用以指定`Count`开始计算的时间，是可选项.
`start`和`end`是Date类型的参数，格式为new Date([arguments list]).

使用`main`属性来指定`Count`的显示位置.`main`是一个`jQuery`可以接受的`css selector`.

<div id="Count1"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        main: '#Count1',
        start: new Date(2015,7,9,12,0,0),
        end: new Date(2015,8,31,0,0,0),
        skin: 'default',
        output: 'WEEK-DAY-HOUT-MINUTE-SECOND' 
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
        main: '#Count2',
        end: new Date(2015,8,31,0,0,0),
        skin: 'default',
        output: 'WEEK-DAY-HOUT-MINUTE-SECOND' 
    })
    .render();
});
```




省略`start`将以客户端当前时间作为倒计时开始计算的时间


<div id="Count2"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        main: '#Count2',
        end: new Date(2015,8,31,0,0,0),
        skin: 'default',
        output: 'WEEK-DAY-HOUT-MINUTE-SECOND' 
    })
    .render();
});
</script>








`Count`的其他可选参数有`isWeek`, 用以指定`Count`是否计算星期, `isDay`, 用以指定`Count`是否计算天. `isSecond`用以指定`Count`是否计算秒.

时和分是必计算项，不可自定义.

```html
<div id="Count3"></div>
```

```js
require(['ui/Count'], function (Count) {
    new Count({
        main: '#Count3',
        end: new Date(2015,8,31,0,0,0),
        isWeek: false,
        isDay: true,
        isSecond: true,
        skin: 'default',
        output: 'WEEK-DAY-HOUT-MINUTE-SECOND' 
    })
    .render();
});
```

示例：不计算星期

<div id="Count3"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        main: '#Count3',
        end: new Date(2015,8,31,0,0,0),
        isWeek: false,
        isDay: true,
        isSecond: true,
        skin: 'default',
        output: 'WEEK-DAY-HOUT-MINUTE-SECOND' 
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
        main: '#Count4',
        end: new Date(2015,8,31,0,0,0),
        isDay: true,
        isSecond: false,
        skin: 'default',
        output: 'WEEK-DAY-HOUT-MINUTE-SECOND' 
    })
    .render();
});
```

示例：不计算秒

<div id="Count4"></div>

<script>
require(['ui/Count'], function (Count) {
    new Count({
        main: '#Count4',
        end: new Date(2015,8,31,0,0,0),
        isDay: true,
        isSecond: false,
        skin: 'default',
        output: 'WEEK-DAY-HOUT-MINUTE-SECOND' 
    })
    .render();
});
</script>
{%/filter%}
