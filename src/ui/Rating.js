/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 评分组件
 * @author hushicai02
 */

define(function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * 私有函数或方法
     *
     * @type {Object}
     * @namespace
     * @name module:Rating~privates
     */
    var privates = /** @lends module:Rating~privates */ {

        /**
         * 清洗点亮的星星
         *
         * @private
         */
        drain: function () {
            var options = this.options;
            var prefix = options.prefix;
            $('.' + prefix + '-star-on').removeClass(prefix + '-star-on');
        },

        /**
         * 按给定星级，从左往右点亮星星
         *
         * @param {number} value 星级
         * @return {Array.<HTMLElement>} 星星的 HTMLElement 数组
         * @private
         */
        fill: function (value) {
            value = parseInt(value || 0, 10);
            var options = this.options;
            var prefix = options.prefix;
            var result = this.stars.slice(0, value);
            $(result).addClass(prefix + '-star-on');
            return result;
        },

        /**
         * 重置星级，避开常用词reset，将方法命名为resetRating
         *
         * @return {Array.<HTMLElement>} 星星的 HTMLElement 数组
         * @private
         */
        resetRating: function () {
            var options = this.options;
            var value = options.value;
            var prefix = options.prefix;
            var result = this.stars.slice(0, value);
            $(result).addClass(prefix + '-star-on');
            return result;
        },

        /**
         * click事件处理
         *
         * @param {?Event} e DOM事件对象
         * @return {boolean} 返回 false 时阻止事件
         * @fires module:Rating#rated
         * @private
         */
        onClick: function (e) {
            var options = this.options;
            var prefix = options.prefix;
            var target = $(e.target);
            var value = options.value;

            if (!e || this.disabled) {
                return false;
            }

            if (target.hasClass(prefix + '-star')) {

                var newValue = parseInt(target.attr('data-value'), 10);

                // 如果星级没变化，则不处理
                if (newValue === value) {
                    return false;
                }

                options.value = newValue;
                privates.drain.call(this);
                privates.resetRating.call(this);

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
         * @return {boolean} 返回 false 时阻止事件
         * @private
         */
        onMouseOver: function (e) {
            var options = this.options;
            var prefix = options.prefix;
            var target = $(e.target);

            if (!e || this.disabled) {
                return false;
            }

            if (target.hasClass(prefix + '-star')) {
                privates.drain.call(this);
                privates.fill.call(this, target.attr('data-value'));
            }
        },

        /**
         * mouseout事件处理
         *
         * @param {?Event} e DOM事件处理
         * @return {boolean} 返回 false 时阻止事件
         * @private
         */
        onMouseOut: function (e) {
            var options = this.options;
            var prefix = options.prefix;
            var target = $(e.target);

            if (!e || this.disabled) {
                return false;
            }

            if (target.hasClass(prefix + '-star')) {
                privates.drain.call(this);
                privates.resetRating.call(this);
            }
        }
    };

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
            prefix: 'ecl-ui-rating',

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
         * 初始化控件
         *
         * @param {Object} options 控件配置项
         * @see module:Rating#options
         * @private
         */
        init: function (options) {
            this.main = lib.g(options.main);
            this._disabled = options.disabled;

            this.bindEvents(privates);
        },

        /**
         * 绘制控件
         *
         * @return {module:Rating} 当前实例
         * @public
         */
        render: function () {
            var options = this.options;

            if (!this.rendered) {
                this.rendered = true;

                // 生成星星
                var prefix = options.prefix;
                var html = ['<ul class="' + prefix + '-stars">'];

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

                // 绑定事件
                var bound = this._bound;
                this.stars = $('.' + prefix + '-star')
                    .hover(bound.onMouseOver, bound.onMouseOut)
                    .on('click', bound.onClick)
                    .toArray();

            }

            privates.resetRating.call(this);

            this._disabled && this.disable();

            return this;
        },

        /**
         * 启用组件
         *
         * @public
         */
        enable: function () {
            $(this.main).removeClass(this.options.prefix + '-disabled');
            this.parent('enable');
        },

        /**
         * 不启用组件
         *
         * @public
         */
        disable: function () {
            $(this.main).addClass(this.options.prefix + '-disabled');
            this.parent('disable');
        },

        /**
         * 销毁控件
         *
         * @public
         */
        dispose: function () {
            var bound = this._bound;

            $(this.stars)
                .off('mouseover', bound.onMouseover)
                .off('mouseout', bound.onMouseout)
                .off('click', bound.onClick);

            delete this.stars;

            this.parent('dispose');
        }
    });

    return Rating;
});
