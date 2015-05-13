{% target: Pager(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Pager.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.card.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.jinrong.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.jiaoyu.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.jiankang.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.weigou.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.youxi.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.hunqing.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.qiche.less" />
<link rel="stylesheet" href="../src/css/theme/Pager.koubei.less" />
<link rel="stylesheet" href="../src/css/Select.less" />
<style>
    .content {
        text-align: center;
    }

    #pager-normal .ui-pager-item {
        color: #999;
        border: 0;
        text-decoration: none;
        font-size: 16px;
    }

    #pager-normal .ui-pager-item:hover {
        color: #1796f9;
        background: #fff;
    }

    #pager-normal .ui-pager-prev,
    #pager-normal .ui-pager-next {
        border: 1px solid #1796f9;
        color: #1796f9;
        line-height: 14px;
        padding: 3px;
        height: 12px;
        font-size: 12px;
    }

    #pager-normal .ui-pager-disabled {
        color: #999;
        border-color: #999;
    }

    #pager-normal .ui-pager-disabled:hover {
        color: #999;
    }

    #pager-normal .ui-pager-current {
        color: #1796f9;
    }


</style>
{% content: content %}

{% filter: markdown %}

# Pager

### 应用于中间页

```js
$('[data-skin]').each(function (i, pager) {
    new Pager({
        main: pager,
        page: 0,
        first: 0,
        total: 10,
        padding: 3,
        skin: [pager.getAttribute('data-skin')]
    })
    .render();
});
```

- 金融 ( 皮肤:`jinrong` )

<div class="content">
    <div data-skin="jinrong" class="ui-pager"></div>
</div>

- 教育 ( 皮肤:`jiaoyu` )


<div class="content">
    <div data-skin="jiaoyu" class="ui-pager"></div>
</div>

- 健康 ( 皮肤:`jiankang` )


<div class="content">
    <div data-skin="jiankang" class="ui-pager"></div>
</div>


- 微购 ( 皮肤:`weigou` )

<div class="content">
    <div data-skin="weigou" class="ui-pager"></div>
</div>

- 游戏 ( 皮肤:`youxi` )

<div class="content">
    <div data-skin="youxi" class="ui-pager"></div>
</div>

- 汽车 ( 皮肤:`qiche` )

<div class="content">
    <div data-skin="qiche" class="ui-pager"></div>
</div>

- 婚庆  ( 皮肤:`hunqin` )

<div class="content">
    <div data-skin="hunqing" class="ui-pager"></div>
</div>

- 口碑  ( 皮肤:`koubei` )

<div class="content">
    <div data-skin="koubei" class="ui-pager"></div>
</div>

<script>
require(['jquery', 'ui/Pager'], function ($, Pager) {
    $('[data-skin]').each(function (i, pager) {
        new Pager({
            main: pager,
            page: 0,
            first: 0,
            total: 10,
            padding: 3,
            skin: [pager.getAttribute('data-skin')]
        })
        .render();
    });
});
</script>

### 设置总页数

```js
require(['ui/Pager'], function (Pager) {
    var pager = new Pager({
        main: $('#pager2'),
        total: 10
    })
    .render();

    var Select = new Select({
        main: document.getElementById('page-size'),
        value: 10,
        datasource: [{
            name: '10',
            value: 10
        }, {
            name: '20',
            value: 20
        }, {
            name: '50',
            value: 50
        }]
    }).render().on('change', function (e) {
        pager.setTotal(e.value);
    });
});
```


<div class="content">
    <div id="pager2" class="ui-pager"></div>
    <div id="page-size" class="ui-select"></div>
</div>

<script>
require(['ui/Pager', 'ui/Select'], function (Pager, Select) {
    var pager = new Pager({
        main: $('#pager2'),
        total: 10
    })
    .render();

    new Select({
        main: document.getElementById('page-size'),
        value: 10,
        datasource: [{
            name: '10',
            value: 10
        }, {
            name: '20',
            value: 20
        }, {
            name: '50',
            value: 50
        }]
    })
    .render()
    .on('change', function (e) {
        pager.setTotal(e.value);
    });

});
</script>



### 应用于大搜索卡片

示例：


<div class="content">
    <div id="pager1" class="ui-pager"></div>
</div>

<script>
require(['ui/Pager'], function (Pager) {
    new Pager({
        main: document.getElementById('pager1'),
        page: 1,
        first: 1,
        total: 5,
        showCount: 10
    })
    .render();
});
</script>


```js
// 分页是链接
require(['ui/Pager'], function (Pager) {
    new Pager({
        main: document.getElementById('pager-url'),
        page: 1,
        first: 1,
        total: 5,
        showCount: 10,
        anchor: '/example/Pager.tpl'
    })
    .render();
});
```

### 分页是链接

示例：


<div class="content">
    <div id="pager-url" class="ui-pager"></div>
</div>

