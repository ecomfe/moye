/**
 * @file 文本输入框
 * @author leon <lupengyu@baidu.com>
 */
define(function (require) {

    var $       = require('jquery');
    var Control = require('./Control');
    
    var TextBox = Control.extend({

        type: 'textbox',

        options: {
            main: '',
            plugins: []
        },

        /**
         * 初始化参数
         * 
         * @param {object} options 参数
         * @protected
         */
        init: function (options) {
            var me = this;
            var main = $(options.main);

            me.input = options.input ? $(options.input) : main.find('input');
            me.input = me.input.get(0);
            me.main = main.get(0);
        },

        /**
         * 初始化事件绑定
         * 
         * @protected
         */
        initEvents: function () {
            var me = this;
            var input = $(me.input);

            // 将HTMLElement事件代理到`Control`事件
            input   
                .delegate('input', input, me._on)
                .delegate('blur',  input, me._on)
                .delegate('focus', input, me._on);

            return me;
        },

        /**
         * HTMLElement事件处理函数
         * 
         * @private
         * @param {Event} e HTMLElement事件
         */
        _on: function (e) {
            this.fire(e.type, e);
        },

        /**
         * 返回控件值
         * 
         * @public
         * @return {string}
         */
        getValue: function () {
            return this.input.val();
        }

    });

    return TextBox;

});

