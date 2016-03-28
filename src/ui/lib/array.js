/**
 * @copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 数组相关小工具
 * @author Leon(ludafa@outlook.com)
 */

define(function (require) {

    /**
     * 方法静态化
     *
     * 反绑定、延迟绑定
     *
     * @inner
     * @param {Function} method 待静态化的方法
     * @return {Function} 静态化包装后方法
     */
    function generic(method) {
        return function () {
            return Function.call.apply(method, arguments);
        };
    }

    var exports = {

        /**
         * 数组切片方法
         *
         * @method module:lib.slice
         *
         * @param {Array} array 输入数组或类数组
         * @param {number} startIndex 切片的开始索引
         * @param {number} endIndex 切片的结束索引
         *
         * @return {Array} 新的数组
         */
        slice: generic(Array.prototype.slice),


        /**
         * 遍历数组 / 对象
         *
         * @method module:lib.each
         * @param  {(Array | Object)} obj      遍历的目标
         * @param  {Function}         iterator 遍历器
         * @param  {*}                context  遍历器执行作用域
         * @return {(Array | Object)}          遍历的目标
         */
        each: function (obj, iterator, context) {

            var i;

            if (obj == null) {
                return obj;
            }

            var length = obj.length;

            if (length === +length) {
                for (i = 0; i < length; i++) {
                    iterator.call(context, obj[i], i, obj);
                }
            }
            else {
                var keys = exports.keys(obj);
                for (i = 0, length = keys.length; i < length; i++) {
                    var key = keys[i];
                    iterator.call(context, obj[key], key, obj);
                }
            }

            return obj;

        },

        /**
         * 同underscore.map
         *
         * @method module:lib.map
         * @param  {(Array | Object)} obj      遍历的目标
         * @param  {Function}         iterator 遍历器
         * @param  {*}                context  遍历器执行作用域
         * @return {(Array | Object)}          新的数组
         */
        map: function (obj, iterator, context) {

            var i;

            if (obj == null) {
                return [];
            }

            var length = obj.length;
            var result = [];

            if (length === +length) {
                for (i = 0; i < length; i++) {
                    result[i] = iterator.call(context, obj[i], i, obj);
                }
            }
            else {
                var keys = exports.keys(obj);
                for (i = 0, length = keys.length; i < length; i++) {
                    var key = keys[i];
                    result.push(iterator.call(context, obj[key], key, obj));
                }
            }

            return result;

        },

        /**
         * ES5的reduce函数啦~
         *
         * @method module:lib.reduce
         * @param  {(Object | Array)} obj           处理的数据
         * @param  {Function}         iterator      迭代器
         * @param  {*}                initialValue  初始值
         * @param  {Object}           context       执行上下文
         * @return {*}
         */
        reduce: function (obj, iterator, initialValue, context) {
            exports.each(
                obj,
                function (value, key) {
                    initialValue = iterator.call(context, initialValue, value, key);
                },
                context
            );
            return initialValue;
        },


        /**
         * 数组的 filter 方法
         *
         * 现代浏览器中数组 filter 方法静态化
         * @method module:lib.filter
         * @param {Array} obj 待处理的数组或类数组
         * @param {Function} iterator 迭代方法
         * @param {Object=} bind 迭代方法中绑定的 this
         * @return {Array} filter 处理后的原数组
         */
        filter: function (obj, iterator, bind) {
            var result = [];
            for (var i = 0, l = obj.length; i < l; i++) {
                if (i in obj && iterator.call(bind, obj[i], i, obj)) {
                    result.push(obj[i]);
                }
            }
            return result;
        },

        /**
         * 查询数组中指定元素的索引位置
         *
         * @method module:lib.indexOf
         * @param {Array} source 需要查询的数组
         * @param {*} item 查询项
         * @param {number} from 初始的查询位置
         * @return {number} 指定元素的索引位置，查询不到时返回-1
         */
        indexOf: function (source, item, from) {
            var length = this.length >>> 0;
            var i = (from < 0) ? Math.max(0, length + from) : from || 0;
            for (; i < length; i++){
                if (source[i] === item) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * es5的keys函数
         *
         * @method module:lib.keys
         * @param  {(Object | Array)} obj   处理的数据
         * @return {string[]}
         */
        keys: Object.keys
            ? function (obj) {
                return obj == null
                    ? []
                    : Object.keys(obj);
            }
            : function (obj) {
                var keys = [];

                if (obj == null) {
                    return keys;
                }

                for (var name in obj) {

                    // 这里需要使用Object的hasOwnProperty来搞
                    // 防止当obj.hasOwnProperty方法被修改
                    if (Object.prototype.hasOwnProperty.call(obj, name)) {
                        keys.push(name);
                    }
                }

                return keys;
            },

        /**
         * 生成数字序列，同underscore.range
         *
         * @method module:lib.range
         * @param  {number} start 起始值
         * @param  {number} stop  终止值
         * @param  {number} step  步进值
         * @return {Array.number}
         */
        range: function (start, stop, step) {
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }

            step = step || 1;

            var length = Math.max(Math.ceil((stop - start) / step), 0);
            var range = Array(length);

            for (var idx = 0; idx < length; idx++, start += step) {
                range[idx] = start;
            }

            return range;
        }

    };

    return exports;

});
