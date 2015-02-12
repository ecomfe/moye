/**
 * @file 一大堆校验规则
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var ValidityState = require('./ValidityState');
    var lib = require('../lib');

    /**
     * 具名规则缓存池
     * @type {Object}
     */
    var rules = {};

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
            return func.call(this, value, control);
        };
    }

    var ValidityRule = lib.newClass({

        options: {
            message: {
                invalid: '${title}格式不符合要求'
            }
        },

        $class: 'ValidityRule',

        initialize: function (options) {

            // 分情况将配置转化成标准配置格式
            // 如果输入是一个正则
            if (lib.isRegExp(options)) {
                options = {
                    check: wrapRegex(options)
                };
            }
            // 如果输入是一个函数
            else if (lib.isFunction(options)) {
                options = {
                    check: wrapFunction(options)
                };
            }
            // 如果输入是一个字符串
            else if (lib.isString(options)) {
                options = {
                    type: options
                };
            }

            // 如果`check`方法是一个正则, 那么需要把它包装一下下
            if (lib.isRegExp(options.check)) {
                options.check = wrapRegex(options.check);
            }

            // 如果`message`是一个字符串, 那么我们默认它是错误提示信息模板
            if (lib.isString(options.message)) {
                options.message = {
                    invalid: options.message
                };
            }

            var type = options.type;
            var preset = rules[type];

            // 如果配置中设定了type, 而且我们在池子里没找到这个类型的校验规则, 就跪了
            if (type && !preset) {
                throw new Error('ValidateRule [' + type + '] cannot be found');
            }

            lib.extend(this, preset || this.options, options);
        },

        getMessage: function (control, isValid) {
            var state = isValid ? 'valid' : 'invalid';
            var message = this.message || control[this.type + lib.captalize(state) + 'Message'];
            if (lib.isFunction(message)) {
                return message.call(this, control, isValid);
            }
            var template = message[state];
            return template
                ? lib.format(template, control, this)
                : '';
        },

        /**
         * 校验
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
