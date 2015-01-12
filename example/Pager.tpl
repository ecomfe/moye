{% target: pager(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Pager.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.mp.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.jinrong.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.jiaoyu.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.jiankang.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.weigou.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.youxi.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.hunqing.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.qiche.less" />
<link rel="stylesheet" href="../src/css/Select.less" />
{% content: content %}
{% filter: markdown %}
# Pager

### 应用于大搜索卡片

示例：

{% /filter %}

<div class="content" style="text-align:center;vertical-align:top;">
    <div id="pager1" class="ecl-ui-pager"></div>
</div>

<script>
require(['ui/Pager'], function (Pager) {
    new Pager({
        main: document.getElementById('pager1'),
        page: 0,
        first: 1,
        total: 5,
        showCount: 10
    })
    .render();
});
</script>

{%filter: markdown%}

源码

```js
require(['ui/Pager'], function (Pager) {
    var pager1 = new Pager({
        main: 'pager1',
        page: 0,
        first: 1,
        total: 10
    })
    .on('change', function (e) {
        this.setPage(e.page);
    })
    .render();
});
```

###应用于中间页

- 金融 ( 皮肤:`mp`, `jinrong` )

{%/filter%}

<div class="content" style="text-align:center;vertical-align:top;">
    <div data-skin="jinrong" class="ecl-ui-pager ecl-ui-mp-pager"></div>
</div>

{%filter: markdown%}

- 教育 ( 皮肤:`mp`, `jiaoyu` )

{%/filter%}

<div class="content" style="text-align:center;vertical-align:top;">
    <div data-skin="jiaoyu" class="ecl-ui-pager ecl-ui-mp-pager"></div>
</div>

{%filter: markdown%}

- 健康 ( 皮肤:`mp`, `jiankang` )

{%/filter%}

<div class="content" style="text-align:center;vertical-align:top;">
    <div data-skin="jiankang" class="ecl-ui-pager ecl-ui-mp-pager"></div>
</div>

{%filter: markdown%}

- 微购 ( 皮肤:`mp`, `weigou` )

{%/filter%}

<div class="content" style="text-align:center;vertical-align:top;">
    <div data-skin="weigou" class="ecl-ui-pager ecl-ui-mp-pager"></div>
</div>

{%filter: markdown%}

- 游戏 ( 皮肤:`mp`, `youxi` )

{%/filter%}

<div class="content" style="text-align:center;vertical-align:top;">
    <div data-skin="youxi" class="ecl-ui-pager ecl-ui-mp-pager"></div>
</div>

{%filter: markdown%}

- 汽车 ( 皮肤:`mp`, `qiche` )

{%/filter%}

<div class="content" style="text-align:center;vertical-align:top;">
    <div data-skin="qiche" class="ecl-ui-pager ecl-ui-mp-pager"></div>
</div>

{%filter: markdown%}

- 婚庆  ( 皮肤:`mp`, `hunqin` )

{%/filter%}

<div class="content" style="text-align:center;vertical-align:top;">
    <div data-skin="hunqing" class="ecl-ui-pager ecl-ui-mp-pager"></div>
</div>

<script>
require(['jquery', 'ui/Pager'], function ($, Pager) {
    $('.ecl-ui-mp-pager').each(function (i, pager) {
        new Pager({
            main: pager,
            page: 0,
            first: 0,
            total: 10,
            padding: 3,
            skin: [pager.getAttribute('data-skin'), 'mp']
        })
        .on('change', function (e) {
            this.setPage(e.page);
        })
        .render();
    });
});
</script>

{% filter: markdown %}

源码

```js
require(['jquery', 'ui/Pager'], function ($, Pager) {
    $('.ecl-ui-mp-pager').each(function (i, pager) {
        new Pager({
            main: pager,
            page: 0,
            first: 1,
            total: 10,
            skin: [pager.getAttribute('data-skin'), 'mp']
        })
        .on('change', function (e) {
            this.setPage(e.page);
        })
        .render();
    });
});
```

### 设置总页数
------------------------

{%/filter%}

<div class="content" style="text-align:center;vertical-align:top;">
    <div id="pager2" class="ecl-ui-pager c-clearfix"></div>
    <select id="page-size">
        <option value="10" selected>10</option>
        <option value="20">20</option>
        <option value="30">30</option>
    </select>
</div>

<script>
require(['ui/Pager'], function (Pager) {
    var pager = new Pager({
        main: $('#pager2'),
        total: 10
    })
    .on('change', function (e) {
        this.setPage(e.page);
    })
    .render();

    $('#page-size').on('change', function (e) {
        pager.setTotal($(this).val());
    });
});
</script>

{%filter: markdown%}

```js
require(['ui/Pager'], function (Pager) {
    var pager = new Pager({
        main: $('#pager2'),
        total: 10
    })
    .on('change', function (e) {
        this.setPage(e.page);
    })
    .render();

    $('#page-size').on('change', function (e) {
        pager.setTotal($(this).val());
    });
});
```

### 全部配置参数
------------------------

| 属性名        |类型        |   说明   |
| :--------    |:--------- | :------ |
| disabled     |boolean    |  控件的不可用状态  |
| main         |HTMLElement|  控件渲染容器  |
| page         |number     |  当前页（第一页从0开始）  |
| first        |number     |  起始页码，默认为0  |
| padding      |number     |  当页数较多时，首尾显示页码的个数  |
| showAlways   |boolean    |  是否一直显示分页控件  |
| showCount    |number     |  当页数较多时，中间显示页码的个数  |
| total        |number     |  总页数  |
| lang         |Object<string, string>|  用于显示上下页的文字  |
| lang.prev    |string     |  上一页显示文字(支持HTML)  |
| lang.next    |string     |  下一页显示文字(支持HTML)  |
| lang.ellipsis|string     |  省略处显示文字(支持HTML)  |

在页面切换的时候可以绑定回调事件`onChange`。

{% /filter %}
