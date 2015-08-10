title: Form
name: Form
categories:
  - component
date: 2015-08-09 10:41:28
---

### 基本表单使用

<iframe height='268' scrolling='no' src='//codepen.io/wuhy/embed/XbGNZp/?height=268&theme-id=17700&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/wuhy/pen/XbGNZp/'>Form</a> by spark (<a href='http://codepen.io/wuhy'>@wuhy</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

**注意：** 禁用的表单项，不会出现在 `getData` 接口返回的数据里。为了能获取到对应的表单数据，需要对每个表单控件设置 `name` 属性。

默认，表单项是没有校验功能，可以使用下面的表单校验插件开启校验，如果还是无法满足你的需求，你也可以强制性重写表单的 `validate` 方法。

对于 `submit` 类型的按钮，会自动触发 `submit` 事件，对于普通的按钮，如果想自动触发 `submit` 逻辑，可以使用 `FormSubmit` 插件：

{% codeblock 自动提交 lang:js %}
// 要求 require `moye/plugin/FormSubmit` 插件
var form = new Form({
    main: document.getElementById('my-form'),
    target: 'my-frame',
    plugins: [ // 启用 FormSubmit 插件
        {
            type: 'FormSubmit',
            options: {
                triggers: ['save-btn'] // 配置要自动触发 `submit` 的按钮 id 或 控件的 id
            }
        }
    ]
});
{% endcodeblock %}

### 表单关联域联动

<iframe height='266' scrolling='no' src='//codepen.io/wuhy/embed/MwxJam/?height=266&theme-id=17700&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/wuhy/pen/MwxJam/'>Moye Form Relation Plugin</a> by spark (<a href='http://codepen.io/wuhy'>@wuhy</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>


经常会有这种需求，比如当某个控件值发生变化时候，某个或某些控件需要发生联动变化，这时候可以使用 `FormRelation` 插件，为了监控这些表单域变化，需要使用 `FormFieldWatcher` 插件。

{% codeblock 表单域联动 lang:js %}
// 要求 require `moye/plugin/FormFieldWatcher` 插件
// 要求 require `moye/plugin/FormRelation` 插件
// 下面这段代码做的事情非常简单：只有姓名和邮箱都不为空的时候，提交按钮才可用
var form = new Form({
    main: document.getElementById('my-form'),
    target: 'my-frame',
    plugins: [
        {
            type: 'FormFieldWatcher',
            options: {
                eventTypes: ['input', 'change'] // 配置要监控的表单域的事件类型
            }
        },
        {
            type: 'FormRelation',
            options: {
                relations: [
                    {
                        dependences: [
                            {
                                id: 'uNameTextBox', // 控件 id
                                logic: function () { // 要触发联动的逻辑条件定义
                                    return !this.getValue();
                                }
                            },
                            {
                                id: 'emailTextBox',
                                logic: function () {
                                    return !this.getValue();
                                }
                            }
                        ],
                        // 触发联动效果的依赖表单域需要满足的条件
                        // 这里定义条件为只要上面的依赖逻辑条件任何一个为 true 就会触发目标
                        // 控件的联动行为
                        pattern: FormRelation.patterns.any,
                        targets: ['submitBtn'], // 要触发联动的目标控件 id
                        actions: [
                            function (result) { // 联动行为
                                result ? this.disable() : this.enable();
                            }
                        ]
                    }
                ]
            }
        }
    ]
});
{% endcodeblock %}

### 表单校验

<iframe height='266' scrolling='no' src='//codepen.io/wuhy/embed/OVqWXP/?height=266&theme-id=17700&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/wuhy/pen/OVqWXP/'>Moye Form Validate</a> by spark (<a href='http://codepen.io/wuhy'>@wuhy</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

`Moye` 预定义的校验规则：

* `moye/plugin/validator/email` : 邮件校验规则

* `moye/plugin/validator/identity` : 身份证校验规则

* `moye/plugin/validator/max` : 最大值校验规则

* `moye/plugin/validator/min` : 最小值校验规则

* `moye/plugin/validator/maxlength` : 最大长度校验规则

* `moye/plugin/validator/minlength` : 最小长度校验规则

* `moye/plugin/validator/mobile` : 手机号码校验规则

* `moye/plugin/validator/natural` : 数字验规则

* `moye/plugin/validator/required` : 不为空校验规则

如果没有想要的校验规则，可以自定义自己的校验规则，具体参考上述校验规则实现。

{% codeblock 校验规则添加 lang:js %}
// 为了实现表单自动校验，需要添加表单域的校验规则，需要先 require 如下几个插件：
// `moye/plugin/Validator`
// `moye/plugin/ValidateTip`  如果要添加校验提示，需要这个插件
// `moye/plugin/validator/xx` require 用到的校验规则插件

ctrlId: {
    type: 'TextBox',
    name: 'email',
    value: '',
    title: '邮箱',
    plugins: [
        'Validator',  // 启用校验插件
        'ValidateTip' // 启用校验 tip 插件
    ],
    rules: [ // 定义校验规则
        {
            type: 'minlength',
            minLength: 5,
            message: '!{title}长度不能小于!{minLength}'
        },
        {
            type: 'maxlength',
            maxLength: 100
        },
        'email'
    ]
}
{% endcodeblock %}