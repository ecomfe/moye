{% target: LightBox(master=base) %}
{% content: style%}
<link rel="stylesheet" href="../src/css/LightBox.less">
<link rel="stylesheet" href="../src/css/Slider.less">
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
<div class="image-container">
    <img src="http://ww4.sinaimg.cn/large/006234yQjw1euefah0d07j30u00i00xp.jpg" data-lightbox-url="http://ww4.sinaimg.cn/large/006234yQjw1euefah0d07j30u00i00xp.jpg" data-role="lightbox-image" width="200">
    <img src="http://ww2.sinaimg.cn/large/4aa4ff9ajw1eu0qi54dbpj20u00i0adh.jpg" data-lightbox-url="http://ww2.sinaimg.cn/large/4aa4ff9ajw1eu0qi54dbpj20u00i0adh.jpg" data-role="lightbox-image" width="200">
    <img src="http://ww4.sinaimg.cn/large/683b1fbdjw1etzx5smxzlj20u00i0wj9.jpg" data-lightbox-url="http://ww4.sinaimg.cn/large/683b1fbdjw1etzx5smxzlj20u00i0wj9.jpg" data-role="lightbox-image" data-lightbox-width="400" width="200">
</div>

```

```js
require(['ui/LightBox', 'jquery'], function (LightBox, $) {

    var lightbox = new LightBox({
        cyclic: true,
        autoScale: true
    }).render();
});
```
<style>
.image-container * {
  margin: 20px;
  cursor: pointer;
}
</style>
<div class="image-container">
    <img src="http://ww4.sinaimg.cn/large/006234yQjw1euefah0d07j30u00i00xp.jpg" data-lightbox-url="http://ww4.sinaimg.cn/large/006234yQjw1euefah0d07j30u00i00xp.jpg" data-role="lightbox-image" width="200">
    <img src="http://ww2.sinaimg.cn/large/4aa4ff9ajw1eu0qi54dbpj20u00i0adh.jpg" data-lightbox-url="http://ww2.sinaimg.cn/large/4aa4ff9ajw1eu0qi54dbpj20u00i0adh.jpg" data-role="lightbox-image" width="200">
    <img src="http://ww4.sinaimg.cn/large/683b1fbdjw1etzx5smxzlj20u00i0wj9.jpg" data-lightbox-url="http://ww4.sinaimg.cn/large/683b1fbdjw1etzx5smxzlj20u00i0wj9.jpg" data-role="lightbox-image" data-lightbox-width="400" width="200">
</div>
<script>
require(['ui/LightBox', 'jquery'], function (LightBox, $) {
    var lightbox = new LightBox({
        cyclic: true,
        autoScale: true
    }).render();
});
</script>


{%/filter%}
