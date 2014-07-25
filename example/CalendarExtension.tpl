{% target: CalenderExtension(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/CalendarExtension.less">
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

# CalenderExtension 扩展版日历

扩展版日历可以快速选择年份与月份

### DEMO
-----------------------

{% /filter%}
<div class="content">
  <div class="line">
    <input type="text" class="calendar-trigger" />
    <button type="button" class="calendar-trigger">click</button>
    <input type="text" class="calendar-trigger" />
    <button type="button" class="calendar-trigger">click</button>
  </div>

  <div class="line live-holder">
    <input type="text" class="calendar-target calendar-trigger1" />
    <button type="button" class="calendar-trigger1">click</button>
  </div>

  <button type="button" class="create-button">create button</button>
  <div class="embed-calendar-holder"></div>
</div>

{% filter: markdown %}
### 源码
-----------------------

```html
<div class="line">
  <input type="text" class="calendar-trigger" />
  <button type="button" class="calendar-trigger">click</button>
</div>
<div class="line">
  <input type="text" class="calendar-trigger" />
  <button type="button" class="calendar-trigger">click</button>
</div>

<div class="line live-holder">
  <input type="text" class="calendar-target calendar-trigger1" />
  <button type="button" class="calendar-trigger1">click</button>
</div>

<button type="button" class="create-button">create button</button>
<div class="embed-calendar-holder"></div>
```

```js
require(['CalendarExtension'], function (CalendarExtension) {

  var $ = require('jquery');

  var addDays = function (date, days) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  };

  var now = new Date();
  var begin = [now, addDays(now, 89)];
  var end = [addDays(now, 1), addDays(now, 90)];

  var triggers = $('.calendar-trigger');

  new CalendarExtension({
    prefix: 'ecl-ui-cal',
    // W为星期几，WW带周作前缀
    dateFormat: 'yyyy-MM-dd(WW)',
    triggers: triggers.toArray(),
    //value: '2012-03-30',
    // 显示几个月
    //monthes: 3,
    // 一周的开始日，默认为周日
    first: 1,
    lang: {
      days: '一,二,三,四,五,六,日'
    },
    // range: {
    //   begin: '2013-03-25',
    //   end: '2013-07-25'
    // },
    // 如果要处理节日
    process: function (el, classList, dateString) {
      var festivals = {
        '2013-03-08': '三八',
        '2013-04-04': '清明',
        '2013-05-01': '劳动',
        '2013-10-01': '国庆'
      };

      if ( festivals[dateString] ) {
        // 改变文字显示，你也可以通过push一个class到classList 以便改为预设的class
        el.innerHTML = festivals[dateString];
      }
    },
    // 不指定 target 时，需要在本事件中动态指定
    onBeforeShow: function (arg) {
      var e = arg.event;
      var target = e.target;

      // 更新定位及赋值关联的目标 target
      target = target.tagName === 'INPUT' && target.type === 'text'
               ? target
               : $(target).prev().get(0);

      this.setTarget(target);

      if ( target === triggers[0] ) {
          // 设定开始的范围
          this.setRange({begin: begin[0], end: begin[1]});
      }
      else {
          if (triggers[0].value) {
            var date = this.from(triggers[0].value);
            // 在开始日期的后一天
            end[0] = addDays(date, 1);
            // 开始日期的30天结束
            end[1] = addDays(date, 30);
          }

          // 设定结束的范围
          this.setRange({begin: end[0], end: end[1]});
      }
    },
    // 选取日期的后续处理
    // arg = { value:, week:, date: }
    onPick: function (arg) {
      var target = this.target;
      if ( target === triggers[0] && triggers[2].value <= target.value) {
          triggers[2].value = this.format(addDays(arg.date, 1));
      }
    }
  }).render();

  new CalendarExtension({
    prefix: 'ecl-ui-cal',
    main: $('.embed-calendar-holder')[0],
    triggers: 'calendar-trigger1',
    liveTriggers: $('.live-holder')[0],
    target: $('.calendar-target')[0],
    onHide: function () {
      console.log('hided');
    }
  }).render();

  $('.create-button').on('click', function () {
    var btn = document.createElement('button')
    btn.className = 'calendar-trigger1';
    btn.innerHTML = 'new btn';
    $('.live-holder')[0].appendChild(btn);
  });

});
```
{% /filter %}
{% content: script %}
<script>
require(['ui/CalendarExtension'], function (CalendarExtension) {

  var $ = require('jquery');

  var addDays = function (date, days) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  };

  var now = new Date();
  var begin = [now, addDays(now, 89)];
  var end = [addDays(now, 1), addDays(now, 90)];

  var triggers = $('.calendar-trigger');

  new CalendarExtension({
    prefix: 'ecl-ui-cal',
    // W为星期几，WW带周作前缀
    dateFormat: 'yyyy-MM-dd(WW)',
    triggers: triggers.toArray(),
    //value: '2012-03-30',
    // 显示几个月
    //monthes: 3,
    // 一周的开始日，默认为周日
    first: 1,
    lang: {
      days: '一,二,三,四,五,六,日'
    },
    // range: {
    //   begin: '2013-03-25',
    //   end: '2013-07-25'
    // },
    // 如果要处理节日
    process: function (el, classList, dateString) {
      var festivals = {
        '2013-03-08': '三八',
        '2013-04-04': '清明',
        '2013-05-01': '劳动',
        '2013-10-01': '国庆'
      };

      if ( festivals[dateString] ) {
        // 改变文字显示，你也可以通过push一个class到classList 以便改为预设的class
        el.innerHTML = festivals[dateString];
      }
    },
    // 不指定 target 时，需要在本事件中动态指定
    onBeforeShow: function (arg) {
      var e = arg.event;
      var target = e.target;

      // 更新定位及赋值关联的目标 target
      target = target.tagName === 'INPUT' && target.type === 'text'
               ? target
               : $(target).prev().get(0);

      this.setTarget(target);

      if ( target === triggers[0] ) {
          // 设定开始的范围
          this.setRange({begin: begin[0], end: begin[1]});
      }
      else {
          if (triggers[0].value) {
            var date = this.from(triggers[0].value);
            // 在开始日期的后一天
            end[0] = addDays(date, 1);
            // 开始日期的30天结束
            end[1] = addDays(date, 30);
          }

          // 设定结束的范围
          this.setRange({begin: end[0], end: end[1]});
      }
    },
    // 选取日期的后续处理
    // arg = { value:, week:, date: }
    onPick: function (arg) {
      var target = this.target;
      if ( target === triggers[0] && triggers[2].value <= target.value) {
          triggers[2].value = this.format(addDays(arg.date, 1));
      }
    }
  }).render();

  new CalendarExtension({
    prefix: 'ecl-ui-cal',
    main: $('.embed-calendar-holder')[0],
    triggers: 'calendar-trigger1',
    liveTriggers: $('.live-holder')[0],
    target: $('.calendar-target')[0],
    onHide: function () {
      console.log('hided');
    }
  }).render();

  $('.create-button').on('click', function () {
    var btn = document.createElement('button')
    btn.className = 'calendar-trigger1';
    btn.innerHTML = 'new btn';
    $('.live-holder')[0].appendChild(btn);
  });

});
</script>