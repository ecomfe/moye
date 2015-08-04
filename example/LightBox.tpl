{% target: LightBox(master=base) %}
{% content: style%}
<link rel="stylesheet" href="../src/css/LightBox.less">
<style>
  .content {
    margin: 20px 0;
  }
</style>
{% content: content%}
{%filter: markdown%}

# LightBox 查看大图

## 普通窗口

```html

```

```js
require(['jquery', 'ui/LightBox'], function ($, LightBox) {
  var lightbox = new LightBox({
    cyclic: true
  }).render();
});
```
<style>
.lightbox {
  display: block;
}
</style>
<div class="content">
    <a href="http://getuikit.com/docs/images/placeholder_800x600_2.jpg" class="lightbox" data-width="200" data-height="200">
        Image1
    </a>
    <a href="http://getuikit.com/docs/images/placeholder_800x600_1.jpg" class="lightbox" data-title="这是一个标题">
        Image2
    </a>
    <a href="http://file.ynet.com/2/1503/23/9928834.jpg" class="lightbox" >
        <img alt="demoImg" src="http://file.ynet.com/2/1503/23/9928834.jpg" width="100" height="75">
    </a>
</div>

<script>
require(['jquery', 'ui/LightBox'], function ($, LightBox) {

  var lightbox = new LightBox({
    cyclic: false,
    autoScale: true
  }).render();
});
</script>


{%/filter%}
