/**
 * @file MOYE 按钮
 * @author leon(leonlu@outlook.com)
 */
define(function (require) {

    var $       = require('jquery');
    var Control = require('./Control');
    var painter = require('./painter');

    var Button = Control.extend({

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Button',


        /**
         * 控件配置项
         *
         * @name module:Button#optioins
         * @type {Object}
         * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
         */
        options: {

            text: '',

            width: '',

            height: ''

        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Pager#options
         * @private
         */
        init: function (options) {
            this.$parent(options);
            this.text = this.text || this.main.innerHTML;
        },

        /**
         * 初始化事件绑定
         *
         * @return {Control} self
         */
        initEvents: function () {
            this.delegate(this.main, 'click', this.onClick);
        },

        /**
         * 重绘
         *
         * @protected
         */
        repaint: painter.createRepaint(
            {
                name: [ 'width', 'height' ],
                paint: function (conf, width, height) {
                    width && $(this.main).css('width', width);
                }
            },
            {
                name: ['height'],
                paint: function (conf, height) {
                    height && $(this.main).css('height', height);
                }
            },
            {
                name: [ 'text' ],
                paint: function (conf, text) {
                    this.setText(text);
                }
            }
        ),

        /**
         * 设定按钮文本
         *
         * @param {string} text 文本
         * @return {Button} SELF
         */
        setText: function (text) {
            this.main.innerHTML = text;
            return this;
        },

        /**
         * 获取按钮文本
         *
         * @return {string}
         */
        getText: function () {
            return this.main.innerHTML;
        },

        /**
         * 点击事件处理函数
         *
         * @param {Event} e 点击事件
         * @private
         */
        onClick: function (e) {
            // 搞成按钮的A标签点击都要被阻止跳转
            if (this.main.tagName === 'A') {
                e.preventDefault();
            }
            if (!this.hasState('disabled')) {
                this.fire('click', e);
            }
        }

    });

    return Button;

});
