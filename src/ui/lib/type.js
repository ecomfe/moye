/**
 * @copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 类型相关的小函数
 * @author Leon(ludafa@outlook.com)
 */

define(function (require) {

    var $ = require('jquery');
    var fn = require('./function');
    var array = require('./array');

    /**
     * 判断一个对象是不是指定的类型
     *
     * @inner
     * @param  {string}  type 类型
     * @param  {*}       obj  想要判断的对象
     * @return {boolean}
     */
    function is(type, obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === type;
    }

    var exports = {};

    var types = [
        'Null',
        'Undefined',
        'String',
        'Array',
        'Function',
        'Number',
        'Date',
        'Object',
        'Boolean',
        'RegExp'
    ];

    array.each(types, function (name) {


        /**
         * 判断是否字符串
         *
         * @method module:lib.isString
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否数组
         *
         * @method module:lib.isArray
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否函数
         *
         * @method module:lib.isFunction
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否日期对象
         *
         * @method module:lib.isDate
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否对象
         *
         * @method module:lib.isObject
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否为null
         *
         * @method module:lib.isNull
         * @param {*} obj 待判断的输入
         * @return {boolean}
         */
        /**
         * 判断是否为undefined
         *
         * @method module:lib.isUndefined
         * @param {*} obj 待判断的输入
         * @return {boolean}
         */
        /**
         * 判断是否为数字
         *
         * @method module:lib.isNumber
         * @param {*} obj 待判断的输入
         * @return {boolean}
         */
        /**
         * 判断是否为布尔类型
         *
         * @method module:lib.isBoolean
         * @param {*} obj 待判断的输入
         * @return {boolean}
         */
        /**
         * 判断是否为正则表达式
         *
         * @method module:lib.isRegExp
         * @param {*} obj 待判断的输入
         * @return {boolean}
         */
        exports['is' + name] = fn.curry(is, name);
    });

    /**
     * 判断一个对象是不是NaN
     *
     * @method module:lib.isNaN
     * @param  {*}       obj 判断的目标
     * @return {boolean}
     */
    exports.isNaN = function (obj) {
        return Number.isNaN(obj);
    };

    /**
     * 判断一个对象是不是HTML元素
     *
     * @method module:lib.isElement
     *
     * @param  {*}       obj 判断的目标
     * @return {boolean}
     */
    exports.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };

    /**
     * 判断一个对象是一个promise
     *
     * @method module:lib.isPromise
     * @param  {*}       obj 判断的对象
     * @return {boolean}
     */
    exports.isPromise = function (obj) {
        return obj && exports.isFunction(obj.then);
    };

    /**
     * 返回一个对象的真实类型
     *
     * @method module:lib.typeOf
     *
     * @param  {*}      obj 处理的对象
     * @return {string}
     */
    exports.typeOf = function (obj) {
        return exports.isElement(obj) ? 'element' : $.type(obj);
    };

    return exports;
});
