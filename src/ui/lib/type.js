/**
 * @file 类型相关的小函数
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var $ = require('jquery');
    var fn = require('./function');
    var array = require('./array');

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
        exports['is' + name] = fn.curry(is, name);
    });

    exports.isNaN = function (obj) {
        return Number.isNaN(obj);
    };

    exports.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };

    exports.isPromise = function (obj) {
        return obj && exports.isFunction(obj.then);
    };

    exports.typeOf = function (obj) {
        return exports.isElement(obj)
                ? 'element'
                : $.type(obj);
    };

    return exports;
});
