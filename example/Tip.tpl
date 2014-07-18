{% target: Tip(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Tip.less">
<style>
.tooltips {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    width: 98px;
    height: 98px;
    vertical-align: top;
    line-height: 98px;
    text-align: center;
    background-color: #418CE5;
    border: 1px dashed #c1d5ea;
    margin-left: 40px;
    margin-bottom: 20px;
}

.tooltips-first {
    margin-left: 0;
}
.content i {
    position: absolute;
}
#example {
    position: relative;
    height: 400px;
}
#cube {
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -100px;
    width: 200px;
    height: 200px;
    line-height: 200px;
    background: #418CE5;
    z-index: 2
}
</style>
{% content: content %}

{% filter: markdown %}
# Tip 打分组件

### DEMO
-----------------------

{% /filter%}
<div class="content"></div>
{% filter: markdown %}

### 源码
-----------------------

```html
<div class="content">
    <div class="ecl-ui-rating" id="rating"></div>
</div>
```

```js
var tip = new Tip({
    arrow: '1',
    hideDelay: 1,
    offset: { x: 5, y: 5},
    onBeforeShow: function () {
      this.title = Math.random();
    }
}).render();
```

### 方位关系

{% /filter %}
<div id="example">
    <div id="cube" class="tooltips" data-tooltips="lc" onclick="">单击切换模式:lc</div>
</div>

{% content: script %}
<script>
require(['Tip'], function (Tip) {

    var $ = require('jquery');
    var content = $('.content');

    for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 6; j++) {
            $('<div>')
                .addClass(['tooltips', j === 0 ? 'tooltips-first' : ''].join(' '))
                .text('自动定位')
                .appendTo(content);
        }
    }

    var tip = new Tip({
        arrow: '1',
        hideDelay: 1,
        offset: { x: 0, y: 5},
        onBeforeShow: function () {
          this.title = Math.random();
        }
    }).render();

    var arrow = {
        tl: 'tc', 
        tc: 'tr', 
        tr: 'rt', 
        rt: 'rc', 
        rc: 'rb', 
        rb: 'br', 
        br: 'bc', 
        bc: 'bl', 
        bl: 'lb', 
        lb: 'lc', 
        lc: 'lt', 
        lt: 'tl'
    };

    $('#cube').on('click', function () {
        var $this = $(this);
        var direction = arrow[$this.attr('data-tooltips')];
        $this.attr('data-tooltips', direction).text('单击切换模式:' + direction);
    });

});

</script>