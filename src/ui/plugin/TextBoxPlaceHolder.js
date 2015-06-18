/**
 * @file moye - TextBox - placeholder
 * @author cxtom (cxtom2010@gamil.com)
 */

define(function (require) {

    var lib  = require('../lib');
    var Plugin = require('./Plugin');
    var Popup = require('../Popup');

    var TextBoxPlaceHolder = Plugin.extend({

        $class: 'TextBoxPlaceHolder',

        options: {

            /**
             * placeholder显示的颜色
             *
             * @type {String}
             */
            color: '#ccc'

        },

        activate: function (textbox) {

            var ie = lib.browser.ie;

            if (!ie || ie > 8) {
                textbox.placeholder && $(textbox.input).attr('placeholder', textbox.placeholder);
                return;
            }

            textbox.getPopup = $.proxy(this.getPopup, this);

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

            var content = ''
                + '<div style="'
                +     'color:' + this.options.color + ';'
                +     'font-size:' + input.css('fontSize') + ';'
                +     'height:' + input.outerHeight() + 'px;'
                +     'z-index: 1000;'
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
        getPopup: function () {
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

            this.textbox = null;
        }

    });

    return TextBoxPlaceHolder;
});
