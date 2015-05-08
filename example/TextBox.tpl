{% target: TextBox(master=base) %}
{% content: style %}
<link rel="stylesheet" href="../src/css/TextBox.less">
<link rel="stylesheet" href="../src/css/plugin/TextBoxAutoComplete.less">
{% content: content %}
{% filter: markdown %}
# TextBox 文本输入框

```html
<label>我是</label>
<div id="textbox1" class="ui-textbox">
    <input type="text">
</div>
<div id="welcome"></div>
```

```js
new TextBox({
    main: document.getElementById('textbox1')
})
.on('input', function () {
    document.getElementById('console').innerText = '你好，' + this.getValue();
})
.render();
```

<div class="content">
    <label>我是</label>
    <div id="textbox1" class="ui-textbox">
        <input type="text">
    </div>
    <div id="welcome"></div>
</div>

<script>
require(['ui/TextBox'], function (TextBox) {

    new TextBox({
        main: document.getElementById('textbox1')
    })
    .on('change', function () {
        document.getElementById('welcome').innerText = '你好，' + this.getValue();
    })
    .render();

});
</script>

```js
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
```

```html
<div id="textbox2" class="ui-textbox ui-textbox-disabled">
    <input type="text" value="禁用">
</div>
<div id="textbox3" class="ui-textbox ui-textbox-readOnly">
    <input type="text" value="只读">
</div>
<div id="textbox4" class="ui-textbox ui-textbox-valid">
    <input type="text" value="通过校验">
</div>
<div id="textbox4" class="ui-textbox ui-textbox-invalid">
    <input type="text" value="未通过校验">
</div>
```

<div class="content">
    <div id="textbox2" class="ui-textbox ui-textbox-disabled">
        <input type="text" value="禁用">
    </div>
</div>
<div class="content">
    <div id="textbox3" class="ui-textbox ui-textbox-readOnly">
        <input type="text" value="只读">
    </div>
</div>
<div class="content">
    <div id="textbox4" class="ui-textbox ui-textbox-valid">
        <input type="text" value="通过校验">
    </div>
</div>
<div class="content">
    <div id="textbox4" class="ui-textbox ui-textbox-invalid">
        <input type="text" value="未通过校验">
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


### 文本框 + autocomplete

<div class="content">
    <div id="textbox-autocomplete" class="ui-textbox">
        <input type="text" value="">
    </div>
</div>




<script>
require(['ui/TextBox', 'ui/plugin/TextBoxAutoComplete'], function (TextBox, TextBoxAutoComplete) {

    new TextBox({
        main: document.getElementById('textbox-autocomplete'),
        plugins: [{
            type: 'TextBoxAutoComplete',
            options: {
                datasource: function () {
                    return [{
                        text: 'aaa',
                        value: 'aaa'
                    }, {
                        text: 'bbb',
                        value: 'bbb'
                    }];
                }
            }
        }]
    })
    .render()

});
</script>



```js
require(['ui/TextBox', 'ui/plugin/TextBoxAutoComplete'], function (TextBox, TextBoxAutoComplete) {

    new TextBox({
        main: document.getElementById('textbox-autocomplete'),
        plugins: [{
            type: 'TextBoxAutoComplete',
            options: {
                datasource: function () {
                    return [{
                        text: 'aaa',
                        value: 'aaa'
                    }, {
                        text: 'bbb',
                        value: 'bbb'
                    }];
                }
            }
        }]
    })
    .render()

});
```


{%/filter%}
