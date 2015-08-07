{% target: Tab(master=base) %}
{% content: style %}
<link rel="stylesheet" href="../src/css/Tab.less">
<style>
.content {
  margin: 20px 0;
}

.markdown .ui-tab {
    width: auto;
}

.markdown h3 {
    padding-top: 20px;
    border-bottom: 2px solid #275cea;
}


</style>
{% content: content %}
{% filter: markdown %}

# Tab 选项卡
{%/filter%}

<!-- **********************************************************************
                            例子：正常模式
*********************************************************************** -->

{% filter: markdown %}

### 正常模式
点击标签可以切换

> 可以通过阻止`change`事件对象的默认行为来阻止切换标签

```js
require(['ui/Tab', 'ui/plugin/TabBar'], function (Tab) {

    var tab = new Tab({
        main: document.getElementById('tab1'),
        // mode: 'click',  // 默认为click
        plugins: ['TabBar']
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
    <div id="tab1" class="ui-tab">
        <ul class="ui-tab-wrapper">
            <li class="ui-tab-item ui-tab-item-first ui-tab-item-active" data-index="0" data-panel="#panel1">CSS控件</li>
            <li class="ui-tab-item" data-index="1" data-panel="#panel2">UI控件拆分</li>
            <li class="ui-tab-item" data-index="2" data-panel="#panel3">UI栅格化设计</li>
            <li class="ui-tab-item  ui-tab-item-last" data-index="3" data-panel="#panel4">新UI设计规范</li>
        </ul>
    </div>
    <div id="panel1" style="width: 100px;height: 100px; background-color: green; display: block"></div>
    <div id="panel2" style="width: 100px;height: 100px; background-color: blue; display: none"></div>
    <div id="panel3" style="width: 100px;height: 100px; background-color: red; display: none"></div>
    <div id="panel4" style="width: 100px;height: 100px; background-color: yellow; display: none"></div>
</div>


<script>
require(['ui/Tab', 'ui/plugin/TabBar'], function (Tab) {

    var tab = new Tab({
        main: document.getElementById('tab1'),
        // mode: 'click',  // 默认为click
        // plugins: ['TabBar']
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
require(['ui/Tab', 'ui/plugin/TabBar'], function (Tab) {

    var tab = new Tab({
        main: document.getElementById('tab2'),
        plugins: ['TabBar'],
        mode: 'hover'
    }).render();
});
```


{%/filter%}


<div class="content">
    <div id="tab2" class="ui-tab">
        <div class="ui-tab-bar"></div>
        <ul class="ui-tab-wrapper">
            <li class="ui-tab-item ui-tab-item-first" data-index="0">CSS控件</li>
            <li class="ui-tab-item ui-tab-item-active" data-index="1">UI控件拆分</li>
            <li class="ui-tab-item" data-index="2">UI栅格化设计</li>
            <li class="ui-tab-item  ui-tab-item-last" data-index="3">新UI设计规范</li>
        </ul>
    </div>
</div>


<script>
require(['ui/Tab', 'ui/plugin/TabBar'], function (Tab) {

    var tab = new Tab({
        main: document.getElementById('tab2'),
        plugins: ['TabBar'],
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
require(['ui/Tab', 'ui/plugin/TabBar'], function (Tab) {

    var tab = new Tab({
        main: document.getElementById('tab3'),
        plugins: ['TabBar'],
        mode: 'auto'
    }).render();
});
```


{%/filter%}


<div class="content">
    <div id="tab3" class="ui-tab">
        <div class="ui-tab-bar"></div>
        <ul class="ui-tab-wrapper">
            <li class="ui-tab-item ui-tab-item-first" data-index="0">CSS控件</li>
            <li class="ui-tab-item ui-tab-item-active" data-index="1">UI控件拆分</li>
            <li class="ui-tab-item" data-index="2">UI栅格化设计</li>
            <li class="ui-tab-item  ui-tab-item-last" data-index="3">新UI设计规范</li>
        </ul>
    </div>
</div>


<script>
require(['ui/Tab', 'ui/plugin/TabBar'], function (Tab) {

    var tab = new Tab({
        main: document.getElementById('tab3'),
        plugins: ['TabBar'],
        mode: 'auto'
    }).render();
});
</script>




