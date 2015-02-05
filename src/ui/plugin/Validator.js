/**
 * @file MOYE校验插件
 * @author leon <leonlu@outlook.com>
 */

define(function (require) {

    var $             = require('jquery');
    var Plugin        = require('./Plugin');
    var Validity      = require('./Validity');
    var ValidatorRule = require('./ValidatorRule');
    var lib           = require('../lib');

    var Validitor = Plugin.extend({

        $class: 'Validator',

        options: {

            /**
             * 指定触发控件校验的事件
             * @type {Array}
             */
            listen: ['blur']

        },

        activate: function (control) {

            this.target = control;

            var validate = control.validate = $.proxy(this.validate, this, control);

            // 把`listen`中设定的事件名绑定上validate方法
            this.listen && lib.each(this.listen, function (eventName) {
                control.on(eventName, validate);
            });

        },

        /**
         * 校验输入值
         *
         * 校验规则可以是以下三种类型
         * 1：schema
         * 2：函数
         *
         * @param {MOYE/Control} control 控件
         * @return {Promise|bool} 如果校验规则中存在异步校验, 那么会返回一个promise; 否则会返回一个bool;
         */
        validate: function (control) {

            // 如果控件被禁用了, 那么我们直接返回true;
            if (control.isDisabled()) {
                return true;
            }

            var me         = this;
            var schema     = me.schema;
            var value      = control.getValue();
            var isDeferred = false;
            var states     = [];
            var names      = [];
            var validity   = new Validity();

            // 这里应该释放一个`beforevalidate`的事件
            // 如果这个事件被preventDefault，那么后边就不执行了
            // 这在做表单联动时有用
            // 但是我们现在没有这样的event机制，先不做这一块
            me.target.fire('beforevalidate', {
                type: 'beforevalidate',
                validity: validity
            });

            var rules = $.isFunction(schema)
                // 如果schema是一个函数，那么包装一下这货
                ? [{
                    type: 'function',
                    check: schema
                }]
                // 如果是正常的schema，那么我们从控件上抽取所有的Rule
                : ValidatorRule.getRules(control);

            // 基于schema的校验规则
            //
            // TODO: 这里其实有一个优化可以做
            // 如果!!options.breakEarly那么只要有一个Rule失败，直接返回失败的结果
            // 可以省略其他的校验器执行
            $.each(rules, function (key, rule) {

                // 执行校验
                var ret = rule.check(value, control);

                // 如果返回结果是promise，那么需要标识有异步校验
                if ($.type(ret.then) === 'function') {
                    isDeferred = true;
                }

                // 放到队列中
                states.push(ret);
                names.push(rule.type);

            });

            // 如果没有校验规则返回了promise，那么就意味着所有的校验规则都同步返回结果
            // 这样的话我们直接返回布尔结果
            if (!isDeferred) {
                return me.onValidateFinish(validity, states, names);
            }

            // 释放一个`validating`的事件，报告正在异步校验
            me.target.fire('validating', {
                type: 'validating',
                validity: validity
            });

            // 只要有任意一个rule返回了promise，那么我们需要先返回一个promise
            // 等异步校验完成再回调
            return $.when.apply(null, states).always(function () {
                var results = [].slice.call(arguments);
                return me.onValidateFinish(validity, results, names);
            });

        },

        /**
         * 异步校验成功
         *
         * 这里是说有所有异步校验都通过了
         *
         * @private
         * @param {Validity} validity 校验合法性实例
         * @param {Array.ValidityState} states 校验状态们
         * @param {Array.string} names 校验规则的名称
         * @return {bool}
         */
        onValidateFinish: function (validity, states, names) {

            var target = this.target;

            lib.each(states, function (state, i) {
                validity.addState(names[i], state);
            });

            var state = validity.getValidState();

            var event = new $.Event(
                state,
                {
                    validity: validity
                }
            );

            // 先释放合法/非法事件，外部监听者可以在这个事件中修改校验的结果
            target.fire(event);

            // 如果事件的默认动作没有被阻止, 那么我们更新一下控件的状态
            if (!event.isDefaultPrevented()) {
                // 更新控件的状态
                this.updateControlState(validity);
            }

            return validity.isValid();
        },

        /**
         * 更新控件状态
         *
         * @private
         * @param {Validity} validity 合法性实例
         */
        updateControlState: function (validity) {

            var valid = validity.isValid();
            var state = validity.getValidState();
            var inverse = !valid ? 'valid' : 'invalid';
            var target = this.target;

            // 添加合法/非法状态样式
            if (!target.hasState(state)) {
                target.addState(state);
            }

            // 移除相反状态
            if (target.hasState(inverse)) {
                target.removeState(inverse);
            }

        },

        dispose: function () {
            this.target = null;
        }

    });

    return Validitor;
});

