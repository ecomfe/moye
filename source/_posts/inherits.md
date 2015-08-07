title: 继承 / inherits
categories:
  - introduction
date: 2015-08-07 18:09:07
---

# 继承机制

每个可实例化的`moye`控件都应该继承自`Control`基类。可以通过`Control.extend(proto)`方法来创建一个新的控件类。

参数`proto`是一个`Object`类型对象，其所有属性都被合并到新控件的原型链对象上。因此，可以在`proto`上挂接所需要的属性或方法，控件实例可以直接访问。

示例：

```js
var Control = require('moye/Control');
var Test = Control.extend({

  type: 'Test',

  init: function (options) {
    this.$parent(options);
  },

  initStructure: function () {
    this.main.innerHTML = 'test';
  },

  initEvents: function () {
    $(this.main).on('click', $.proxy(this.onMainClick, this));
  },

  onMainClick: function (e) {
    console.log('test clicked');
  },

  dispose: function () {
    $(this.main).off('click');
    this.$parent();
  }

});

var Test2 = Test.extend({

  type: 'Test2',

  onMainClick: function (e) {
    console.log('test2 clicked');
    this.$parent(e);
  }

});

```

可以通过覆盖基类`Control`提供了一系列的接口来实现子控件的具体交互逻辑。这里主要想介绍一下调用父类接口的方法，即：

```js
// 凡是覆盖父类接口的方法(@override)中，
// 都可以使用`this.$parent(args)`的方式来调用父类接口
this.$parent( ... );
```

因此，在Test2实例的主元素被点击进会在控制输出如下结果：

```
test2 clicked
test clicked
```
