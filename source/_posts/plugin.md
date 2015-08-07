title: 插件 / Plugin
categories:
  - introduction
date: 2015-08-07 16:05:23
---

## moye插件机制

出于性能考虑, `moye`控件只保留最小功能集合. 许多增强功能是由`插件`来协助完成的.

例如, 在`获取校验码`按钮一般情况都有一个冷却时间60秒. 点击之后60秒内是禁用的, 此时按钮文字显示冷却时间的倒计时. 此功能不方便直接写在`Button`控件中, 即可编写一个`插件`来完成.

### 使用方式

可以使用两种方式来激活一个控件

1. 通过构造参数`plugins`

  ```js

  require('moye/plugin/ButtonCooldown');

  var button = new Button({
    main: document.getElementById('some-button'),
    plugins: ['ButtonCoolDown']
  });
  ```

2. 通过调用接口`use()`

  ```js

  require('moye/plugin/ButtonCooldown');

  var button = new Button({
    main: document.getElementById('some-button')
  });

  button.use('ButtonCooldown');
  ```

### 如何编写一个插件

#### 基础

我们提供了一个`Plugin`的基类, 其中定义了`Plugin`所需要的几个接口:

1. activate({Control}) 激活插件, 在控件初始化时调用. **必须重写**
2. inactivate()        禁用插件, 在有必要禁用插件时调用. **有必要时重写**
3. dispose()           销毁插件, 在控件被销毁时调用. **有必要时重写**

因此, 大家在编写插件时, 首先需要引入基类`Plugin`, 然后从`Plugin`上生成新的插件并重写上边的三个方法. 示例:

```js
var ExamplePlugin = Plugin.extend({
  activate: function (control) {
    this.control = control;
  },
  dispose: function () {
    this.control = null;
  }
});
```

#### 最优实践

1. 扩展控件的方法

  挂接方法是指将额外方法挂接到控件实例上, 来提供扩展功能. 例如:

  ```js
  ButtonCooldown = Plugin.extend({
    activate: function (control) {
      control.startCooldown = $.proxy(this.start, this);
    },
    start: function () {
      // 开始倒计时
    }
  });
  ```

  插件激活后, 控件就会获得`startCooldown`的方法, 可以在合适的时候进行调用.

  > 请尽量不要覆盖`控件`原有方法. 入侵式挂接可能会导致不可预期的逻辑混乱.

1. 扩展控件的事件

  > `插件`触发`寄主控件`事件, `寄主`是事件源, 即`control.fire('plugin-special-event')`;

  > 插件本身没有实现`Observable`接口, 不能释放事件;

  > 理论上讲, 从外部来看, 使用者没有办法获取到插件实例;

  激活插件后, 根据插件的属性或者监听控件的事件, 结合控件自身逻辑, 在合适的时机在`控件实例`上触发事件. 例如:

  ```js
  Validator = Plugin.extend({

    activate: function (control) {
      control.on('change', $.proxy(this.validate, this);
      this.rules = control.rules;
      this.control = control;
    },

    validate: function () {
      // 根据rules所定义的规则来计算当前用户输入是否合法
      var state = false;
      // 其他插件可以`invalid`事件来完成相应的交互.
      // 例如, ValidityTip插件就是监听事件`invalid`来触发错误提示信息的展现的.
      this.control.fire('invalid');
      return state;
    }

  });
  ```

  以上示例简单完成了两个功能

  1. 当`寄主控件`发生了`change`事件时, 进行校验.
  2. 如果校验失败, 在`寄主控件`上触发事件`invalid`.

  `插件事件`是多插件合作的基础. 由于`插件A`没办法知晓`插件B`是否存在, 因此也就没有一个明确的接口可以使用. 所以插件与插件之间的合作都是通过`寄主控件`的插件事件来完成的.

1. 插件如何获取参数

  我们推荐直接将插件参数添在控件上, 在开发插件时直接从插件上获取. 示例:

  ```js
  TextBoxPlaceholder = Plugin.extend({
    activate: function (control) {
      if (lib.browser.ie < 9 && control.placeholder) {
        // 只有当浏览器为ie678并且Textbox需要一个placeholder时我们才继续
      }
    }
  );
  ```

1. 插件的执行时机

  我们推荐监听控件的 `生命周期事件` / `交互事件` 来完成控件状态转化. 例如:

  ```js
  TextBoxPlaceholder = Plugin.extend({
    activate: function (control) {
      if (lib.browser.ie < 9 && control.placeholder) {
        control.on('afterrender', $.proxy(this.buildPlaceHoder, this);
        this.control = control;
      }
    },

    build: function () {
      // 生成placeholder所需要的元素
      // 事件绑定
      // 等等...
    }
  });

  ```

  上边这个示例中所定义的TextBoxPlaceHolder是用来兼容ie678上input的placeholder属性的. 那么在需要在控件完成渲染后才能进行插件所需要的额外逻辑的执行.

#### 代码示例

下边的代码简要地介绍如何编写一个插件:

```js
define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');

    var ButtonCooldown = Plugin.extend({

        $class: 'ButtonCooldown',

        /**
         * 默认参数
         * @type {Object}
         */
        options: {
          // 这里放置的参数会自动与构造参数合并, 构造参数的优先级高于此处
        },

        activate: function (target) {
          this.target = target;
          target.startCooldown  = $.proxy(this.startCooldown, this);
          target.isCooling      = $.proxy(this.isCooling, this);
        },

        dispose: function () {
          this.target = null;
        },

        startCooldown: function (cooldown, interval, message) {
          var me = this;
          me.timer = setInterval(function () {

            if (me.count--) {
              me.updateButtonText();
            }
            else {
              me.finishCooldown();
            }

          }, 1000);
        },

        finishCooldown: function () {
          clearInterval(this.timer);
          this.target.fire('cooldown');
        },

        isCooling: function () {
            // ...
        }

    });

    return ButtonCooldown;

});
```

