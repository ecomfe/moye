{% target: Marquee(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Marquee.less">
<style>
    .ui-marquee {
        margin-left: 20px;
        border: 1px solid #333;
        padding: 10px 0;
    }
</style>
{% content: content %}

{% filter: markdown %}

# 走马灯

#### scroll

- 向左

```js
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee1'),
        behavior: 'scroll'
    })
    .render();
});
```
```html
<div id="marquee1" data-content="这是一句话" class="ui-marquee"></div>
```
<div id="marquee1" data-content="这是一句话" class="ui-marquee"></div>
<script>
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee1'),
        behavior: 'scroll'
    })
    .render();
});
</script>

- 向右

```js
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee2'),
        behavior: 'scroll',
        direction: 'right'
    })
    .render();
});
```
```html
<div id="marquee2" data-content="这是一句话" class="ui-marquee"></div>
```
<div id="marquee2" data-content="这是一句话" class="ui-marquee"></div>
<script>
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee2'),
        behavior: 'scroll',
        direction: 'right'
    })
    .render();
});
</script>

- 向上


```js
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee7'),
        behavior: 'scroll',
        direction: 'up',
        content: '这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话'
    })
    .render();
});
```
```html
<div id="marquee7" data-content="" class="ui-marquee up"></div>
<style>
    .up {
        margin-left: 20px;
        border: 1px solid #333;
        padding: 0 10px;
        height: 200px;
        white-space: normal;
    }
</style>
```
<div id="marquee7" data-content="" class="ui-marquee ui-marquee-vertical"></div>
<style>
    .ui-marquee-vertical {
        margin-left: 20px;
        border: 1px solid #333;
        padding: 0 10px;
        height: 200px;
        white-space: normal;
    }
</style>
<script>
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee7'),
        behavior: 'scroll',
        direction: 'up',
        content: '这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话这是一段话'
    })
    .render();
});
</script>


- 图片

```js
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee5'),
        behavior: 'scroll',
        content: '<img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg">',
        width: 200
    })
    .render();
});
```
```html
<div id="marquee5" class="ui-marquee"></div>
```
<div id="marquee5" class="ui-marquee"></div>
<script>
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee5'),
        behavior: 'scroll',
        content: '<img src="http://pic.hefei.cc/newcms/2012/03/14/13316929274f60057f72733.jpg" width="200">',
        width: 200
    })
    .render();
});
</script>

- 点击开始

```js
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    var marquee = new Marquee({
        main: document.getElementById('marquee6'),
        behavior: 'scroll',
        auto: false,
        hoverable: false
    })
    .render();

    document.getElementById('button1').onclick = function () {
        marquee.start();
    }

    document.getElementById('button2').onclick = function () {
        marquee.stop();
    }
});
```
```html
<div id="marquee6" data-content="这是一句话" class="ui-marquee"></div>
<button>点我开始</button>
```
<div id="marquee6" data-content="这是一句话" class="ui-marquee"></div>
<button id="button1">点我开始</button><button id="button2">点我停止</button>
<script>
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    var marquee = new Marquee({
        main: document.getElementById('marquee6'),
        behavior: 'scroll',
        auto: false,
        hoverable: false
    })
    .render();

    document.getElementById('button1').onclick = function () {
        marquee.start();
    }

    document.getElementById('button2').onclick = function () {
        marquee.stop();
    }
});
</script>


#### continus

- 向左

```js
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee3')
    })
    .render();
});
```
```html
<div id="marquee3" data-content="这是一句话非常长，非常长，非常长，非常长的话！" class="ui-marquee"></div>
```
<div id="marquee3" data-content="这是一句话非常长，非常长，非常长，非常长的话！" class="ui-marquee"></div>
<script>
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee3')
    })
    .render();
});
</script>

- 向右

```js
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee4'),
        direction: 'right'
    })
    .render();
});
```
```html
<div id="marquee4" data-content="这是一句话非常长，非常长，非常长，非常长的话！" class="ui-marquee"></div>
```
<div id="marquee4" data-content="这是一句话非常长，非常长，非常长，非常长的话！" class="ui-marquee"></div>
<script>
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee4'),
        direction: 'right'
    })
    .render();
});
</script>

- 向上


```js
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee8'),
        direction: 'up',
        content: '这是一段话这是一段话这是话这是话这是话这是话这话这是话这是话这话这是话这是话这话这是话这是话这',
        gap: 20
    })
    .render();
});
</script>
```
```html
<div id="marquee8" data-content="" class="ui-marquee up2"></div>
<style>
    .up2 {
        margin-left: 20px;
        border: 1px solid #333;
        padding: 0 10px;
        height: 50px;
        white-space: normal;
    }
</style>
```
<div id="marquee8" data-content="" class="ui-marquee ui-marquee-vertical"></div>
<style>
    .ui-marquee-vertical {
        padding: 0 10px;
        height: 100px;
    }
</style>
<script>
require(['jquery', 'ui/Marquee'], function ($, Marquee) {
    new Marquee({
        main: document.getElementById('marquee8'),
        direction: 'up',
        content: '这是一段话这是一段话这是话这是话这是话这是话这话这是话这是话这话这是话这是话这话这是话这是话这',
        gap: 20
    })
    .render();
});
</script>

{%/filter%}
