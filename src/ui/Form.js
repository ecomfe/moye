/**
 * @file 表单控件
 *       注意： 当前Form组件的校验能力依赖于表单域使用插件Validator
 * @author Leon(lupengyu@baidu)
 * @auhtor wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Panel = require('./Panel');

    /**
     * 判断给定的 DOM 元素是否是表单元素
     *
     * @inner
     * @param {HTMLElement} elem 要判断的 DOM 元素
     * @return {boolean}
     */
    function isFormElement(elem) {
        return 'FORM' === elem.tagName;
    }

    /**
     * 提交表单
     *
     * @inner
     * @fires module:Form#submit
     * @param {Form} form 表单控件实例
     */
    function submit(form) {
        var event = new $.Event('submit');

        /**
         * @event module:Form#submit
         * @param {Object} e 事件对象参数
         */
        form.fire(event);

        if (!event.isDefaultPrevented()) {
            form.main.submit();
        }
    }

    /**
     * 表单控件
     *
     * @extends module:Panel
     * @exports Form
     */
    var Form = Panel.extend(/** @lends module:Form.prototype */{

        /**
         * 控件类型
         *
         * @readonly
         * @type {string}
         */
        type: 'Form',

        /**
         * 控件默认选项配置
         *
         * @property {Object} options 控件选项配置
         * @property {string} options.action 表单提交的 action
         * @property {string} options.method 表单提交的 method
         * @property {string} options.target 表单提交的 target
         */
        options: {
            action: '',
            method: 'GET',
            target: '_self'
        },

        /**
         * 创建主元素
         *
         * @override
         */
        createMain: function () {
            return document.createElement('form');
        },

        /**
         * 初始化表单控件的配置
         *
         * @override
         */
        init: function (options) {
            this.$parent(options);
            this.action = this.action || this.main.action;
            this.target = this.target || this.main.target;
        },

        /**
         * 初始化表单控件的 DOM 结构
         *
         * @override
         */
        initStructure: function () {
            var main = this.main;
            if (isFormElement(main)) {
                main.method = this.method || main.method;
            }
        },

        /**
         * 初始化表单控件的事件绑定
         *
         * @override
         */
        initEvents: function () {
            if (isFormElement(this.main)) {
                this.delegate(this.main, 'submit', this.onSubmit);
            }
        },

        /**
         * 重绘表单控件
         *
         * @override
         */
        repaint: require('./painter').createRepaint(
            Panel.prototype.repaint,
            {
                name: 'action',
                paint: function (conf, action) {
                    this.main.action = action;
                }
            },
            {
                name: 'target',
                paint: function (conf, target) {
                    this.main.target = target || '';
                }
            }
        ),

        /**
         * 表单提交时的处理函数
         *
         * @private
         * @fires module:Form#submit
         * @param {Event} e 提交事件
         */
        onSubmit: function (e) {
            e.preventDefault();
            this.submit();
        },

        /**
         * 提交表单，提交前会自动校验表单有效性，验证通过，才会真正触发提交事件
         *
         * @public
         * @return {Form}
         */
        submit: function () {
            var me = this;

            if (!isFormElement(me.main)) {
                return;
            }

            var isValid = me.validate();
            if (lib.isPromise(isValid)) {
                isValid.then(function (result) {
                    result && submit(me);
                });
            }
            else if (isValid) {
                submit(me);
            }

            return this;
        },

        /**
         * 获取表单中的InputControl的数据，形成以 `name` 为键，`value` 为值的对象
         * 如果有同 `name` 的多个控件，则值为数组
         *
         * @return {Object}
         */
        getData: function () {
            var controls = this.getInputControls();

            // 这里支持一下原生dom的值
            var data = {};

            lib.each(controls, function (control) {

                // 被禁用的控件不能作为表单数据, 跳过之
                if (control.isDisabled()) {
                    return;
                }

                // TODO 这里还有些规范约定，不能提交数据，比如未选中的checkbox, select等

                var name = control.name;
                var value = control.getValue();

                // 这里处理多个InputControl共用一个name的情况
                // 按原生Form的处理规则, 将它们合并为一个数组
                if (data.hasOwnProperty(name)) {
                    data[name] = [].concat(data[name], value);
                }
                else {
                    data[name] = value;
                }
            });

            return data;
        },

        /**
         * 获取表单中的 `输入控件`
         *
         * @return {Array.<Control>}
         */
        getInputControls: function () {
            var controls = [];
            var context = this.context;

            var children = this.children || [];
            $.each(children, function (idx, control) {
                if (
                    // 是一个控件
                    control
                    // 必须有属性name
                    && control.name
                    // 是一个输入控件 TODO: 对于输入控件行为约束规范，需要在开发文档明确，
                    // 保证所有输入控件都按照这里判断标准实现
                    && lib.isFunction(control.getValue)
                    // 与form在同一上下文中
                    && control.context === context
                ) {
                    controls.push(control);
                }
                // TODO 考虑有些组件是容器组件比如Panel，可能需要递归遍历
            });

            return controls;
        },

        /**
         * 验证表单
         *
         * @private
         * @param {string} checker 输入控件校验方法名
         * @return {boolean|Promise}
         */
        check: function (checker) {
            var defer = false;
            var valid = true;
            var states = [];
            var inputs = inputs = this.getInputControls();

            // 考虑到有些输入控件校验返回是异步对象，有些不是，这里先收集所有输入控件的校验状态
            // 只要存在一个异步对象，则返回promise
            for (var i = 0, len = inputs.length; i < len; i++) {

                // 如果找不到校验方法，默认认为校验通过
                var checkFunc = inputs[i][checker];
                var state = checkFunc ? checkFunc() : true;
                states[i] = state;

                if (valid && !state) {
                    valid = false;
                }
                else if (!defer) {
                    defer = lib.isPromise(state);
                }
            }

            if (defer) {
                return $.when.apply(null, states).then(function () {
                    for (var i = arguments.length - 1; i >= 0; i--) {
                        if (!arguments[i]) {
                            return false;
                        }
                    }
                    return true;
                });
            }

            return valid;
        },

        /**
         * 校验表单输入值有效性
         *
         * @return {boolean|Promise}
         */
        validate: function () {
            return this.check('validate');
        },

        /**
         * 校验表单输入值有效性，该方法跟 `validate` 区别，该方法调用输入
         * 控件的 `checkValidity` 方法，输入控件不抛出校验相关的事件。
         *
         * @return {boolean|Promise}
         */
        checkValidity: function () {
            return this.check('checkValidity');
        },

        /**
         * 销毁表单控件实例
         *
         * @override
         */
        dispose: function () {
            if (isFormElement(this.main)) {
                this.undelegate(this.main, 'submit', this.onSubmit);
            }

            this.$parent();
        }

    });

    return Form;
});
