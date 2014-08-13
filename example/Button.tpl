{% target: Button(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Button.less">

{% content: content %}

{% filter: markdown %}
# 按钮

#### 普通青年

{% /filter%}
<div class="content">
    <button id="button1">ok</button>
</div>
<script>
require(['jquery', 'ui/Button'], function ($, Button) {
    new Button({
        main: document.getElementById('button1')
    })
    .render();
});
</script>

{%filter:markdown%}

```js
require(['jquery', 'ui/Button'], function ($, Button) {
    new Button({
        main: document.getElementById('button1')
    })
    .render();
});
```

#### 参数配置
{%/filter%}

<div class="content">
    <button id="button2">ok</button>
</div>
<script>
require(['jquery', 'ui/Button'], function ($, Button) {
    new Button({
        main: document.getElementById('button2'),
        width: '100px',
        height: '61.8px',
        text: 'hello world~'
    })
    .render();
});
</script>

{%filter:markdown%}

```js
require(['jquery', 'ui/Button'], function ($, Button) {
    new Button({
        main: document.getElementById('button2'),
        width: '100px',
        height: '61.8px',
        text: 'hello world~'
    })
    .render();
});
```

#### 事件绑定
{%/filter%}

<div class="content">
    <button id="button3">ok</button>
</div>
<script>
require(['jquery', 'ui/Button'], function ($, Button) {

    var i = 0;

    new Button({
        main: document.getElementById('button3'),
        text: '赞'
    })
    .render()
    .on('click', function (e) {
        this.setText('+' + (++i));
    });

});
</script>

{%filter:markdown%}

```js
require(['jquery', 'ui/Button'], function ($, Button) {

    var i = 0;

    new Button({
        main: document.getElementById('button3'),
        text: '赞'
    })
    .render()
    .on('click', function (e) {
        this.setText('+' + (++i));
    });

});
```

#### 应用于`<a>`标签
{%/filter%}

<div class="content">
    <a id="button4" href="http://www.baidu.com" target="_blank">其实，我是一个链接~</a>
</div>
<script>
require(['jquery', 'ui/Button'], function ($, Button) {

    new Button({
        main: document.getElementById('button4')
    })
    .render();

});
</script>

{%filter:markdown%}
```js
require(['jquery', 'ui/Button'], function ($, Button) {

    new Button({
        main: document.getElementById('button4')
    })
    .render();

});
```
#### 禁用状态
{%/filter%}

<div class="content">
    <button id="button5" type="submit">不许动</button>
</div>
<script>
require(['jquery', 'ui/Button'], function ($, Button) {

    new Button({
        main: document.getElementById('button5'),
        disabled: true
    })
    .render()
    .on('click', function () {
        console.log('如果这里被调用就出错了哟~');
    });

});
</script>
{% filter: markdown %}
```js
require(['jquery', 'ui/Button'], function ($, Button) {

    new Button({
        main: document.getElementById('button5'),
        disabled: true
    })
    .render()
    .on('click', function () {
        console.log('如果这里被调用就出错了哟~');
    });

});
```
{% /filter %}
