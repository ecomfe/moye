{% target: Radio(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/BoxGroup.less">

{% content: content %}

{% filter: markdown %}
# 单复选框

#### 复选框

```html
<div class="content">复选框1：<div id="checkbox1"></div></div>
```

```js
require(['ui/BoxGroup'], function (BoxGroup) {
  new BoxGroup({
    main: document.getElementById('checkbox1'),
    styleClass: 'checkbox-tick',
    datasource: [
      {value: 0, name: '不限'},
      {value: 1, name: '中关村-上地'},
      {value: 2, name: '亚运村'},
      {value: 3, name: '北京南站商圈超长'}
    ],
    value: [1, 2]
  }).render();
});
```
<div class="content">复选框2：<div id="checkbox1"></div></div>
<script>
require(['ui/BoxGroup'], function (BoxGroup) {
  new BoxGroup({
    main: document.getElementById('checkbox1'),
    styleClass: 'checkbox-tick',
    datasource: [
      {value: 0, name: '不限'},
      {value: 1, name: '中关村-上地'},
      {value: 2, name: '亚运村'},
      {value: 3, name: '北京南站商圈超长'}
    ],
    value: [1, 2]
  }).render();
});
</script>


```html
<div class="content">复选框1：<div id="checkbox2"></div></div>
```

```js
require(['ui/BoxGroup'], function (BoxGroup) {
  new BoxGroup({
    main: document.getElementById('checkbox2'),
    datasource: [
      {value: 0, name: '不限'},
      {value: 1, name: '中关村-上地'},
      {value: 2, name: '亚运村'},
      {value: 3, name: '北京南站商圈超长'}
    ],
    value: [1, 2]
  }).render();
});
```
<div class="content">复选框1：<div id="checkbox2"></div></div>
<script>
require(['ui/BoxGroup'], function (BoxGroup) {
  new BoxGroup({
    main: document.getElementById('checkbox2'),
    datasource: [
      {value: 0, name: '不限'},
      {value: 1, name: '中关村-上地'},
      {value: 2, name: '亚运村'},
      {value: 3, name: '北京南站商圈超长'}
    ],
    value: [1, 2]
  }).render();
});
</script>


#### 单选框

```html
<div class="content">单选框1：<div id="radio1"></div></div>
```

```js
require(['ui/BoxGroup'], function (BoxGroup) {
  new BoxGroup({
    main: document.getElementById('radio1'),
    styleClass: 'radio-point',
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
```
<div class="content">单选框1：<div id="radio1"></div></div>
<script>
require(['ui/BoxGroup'], function (BoxGroup) {
  new BoxGroup({
    main: document.getElementById('radio1'),
    styleClass: 'radio-point',
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
</script>

```html
<div class="content">单选框2：<div id="radio2"></div></div>
```

```js
require(['ui/BoxGroup'], function (BoxGroup) {
  new BoxGroup({
    main: document.getElementById('radio2'),
    datasource: [
      {value: 0, name: '不限'},
      {value: 1, name: '中关村-上地'},
      {value: 2, name: '亚运村'},
      {value: 3, name: '北京南站商圈超长'}
    ],
    value: [1]
  }).render();
});
```
<div class="content">单选框2：<div id="radio2"></div></div>
<script>
require(['ui/BoxGroup'], function (BoxGroup) {
  new BoxGroup({
    main: document.getElementById('radio2'),
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
</script>

{%/filter%}

