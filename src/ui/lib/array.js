/**
 * @file 数组相关小工具
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    /**
     * 方法静态化
     *
     * 反绑定、延迟绑定
     * @inner
     * @param {Function} method 待静态化的方法
     *
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
         * @param {Array} array 输入数组或类数组
         * @param {number} startIndex 切片的开始索引
         * @param {number} endIndex 切片的结束索引
         *
         * @return {Array} 新的数组
         */
        /**
         * 数组切片方法
         *
         * @method module:lib.array.slice
         * @param {Array} array 输入数组或类数组
         * @param {number} startIndex 切片的开始索引
         * @param {number} endIndex 切片的结束索引
         *
         * @return {Array} 新的数组
         */
        slice: generic(Array.prototype.slice),


        each: function (obj, iterator, context) {

            var i;
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

        map: function (obj, iterator, context) {

            var i;
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

        keys: Object.keys
            ? Object.keys
            : function (obj) {
                var keys = [];
                for (var name in obj) {
                    if (obj.hasOwnProperty(name)) {
                        keys.push(name);
                    }
                }
                return keys;
            }

    };

    return exports;

});
