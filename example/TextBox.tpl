{% target: TextBox(master=base) %}
{% content: style %}
<link rel="stylesheet" href="../src/css/TextBox.less">
{% content: content %}
{% filter: markdown %}
# TextBox 文本输入框

### DEMO
-----------------------
{% /filter%}

<style>
    #welcome {
        padding-left: 10px;
    }
</style>

<div class="content">
    <label>我是</label>
    <div id="textbox1" class="ui-textbox">
        <input type="text">
    </div>
    <label id="welcome"></label>
</div>

<script>
require(['ui/TextBox'], function (TextBox) {

    new TextBox({
        main: document.getElementById('textbox1')
    })
    .on('input', function () {
        document.getElementById('welcome').innerText = '你好，' + this.getValue();
    })
    .render();

});
</script>

{%filter:markdown%}

```html
<label>我是</label>
<div id="textbox1" class="ui-textbox">
    <input type="text">
</div>
<label id="welcome"></label>
```

```js
require(['ui/TextBox'], function (TextBox) {

    new TextBox({
        main: document.getElementById('textbox1')
    })
    .on('input', function () {
        document.getElementById('console').innerText = '你好，' + this.getValue();
    })
    .render();

});
```
{%/filter%}

<div class="content">
    <label>禁用</label>
    <div id="textbox2" class="ui-textbox ui-textbox-disabled">
        <input type="text" value="禁用">
    </div>
    <label>只读</label>
    <div id="textbox3" class="ui-textbox ui-textbox-readOnly">
        <input type="text" value="只读">
    </div>
</div>
<script>
require(['ui/TextBox'], function (TextBox) {
    new TextBox({
        main: document.getElementById('textbox2')
    })
    .render()
    .disable();

    new TextBox({
        main: document.getElementById('textbox3')
    })
    .render()
    .setReadOnly(true);

});
</script>
