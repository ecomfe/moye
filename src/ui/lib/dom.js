/**
 * @file DOM相关的小工具
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var type = require('./type');

    return {
        /**
         * 从文档中获取指定的DOM元素
         *
         * @method module:lib.g
         * @param {string|HTMLElement} id 元素或元素 id
         *
         * @return {?HTMLElement} 获取的元素，查找不到时返回null，如果参数不合法，直接返回参数
         */
        g: function (id) {
            return type.isString(id) ? document.getElementById(id) : id;
        }
    };

});