<script>
    require(['ui/Pager'], function (Pager) {
        new Pager({
            main: document.getElementById('pager-url'),
            page: 1,
            first: 1,
            total: 10,
            showCount: 5,
            anchor: '/example/Pager.tpl'
        })
        .render();
    });
</script>



```js
// 普通分页活用
require(['ui/Pager'], function (Pager) {
    new Pager({
        main: document.getElementById('pager-normal'),
        page: 1,
        first: 1,
        total: 5,
        showCount: 10,
        lang: {
            prev: '◀',
            next: '▶'
        },
        getItemHTML: function (page, part) {
            var className = this.getItemClassName(Array.prototype.slice.call(arguments, 1).concat('item'));
            var item = this.lang[part] != null ? this.lang[part] : '●';

            return ''
                + '<a href="#" data-page="' + page + '" '
                +    'class="' + className + '">'
                +    item
                + '</a>';
        }
    })
    .render();
});
```

### 普通分页活用

示例：


<div class="content">
    <div id="pager-normal" class="ui-pager"></div>
</div>

<script>
    require(['ui/Pager'], function (Pager) {
        new Pager({
            main: document.getElementById('pager-normal'),
            page: 1,
            first: 1,
            total: 5,
            showCount: 10,
            lang: {
                prev: '◀',
                next: '▶'
            },
            getPageItemHTML: function (page, part) {
                var className = this.getItemClassName(Array.prototype.slice.call(arguments, 1).concat('item'));

                return ''
                    + '<a href="#" data-page="' + page + '" '
                    +    'class="' + className + '">'
                    +    '●'
                    + '</a>';
            }
        })
        .render();
    });
</script>



```js
// 精简版分页
require(['ui/Pager'], function (Pager) {
    new Pager({
        main: document.getElementById('pager-simple'),
        page: 1,
        first: 1,
        total: 5,
        showCount: 10,
        mode: 'simple'
    })
    .render();
});
```

### 精简版分页

示例：


<div class="content">
    <div id="pager-simple" class="ui-pager"></div>
</div>

<script>
    require(['ui/Pager'], function (Pager) {
        new Pager({
            main: document.getElementById('pager-simple'),
            page: 1,
            first: 1,
            total: 5,
            showCount: 10,
            mode: 'simple'
        })
        .render();
    });
</script>


```js
// 精简版分页灵活运用
require(['ui/Pager'], function (Pager) {
    new Pager({
        main: document.getElementById('pager-simple'),
        page: 0,
        first: 1,
        total: 5,
        showCount: 10,
        mode: 'simple',
        getPageItemHTML: function (page) {
            return ' 当前第<input value="'
                + page
                + '" style="width: 20px;text-align:center" />'
                + '页，共' + this.total + '页 ';
        }
    })
    .render();
});
```

### 精简版分页灵活运用

示例：


<div class="content">
    <div id="pager-simple-change" class="ui-pager"></div>
</div>

<script>
    require(['ui/Pager'], function (Pager) {
        new Pager({
            main: document.getElementById('pager-simple-change'),
            page: 1,
            first: 1,
            total: 5,
            showCount: 10,
            mode: 'simple',
            getPageItemHTML: function (page) {
                return ' 当前第<input value="'
                        + page
                        + '" style="width: 20px;text-align:center" />'
                        + '页，共' + this.total + '页 ';
            }
        })
        .render();
    });
</script>


### 分页getPage和setPage使用

示例：


<div class="content">
    <div id="pager-set" class="ui-pager"></div>
    <div class="pager-op">
        <a id="pager-set-prev">上一页</a>
        <a id="pager-set-next">下一页</a>
    </div>
</div>

<script>
    require(['ui/Pager'], function (Pager) {
        var pagerTest = new Pager({
            main: document.getElementById('pager-set'),
            page: 1,
            first: 1,
            total: 5,
            showCount: 10,
            mode: 'simple',
            getPageItemHTML: function (page) {
                return ' 当前第<input value="'
                        + page
                        + '" style="width: 20px;text-align:center" />'
                        + '页，共' + this.total + '页 ';
            }
        })
        .render();

        $('#pager-set-prev').click(function () {
            var page = pagerTest.getPage();

            // pagerTest.setPage(page - 1);
            pagerTest.set('page', page - 1);
        });

        $('#pager-set-next').click(function () {
            var page = pagerTest.getPage();

            pagerTest.setPage(page + 1);
        });
    });
</script>



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
| anchor       |string     |  跳转链接  |
| mode         |string     |  分页类型（normal/simple）  |
| getPageItemHTML    |function|  分页item字符串  |
| lang         |Object<string, string>|  用于显示上下页的文字  |
| lang.prev    |string     |  上一页显示文字(支持HTML)  |
| lang.next    |string     |  下一页显示文字(支持HTML)  |
| lang.ellipsis|string     |  省略处显示文字(支持HTML)  |

在页面切换的时候可以绑定回调事件`onChange`。

{% /filter %}
