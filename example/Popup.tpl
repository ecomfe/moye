{% target: Button(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Popup.less">

{% content: content %}

{% filter: markdown %}


### Popup

```html
<div class="content">
    <input type="text" id="input-target">
</div>
```

```js
require(['ui/Popup'], function (Popup) {
    var input = document.getElementById('input-target');
    new Popup({
        target: input,
        triggers: input,
        content: 'this is popup content'
    })
    .render();
});
```

`Popup`是一个工具控件, 用来完成浮出层的功能. 经常作为其他控件的子控件组合使用, 一般不直接使用.

`Popup`的主要参数是`triggers`, 用以指定触发`Popup`浮层. `triggers`是一个`jQuery`可以接受的`css selector`.

使用`target`属性来指定`Popup`的显示位置.

<div class="content">
    <input type="text" id="input-target">
</div>

<script>
require(['ui/Popup'], function (Popup) {
    var input = document.getElementById('input-target');
    new Popup({
        target: input,
        triggers: input,
        content: 'this is popup content'
    })
    .render();
});
</script>

<style>
.popup-target {
    margin-top: 10px;
    padding: 0 10px;
    height: 25px;
    line-height: 25px;
    color: #000;
    background-color: #009F86;
}
</style>

```html
<div class="content">
    <ul>
        <li class="popup-target">
            <span>aaaaaaaaaa</span>
        </li>
        <li class="popup-target">
            <span>bbbbbbbbbb</span>
        </li>
        <li class="popup-target">
            <span>cccccccccc</span>
        </li>
        <li class="popup-target">
            <span>dddddddddd</span>
        </li>
        <li class="popup-target">
            <span>eeeeeeeeee</span>
        </li>
        <li class="popup-target">
            <span>ffffffffff</span>
        </li>
        <li class="popup-target">
            <span>jjjjjjjjjj</span>
        </li>
    </ul>
</div>
```

```js
require(['ui/Popup'], function (Popup) {
    new Popup({
        triggers: '.popup-target',
        content: 'this is popup content',
        dir: 'rc'
    })
    .render();
});
```

如果不指定`target`属性, 那么`Popup`会挂靠到当前的触发元素上


<div class="content">
    <ul>
        <li class="popup-target">
            <span>aaaaaaaaaa</span>
        </li>
        <li class="popup-target">
            <span>bbbbbbbbbb</span>
        </li>
        <li class="popup-target">
            <span>cccccccccc</span>
        </li>
        <li class="popup-target">
            <span>dddddddddd</span>
        </li>
        <li class="popup-target">
            <span>eeeeeeeeee</span>
        </li>
        <li class="popup-target">
            <span>ffffffffff</span>
        </li>
        <li class="popup-target">
            <span>jjjjjjjjjj</span>
        </li>
    </ul>
</div>

<script>
require(['ui/Popup'], function (Popup) {
    new Popup({
        triggers: '.popup-target',
        content: 'this is popup content',
        dir: 'rc',
        mode: 'over'
    })
    .render();
});
</script>

可以通过指定`dir`参数来调整`Popup`挂靠的方向. 上例中 `dir`设定为`rc`, 表示`Popup`挂靠到目标元素的右侧中间位置.

```html
<div class="content">
    <button id="add">添加一项</button>
    <ul id="live-trigger-container">
        <li class="popup-target">
            <span>aaaaaaaaaa</span>
        </li>
        <li class="popup-target">
            <span>bbbbbbbbbb</span>
        </li>
        <li class="popup-target">
            <span>cccccccccc</span>
        </li>
        <li class="popup-target">
            <span>dddddddddd</span>
        </li>
        <li class="popup-target">
            <span>eeeeeeeeee</span>
        </li>
        <li class="popup-target">
            <span>ffffffffff</span>
        </li>
        <li class="popup-target">
            <span>jjjjjjjjjj</span>
        </li>
    </ul>
</div>
```

```js
require(['ui/Popup', 'jquery'], function (Popup, $) {
    new Popup({
        triggers: '.popup-target',
        liveTriggers: '#live-trigger-container',
        content: 'this is popup content',
        dir: 'rc',
        mode: 'over'
    })
    .render();

    $('#add').on('click', function () {
        $('<li>')
            .addClass('popup-target')
            .html(Math.random())
            .appendTo('#live-trigger-container');
    });

});
```

<div class="content">
    <button id="add">添加一项</button>
    <ul id="live-trigger-container">
        <li class="popup-target">
            <span>aaaaaaaaaa</span>
        </li>
        <li class="popup-target">
            <span>bbbbbbbbbb</span>
        </li>
        <li class="popup-target">
            <span>cccccccccc</span>
        </li>
        <li class="popup-target">
            <span>dddddddddd</span>
        </li>
        <li class="popup-target">
            <span>eeeeeeeeee</span>
        </li>
        <li class="popup-target">
            <span>ffffffffff</span>
        </li>
        <li class="popup-target">
            <span>jjjjjjjjjj</span>
        </li>
    </ul>
</div>

<script>
require(['ui/Popup', 'jquery'], function (Popup, $) {
    new Popup({
        triggers: '.popup-target',
        liveTriggers: '#live-trigger-container',
        content: 'this is popup content',
        dir: 'rc',
        mode: 'over'
    })
    .render();

    $('#add').on('click', function () {
        $('<li>').addClass('popup-target').html(Math.random()).appendTo('#live-trigger-container');
    });

});
</script>

可以指定`liveTriggers`来限定一个容器, 在限容器内的所有`triggers`都可以触发`Popup`, 即使它们是在初始化之后被创建的.

{%/filter%}
