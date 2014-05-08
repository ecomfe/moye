/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 评分组件
 * @author hushicai02
 */

define(function (require) {
    var lib = require('./lib');
    var config = require('./config');
    var Control = require('./Control');

    /**
     * 评分组件
     * TODO: 半星支持
     *
     * @extends module:Control
     * @requires Control
     * @exports Rating
     */
    var Rating = Control.extend(/** @lends module:Rating.prototype */{
        options: {
            // 可用性
            disabled: false,

            // 主元素
            main: '',

            // class前缀
            prefix: config.prefix + '-rating',

            // 最多星星数
            max: 5,

            // 星级
            value: 0,

            // 如果需要自定义星星样式，则置为1，然后通过className去控制样式
            skin: 0
        },

        /**
         * 控件类型
         *
         * @const
         * @type {string}
         */
        type: 'Rating',

        /**
         * 需要绑定`this`的方法名，多个方法以半角逗号分开
         *
         * @const
         * @type {string}
         */
        binds: 'onClick, onMouseOver, onMouseOut',

        /**
         * 初始化控件
         *
         * @param {Object} options 控件配置项
         * @see module:Rating#options
         * @private
         */
        init: function (options) {
            this.main = lib.g(options.main);
            this.disabled = options.disabled;
        },

        /**
         * 绘制控件
         *
         * @public
         */
        render: function () {
            var options = this.options;

            if (!this.rendered) {
                this.rendered = true;

                // 生成星星
                var html = [];
                var prefix = options.prefix;

                html.push('<ul class="' + prefix + '-stars">');
                for (var i = 0; i < options.max; i++) {
                    html.push(
                        '<li ',
                        'class="' + prefix + '-star' + '" ',
                        'data-value="' + (i + 1) + '"',
                        '>',
                        // 默认星星字符
                        (options.skin ? '' : '☆'),
                        '</li>'
                    );
                }
                html.push('</ul>');
                this.main.innerHTML = html.join('');

                this.stars = this.query(prefix + '-star');

                // 绑定事件
                var me = this;

                lib.each(this.stars, function (star) {
                    lib.on(star, 'mouseover', me.onMouseOver);
                    lib.on(star, 'mouseout', me.onMouseOut);
                    lib.on(star, 'click', me.onClick);
                });
            }

            this.resetRating();

            this.disabled && this.disable();

            return this;
        },

        /**
         * 启用组件
         *
         * @public
         */
        enable: function () {
            lib.removeClass(this.main, this.options.prefix + '-disabled');

            this.parent('enable');
        },

        /**
         * 不启用组件
         *
         * @public
         */
        disable: function () {
            lib.addClass(this.main, this.options.prefix + '-disabled');

            this.parent('disable');
        },

        /**
         * 清洗点亮的星星
         *
         * @private
         */
        drain: function () {
            var options = this.options;
            var prefix = options.prefix;

            var ons = this.query(prefix + '-star-on');

            lib.each(
            ons, function (star) {
                lib.removeClass(star, prefix + '-star-on');
            });
        },

        /**
         * 按给定星级，从左往右点亮星星
         *
         * @param {number} value 星级
         * @private
         */
        fill: function (value) {
            value = parseInt(value || 0, 10);

            var options = this.options;
            var prefix = options.prefix;
            var result = this.stars.slice(0, value);

            lib.each(
            result, function (star) {
                lib.addClass(star, prefix + '-star-on');
            });

            return result;
        },

        /**
         * 重置星级，避开常用词reset，将方法命名为resetRating
         *
         * @private
         */
        resetRating: function () {
            var options = this.options;
            var value = options.value;
            var prefix = options.prefix;

            var result = this.stars.slice(0, value);

            lib.each(
            result, function (star) {
                lib.addClass(star, prefix + '-star-on');
            });

            return result;
        },

        /**
         * click事件处理
         *
         * @param {?Event} e DOM事件对象
         * @fires module:Rating#rated
         * @private
         */
        onClick: function (e) {
            var options = this.options;
            var prefix = options.prefix;
            var target = lib.getTarget(e);
            var value = options.value;

            if (!e || this.disabled) {
                return false;
            }

            if (lib.hasClass(target, prefix + '-star')) {
                var newValue = parseInt(
                target.getAttribute('data-value'), 10);

                // 如果星级没变化，则不处理
                if (newValue === value) {
                    return false;
                }

                options.value = newValue;

                this.drain();
                this.resetRating();

                /**
                 * @event module:Rating#rated
                 * @type {Object}
                 * @property {number} value 星级
                 */
                this.fire('rated', {
                    value: options.value
                });
            }
        },

        /**
         * mouseover事件处理
         *
         * @param {?Event} e DOM事件对象
         * @private
         */
        onMouseOver: function (e) {
            var options = this.options;
            var prefix = options.prefix;
            var target = lib.getTarget(e);

            if (!e || this.disabled) {
                return false;
            }

            if (lib.hasClass(target, prefix + '-star')) {
                this.drain();
                this.fill(target.getAttribute('data-value'));
            }
        },

        /**
         * mouseout事件处理
         *
         * @param {?Event} e DOM事件处理
         * @private
         */
        onMouseOut: function (e) {
            var options = this.options;
            var prefix = options.prefix;
            var target = lib.getTarget(e);

            if (!e || this.disabled) {
                return false;
            }

            if (lib.hasClass(target, prefix + '-star')) {
                this.drain();
                this.resetRating();
            }
        },

        /**
         * 销毁控件
         *
         * @public
         */
        dispose: function () {
            var me = this;

            // 释放事件
            lib.each(this.stars, function (star) {
                lib.un(star, 'click', me.onClick);
                lib.un(star, 'mouseover', me.onMouseOver);
                lib.un(star, 'mouseout', me.onMouseOut);
            });

            delete this.stars;

            this.parent('dispose');
        }
    });

    return Rating;
});
