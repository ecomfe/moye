{% target: select(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Select.less" >
{% content: content %}
{% filter: markdown %}
# Select

### DEMO
-----------------------

{% /filter %}


<div class="content">
  <div id='content_left'>
    <div class="result-op" srcid="16873" id="1" mu="http://baike.baidu.com/view/1758.htm" data-op="{'y':'FD9FFD6B'}">
      <div>
        筛选： 
        <a href="#" class="ecl-ui-sel-target"><b>商圈</b><i></i></a><a href="#" class="ecl-ui-sel-target"><b>价格</b><i></i></a><a href="#" class="ecl-ui-sel-target"><b>星级</b><i></i></a><a href="#" class="ecl-ui-sel-target"><b>品牌</b><i></i></a> <input class="ecl-ui-sel-target" value="直辖市">
        <button class="reset">reset</button>
        <button class="disable">disable</button>
        <button class="enable">enable</button>
      </div>
    </div>
  </div>

  <p class="ecl-ui-sel c-clearfix">
    <a href="#" data-value="0">不限</a>
    <a href="#" data-value="1">中关村、上地</a>
    <a href="#" data-value="3">公主坟商圈</a>
    <a href="#" data-value="4">劲松潘家园</a>
    <a href="#" data-value="2">亚运村</a>
    <a href="#" data-value="5">北京南站商圈超长</a>
  </p>
   
  <p class="ecl-ui-sel">
    <a href="#" data-value="0">不限</a>
    <a href="#" data-value="1">200元以下</a>
    <a href="#" data-value="2">200元-300元</a>
    <a href="#" data-value="3">300元-500元</a>
    <a href="#" data-value="4">500元以上</a>
  </p>
      
  <p class="ecl-ui-sel">
    <a href="#" data-value="0">不限</a>
    <a href="#" data-value="1">经济型</a>
    <a href="#" data-value="2">二星级/普通</a>
    <a href="#" data-value="3">三星级/舒适</a>
    <a href="#" data-value="4">四星级/高档</a>
    <a href="#" data-value="5">五星级豪华</a>
  </p>

  <p class="ecl-ui-sel">
    <a href="#" data-value="0">不限</a>
    <a href="#" data-value="1">7天连锁</a>
    <a href="#" data-value="2">如家快捷</a>
    <a href="#" data-value="3">汉庭酒店</a>
    <a href="#" data-value="4">99连锁</a>
  </p>
</div>

{% filter: markdown %}

### 源码
-----------------------

```html
<div id='content_left'>
  <div class="result-op" srcid="16873" id="1" mu="http://baike.baidu.com/view/1758.htm" data-op="{'y':'FD9FFD6B'}">
    <div>
      筛选： 
      <a href="#" class="ecl-ui-sel-target"><b>商圈</b><i></i></a><a href="#" class="ecl-ui-sel-target"><b>价格</b><i></i></a><a href="#" class="ecl-ui-sel-target"><b>星级</b><i></i></a><a href="#" class="ecl-ui-sel-target"><b>品牌</b><i></i></a> <input class="ecl-ui-sel-target" value="直辖市">
      <button class="reset">reset</button>
      <button class="disable">disable</button>
      <button class="enable">enable</button>
    </div>
  </div>
</div>


<p class="ecl-ui-sel c-clearfix">
  <a href="#" data-value="0">不限</a>
  <a href="#" data-value="1">中关村、上地</a>
  <a href="#" data-value="3">公主坟商圈</a>
  <a href="#" data-value="4">劲松潘家园</a>
  <a href="#" data-value="2">亚运村</a>
  <a href="#" data-value="5">北京南站商圈超长</a>
</p>

  
<p class="ecl-ui-sel">
  <a href="#" data-value="0">不限</a>
  <a href="#" data-value="1">200元以下</a>
  <a href="#" data-value="2">200元-300元</a>
  <a href="#" data-value="3">300元-500元</a>
  <a href="#" data-value="4">500元以上</a>
</p>
  
  
<p class="ecl-ui-sel">
  <a href="#" data-value="0">不限</a>
  <a href="#" data-value="1">经济型</a>
  <a href="#" data-value="2">二星级/普通</a>
  <a href="#" data-value="3">三星级/舒适</a>
  <a href="#" data-value="4">四星级/高档</a>
  <a href="#" data-value="5">五星级豪华</a>
</p>


<p class="ecl-ui-sel">
  <a href="#" data-value="0">不限</a>
  <a href="#" data-value="1">7天连锁</a>
  <a href="#" data-value="2">如家快捷</a>
  <a href="#" data-value="3">汉庭酒店</a>
  <a href="#" data-value="4">99连锁</a>
</p>

```

```js
require(['lib', 'Select'], function (lib, Select) {

        var mains = Array.prototype.slice.call($('.ecl-ui-sel'), 0);
        var targets = Array.prototype.slice.call($('.ecl-ui-sel-target'), 0);

        var selects = [];

        selects.push(new Select({
            prefix: 'ecl-ui-sel',
            target: targets.pop(),
            datasource: '直辖市, 北京, 上海, 天津, 重庆',
            //valueUseIndex: true,
            maxLength: 8,
            offset: {
              y: -1
            },
            onChange: function (arg) {
              window.console && console.log(arg);
            }          
        }).render());

        $.each(mains, function (i, main) {

          var select = new Select({
            prefix: 'ecl-ui-sel',
            main: mains[i],
            target: targets[i],
            maxLength: 8,
            cols: i < 2 ? 3 : 1,
            offset: {
              y: -1
            },
            onChange: function (arg) {
              window.console && console.log(arg);
            }
          }).render();

          selects.push(select);

        });

        $('.reset').on('click', function () {

          $.each(selects, function (i, select) {
            select.reset();
          });

        });

        $('.disable').on('click', function () {

          $.each(selects, function (i, select) {
            select.disable();
          });

        });

        $('.enable').on('click', function () {

          $.each(selects, function (i, select) {
            select.enable();
          });

        });


    });
```

{% /filter %}

{% content: script %}
<script>
require(['lib', 'Select'], function (lib, Select) {

    var mains = Array.prototype.slice.call($('.ecl-ui-sel'), 0);
    var targets = Array.prototype.slice.call($('.ecl-ui-sel-target'), 0);

    var selects = [];

    selects.push(new Select({
        prefix: 'ecl-ui-sel',
        target: targets.pop(),
        datasource: '直辖市, 北京, 上海, 天津, 重庆',
        //valueUseIndex: true,
        maxLength: 8,
        offset: {
          y: -1
        },
        onChange: function (arg) {
          window.console && console.log(arg);
        }          
    }).render());

    $.each(mains, function (i, main) {

      var select = new Select({
        prefix: 'ecl-ui-sel',
        main: mains[i],
        target: targets[i],
        maxLength: 8,
        cols: i < 2 ? 3 : 1,
        offset: {
          y: -1
        },
        onChange: function (arg) {
          window.console && console.log(arg);
        }
      }).render();

      selects.push(select);

    });

    $('.reset').on('click', function () {

      $.each(selects, function (i, select) {
        select.reset();
      });

    });

    $('.disable').on('click', function () {

      $.each(selects, function (i, select) {
        select.disable();
      });

    });

    $('.enable').on('click', function () {

      $.each(selects, function (i, select) {
        select.enable();
      });

    });


});
</script>