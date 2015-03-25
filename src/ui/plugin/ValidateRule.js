/**
 * @file 一大堆校验规则
 * @author Leon(lupengyu@baidu)
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var ValidityState = require('./ValidityState');
    var lib = require('../lib');

    /**
     * 具名规则缓存池
     *
     * @type {Object}
     */
    var rules = {};

    /**
     * 将给定的状态数据，转成 `ValidityState` 对象
     *
     * @inner
     * @param {Control} control 要校验的控件实例
     * @param {*} s 状态信息
     * @return {ValidityState}
     */
    function toValidityState(control, s) {
        if (s instanceof ValidityState) {
            return s;
        }

        var result;
        if (lib.isString(s)) {
            result = {state: false, message: s};
        }
        else if (lib.isBoolean(s) || lib.isNumber(s)) {
            result = {state: !!s};
        }
        else {
            s || (s = {});
            result = {state: !!s.state, message: s.message};
        }

        if (!result.message) {
            result.message = this.getMessage(control, result.state);
        }

        return new ValidityState(result.state, result.message);
    }

    function wrapRegex(reg) {
        return function (value, control) {
            var state = reg.test(value);
            return new ValidityState(
                state,
                this.getMessage(control, state)
            );
        };
    }

    function wrapFunction(func) {
        return function (value, control) {
            var me = this;
            var result = func.call(me, value, control);

            // 对于 check 结果做个预处理，确保返回的数据对象是 `ValidityState`
            // 同时给使用者更多灵活性，不用强制要求必须返回 `ValidityState` 对象
            if (lib.isPromise(result)) {
                return result.then(
                    function (state) {
                        return toValidityState.call(me, control, state);
                    },
                    function (state) {
                        return toValidityState.call(me, control, state);
                    }
                );
            }

            return toValidityState.call(me, control, result);
        };
    }

    /**
     * 验证规则
     *
     * @exports ValidityRule
     */
    var ValidityRule = lib.newClass({

        $class: 'ValidityRule',

        /**
         * 验证规则选项配置
         *
         * @property {Object} options 验证规则选项配置
         * @property {string|Object|function(Control, boolean):string}
         *           options.message 校验结果显示的信息，或者自定义的消息获取方法
         *           对于object格式为：{invalid: string, valid: string}
         *           对于string等价于{invalid: string}
         * @property {string} options.type 注册的校验规则名称
         * @property {function} options.check 自定义的校验方法，参数说明见
         *           {@link ValidityRule.prototype.check}方法，参数返回值可以比较灵活
         *           可以是 `boolean`, `{state: boolean, message: string}`、`string`
         *           对于返回的 `promise` 回调参数也是一样的。为了避免对`ValidityState`的
         *           依赖，不建议返回该对象实例
         */
        options: {
            /**
             * 校验结果显示的信息
             *
             * @type {Object}
             */
            message: {
                invalid: '!{title}格式不符合要求'
            }
        },

        initialize: function (options) {

            // 如果输入是一个正则 或者 函数
            if (lib.isRegExp(options) || lib.isFunction(options)) {
                options = {
                    check: options
                };
            }
            // 如果输入是一个字符串
            else if (lib.isString(options)) {
                options = {
                    type: options
                };
            }

            var type = options.type;
            var preset = rules[type];

            // 如果配置中设定了type, 而且我们在池子里没找到这个类型的校验规则, 就跪了
            if (type && !preset) {
                throw new Error('ValidateRule [' + type + '] cannot be found');
            }

            options = lib.extend({}, preset || this.options, options);

            // 如果`check`方法是一个正则, 那么需要把它包装一下下
            if (lib.isRegExp(options.check)) {
                options.check = wrapRegex(options.check);
            }
            // 如果 `check` 方法是一个 function，也需要包装下
            else if (lib.isFunction(options.check)) {
                options.check = wrapFunction(options.check);
            }

            // 如果 `message` 是一个字符串, 那么我们默认它是错误提示信息模板
            if (lib.isString(options.message)) {
                options.message = {
                    invalid: options.message
                };
            }

            lib.extend(this, options);
        },

        /**
         * 获取校验消息
         *
         * @param {Control} control 被校验的控件实例
         * @param {boolean} isValid 是否有效
         * @return {string}
         */
        getMessage: function (control, isValid) {
            var state = isValid ? 'valid' : 'invalid';
            var message = this.message || control[this.type + lib.capitalize(state) + 'Message'];

            if (lib.isFunction(message)) {
                return message.call(this, control, isValid);
            }

            var template = lib.isString(message) ? message : message[state];
            return template
                ? lib.format(template, control, this)
                : '';
        },

        /**
         * 校验
         *
         * @abstract
         * @param {string} value 控件值
         * @param {Control} control 控件
         * @return {ValidityState|Promise}
         */
        check: function (value, control) {
            throw new Error('`check` must be implemented');
        }

    });

    /**
     * 注册一个校验器
     *
     * @param  {string} name 校验器名称
     * @param  {Object} conf 校验参数
     * @return {ValidityRule}
     */
    ValidityRule.register = function (name, conf) {
        rules[name] = conf;
        return this;
    };

    return ValidityRule;
});
