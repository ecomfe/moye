{% target: ScrollBar(master=base) %}
{% content: style %}
<link rel="stylesheet" href="../src/css/ScrollBar.less">
<style>
img {
    width: 270px;
    height: 129px;
}
</style>

{% content: content %}
{%filter: markdown%}

# ScrollBar 滚动条

## 示例：纵向滚动条

{%/filter%}
<div class="content">
  <div id="scrollbar" class="ecl-ui-scrollbar ecl-ui-scrollbar-position-mode">
    <div class="ecl-ui-scrollbar-track">
      <i id="ecl-ui-scrollbar-thumb" class="ecl-ui-scrollbar-thumb"></i>
    </div>
    <div class="ecl-ui-scrollbar-panel">
      <div style="background:#CCC">
      <div id="ecl-ui-scrollbar-main" class="ecl-ui-scrollbar-main">
        <div style="background:#CCC">
          <p>猪!你的鼻子有两个孔,感冒时的你还挂着鼻涕牛牛. </p>
          <p>猪!你有着黑漆漆的眼,望呀望呀望也看不到边. </p>
          <p>猪!你的耳朵是那么大,呼扇呼扇也听不到我在骂你傻. </p>
          <p>猪!你的尾巴是卷又卷,原来跑跑跳跳还离不开它 </p>
          <p>哦~~~ </p>
          <p>猪头猪脑猪身猪尾(yi)巴 </p>
          <p>从来不挑食的乖娃娃 </p>
          <p>每天睡到日晒三杆后 </p>
          <p>从不刷牙从不打架 </p>
          <p>猪!你的肚子是那么鼓,一看就知道受不了生活的苦 </p>
          <p>猪!你的皮肤是那么白,上辈子一定投在那富贵人家 </p>
          <p>哦~~~ </p>
          <p>传说你的祖先有八钉耙,算命先生说他命中犯桃花 </p>
          <p>见到漂亮姑娘就嘻嘻哈哈 </p>
          <p>不会脸红不会害怕 </p>
          <p>猪头猪脑猪身猪尾(yi)巴 </p>
          <p>从来不挑食的乖娃娃 </p>
          <p>每天睡到日晒三杆后 </p>
          <p>从不刷牙从不打架哦~~~ </p>
          <p>传说你的祖先有八钉耙,算命先生说他命中犯桃花 </p>
          <p>见到漂亮姑娘就嘻嘻哈哈 </p>
          <p>不会脸红不会害怕 </p>
          <p>你很象她</p>
          <p>从不刷牙从不打架 </p>
          <p>猪!你的肚子是那么鼓,一看就知道受不了生活的苦 </p>
          <p>猪!你的皮肤是那么白,上辈子一定投在那富贵人家 </p>
          <p>哦~~~ </p>
          <p>传说你的祖先有八钉耙,算命先生说他命中犯桃花 </p>
          <p>见到漂亮姑娘就嘻嘻哈哈 </p>
          <p>不会脸红不会害怕 </p>
          <p>猪头猪脑猪身猪尾(yi)巴 </p>
          <p>从来不挑食的乖娃娃 </p>
          <p>每天睡到日晒三杆后 </p>
          <p>从不刷牙从不打架哦~~~ </p>
          <p>传说你的祖先有八钉耙,算命先生说他命中犯桃花 </p>
          <p>见到漂亮姑娘就嘻嘻哈哈 </p>
          <p>不会脸红不会害怕 </p>
          <p>你很象她</p>
        </div>
      </div>
    </div>
  </div>

</div>
<div class="content">
  <button id="scrollToBegin">滚动到开头</button>
  <button id="scrollToEnd">滚动到结尾</button>
  <button id="scrollToMid">滚动到中间</button>
</div>

{%filter:markdown%}
```js
require(['ui/lib', 'ui/ScrollBar', 'jquery'], function (lib, ScrollBar, $) {
  var scrollbar = new ScrollBar({
    main: 'scrollbar',
    disabled: 0,
    mode: 'position'
  })
  scrollbar.render();

  $('#scrollToBegin').on('click', function () {
    scrollbar.scrollTo('begin');
  });

  $('#scrollToEnd').on('click', function () {
    scrollbar.scrollTo('end');
  });

  $('#scrollToMid').on('click', function () {
    scrollbar.scrollTo(0.5);
  });

});
```

## 横向滚动条

{%/filter%}

<div class="content">
  <div id="ecl-ui-scrollbar-horizontal" class="ecl-ui-scrollbar ecl-ui-scrollbar-horizontal">
    <div class="ecl-ui-scrollbar-panel">
      <div id="ecl-ui-scrollbar-main1" style="white-space:nowrap">
        <div style="background:#CCC">
          猪!你的鼻子有两个孔,感冒时的你还挂着鼻涕牛牛. 
          猪!你有着黑漆漆的眼,望呀望呀望也看不到边. 
          猪!你的耳朵是那么大,呼扇呼扇也听不到我在骂你傻. 
          猪!你的尾巴是卷又卷,原来跑跑跳跳还离不开它 
          哦~~~ 
        </div>
        <div>
          猪!你的鼻子有两个孔,感冒时的你还挂着鼻涕牛牛. 
          猪!你有着黑漆漆的眼,望呀望呀望也看不到边. 
          猪!你的耳朵是那么大,呼扇呼扇也听不到我在骂你傻. 
          猪!你的尾巴是卷又卷,原来跑跑跳跳还离不开它 
          哦~~~ 
       </p>
       </div>
      </div>
    </div>
    <div class="ecl-ui-scrollbar-track">
      <i id="ecl-ui-scrollbar-thumb1" class="ecl-ui-scrollbar-thumb"></i>
    </div>
  </div>
</div>

{%filter: markdown%}
require(['ui/lib', 'ui/ScrollBar', 'jquery'], function (lib, ScrollBar, $) {
  new ScrollBar({
    main: $('#ecl-ui-scrollbar-horizontal')[0],
    direction: 'horizontal'
  }).render();
});
{%/filter%}


{% content: script %}
<script>
require(['ui/lib', 'ui/ScrollBar', 'jquery'], function (lib, ScrollBar, $) {
  var scrollbar = new ScrollBar({
    main: 'scrollbar',
    disabled: 0,
    mode: 'position'
  });
  
  scrollbar.render();

  $('#scrollToBegin').on('click', function () {
    scrollbar.scrollTo('begin');
  });

  $('#scrollToEnd').on('click', function () {
    scrollbar.scrollTo('end');
  });

  $('#scrollToMid').on('click', function () {
    scrollbar.scrollTo(0.5);
  });

  new ScrollBar({
    main: $('#ecl-ui-scrollbar-horizontal')[0],
    direction: 'horizontal'
  }).render();

});
</script>
