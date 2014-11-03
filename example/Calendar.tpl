{% target: Calendar(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Calendar.less">
<style>
  .line input {
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    padding: 4px 5px;
    height: 16px;
    line-height: 16px;
    margin: 0;
    outline: none;
  }
  
  .line button {
    margin-left: 10px;
  }

  .line {
    margin: 10px 0;
  }
</style>
{% content: content %}

{% filter: markdown %}
# Calendar 日历

## 单独使用
{% /filter%}

<div class="content line">
  预约时间：<input type="text" id="calendar1" value="2014-08-08"/>
</div>

{%filter: markdown%}
```js
require(['ui/Calendar'], function (Calendar) {

  var target = document.getElementById('calendar1');

  new Calendar({

    // 日历控件显示时挂靠的元素
    target: target,

    // triggers用来指定哪些元素被点击时，显示日历控件
    triggers: target,

    // y为年，M为月，d为天，W为星期几，WW带周作前缀
    dateFormat: 'yyyy-MM-dd',

    // 选中值
    value: '2014-08-08',

    // 显示几个月
    // monthes: 3,
    // 一周的开始日，默认为周日
    first: 1,
  
    // 标题中星期显示值
    lang: {
      days: '一,二,三,四,五,六,日'
    }

  })
  // 选取日期的后续处理
  // arg = { value:, week:, date: }
  .on('pick', function (arg) {
    this.target.value = this.format(arg.date);
  })
  .render();

});
```
{%/filter%}

<script>
require(['jquery', 'ui/Calendar'], function ($, Calendar) {

  var target = document.getElementById('calendar1');

  new Calendar({
    target: target,
    triggers: target,
    dateFormat: 'yyyy-MM-dd',
    value: '2014-08-08',
    first: 1,
    lang: {
      days: '一,二,三,四,五,六,日'
    }
  })
  // 选取日期的后续处理
  // arg = { value:, week:, date: }
  .on('pick', function (arg) {
    this.target.value = this.format(arg.date);
  })
  .render();

});
</script>

{% filter: markdown %}

## 多个target共享同一个Calendar组件

下面的两个输入框共享使用同一个Calendar组件。这种模式下需要到Calendar的`beforeShow`事件中手动指定`target`

{% /filter%}

<div class="content">
  <div class="line">
    出发日期：<input type="text" class="calendar-trigger" />
    返程日期：<input type="text" class="calendar-trigger" />
  </div>
</div>

<script>
require(['ui/Calendar'], function (Calendar) {
  var addDays = function (date, days) {
      return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  };

  var now = new Date();
  var begin = [now, addDays(now, 89)];
  var end = [addDays(now, 1), addDays(now, 90)];

  var triggers = $('.calendar-trigger');

  new Calendar({
    // W为星期几，WW带周作前缀
    dateFormat: 'yyyy-MM-dd(WW)',
    // 触发显示日历组件的元素样式
    triggers: 'calendar-trigger'
  })
  // 不指定 target 时，需要在本事件中动态指定
  .on('beforeShow', function (arg) {
    var e = arg.event;
    var target = e.target;

    // 由于是共享组件模式，这里需要手动更新target元素
    // 更新定位及赋值关联的目标 target
    this.setTarget(target);
  })
  // 选取日期的后续处理
  // 如果选择出发日期时返程日期为空，那么填入出发日期的下一天
  // arg = { value:, week:, date: }
  .on('pick', function (arg) {
    var target = this.target;
    if ( target === triggers[0] && triggers[1].value <= target.value) {
        triggers[1].value = this.format(addDays(arg.date, 1));
    }
  })
  .render();
});
</script>

{%filter: markdown%}

源码

```html
出发日期：<input type="text" class="calendar-trigger" />
返程日期：<input type="text" class="calendar-trigger" />
```

```js
require(['ui/Calendar'], function (Calendar) {
  var addDays = function (date, days) {
      return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  };

  var now = new Date();
  var begin = [now, addDays(now, 89)];
  var end = [addDays(now, 1), addDays(now, 90)];

  var triggers = $('.calendar-trigger');

  new Calendar({
    // W为星期几，WW带周作前缀
    dateFormat: 'yyyy-MM-dd(WW)',
    // 触发显示日历组件的元素样式
    triggers: 'calendar-trigger'
  })
  // 不指定 target 时，需要在本事件中动态指定
  .on('beforeShow', function (arg) {
    var e = arg.event;
    var target = e.target;

    // 由于是共享组件模式，这里需要手动更新target元素
    // 更新定位及赋值关联的目标 target
    this.setTarget(target);
  })
  // 选取日期的后续处理
  // 如果选择出发日期时返程日期为空，那么填入出发日期的下一天
  // arg = { value:, week:, date: }
  .on('pick', function (arg) {
    var target = this.target;
    if ( target === triggers[0] && triggers[1].value <= target.value) {
        triggers[1].value = this.format(addDays(arg.date, 1));
    }
  })
  .render();
});
```

## 可选范围

可以通过配置`Calendar`的`range`属性来设定日历的可选范围，或者可以通过`setRange`方法可动态设定。示例：

{%/filter%}

<div class="content">
  <div class="line">
    出发日期：<input type="text" id="first-range-calendar">（2014年8月至10月可选）
  </div>  
  <div class="line">
    返程日期：<input type="text" id="second-range-calendar">（出发日期之后三天可选）
  </div>
</div>

<script>
require(['ui/Calendar'], function (Calendar) {

  var firstTarget = document.getElementById('first-range-calendar');

  var first = new Calendar({
    value: '2014-08-08',
    target: firstTarget,
    triggers: firstTarget,
    range: {
      begin: '2014-08-01', 
      end: '2014-10-31'
    }
  })
  .on('pick', function (arg) {
    this.value = arg.value;
    secondTarget.value = '';
  })
  .render();

  var secondTarget = document.getElementById('second-range-calendar');

  var second = new Calendar({
    target: secondTarget,
    triggers: secondTarget
  })
  .on('beforeShow', function (arg) {
    var begin = this.from(first.value);
    var end = new Date(begin);

    begin.setDate(begin.getDate() + 1);
    end.setDate(end.getDate() + 3);

    this.value = begin;
    this.setRange({
      begin: this.format(begin),
      end: this.format(end)
    });

  })
  .render();

});
</script>

{%filter: markdown%}

源码

```html
<div class="content">
  <div class="line">
    出发日期：<input type="text" id="first-range-calendar">（2014年8月至10月可选）
  </div>  
  <div class="line">
    返程日期：<input type="text" id="second-range-calendar">（出发日期之后三天可选）
  </div>
</div>
```

```js
require(['ui/Calendar'], function (Calendar) {

  var firstTarget = document.getElementById('first-range-calendar');

  var first = new Calendar({
    value: '2014-08-08',
    target: firstTarget,
    triggers: firstTarget,
    range: {
      begin: '2014-08-01', 
      end: '2014-10-31'
    }
  })
  .on('pick', function (arg) {
    this.value = arg.value;
    secondTarget.value = '';
  })
  .render();

  var secondTarget = document.getElementById('second-range-calendar');

  var second = new Calendar({
    target: secondTarget,
    triggers: secondTarget
  })
  .on('beforeShow', function (arg) {
    var begin = this.from(first.value);
    var end = new Date(begin);

    begin.setDate(begin.getDate() + 1);
    end.setDate(end.getDate() + 3);

    this.setRange({
      begin: this.format(begin),
      end: this.format(end)
    });

  })
  .render();

});

```
## 特殊日期

可以通过process参数来处理任意特殊日期的显示值或样式。示例:

{%/filter%}

<div class="content">
  <div class="line">
    带有节日的日历组件：<input type="text" value="2014-10-01" id="festival-calendar">
  </div>
</div>

<script>
require(['ui/Calendar'], function (Calendar) {

  var target = document.getElementById('festival-calendar');

  new Calendar({

    target: target,

    triggers: target,

    value: '2014-10-01',

    // 处理节日
    process: function (el, classList, dateString) {
      if ( dateString.indexOf('-10-01') !== -1 ) {
        // 改变文字显示，你也可以通过push一个class到classList 以便改为预设的class
        el.innerHTML = '国庆';
      }
    }

  })
  .on('pick', function (arg) {
    this.target.value = this.fomart(arg.date);
  })
  .render();
});
</script>

{%filter: markdown%}

源码：

```js
require(['ui/Calendar'], function (Calendar) {

  var target = document.getElementById('festival-calendar');

  new Calendar({

    // 定位元素
    target: target,

    // 触发显示元素
    triggers: target,

    // 值
    value: '2014-10-01',

    // 处理节日
    process: function (el, classList, dateString) {
      if ( dateString.indexOf('-10-01') !== -1 ) {
        // 改变文字显示，你也可以通过push一个class到classList 以便改为预设的class
        el.innerHTML = '国庆';
      }
    }

  })
  .on('pick', function (arg) {
    this.target.value = this.fomart(arg.date);
  })
  .render();
});
```

## 动态triggers

可以通过指定Calendar的`liveTriggers`属性来指定某个元素，它的子元素中凡是带有`triggers`样式的被点击时可触发日历的展现。也就是说，由js生成新生成的子元素也可以触发。效果如下：

{%/filter%}

<div class="content">
  <div id="live-holder" class="line">
    <input type="text" id="calendar-live-trigger" class="calendar-live-trigger" />
    <button type="button" class="calendar-live-trigger">click</button>
  </div>
  <button type="button" id="create-live-trigger">create button</button>
</div>

<script>
require(['jquery', 'ui/Calendar'], function ($, Calendar) {

  new Calendar({
    triggers: 'calendar-live-trigger',
    liveTriggers: document.getElementById('live-holder'),
    target: document.getElementById('calendar-live-trigger')
  }).render();

  $('#create-live-trigger').on('click', function () {
    $('<button>')
      .addClass('calendar-live-trigger')
      .html('新按钮')
      .appendTo('#live-holder');
  });

});
</script>

{%filter: markdown%}

> 如果使用了`liveTriggers`，那么要求`triggers`必须为`string`，指定触发元素的样式。

源码

```html
<div class="content">
  <div id="live-holder" class="line">
    <input type="text" id="calendar-live-trigger" class="calendar-live-trigger" />
    <button type="button" class="calendar-live-trigger">click</button>
  </div>
  <button type="button" id="create-live-trigger">create button</button>
</div>
```

```js
require(['jquery', 'ui/Calendar'], function ($, Calendar) {

  new Calendar({
    triggers: 'calendar-live-trigger',
    liveTriggers: document.getElementById('live-holder'),
    target: document.getElementById('calendar-live-trigger')
  }).render();

  $('#create-live-trigger').on('click', function () {
    $('<button>')
      .addClass('calendar-live-trigger')
      .html('新按钮')
      .appendTo('#live-holder');
  });

});
```

{%/filter%}
