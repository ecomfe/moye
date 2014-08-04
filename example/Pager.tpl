{% target: pager(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Pager.less" />
{% content: content %}
{% filter: markdown %}
# Pager

### DEMO
-----------------------

{% /filter %}

<div class="content">
    <div style="text-align:center"><div class="ecl-ui-pager c-clearfix"></div></div>
</div>

<button id="dispose">dispose</button>

{% filter: markdown %}

### 源码
-----------------------

```html
<div style="text-align:center"><div class="ecl-ui-pager c-clearfix"></div></div>
```

```js
require(['lib', 'Pager'], function (lib, Pager) {

    var pager = new Pager({
        main: $('.ecl-ui-pager')[0],
        page: 0,
        first: 1,
        total: 10,
        onChange: function (e) {
          console.log(e);
        }
    });

    pager.on('change', function (e) {
        // load content
        this.setPage(e.page);
        this.render();
    });

    pager.render();
});
```

使用`RequireJS`加载模块`lib`和`Pager`，`lib`是Moye UI基础库，当然还必须加载`Pager`模块。

`Pager`控件的配置项如下：

| 属性名      |     类型 |   说明   |
| :-------- | --------:| :------: |
| disabled    |   boolean |  控件的不可用状态  |
| main    |   string、HTMLElement |  控件渲染容器  |
| page    |   number |  当前页（第一页从0开始）  |
| first    |   number |  起始页码，默认为0  |
| padding    |   number |  当页数较多时，首尾显示页码的个数  |
| showAlways    |   boolean |  是否一直显示分页控件  |
| showCount    |   number |  当页数较多时，中间显示页码的个数  |
| total    |   number |  总页数  |
| prefix    |   string |  控件class前缀，同时将作为main的class之一  |
| disabledClass    |   string |  分页项不用可时的class定义  |
| lang    |   Object<string, string> |  用于显示上下页的文字  |
| lang.prev    |   string |  上一页显示文字(支持HTML)  |
| lang.next    |   string |  下一页显示文字(支持HTML)  |
| lang.ellipsis    |   string |  省略处显示文字(支持HTML)  |

在页面切换的时候可以绑定回调事件`onChange`。

{% /filter %}

{% content: script %}
<script>
require(['lib', 'Pager'], function (lib, Pager) {

    var pager = new Pager({
        main: $('.ecl-ui-pager')[0],
        page: 0,
        first: 1,
        total: 10
    })
    .on('change', function (e) {
        // load content
        this.setPage(e.page);
        this.render();
    })
    .render();

    console.log(pager);

    $('#dispose').on('click', function () {
        pager.dispose();
        console.log(pager);
    });

});
</script>
