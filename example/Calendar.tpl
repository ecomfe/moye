{% target: Calendar(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Calendar.less">
{% content: content %}

{% filter: markdown %}

## 日历

```js
require(['ui/Calendar'], function (Calendar) {

  new Calendar({
    main: document.getElementById('calendar1')
  }).render();

});
```

<div class="content line">
  预约时间：<input type="text" id="calendar1" value="2014-08-08"/>
</div>


<script>
require(['ui/Calendar'], function (Calendar) {

  new Calendar({
    main: document.getElementById('calendar1')
  }).render();

});
</script>

## 显示多个月份供选择

```html
预约时间：<input type="text" id="calendar2" value="2014-08-08"/>
```

```js
require(['ui/Calendar'], function (Calendar) {

  new Calendar({
    main: document.getElementById('calendar2'),
    months: 3
  }).render();

});
```

<div class="content line">
  预约时间：<input type="text" id="calendar2" value="2014-08-08"/>
</div>

<script>
require(['ui/Calendar'], function (Calendar) {

  new Calendar({
    main: document.getElementById('calendar2'),
    months: 3
  }).render();

});
</script>


## 可选范围

> 此处请注意, 如果设定的值不在可选的范围内, 值被会被清空.

```html
<div class="content">
  预约时间：<input type="text" id="calendar3" value="2014-08-08"/>
</div>
```

```js
require(['ui/Calendar'], function (Calendar) {

  new Calendar({
    main: document.getElementById('calendar3'),
    months: 2,
    range: {
      begin: '2015-01-01',
      end: new Date()
    }
  }).render();

});

```

可以通过配置`Calendar`的`range`属性来设定日历的可选范围，或者可以通过`setRange`方法可动态设定。示例：

<div class="content line">
  预约时间：<input type="text" id="calendar3" value="2014-08-08"/>
</div>

<script>
require(['ui/Calendar'], function (Calendar) {

  new Calendar({
    main: document.getElementById('calendar3'),
    months: 2,
    range: {
      begin: '2015-01-01',
      end: new Date()
    }
  }).render();

});
</script>

## 特殊日期

```html
价格日历：<input type="text" value="2014-10-01" id="price-calendar">
```

```js
require(['ui/Calendar'], function (Calendar) {

  var begin = new Date();
  var end = new Date(begin);

  end.setMonth(end.getMonth() + 3);

  new Calendar({
    main: document.getElementById('price-calendar'),
    months: 3,
    range: {
      begin: begin,
      end: end
    },
    process: function (data) {
      if (data.value === '2015-02-19') {
        data.content = '春节';
      }
      return data;
    }
  }).render();

});
```

可以通过process参数来处理任意特殊日期的显示值或样式。可用于处理节日特殊样式等等情况, 示例:

<div class="content">
  <div class="line">
    价格日历：<input type="text" value="2015-02-18" id="price-calendar">
  </div>
</div>

<style>
  .spring {
    background-color: #f00 !important;
    color: #fff !important;
  }
</style>

<script>
require(['ui/Calendar'], function (Calendar) {

  new Calendar({
    main: document.getElementById('price-calendar'),
    months: 3,
    range: {
      begin: '2015-01-01',
      end: '2015-03-31'
    },
    process: function (data) {
      if (data.value === '2015-02-19') {
        data.content = '春节';
        data.classList.push('spring');
      }
      return data;
    }
  }).render();

});
</script>
{%/filter%}
