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
            color: '#ccc',

            /**
             * placeholder的zindex
             *
             * @type {String}
             */
            level: 10

        },

        /**
         * 激活
         *
         * @public
         * @override
         * @param {module:TextBox} textbox 输入框
         */
        activate: function (textbox) {

            this.control = textbox;
            var ie = lib.browser.ie;
            var that = this;

            textbox.repaint = require('../painter').createRepaint(textbox.repaint, {
                name: 'placeholder',
                paint: function (conf, placeholder) {

                    if (!placeholder) {
                        return;
                    }

                    // 更新placeholder的内容
                    if (!ie || ie > 8) {
                        $(textbox.input).attr('placeholder', placeholder);
                        return;
                    }

                    this
                        .getPlaceHolder().main
                        .setContent(that.getPlaceHolderHTML(placeholder));
                }
            });

            textbox.getPlaceHolder = $.proxy(this.getPlaceHolder, this);

            if (!ie || ie > 8) {
                return;
            }

            this.input       = textbox.input;
            var placeholder  = textbox.placeholder || $(this.input).attr('placeholder');
            this.placeholder = placeholder ? placeholder : '请输入';

            this.build();

            var me = this;
            this.id = textbox.id + '-placeholder';

            $(this.input)
                .on('blur.' + this.id, function (e) {
                    me.isNeedToShow() ? me.show() : me.hide();
                })
                .on('focus.' + this.id, function (e) {
                    me.hide();
                });

            this.$parent();

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

            var content = this.getPlaceHolderHTML(this.placeholder);

            // 计算偏移
            var offsetX = parseInt(input.css('paddingLeft'), 10)
                        + parseInt(input.css('borderLeftWidth'), 10);

            var offsetY = -parseInt(input.outerHeight(), 10);

            // 生成一个popup控件, 用来展现placeholder
            var popup = this.main = new Popup({
                target: input,
                mode: 'static',
                content: content,
                showDelay: 0,
                hideDelay: 0,
                offset: {
                    x: offsetX,
                    y: offsetY
                }
            })
            .render()
            .show()
            .on('click', function (e) {
                $(me.input).trigger('focus');
                e.stopPropagation();
            });

            popup.main.style.zIndex = this.level;

            // 页面resize时需要重新定位
            this.main.delegate(window, 'resize', this.main.onWindowResize);

            return this.control;
        },


        /**
         * 获取placehoder popup的html字符串
         *
         * @param {string} placeholder placeholder
         * @return {string} html字符串
         */
        getPlaceHolderHTML: function (placeholder) {
            var input = $(this.input);

            var content = ''
                + '<div style="'
                +     'color:' + this.color + ';'
                +     'font-size:' + input.css('fontSize') + ';'
                +     'height:' + input.outerHeight() + 'px;'
                +     'width:' + input.outerWidth() + 'px;'
                +     'line-height:' + input.outerHeight() + 'px;'
                +     'cursor:text'
                + '">' + placeholder + '</div>';

            return content;
        },

        /**
         * 暴露此方法，方面外部调用进行定制
         *
         * @public
         * @return {Popup}
         */
        getPlaceHolder: function () {
            return this;
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
            this.main && this.main.show();

            return this.control;
        },

        /**
         * 隐藏浮层
         *
         * @private
         * @return {TextBox}
         */
        hide: function () {
            this.main && this.main.hide();

            return this.control;
        },


        /**
         * 禁用
         *
         * @override
         */
        inactivate: function () {
            var textbox = this.control;

            $(textbox.input)
                .off('focus.' + this.id)
                .off('blur.' + this.id);

            this.control = null;
            this.input = null;
            this.placeholder = null;

            // 页面resize时需要重新定位
            this.main.undelegate(window, 'resize', this.main.onWindowResize);
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
