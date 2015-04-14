/**
 * @file MOYE校验插件，对于要启用校验的输入控件，必须 `use` 这个插件 或者通过 `plugins` 属性
 *       引入该插件，通过输入控件的`rules`属性配置校验规则
 * @author leon <leonlu@outlook.com>
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var $             = require('jquery');
    var Plugin        = require('./Plugin');
    var Validity      = require('./Validity');
    var ValidateRule  = require('./ValidateRule');
    var lib           = require('../lib');

    /**
     * 校验插件
     *
     * @extends module:Plugin
     * @exports Validator
     */
    var Validator = Plugin.extend(/** @lends module:Validator.prototype */{

        $class: 'Validator',

        /**
         * 校验插件的选项定义
         *
         * @property {Object} options 验证规则选项配置
         * @property {Array.<string>} options.listener 要自动触发校验的事件名称
         * @property {boolean} options.failEarly 是否配置的校验规则出现失败时候，是否立刻停止校验
         * @property {number} options.delay 校验规则延迟执行的时间
         */
        options: {

            /**
             * 指定触发控件校验的事件
             *
             * @type {Array.<string>}
             */
            listen: ['blur'],

            /**
             * 当某个校验规则失败时, 是否中止校验
             *
             * @type {boolean}
             */
            failEarly: true,


            /**
             * 校验执行延迟(毫秒)
             *
             * 在绑定到`change`事件时, 有可能是`TextBox`所触发的`change`, 这样可能会比较频繁地触发校验.
             * 如果校验逻辑中带有异步校验, 比如ajax校验, 那么会比较浪费.
             * 因此, 此参数可以delay校验的触发.
             *
             * @type {number}
             */
            delay: 0

        },

        /**
         * @override
         */
        activate: function (control) {

            this.target = control;

            this.rules = lib.map(control.rules, function (conf) {
                return new ValidateRule(conf);
            });

            control.checkValidity = $.proxy(this.checkValidity, this, control);

            var validate = control.validate = $.proxy(this.validate, this, control);

            // 如果带有delay参数, 那么我们做一个debounce函数
            if (this.delay) {
                validate = lib.debounce.call(this, validate, this.delay);
            }

            // 把`listen`中设定的事件名绑定上validate方法
            this.listen && lib.each(this.listen, function (eventName) {
                control.on(eventName, validate);
            });

        },

        /**
         * 以 `安静` 模式校验控件，即不抛出各种校验事件，也不更新对应的校验结果控件状态
         *
         * @param {Control} control 要校验的控件实例
         * @return {Promise|boolean}
         */
        checkValidity: function (control) {
            return this.check(control, true);
        },

        /**
         * 校验控件
         *
         * @param {Control} control 要校验的控件实例
         * @return {Promise|boolean}
         */
        validate: function (control) {
            return this.check(control, false);
        },

        /**
         * 校验输入值
         *
         * @private
         * @fires module:Validator#beforevalidate
         * @fires module:Validator#validating
         * @param {Control} control 控件
         * @param {boolean} silent  是否释放校验事件+更新控件校验状态
         * @return {Promise|bool} 如果校验规则中存在异步校验, 那么会返回一个promise; 否则会返回一个bool;
         */
        check: function (control, silent) {
            var me = this;
            var rules = me.rules;
            var ruleNum = rules.length;

            // 如果控件被禁用了或者没有校验规则, 那么我们直接返回true;
            if (control.isDisabled() || !ruleNum) {
                return true;
            }

            var value      = control.getValue();
            var isDeferred = false;
            var states     = [];
            var names      = [];
            var validity   = new Validity();

            // 这里应该释放一个`beforevalidate`的事件
            // 如果这个事件被preventDefault，那么后边就不执行了
            // 这在做表单联动时有用
            // 但是我们现在没有这样的event机制，先不做这一块
            /**
             * @event module:Validator#beforevalidate
             * @param {Object} e 事件对象参数
             * @param {Validity} e.validity 校验状态参数
             */
            silent || me.target.fire('beforevalidate', {
                type: 'beforevalidate',
                validity: validity
            });

            // 基于schema的校验规则
            for (var i = 0; i < ruleNum; i++) {
                var rule = rules[i];
                var state = rule.check(value, control);

                // 放到队列中
                states.push(state);
                names.push(rule.type);

                // 如果返回结果是promise，那么需要标识有异步校验
                if (lib.isPromise(state)) {
                    isDeferred = true;
                }
                // 如果不是Promise, 而且当前的校验结果很糟糕, 那么我们就提前结束
                else if (!state.getState() && me.failEarly) {
                    break;
                }
            }

            // 如果没有校验规则返回了promise，那么就意味着所有的校验规则都同步返回结果
            // 这样的话我们直接返回布尔结果
            if (!isDeferred) {
                return me.onValidateFinish(validity, states, names, silent);
            }

            /**
             * @event module:Validator#validating 校验中事件，针对异步校验才有
             * @param {Object} e 事件对象参数
             * @param {Validity} e.validity 校验状态参数
             */
            // 释放一个`validating`的事件，报告正在异步校验
            silent || me.target.fire('validating', {
                type: 'validating',
                validity: validity
            });

            // 只要有任意一个rule返回了promise，那么我们需要先返回一个promise
            // 等异步校验完成再回调
            return $.when.apply(null, states).then(function () {
                return me.onValidateFinish(
                    validity,
                    [].slice.call(arguments),
                    names,
                    silent
                );
            }, function () {
                return me.onValidateFinish(
                    validity,
                    [].slice.call(arguments),
                    names,
                    silent
                );
            });
        },

        /**
         * 异步校验成功
         *
         * 这里是说有所有同步/异步校验都通过了
         *
         * @private
         * @fires module:Validator#valid
         * @fires module:Validator#invalid
         * @fires module:Validator#aftervalidate
         * @param  {Validity}              validity 校验合法性实例
         * @param  {Array.<ValidityState>} states   校验状态们
         * @param  {Array.<string>}        names    校验规则的名称
         * @param  {boolean}               silent   是否发送相关的事件和更新控件状态
         * @return {boolean}
         */
        onValidateFinish: function (validity, states, names, silent) {

            var target = this.target;

            lib.each(states, function (state, i) {
                validity.addState(names[i], state);
            });

            if (!silent) {
                var state = validity.getValidState();
                var event = new $.Event(state, {
                    validity: validity
                });

                /**
                 * @event module:Validator#valid 校验通过事件
                 * @param {Object} e 事件对象参数
                 * @param {Validity} e.validity 校验状态参数
                 */
                /**
                 * @event module:Validator#invalid 校验不通过事件
                 * @param {Object} e 事件对象参数
                 * @param {Validity} e.validity 校验状态参数
                 */
                // 先释放合法/非法事件，外部监听者可以在这个事件中修改校验的结果
                target.fire(event);

                var afterValidateEvent = new $.Event('aftervalidate', {
                    validity: validity
                });

                /**
                 * @event module:Validator#aftervalidate 校验完成事件
                 * @param {Object} e 事件对象参数
                 * @param {Validity} e.validity 校验状态参数
                 */
                target.fire(afterValidateEvent);

                // 如果事件的默认动作没有被阻止, 那么我们更新一下控件的状态
                if (!event.isDefaultPrevented()
                    || !afterValidateEvent.isDefaultPrevented()
                ) {
                    // 更新控件的状态
                    this.updateControlState(validity);
                }
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
            var target = this.target;

            if (target.isDisabled() || target.isReadOnly()) {
                return;
            }

            var valid = validity.isValid();
            var state = validity.getValidState();
            var inverse = !valid ? 'valid' : 'invalid';

            // 添加合法/非法状态样式
            if (!target.hasState(state)) {
                target.addState(state);
            }

            // 移除相反状态
            if (target.hasState(inverse)) {
                target.removeState(inverse);
            }

        },

        /**
         * @override
         */
        dispose: function () {
            this.target = null;
            this.$parent();
        }

    });

    return Validator;
});

