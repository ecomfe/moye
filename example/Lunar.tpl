{% target: Lunar(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Lunar.less" />
{% content: content %}
{% filter: markdown %}

# Lunar 农历日历

### DEMO
-----------------------

{% /filter%}
<div class="content">
  <div class="ecl-ui-lunar c-clearfix" id="lunar"></div>
</div>
{% filter: markdown %}

### 源码
-----------------------

```html
<div class="ecl-ui-lunar c-clearfix" id="lunar"></div>
```

```js
require(['ui/Lunar'], function (Lunar) {

  var lunar = new Lunar({
    // first: 1,
    // lang: {
    //   days: '一,二,三,四,五,六,日'
    // },
    value: '2010-02-17',
    main: document.getElementById('lunar'),
    process: function (el, klass, value, inRange) {
      if (~value.indexOf('02-14')) {
        var div = document.createElement('div');
        div.innerHTML = '今天要买花';
        el.appendChild(div);
      }
    }
  }).render();

});
```
{% /filter %}
{% content: script %}
<script>
require(['ui/Lunar'], function (Lunar) {

  var lunar = new Lunar({
    // first: 1,
    // lang: {
    //   days: '一,二,三,四,五,六,日'
    // },
    value: '2014-07-17',
    main: document.getElementById('lunar'),
    process: function (el, klass, value, inRange) {
      if (~value.indexOf('02-14')) {
        var div = document.createElement('div');
        div.innerHTML = '今天要买花';
        el.appendChild(div);
      }
    }
  });

  lunar.render();

});
</script>