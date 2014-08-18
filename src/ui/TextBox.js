/**
 * @file 文本输入框
 * @author leon <lupengyu@baidu.com>
 */
define(function (require) {

    var $       = require('jquery');
    var Control = require('./Control');
    var painter = require('./painter');

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
            var input = options.input ? $(options.input) : main.find('input');

            $.extend(
                this,
                this.options,
                options,
                {
                    input: input.get(0),
                    value: options.value || input.val()
                }
            );

            me.main = main.get(0);
        },

        /**
         * 初始化事件绑定
         *
         * @protected
         */
        initEvents: function () {
            var input = this.input;
            // 将HTMLElement事件代理到`Control`事件
            this.delegate(input, 'input', this._on)
                .delegate(input, 'blur',  this._on)
                .delegate(input, 'focus', this._on);

            return this;
        },

        repaint: painter.createRepaint([{
            name: ['width', 'height'],
            paint: function (conf, width, height) {
                $(this.main).css({
                    width: width,
                    height: height
                });
            }
        }, {
            name: ['value'],
            paint: function (conf, value) {
                this.setValue(value || '');
            }
        }]),

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
            return this.input.value;
        },

        /**
         * 设置值
         *
         * @param {string} value 控件值
         * @return {Control}
         */
        setValue: function (value) {
            this.input.value = value;
            return this;
        },

        /**
         * 禁用
         */
        disable: function () {
            this.addState('disabled');
            this.input.disabled = true;
        },

        /**
         * 激活
         *
         * @return {[type]} [return description]
         */
        enable: function () {
            this.removeState('disabled');
            this.input.disabled = false;
        },

        /**
         * 设为只读
         *
         * @param {boolean} readOnly 是否只读
         */
        setReadOnly: function (readOnly) {
            this[readOnly ? 'addState' : 'removeState']('readOnly');
            $(this.input).attr('readonly', !!readOnly);
        },

        /**
         * 是否为只读
         *
         * @return {boolean}
         */
        isReadOnly: function () {
            return this.hasState('readOnly');
        }

    });

    return TextBox;

});
