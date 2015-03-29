/**
 * @file 文本输入框
 * @author leon <lupengyu@baidu.com>
 */

define(function (require) {

    var $       = require('jquery');
    var Control = require('./Control');
    var painter = require('./painter');
    var lib     = require('./lib');

    var TextBox = Control.extend({

        type: 'TextBox',

        options: {
        },

        /**
         * 初始化参数
         *
         * @param {Object} options 参数
         * @protected
         */
        init: function (options) {
            this.$parent(options);
            var input = options.input
                ? $(options.input)
                : $(this.main).find('input');
            this.value = options.value || input.val();
            this.input = input[0];
        },

        /**
         * 初始化事件绑定
         *
         * @protected
         * @return {TextBox}
         */
        initEvents: function () {
            var input = this.input;
            var dispatchEvent = this.dispatchEvent;

            // 将HTMLElement事件代理到`Control`事件
            this.delegate(input, 'blur',  dispatchEvent)
                .delegate(input, 'focus', dispatchEvent)
                .delegate(input, 'keyup', dispatchEvent);

            if (lib.browser.ie < 9) {
                this.delegate(input, 'propertychange', dispatchEvent);
            }
            else {
                this.delegate(input, 'input', dispatchEvent);
            }

            return this;
        },

        repaint: painter.createRepaint(
            Control.prototype.repaint,
            {
                name: ['name'],
                paint: function (conf, name) {
                    this.input.name = name || '';
                }
            },
            {
                name: ['value'],
                paint: function (conf, value) {
                    this.setValue(value || '');
                }
            }
        ),

        /**
         * HTMLElement事件处理函数
         *
         * @private
         * @param {Event} e HTMLElement事件
         */
        dispatchEvent: function (e) {

            if (this.isReadOnly()) {
                e.preventDefault();
                return;
            }

            var type = e.type;

            if (type === 'keyup' && e.keyCode === 13) {
                type = 'enter';
            }

            if (type === 'input'
                || type === 'propertychange' && e.originalEvent.propertyName === 'value'
            ) {
                type = 'change';
            }


            var event = this.fire(type);

            if (event.isDefaultPrevented()) {
                e.preventDefault();
            }

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
         * @return {TextBox}
         */
        disable: function () {
            if (!this.hasState('disabled')) {
                this.addState('disabled');
                this.input.disabled = true;
            }
            return this;
        },

        /**
         * 激活
         *
         * @return {TextBox}
         */
        enable: function () {
            if (this.hasState('disabled')) {
                this.removeState('disabled');
                this.input.disabled = false;
            }
            return this;
        },

        /**
         * 设为只读
         *
         * @param {boolean} readOnly 是否只读
         */
        setReadOnly: function (readOnly) {
            this[readOnly ? 'addState' : 'removeState']('readonly');
            $(this.input).attr('readonly', !!readOnly);
        },

        /**
         * 是否为只读
         *
         * @return {boolean}
         */
        isReadOnly: function () {
            return this.hasState('readonly');
        }

    });

    return TextBox;

});
