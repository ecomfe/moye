/**
 * @file 字符串相关的小工具
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var $ = require('jquery');

    return {

        /**
         * 生成全局唯一标识
         *
         * @method module:lib.guid
         * @return {string} 新的全局唯一标识
         */
        guid: (function () {
            var guidPrefix = 'moye';
            var guid = 0;
            return function () {
                return guidPrefix + '-' + guid++;
            };
        })(),


        /**
         * 将字符串转换成单词首字母大写
         *
         * @method module:lib.capitalize
         * @param {string} source 源字符串
         *
         * @return {string}
         */
        capitalize: function (source) {
            return String(source).replace(
                /\b[a-z]/g,
                function (match) {
                    return match.toUpperCase();
                }
            );
        },

        /**
         * 测试是否包含指定字符
         *
         * @method module:lib.contains
         * @param {string} source 源字符串
         * @param {string} target 包含的字符串
         * @param {string} seperator 分隔字符
         *
         * @return {boolean} 是否包含的结果
         */
        contains: function (source, target, seperator) {
            seperator = seperator || ' ';
            source = seperator + source + seperator;
            target = seperator + $.trim(target) + seperator;
            return source.indexOf(target) > -1;
        }

    };
});
