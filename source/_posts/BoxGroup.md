title: 单复选框 / BoxGroup
name: BoxGroup
categories:
  - component
date: 2015-08-10 19:14:47
---

### 复选框

#### 普通复选框

<iframe height='268' scrolling='no' src='//codepen.io/cxtom/embed/yNwpOq/?height=268&theme-id=17729&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/cxtom/pen/yNwpOq/'>yNwpOq</a> by chenxiao (<a href='http://codepen.io/cxtom'>@cxtom</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

{% codeblock checkbox lang:js %}
require(['moye/BoxGroup'], function (BoxGroup) {
    new BoxGroup({
    main: document.getElementById('checkbox1'),
    datasource: [
        {value: 0, name: '不限'},
        {value: 1, name: '中关村-上地'},
        {value: 2, name: '亚运村'},
        {value: 3, name: '北京南站商圈超长'}
    ],
    value: [1, 2]
    }).render();
});
{% endcodeblock %}

#### 普通单选框

<iframe height='266' scrolling='no' src='//codepen.io/cxtom/embed/Qboaqx/?height=266&theme-id=17729&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/cxtom/pen/Qboaqx/'>Qboaqx</a> by chenxiao (<a href='http://codepen.io/cxtom'>@cxtom</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

{% codeblock radio lang:js %}
require(['moye/BoxGroup'], function (BoxGroup) {
    new BoxGroup({
    main: document.getElementById('radio1'),
    boxType: 'radio',
    datasource: [
        {value: 0, name: '不限'},
        {value: 1, name: '中关村-上地'},
        {value: 2, name: '亚运村'},
        {value: 3, name: '北京南站商圈超长'}
    ],
    value: [1]
    }).render();
});
{% endcodeblock %}


#### 木有图标的复选框

可以通过重写 getItemHTML 方法，改变每个选项的 HTML 结构

*** 注意 *** 我们约定每一个选项单元最外层的元素必须包含一个统一的 `selector` ， 默认是`[data-role=boxgroup-item]` ， 可以通过修改配置项 `itemSelector` 来修改。

<iframe height='266' scrolling='no' src='//codepen.io/cxtom/embed/jPJvmx/?height=266&theme-id=17729&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/cxtom/pen/jPJvmx/'>jPJvmx</a> by chenxiao (<a href='http://codepen.io/cxtom'>@cxtom</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

{% codeblock checkbox lang:js %}
require(['jquery','moye/BoxGroup'], function ($, BoxGroup) {
    new BoxGroup({
        main: document.getElementById('checkbox2'),
        icons: false,
        activeClass: 'ui-boxgroup-item-checked',
        datasource: [
            {value: 0, name: '不限'},
            {value: 1, name: '中关村-上地'},
            {value: 2, name: '亚运村'},
            {value: 3, name: '北京南站商圈超长'}
        ],
        value: [1],
        getItemHTML: function (state, item) {

            var classNames = this.helper.getPartClasses('item');
            var index = $.inArray(item, this.datasource);

            if (state) {
                classNames.push(this.activeClass);
            }

            if (index === 0) {
                classNames.push('first');
            }
            else if (index === this.datasource.length - 1) {
                classNames.push('last');
            }

            return ''
                + '<label class="' + classNames.join(' ') + '" data-role="boxgroup-item">'
                +     '<input type="' + this.boxType + '" value="' + item.value + '">'
                +     item.name
                + '</label>';

        }
    })
    .render()
    .on('change', function(e) {
        $('#values').html(this.getValue().join('，'));
    });
});
{% endcodeblock %}