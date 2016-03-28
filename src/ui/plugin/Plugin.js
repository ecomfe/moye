/**
 * @copyright 2014 Baidu Inc. All rights reserved.
 * @file moye插件
 * @author Leon(ludafa@outlook.com)
 * @requires lib
 * @module Plugin
 */

define(function (require) {

    var lib = require('../lib');

    var Plugin = lib.newClass({

        /** @lends Plugin.prototype */

        $class: 'Plugin',

        options: {},

        /**
         * 初始化
         *
         * @private
         * @param  {Object} options 参数
         */
        initialize: function (options) {
            lib.extend(this, this.options, options);
        },

        /**
         * 激活插件
         *
         * @public
         * @method module:Plugin#activate
         * @param  {module:Control} control 控件
         */
        activate: function (control) {
            this.active = true;
        },

        /**
         * 禁用插件
         *
         * @public
         * @method module:Plugin#inactivate
         */
        inactivate: function () {
            this.active = false;
        },

        /**
         * 是否已经
         * 被激活
         * @public
         * @method module:Plugin#isActivated
         * @return {boolean}
         */
        isActivated: function () {
            return !!this.active;
        },

        /**
         * 销毁
         *
         * @public
         * @method module:Plugin#dispose
         */
        dispose: function () {
            this.control = null;
        }

    });

    return Plugin;
});
