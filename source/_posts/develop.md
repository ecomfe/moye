title: 开发指南 / introduction
categories:
  - introduction
date: 2015-08-07 15:59:18
---

如何开发 Moye 组件
==============

### 准备开发

目前, `moye`的开发分支是`feature/ng`, 请在此分支上进行开发.

`moye`基于`edp webserver`进行调试, 使用了`est`作为less mixin库, 在`demo`中需要安装一些`npm`包. 因此, 推荐下面的方法来准备开发环境.

```
cd ~/path/to/moye
npm install
bower install
edp webserver start
```

**请注意**

其中, edp werbserver请使用1.0.15@beta以上的版本, 使用这个命令来安装

```
npm install -g edp-webserver@beta
```

`bower`是一个前端依赖包的管理工具, 可以通过这个命令来安装

```
npm install -g bower
```

### Moye 目录结构

    ```
    Moye
        |- dep        // 外部依赖模块
        |- doc        // 文档目录
        |- example    // 组件对应的示例
        |- src        // 组件源码，包括 LESS 与 JS
        |- test       // 测试用例

    ```

   - doc/api 目录为 `jsdoc3` 自动生成的 API 文档。
   - test 目录下 `config.js` 与 `main.js` 为 edp-test 使用的测试配置，通常不需要修改。
   - test/spec 下包含所有组件对应的单测，单测文件格式： `组件名` + `Spec.js`。
   - 项目构建基于 `Grunt` 的 `grunt build` 命令。
   - 更新 `github` 上 API 文档页面，可使用 `grunt page` 命令。

  **注意：** 所有目录必须使用**`单数`**形式。

### 组件开发

#### js相关

1. 继承自组件基类 `Control`，基本结构（主要字段和方法）：

    ```
    var Control = require('./Control');

    var Foo = Control.extend(/** @lends module:Foo.prototype */{

        // 组件名
        type: 'Foo',

        // 默认配置项
        options: {
        },

        // 初始化
        init: function (options) {
        },

        // 初始化控件的DOM结构
        initStructure: function () {
        },

        // 初始化控件的事件绑定
        initEvents: function () {
        },

        // 属性发生变化时对控件进行重绘
        // 在两种情况下会被重绘
        // 1. render
        // 2. 当propName的值发生变化时, 例如调用`set(propName, propValue)`
        repaint: function (changes, changeIndex) {
        },

        // 设定属性值
        set: function (propName, propValue) {
        },

        // 毁销控件
        dispose: function () {
            this.$parent();
        }

    });

    ```

    此时 Foo 具有父类 Control 中的属性与行为，如需实现 Control 类中同名方法，但保留父类方法相同逻辑，可使用 `this.$parent([参数]);`。

    **注意：**

      - 继承层次尽量保持在两层以内
      - 谨慎使用 implement 直接修改现有公共组件，除非需要影响所有使用者，否则尽量使用 extend 生成子类再改写。
      - 组件主容器名统一为 **`main`**。

2. 所有继承自 `Control` 的子类都具有事件功能，实现见 `lib.observable`，主要方法为 `on`、`un` 与 `fire`。
3. 所有继承自 `Control` 的子类都具有配置的参数，实现见 `lib.configurable`。对于 `on` 开头后跟大写字母，值类型为函数的配置项，自动添加到事件绑定。
4. `Control` 中实现的 `dispose` 方法默认作了一些清理，如果绑定了其它 DOM 事件或希望作别的处理，可以自行实现 `dispose` 方法，在方法最后再调用 `this.$parent();`。


#### 样式相关

1. `moye`样式基于`less`, 并且使用了`less`工具库[est](https://github.com/ecomfe/est). 在控件样式中可以通过`@import "./dep.less"`来加载`est`;

2. 我们在`variable.less`中提供了大量的预定义变量, 包含 `前缀` / `颜色` / `大小` . 可以通过`@import "./variable.less"`来加载它.

3. 每个组件的主类名请保持为`.@{moye-prefix}-your-control-type`, `@moye-prefix`的定义在`variable.less`中, 默认值为`ui`. 例如输入框控件的less代码为:

  ```less
  @import "./variable.less";
  @import "./dep.less";

  .@{moye-prefix}-textbox {
    // ...
  }
  ```

4. 请尽可能地请`数值` / `颜色` 抽离为参数. 这样可以为提供`定制`主题提供较为方便接入口;

  > 在定制主题时, 优先覆盖控件所抽离的参数调整控件样式

  参数的命名规则必须为: `@moye-{type}-{variable-name}`;

  示例:

  ```less
  @import "./variable.less";
  @import "./dep.less";

  @moye-textbox-background-color: #fff;
  @moye-textbox-text-color: #333;

  .@{moye-prefix}-textbox {
    background-color: @moye-textbox-background-color;
    color: @moye-textbox-text-color;
  }

  // 主题定制: 暗黑世界...
  @moye-textbox-backgroud-color: #000;
  @moye-textbox-text-color: #eee;
  ```

5. 数值单位请尽可能使用rem. `moye` 在 `mixin.less`中提供了混入`.moye-rem(@prop, @value)`, 提供`rem`的兼容性处理, 请尽量使用此mixin设定以上数值(如果需要支持ie678, 我们会在`.moye-rem()`中把`rem`转化为`px`; 我们默认是支持ie678的, 所以编译出的css中使用的是`px`). 以下属性强烈建议使用`rem`:
  1. `width` / `height`
  2. `padding` / `margin`
  3. `font-size` / `line-height`

  如果是`border-width`可以使用`px`;

6. 为了更好地配合栅格化, 请尽可能地提供`border-box`的控件展现. `moye`在`mixin.less`中提供了`.moye-border-box-size-rem()`, 方便大家开发.

7. `moye`的样式代码风格与[ecomfe的less代码风格规范](https://github.com/ecomfe/spec/blob/master/less-code-style.md)完全一致, 请按此规范要求保证良好的编码风格.

### 非 UI 类组件

1. 可以参考 `Control`，直接使用 `lib.newClass` 创建。
2. 如需事件支持，请使用 `Foo.implement(lib.observable)`。
3. 如需可配置参数，请使用 `Foo.implement(lib.configurable)`;

### 文档注释

所有组件，必须有完善的文档注释，遵循 `jsdoc3` 的规范，使用 `grunt jsdoc` 命令生成后验证，务必保证生成正确的 API 文档。可以参考现有组件的注释。

### 编写使用范例

### 测试

务必完成代码风格、单元测试及代码覆盖率的要求。

### 提交

在代码 Review 没问题后，会合并到公共组件中。

**注意**

新组件开发必须使用新的分支开发，规范见 [moye组件准入规范](acceptance-criteria-of-moye)
