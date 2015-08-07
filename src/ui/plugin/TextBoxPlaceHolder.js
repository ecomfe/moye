/**
 * @file moye - TextBox - placeholder
 * @author cxtom (cxtom2010@gamil.com)
 * @module TextBoxPlaceHolder
 * @extends module:Plugin
 */

define(function (require) {

    var lib  = require('../lib');
    var Plugin = require('./Plugin');
    var Popup = require('../Popup');

    var TextBoxPlaceHolder = Plugin.extend(/** @lends module:TextBoxPlaceHolder.prototype */{

        $class: 'TextBoxPlaceHolder',

        options: {

            /**
             * placeholder显示的颜色
             *
             * @type {String}
             */
            color: '#ccc'

        },

        /**
         * 激活
         *
         * @public
         * @override
         * @param {module:TextBox} textbox 输入框
         */
        activate: function (textbox) {

            var ie = lib.browser.ie;

            if (!ie || ie > 8) {
                textbox.placeholder && $(textbox.input).attr('placeholder', textbox.placeholder);
                return;
            }

            textbox.getPlaceHolder = $.proxy(this.getPlaceHolder, this);

            this.control     = textbox;
            this.input       = textbox.input;
            var placeholder  = textbox.placeholder || $(this.input).attr('placeholder');
            this.placeholder = placeholder ? placeholder : '请输入';

            this.build();

            var me = this;
            var id = textbox.id;

            $(this.input)
                .on('blur.' + id, function (e) {
                    me.isNeedToShow() ? me.show() : me.hide();
                })
                .on('focus.' + id, function (e) {
                    me.hide();
                });
        },

        /**
         * 显示placeholder
         *
         * @private
         * @return {TextBox}
         */
        build: function () {
            var input = $(this.input);
            var me = this;

            var zIndex = input.css('zIndex') || 1;
            zIndex = zIndex + 1;

            var content = ''
                + '<div style="'
                +     'color:' + this.options.color + ';'
                +     'font-size:' + input.css('fontSize') + ';'
                +     'height:' + input.outerHeight() + 'px;'
                +     'width:' + input.outerWidth() + 'px;'
                +     'z-index:' + zIndex + ';'
                +     'line-height:' + input.outerHeight() + 'px'
                + '">' + this.placeholder + '</div>';

            // 计算偏移
            var offsetX = parseInt(input.css('paddingLeft'), 10)
                        + parseInt(input.css('borderLeftWidth'), 10);

            var offsetY = -parseInt(input.outerHeight(), 10);

            // 生成一个popup控件, 用来展现placeholder
            this.main = new Popup({
                target: input,
                mode: 'static',
                content: content,
                offset: {
                    x: offsetX,
                    y: offsetY
                }
            })
            .render()
            .show()
            .on('click', function (e) {
                me.hide();
                me.input.focus();
            });

            // 页面resize时需要重新定位
            this.main.delegate(window, 'resize', this.main.onWindowResize);

            return this.control;
        },

        /**
         * 暴露此方法，方面外部调用进行定制
         *
         * @public
         * @return {Popup}
         */
        getPlaceHolder: function () {
            return this.main;
        },

        /**
         * 是否需要显示
         *
         * @private
         * @return {bool}
         */
        isNeedToShow: function () {
            var textbox = this.control;
            return textbox.getValue() === '' && !$(textbox.input).is(':focus');
        },

        /**
         * 显示浮层
         *
         * @private
         * @return {TextBox}
         */
        show: function () {
            this.main.show();

            return this.control;
        },

        /**
         * 隐藏浮层
         *
         * @private
         * @return {TextBox}
         */
        hide: function () {
            this.main.hide();

            return this.control;
        },


        /**
         * 禁用
         *
         * @override
         */
        inactivate: function () {
            var textbox = this.control;
            var id = textbox.id;

            $(textbox.input)
                .off('focus.' + id)
                .off('blur.' + id);

            this.control = null;
            this.input = null;
            this.placeholder = null;
        },

        /**
         * 销毁
         */
        dispose: function () {
            this.main.destroy();
            this.$parent();
        }

    });

    return TextBoxPlaceHolder;
});
