/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file Cookie 读写模块
 * @author chris(wfsr@foxmail.com)
 */
define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');

    /**
     * 转义正则关键字字符
     *
     * @param {string} str 需要转义的字符
     * @return {string} 转义后的字符
     * @inner
     */
    var escapeRegExp = function (str) {
        return String(str).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
    };

    /**
     * Cookie 模块
     *
     * @requires lib
     * @exports Cookie
     * @example
     * var cookie = new Cookie('foo', {
     *     duration: 1, // 1 天
     *     domain: 'foo.com',
     *      path: '/'
     *  });
     * cookie.set('bar');
     * cookie.get(); // 'bar'
     *
     * 或者使用静态方法：
     *
     * Cookie.set('foo', 'bar');
     * Cookie.get('foo');   // 'bar'
     */
    var Cookie = lib.newClass(/** @lends module:Cookie.prototype */{


        /**
         * 控件配置项
         *
         * @name module:Cookie#options
         * @type {Object}
         * @property {string} path Cookie 的存储路径
         * @property {string} domain Cookie 的存取域
         * @property {number} duration Cookie 的有效天数
         * @property {boolean} secure 是否安全连接 (https)
         * @private
         */
        options: {
            path: '/',
            domain: '',
            duration: 0,
            secure: false
        },

        /**
         * 初始化
         *
         * @param {string} key Cookie 键名
         * @param {?Object=} options 配置项 @see Cookie#options
         * @private
         */
        initialize: function (key, options) {
            options = this.setOptions(options);

            this.key = key;

            this.value = [
                options.domain ? 'domain=' + options.domain : '',
                options.path ? 'path=' + options.path : '',
                options.secure ? 'secure' : ''
            ].join('; ');
        },

        /**
         * 读取指定键名的 Cookie 值
         *
         * @param {?string} key 指定新的键名
         * @return {string} Cookie 中键名为 `key` 的值，无值返回空字符
         * @public
         */
        get: function (key) {
            var value = document.cookie.match(
                '(?:^|;)\\s*' + escapeRegExp(key || this.key) + '=([^;]*)'
            );
            return value ? decodeURIComponent(value[1]) : '';
        },

        /**
         * 设置指定键的 Cookie 值
         *
         * @param {?string} key 指定的 Cookie 键名
         * @param {string} value 要设置的 Cookie 值
         * @return {module:Cookie} 当前 Cookie 实例
         * @public
         */
        set: function (key, value) {
            if (arguments.length < 2) {
                value = key;
                key = this.key;
            }

            var options = this.options;
            value = encodeURIComponent(value) + this.value;

            if (options.duration) {
                value += ''
                    + '; expires='
                    + new Date(
                        options.duration * 86400000 + (+new Date())
                    ).toGMTString();
            }

            document.cookie = key + '=' + value;
            return this;
        },

        /**
         * 移除指定键名的 Cookie
         *
         * @param {?string} key 要移除的 Cookie 键名
         * @return {module:Cookie} 当前 Cookie 实例
         * @public
         */
        remove: function (key) {
            var options = this.options;
            var duration = options.duration;
            options.duration = -1;
            this.set(key || this.key);
            options.duration = duration;

            return this;
        }

    });
    Cookie.implement(lib.configurable);

    $.extend(Cookie, /** @lends module:Cookie */{

        /**
         * 读取指定键名的 Cookie 值
         * @see module:Cookie#get
         *
         * @param {string} key 指定新的键名
         * @return {string} Cookie 中键名为 `key` 的值，无值返回空字符
         * @public
         */
        get: function (key) {
            return new Cookie(key).get();
        },

        /**
         * 设置指定键的 Cookie 值
         * @see module:Cookie#set
         *
         * @param {string} key 指定的 Cookie 键名
         * @param {string} value 要设置的 Cookie 值
         * @param {Object} options Cookie 配置项
         * @see module:Cookie#options
         * @return {module:Cookie} 当前 Cookie 实例
         * @public
         */
        set: function (key, value, options) {
            return new Cookie(key, options).set(value);
        },

        /**
         * 移除指定键名的 Cookie
         * @see module:Cookie#remove
         *
         * @param {string} key 要移除的 Cookie 键名
         * @return {module:Cookie} 当前 Cookie 实例
         * @public
         */
        remove: function (key, options) {
            return new Cookie(key, options).remove();
        }
    });

    return Cookie;

});
