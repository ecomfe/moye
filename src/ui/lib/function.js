/**
 * @file 函数相关的小工具
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var $     = require('jquery');
    var array = require('./array');
    var slice = array.slice;

    return {

        /**
         * 为对象绑定方法和作用域
         *
         * @method module:lib.binds
         * @param {Object} me 要绑定的 this
         * @param {(Array.string | string)} methods 要绑定的方法名列表
         */
        binds: function (me, methods) {
            if ($.type(methods) === 'string') {
                methods = ~methods.indexOf(',')
                    ? methods.split(/\s*,\s*/)
                    : slice(arguments, 1);
            }
            if (!methods || !methods.length) {
                return;
            }
            for (var i = 0, len = methods.length; i < len; ++i) {
                var name = methods[i];
                var method = me[name];
                if (method) {
                    me[name] = $.proxy(method, me);
                }
            }
        },

        /**
         * 对指定的函数进行包装, 返回一个在指定的时间内一次的函数
         * @param  {Function} fn      待包装函数
         * @param  {number}   wait    时间范围
         * @return {Function}         包装后的函数
         */
        throttle: function (fn, wait) {
            var timer = null;
            var me = this;
            return function () {
                if (timer) {
                    return;
                }
                timer = setTimeout(function () {
                    timer = null;
                }, wait);
                return fn.apply(me, arguments);
            };
        },

        /**
         * 对指定的函数进行包装, 返回一个新的函数
         * 新的函数在调用后wait毫秒后执行原函数
         * 如果在wait的这段时间内新的函数再次被调用,
         * 那么重置wait时长, 在下一次wait毫秒后执行原函数
         *
         * @param  {Function} fn      待包装函数
         * @param  {number}   wait    时间范围
         * @return {Function}         包装后的函数
         */
        debounce: function (fn, wait) {
            var timer;
            var me = this;
            return function () {
                var args = arguments;
                // 如果有计时器，那么先把它清了
                if (timer) {
                    clearTimeout(timer);
                }
                // 重新起动一个定时器
                timer = setTimeout(function () {
                    timer = null;
                    return fn.apply(me, args);
                }, wait);
            };
        },

        /**
         * 对指定函数进行包装，返回一个新函数
         * 此函数在wait毫秒后执行
         * @param  {Function} fn      待包装函数
         * @param  {number}   wait    延迟时间
         * @return {Function}
         */
        delay: function (fn, wait) {
            var me = this;
            return function () {
                var args = slice(arguments);
                setTimeout(function () {
                    return fn.apply(me, args);
                }, wait);
            };
        },

        /**
         * 为函数提前绑定参数（柯里化）
         *
         * @see http://en.wikipedia.org/wiki/Currying
         * @method module:lib.curry
         * @param  {Function} fn 要绑定的函数
         * @param  {*}        args 函数执行时附加到执行时函数前面的参数
         * @return {Function} 封装后的函数
         */
        curry: function (fn) {
            var args = slice(arguments, 1);
            return function () {
                return fn.apply(this, args.concat(slice(arguments)));
            };
        }
    };

});
