{% target: filter(master=base) %}
{% content: style %}
<link rel="stylesheet" href="../src/css/Tabs.less">
<style>
.content {
  margin: 20px 0;
}
.ecl-ui-tabs {
  margin-left: -7px;
}
ul {
  padding: 0;
  margin: 0;
}
</style>
{% content: content %}

{% filter: markdown %}
# Tabs 选项卡

### DEMO
-----------------------

{% /filter%}
<div class="content">
  <ul class="ecl-ui-tabs-labels">
    <li>CSS控件</li>
    <li class="ecl-ui-tabs-selected">UI控件拆分</li>
    <li>UI栅格化设计</li>
    <li>如何使用</li>
    <li>新UI设计规范</li>
    <li>再点你也切换不了</li>
  </ul>  
</div>
{% filter: markdown %}

### 源码
-----------------------

```html
<ul id="tabs" class="ecl-ui-tabs-labels">
  <li>CSS控件</li>
  <li class="ecl-ui-tabs-selected">UI控件拆分</li>
  <li>UI栅格化设计</li>
  <li>如何使用</li>
  <li>新UI设计规范</li>
  <li>再点你也切换不了</li>
</ul>
```

```js
require(['Tabs'], function (Tabs) {

  var tabs = new Tabs({
    main: document.getElementById('tabs'),
    onChange: function (e) {
      //console.log('changed:from %s to %s', e.oldIndex, e.newIndex);
    }
  }).render();

  //console.log(tabs.selectedIndex);

  tabs.onBeforeChange = function (oldIndex, newIndex) {
    if (newIndex === 5) {
      return false;
    }
  };

});
```
{% /filter %}
{% content: script %}
<script>
require(['Tabs'], function (Tabs) {

  var tabs = new Tabs({
    main: document.getElementById('tabs'),
    onChange: function (e) {
      //console.log('changed:from %s to %s', e.oldIndex, e.newIndex);
    }
  }).render();

  //console.log(tabs.selectedIndex);

  tabs.onBeforeChange = function (oldIndex, newIndex) {
    if (newIndex === 5) {
      return false;
    }
  };

});
</script>