{% target: Dialog(master=base) %}
{% content: style%}
<link rel="stylesheet" href="../src/css/Dialog.less">
<style>
  .content {
    margin: 20px 0;
  }
</style>
{% content: content%}
{%filter: markdown%}

# Dialog 窗口

{%/filter%}

<div class="content">
  <button id="newDialog">普通青年(呃，普通窗口)</button>
  <button id="newAlertDialog">警告窗口(alert)</button>
  <button id="newConfirmDialogFixed">确定框(confirm，固定定位)</button>
  <button id="newConfirmDialogAbsolute">确定框(confirm，绝对定位)</button>  
</div>

{%filter: markdown%}

```html
<button id="newDialog">普通青年(呃，普通窗口)</button>
<button id="newAlertDialog">警告窗口(alert)</button>
<button id="newConfirmDialogFixed">确定框(confirm，固定定位)</button>
<button id="newConfirmDialogAbsolute">确定框(confirm，绝对定位)</button>
```

```js
require(['DialogFactory'], function (DialogFactory) {

  var newdlg; 
  $('#newDialog').on('click', function() {
    if(newdlg) {
      newdlg.show();
      return;
    }
    newdlg = DialogFactory.create({
        main: '',
        skin: 'xxx',
        content: '内容',
        footer: '底部',
        width: '600px',
        title: '标题',
        top: '50px',
        left: '',
        fixed: 1,
        showMask: 1,
        leve: 10
    });

    newdlg.show();

  });

  $('#newAlertDialog').on('click', function() {
    var dlg = DialogFactory.alert({
      content: 'hello dialog!'
    });

    dlg.on('confirm', function() {
      dlg.hide();
      dlg.dispose();
    });
    dlg.show();
  });

  $('#newConfirmDialog').on('click', function() {

    var dlg = DialogFactory.confirm({
      content: 'hello dialog!',
      height: '400px'
    });

    dlg.on('confirm', function() {
      console.log('confirm');
      this.hide();
    });

    dlg.on('cancel', function() {
      console.log('cancel');
      this.hide();
    });

    dlg.on('hide', function() {
      console.log('hide');
      dlg.dispose();
    });

    dlg.show();
  });

  $('#newConfirmDialogAbsolute').on('click', function() {

    var dlg = DialogFactory.confirm({
      content: 'hello dialog!',
      height: '400px',
      fixed: 0,
      onConfirm: function() {
        this.hide();
        console.log('onconfirm');
      },
      onCancel: function() {
        this.hide();
        console.log('oncancel');
      }
    });

    dlg.on('hide', function() {
      console.log('hide');
      dlg.dispose();
    });

    dlg.show();
  });

});
```
{%/filter%}
{%content: script%}
<script>
require(['DialogFactory'], function (DialogFactory) {

  var newdlg; 
  $('#newDialog').on('click', function() {
    if(newdlg) {
      newdlg.show();
      return;
    }
    newdlg = DialogFactory.create({
        main: '',
        skin: 'xxx',
        content: '内容',
        footer: '底部',
        width: '600px',
        title: '标题',
        top: '50px',
        left: '',
        fixed: 1,
        showMask: 1,
        leve: 10
    });

    newdlg.show();

  });

  $('#newAlertDialog').on('click', function() {
    var dlg = DialogFactory.alert({
      content: 'hello dialog!'
    });

    dlg.on('confirm', function() {
      dlg.hide();
      dlg.dispose();
    });
    dlg.show();
  });

  $('#newConfirmDialogFixed').on('click', function() {

    var dlg = DialogFactory.confirm({
      content: 'hello dialog!',
      height: '400px'
    });

    dlg.on('confirm', function() {
      console.log('confirm');
      this.hide();
    });

    dlg.on('cancel', function() {
      console.log('cancel');
      this.hide();
    });

    dlg.on('hide', function() {
      console.log('hide');
      dlg.dispose();
    });

    dlg.show();
  });

  $('#newConfirmDialogAbsolute').on('click', function() {

    var dlg = DialogFactory.confirm({
      content: 'hello dialog!',
      height: '400px',
      fixed: 0,
      onConfirm: function() {
        this.hide();
        console.log('onconfirm');
      },
      onCancel: function() {
        this.hide();
        console.log('oncancel');
      }
    });

    dlg.on('hide', function() {
      console.log('hide');
      dlg.dispose();
    });

    dlg.show();
  });

});
</script>