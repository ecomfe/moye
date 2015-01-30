{% target: select(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Select.less" >
{% content: content %}
{% filter: markdown %}

# Select

```html
<div>筛选：<div id="cycle" class="ui-select"></div></div>
```

```js
new Select({
  main: document.getElementById('cycle'),
  datasource: [
    {value: 0, name: '不限'},
    {value: 1, name: '中关村、上地'},
    {value: 2, name: '公主坟商圈'},
    {value: 3, name: '劲松潘家园'},
    {value: 4, name: '亚运村'},
    {value: 5, name: '北京南站商圈超长'}
  ]
}).render();
```

<div class="content">
  <div id='content_left'>
      <div>筛选：<div id="cycle" class="ui-select"></div></div>
  </div>
</div>

<script>
require(['ui/Select'], function (Select) {

  new Select({
    main: document.getElementById('cycle'),
    datasource: [
      {value: 0, name: '不限'},
      {value: 1, name: '中关村、上地'},
      {value: 2, name: '公主坟商圈'},
      {value: 3, name: '劲松潘家园'},
      {value: 4, name: '亚运村'},
      {value: 5, name: '北京南站商圈超长'}
    ]
  }).render();

});
</script>

### 鼠标hover触发展开

```html
<div class="content">
  <div id='content_left'>
      <div>筛选：<div id="hover" class="ui-select"></div></div>
  </div>
</div>
```

<div class="content">
  <div id='content_left'>
      <div>筛选：<div id="hover" class="ui-select"></div></div>
  </div>
</div>
<script>
require(['ui/Select'], function (Select) {

  new Select({
    main: document.getElementById('hover'),
    mode: 'over',
    datasource: [
      {value: 0, name: '不限'},
      {value: 1, name: '中关村、上地'},
      {value: 2, name: '公主坟商圈'},
      {value: 3, name: '劲松潘家园'},
      {value: 4, name: '亚运村'},
      {value: 5, name: '北京南站商圈超长'}
    ]
  }).render();

});
</script>

{% /filter %}
