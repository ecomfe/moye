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
</style>
{% content: content %}

{% filter: markdown %}

# Tabs 选项卡

### 正常模式

```html
<ul id="tabs" class="ui-tabs"></ul>
```

```js
new Tabs({
    main: document.getElementById('tabs'),
    activeIndex: 0,
    mode: 'mouseover',
    tabs: [
        {title: 'CSS控件'},
        {title: 'UI控件拆分'},
        {title: 'UI栅格化设计'},
        {title: '如何使用'},
        {title: '新UI设计规范'},
        {title: '再点你也切换不了'}
    ]
})
.on('change', function (e) {
    if (e.activeIndex === 5) {
        e.preventDefault();
    }
})
.render();
```

点击标签可以切换

> 可以通过阻止`change`事件对象的默认行为来阻止切换标签

{%/filter%}

<div class="content">
    <ul id="tabs" class="ui-tabs"></ul>
</div>

{%filter: markdown%}

<script>
require(['ui/Tabs'], function (Tabs) {

    new Tabs({
        main: document.getElementById('tabs'),
        activeIndex: 0,
        tabs: [
            {title: 'CSS控件'},
            {title: 'UI控件拆分'},
            {title: 'UI栅格化设计'},
            {title: '如何使用'},
            {title: '新UI设计规范'},
            {title: '再点你也切换不了'}
        ]
    })
    .on('change', function (e) {
        if (e.activeIndex === 5) {
            e.preventDefault();
        }
    })
    .render();

});
</script>

## 鼠标移到标签上时切换

> 设置参数`mode`为`mouseover`

```html
<div class="content">
    <ul id="mouseover-tabs" class="ui-tabs"></ul>
</div>
```

```js
new Tabs({
    main: document.getElementById('mouseover-tabs'),
    activeIndex: 0,
    mode: 'mouseover',
    tabs: [
        {title: 'CSS控件'},
        {title: 'UI控件拆分'},
        {title: 'UI栅格化设计'},
        {title: '如何使用'},
        {title: '新UI设计规范'}
    ]
})
.render();
```

{%/filter%}

<div class="content">
    <ul id="mouseover-tabs" class="ui-tabs"></ul>
</div>

<script>
require(['ui/Tabs'], function (Tabs) {

    new Tabs({
        main: document.getElementById('mouseover-tabs'),
        activeIndex: 0,
        mode: 'mouseover',
        tabs: [
            {title: 'CSS控件'},
            {title: 'UI控件拆分'},
            {title: 'UI栅格化设计'},
            {title: '如何使用'},
            {title: '新UI设计规范'}
        ]
    })
    .render();

});
</script>
