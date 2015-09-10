/**
 * @file moye - PopupUbsLog
 *       在控件初始化的时候给控件popup弹出层添加UBS日志的参数
 * @author cxtom(cxtom2008@gmail.com)
 * @module PopupUbsLog
 * @extends module:Plugin
 */

define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');

    var PopupUbsLog = Plugin.extend(/** @lends module:PopupUbsLog.prototype */{

        $class: 'PopupUbsLog',

        /**
         * 激活
         *
         * @public
         * @param {module:Tab} control 含有popup的控件
         */
        activate: function (control) {

            this.control = control;

            this.$parent(control);

            this.onShow = $.proxy(this.onShow, this);

            control.on('show', this.onShow);

            this.main = null;

        },

        /**
         * popup显示的事件处理函数
         *
         * @private
         */
        onShow: function () {

            var control = this.control;

            var main = control.type === 'Tip'
                ? control.main
                : (control.popup && control.popup.main);

            if (!main) {
                return;
            }

            main = $(main);

            main.attr('data-click', lib.stringify(control.dataClick));

        },


        /**
         * 去激活
         *
         * @public
         * @override
         */
        inactivate: function () {

            var control = this.control;

            control.un('show', this.onShow);

            this.control = null;

            this.$parent();

        }

    });

    return PopupUbsLog;
});
