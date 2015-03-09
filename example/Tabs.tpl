{% target: Tabs(master=base) %}
{% content: style %}
<link rel="stylesheet" href="../src/css/Tabs.less">
<style>
.content {
  margin: 20px 0;
}

.markdown .ui-tabs {
    width: auto;
}

.markdown h3 {
    padding-top: 20px;
    border-bottom: 2px solid #275cea;
}


</style>
{% content: content %}
{% filter: markdown %}

# Tabs 选项卡
{%/filter%}

<!-- **********************************************************************
                            例子：正常模式
*********************************************************************** -->

{% filter: markdown %}

### 正常模式
点击标签可以切换

> 可以通过阻止`change`事件对象的默认行为来阻止切换标签

```js
require(['ui/Tabs', 'ui/plugin/TabsBar'], function (Tabs) {

    var tab = new Tabs({
        main: document.getElementById('tabs1'),
        // mode: 'click',  // 默认为click
        plugins: ['TabsBar']
    }).render();

    tab.on('change', function (e) {
        if (e.activeIndex === 3) {
            e.preventDefault();
        }
    });

});
```

{%/filter%}

<div class="content">
    <div id="tabs1" class="ui-tabs">

        <ul class="ui-tabs-wrapper">
            <li class="ui-tabs-item ui-tabs-item-first" data-index="0">CSS控件</li>
            <li class="ui-tabs-item ui-tabs-item-active" data-index="1">UI控件拆分</li>
            <li class="ui-tabs-item" data-index="2">UI栅格化设计</li>
            <li class="ui-tabs-item  ui-tabs-item-last" data-index="3">新UI设计规范</li>
        </ul>
    </div>
</div>


<script>
require(['ui/Tabs', 'ui/plugin/TabsBar'], function (Tabs) {

    var tab = new Tabs({
        main: document.getElementById('tabs1'),
        // mode: 'click',  // 默认为click
        // plugins: ['TabsBar']
    }).render();

    tab.on('change', function (e) {
        if (e.activeIndex === 3) {
            e.preventDefault();
        }
    });

});
</script>




<!-- **********************************************************************
                            例子：hover切换元素
*********************************************************************** -->
{% filter: markdown %}

### hover切换元素

```js
require(['ui/Tabs', 'ui/plugin/TabsBar'], function (Tabs) {

    var tab = new Tabs({
        main: document.getElementById('tabs2'),
        plugins: ['TabsBar'],
        mode: 'hover'
    }).render();
});
```


{%/filter%}


<div class="content">
    <div id="tabs2" class="ui-tabs">
        <div class="ui-tabs-bar"></div>
        <ul class="ui-tabs-wrapper">
            <li class="ui-tabs-item ui-tabs-item-first" data-index="0">CSS控件</li>
            <li class="ui-tabs-item ui-tabs-item-active" data-index="1">UI控件拆分</li>
            <li class="ui-tabs-item" data-index="2">UI栅格化设计</li>
            <li class="ui-tabs-item  ui-tabs-item-last" data-index="3">新UI设计规范</li>
        </ul>
    </div>
</div>


<script>
require(['ui/Tabs', 'ui/plugin/TabsBar'], function (Tabs) {

    var tab = new Tabs({
        main: document.getElementById('tabs2'),
        plugins: ['TabsBar'],
        mode: 'hover'
    }).render();
});
</script>


<!-- **********************************************************************
                            例子：自动切换
*********************************************************************** -->
{% filter: markdown %}

### 自动切换

```js
require(['ui/Tabs', 'ui/plugin/TabsBar'], function (Tabs) {

    var tab = new Tabs({
        main: document.getElementById('tabs3'),
        plugins: ['TabsBar'],
        mode: 'auto'
    }).render();
});
```


{%/filter%}


<div class="content">
    <div id="tabs3" class="ui-tabs">
        <div class="ui-tabs-bar"></div>
        <ul class="ui-tabs-wrapper">
            <li class="ui-tabs-item ui-tabs-item-first" data-index="0">CSS控件</li>
            <li class="ui-tabs-item ui-tabs-item-active" data-index="1">UI控件拆分</li>
            <li class="ui-tabs-item" data-index="2">UI栅格化设计</li>
            <li class="ui-tabs-item  ui-tabs-item-last" data-index="3">新UI设计规范</li>
        </ul>
    </div>
</div>


<script>
require(['ui/Tabs', 'ui/plugin/TabsBar'], function (Tabs) {

    var tab = new Tabs({
        main: document.getElementById('tabs3'),
        plugins: ['TabsBar'],
        mode: 'auto'
    }).render();
});
</script>




