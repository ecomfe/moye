{% target: Button(master=base) %}


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
        start: '2015-07-09-12-00-00',
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
        start: '2015-07-09-12-00-00',
        end: '2015-08-31-00-00-00'
    })
    .render();
});
</script>


{%/filter%}
