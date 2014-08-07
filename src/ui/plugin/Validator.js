/**
 * @file MOYE校验插件
 */
define(function (require) {
    
    var $ = require('jquery');
    var lib = require('../lib');
    var Validity = require('./Validity');

    function Validitor(options) {
        $.extend(this, this.options, options);
    }

    Validitor.prototype = {

        constructor: Validitor,

        options: {
            auto: true,
            listen: ['blur']
        },

        execute: function (control) {

            var me = this;

            me.target = control;

            var validate = control.validate = $.proxy(me.validate, me, control);

            // 如果设定开启自动校验，那么就把alisten中设定的事件名绑定上validate方法
            if (me.auto) {
                $.each(me.listen, function (i, eventName) {
                    control.on(eventName, validate);
                });
            }

        },

        /**
         * asdfasdfs
         * 
         * @private
         * @param {[type]} validity [validity description]
         * @return {[type]} [return description]
         */
        __onValidityChange: function (validity) {

        },

        /**
         * 校验输入值
         * 
         * 校验规则可以是以下三种类型
         * 1：schema
         * 2：函数
         * 
         * @param {MOYE/Control} control 控件
         * @param {*} value 值
         * @param {Object | Function} schema 校验规则
         * @return {Promise} 
         */
        validate: function (control) {

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

            // 如果schema是一个函数，那么包装一下这货
            if ($.isFunction(schema)) {
                schema = me.schema = [{
                    type: 'function',
                    check: schema
                }];
            }

            // 基于schema的校验规则
            $.each(schema, function (key, rule) {

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
                return me.__finish(validity, states, names);
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
                return me.__finish(validity, results, names);
            });

        },

        /**
         * 异步校验成功
         * 
         * 这里是说有所有异步校验都通过了
         * 
         * @private
         * @param {Validity} validity 校验合法性实例
         * @param {Array.[ValidityState]} states 校验状态们
         * @param {Array.[string]} names 校验规则的名称
         */
        __finish: function (validity, states, names) {
            
            var target = this.target;

            $.each(states, function (i, state) {
                validity.addState(names[i], state);
            });

            var state = validity.getValidState();

            // 先释放合法/非法事件，外部监听者可以在这个事件中修改校验的结果
            target.fire(state, {
                type: state,
                validity: validity
            });

            // 更新控件的状态
            this.__updateControlState(validity);

            return validity.isValid();

        },

        /**
         * 更新控件状态
         * 
         * @private
         * @param {Validity} validity 合法性实例
         */
        __updateControlState: function (validity) {

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

    };

    return function (options) {
        return new Validitor(options || {});
    };

});