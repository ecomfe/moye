title: 按钮 / Button
categories: component
date: 2015-08-04 14:39:02
---

### 按钮

#### 普通青年

<iframe height='138' scrolling='no' src='//codepen.io/jinzhubaofu/embed/PqVWow/?height=138&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/PqVWow/'>PqVWow</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

{% codeblock test lang:js %}
require(['jquery', 'ui/Button'], function ($, Button) {
    new Button({
        main: document.getElementById('button1')
    })
    .render();
});
{% endcodeblock %}


#### 参数配置

{% codeblock configuration lang:js %}
require(['jquery', 'ui/Button'], function ($, Button) {
    new Button({
        main: document.getElementById('button2'),
        width: '100px',
        height: '61.8px',
        text: 'hello world~'
    })
    .render();
});
{% endcodeblock %}

#### 事件绑定

{% codeblock event-binding lang:js %}
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
{% endcodeblock %}

#### 应用于`<a>`标签

{% codeblock link lang:js %}
require(['jquery', 'ui/Button'], function ($, Button) {

    new Button({
        main: document.getElementById('button4')
    })
    .render();

});
{% endcodeblock %}


#### 禁用状态

{% codeblock disable lang:js %}
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
{% endcodeblock %}
