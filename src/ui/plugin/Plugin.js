/**
 * @file MOYE插件
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {

    var $ = require('jquery');
    var lib = require('../lib');

    var Plugin = lib.newClass({

        $class: 'Plugin',

        options: {},

        initialize: function (options) {
            lib.extend(this, this.options, options);
        },

        /**
         * 激活插件
         * @param  {Control} control 控件
         */
        activate: function (control) {
            this.active = true;
        },

        /**
         * 禁用插件
         */
        inactivate: function () {
            this.active = false;
        },

        /**
         * 是否已经被激活
         * @return {Boolean} [description]
         */
        isActivated: function () {
            return !!this.active;
        },

        /**
         * 销毁
         */
        dispose: function () {
        }

    });

    return Plugin;
});
