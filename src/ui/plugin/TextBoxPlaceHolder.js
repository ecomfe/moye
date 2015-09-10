/**
 * @file moye - TextBox - placeholder
 * @author cxtom (cxtom2010@gamil.com)
 * @module TextBoxPlaceHolder
 * @extends module:Plugin
 */

define(function (require) {

    var lib  = require('../lib');
    var Plugin = require('./Plugin');

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

            textbox.repaint = require('../painter').createRepaint(textbox.repaint, {
                name: 'placeholder',
                paint: function (conf, placeholder) {

                    placeholder = placeholder || '';

                    // 更新placeholder的内容
                    if (!ie || ie > 9) {
                        $(textbox.input).attr('placeholder', placeholder);
                        return;
                    }

                    var main = this.getPlaceHolder();

                    if (placeholder) {
                        main.innerHTML = placeholder;
                    }
                    else {
                        main.style.display = 'none';
                    }
                }
            });

            textbox.getPlaceHolder = $.proxy(this.getPlaceHolder, this);

            if (!ie || ie > 9) {
                return;
            }

            this.input       = textbox.input;
            var placeholder  = textbox.placeholder || $(this.input).attr('placeholder');
            this.placeholder = placeholder;

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
            var $input = $(this.input);
            var control = this.control;

            var $control = $(control.main);
            var position = $control.css('position');

            if (position === 'static' || position === 'inherit') {
                $control.css('position', 'relative');
            }

            // 计算偏移
            var offsetX = parseInt($input.css('paddingLeft'), 10)
                        + parseInt($input.css('borderLeftWidth'), 10)
                        + $input.position().left;

            var offsetY = $input.position().top
                        + parseInt($input.css('borderTopWidth'), 10);

            var styles = ''
                +     'position: absolute;'
                +     'top: ' + offsetY + 'px;'
                +     'left: ' + offsetX + 'px;'
                +     'color:' + this.color + ';'
                +     'font-size:' + $input.css('fontSize') + ';'
                +     'height:' + $input.outerHeight() + 'px;'
                +     'width:' + $input.outerWidth() + 'px;'
                +     'line-height:' + $input.outerHeight() + 'px;'
                +     'z-index:' + this.level + ';'
                +     'cursor:text';

            this.main = control.helper.createPart(
                'placeholder', 'div', this.placeholder,
                {
                    'style': styles,
                    'data-role': 'textbox-placeholder'
                }
            );

            control.delegate(control.main, 'click', '[data-role=textbox-placeholder]', function (e) {
                $(this.input).trigger('focus');
            });

            $(this.main).appendTo(control.main);

            if (!this.placeholder) {
                this.hide();
            }

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
            this.main && $(this.main).show();

            return this.control;
        },

        /**
         * 隐藏浮层
         *
         * @private
         * @return {TextBox}
         */
        hide: function () {
            this.main && $(this.main).hide();

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

            textbox.undelegate(textbox.main, 'click', '[data-role=textbox-placeholder]');

            this.control = null;
            this.input = null;
            this.placeholder = null;

        }

    });

    return TextBoxPlaceHolder;
});
