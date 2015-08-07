{% target: PicUploader(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/PicUploader.less">
{% content: content %}

{% filter: markdown %}
# PicUploader 图片上传组件

### DEMO
-----------------------

{% /filter%}
<div class="content">
  <div id="uploader-container"></div>
  <button id="uploader-dispose">注销</button>
  <button id="uploader-del">删除路径与第一张图片相同的所有图片</button>
  <button id="uploader-del-index">删除第一个</button>
  <button id="uploader-enable">启用</button>
  <button id="uploader-disable">禁用</button>
</div>
{% filter: markdown %}

### 源码
-----------------------

```html
<div id="uploader-container"></div>
<button id="uploader-dispose">注销</button>
<button id="uploader-del">根据路径删除</button>
<button id="uploader-del-index">删除第一个</button>
<button id="uploader-enable">启用</button>
<button id="uploader-disable">禁用</button>
```

```js
require(['ui/PicUploader'], function (PicUploader) {

  var uploader = new PicUploader({
    main: $('#uploader-container')[0]
  });

  uploader.on('pickerror', function(e) {
    console.log(e.fileName);
  }).on('pick', function(e) {
    console.log(e.fileName);
  }).on('remove', function(e) {
    console.log(e.fileName);
  });

  uploader.render();

  $('#uploader-dispose').on('click', function() {
    uploader.dispose();
  });

  $('#uploader-del').on('click', function() {
      var files = uploader.getFileList();
      uploader.remove(files[0]);
  });

  $('#uploader-del-index').on('click', function() {
      uploader.removeAt(0);
  });

  $('#uploader-enable').on('click', function() {
      uploader.enable();
  });

  $('#uploader-disable').on('click', function() {
      uploader.disable();
  });

});
```
{% /filter %}
{% content: script %}
<script>
require(['ui/PicUploader'], function (PicUploader) {

  var uploader = new PicUploader({
    main: $('#uploader-container')[0]
  });

  uploader.on('pickerror', function(e) {
    console.log(e.fileName);
  }).on('pick', function(e) {
    console.log(e.fileName);
  }).on('remove', function(e) {
    console.log(e.fileName);
  });

  uploader.render();

  $('#uploader-dispose').on('click', function() {
    uploader.dispose();
  });

  $('#uploader-del').on('click', function() {
      var files = uploader.getFileList();
      uploader.remove(files[0]);
  });

  $('#uploader-del-index').on('click', function() {
      uploader.removeAt(0);
  });

  $('#uploader-enable').on('click', function() {
      uploader.enable();
  });

  $('#uploader-disable').on('click', function() {
      uploader.disable();
  });

});
</script>