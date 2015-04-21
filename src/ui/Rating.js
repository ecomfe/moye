/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 评分组件
 * @author hushicai02 chenzhian(chenzhian@baidu.com)
 */

define(function (require) {
    var $ = require('jquery');
    var Control = require('./Control');
    var painter = require('./painter');

    /**
     * 评分组件
     * TODO: 半星支持
     *
     * @extends module:Control
     * @requires Control
     * @exports Rating
     */
    var Rating = Control.extend({

        options: {
            // 最多星星数
            max: 5,
            // 星级
            value: 0
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
            this.$parent(options);
            var helper = this.helper;
            this.ratedClass = helper.getPartClassName('star-on');
            this.itemClass = helper.getPartClassName('star');
        },

        initStructure: function () {
            var helper = this.helper;
            var options = this.options;
            var mainClass = helper.getPartClassName();
            var $main = $(this.main);

            // 如果dom结构已被smarty渲染，则跳过dom结构初始化
            if ($main.find('.' + mainClass).data('dom-inited') === true) {
                this.value = $main.find('.' + this.ratedClass).length;
                this.max = $main.find('.' + this.itemClass).length;
                return;
            }

            var html = ['<ul class="' + mainClass + '">'];

            for (var i = 0; i < options.max; i++) {
                html.push(
                    '<li ',
                    'class="' + this.itemClass + '" ',
                    'data-value="' + (i + 1) + '"',
                    '>',
                    // 默认星星字符
                    (options.skin ? '' : '\u2606'),
                    '</li>'
                );
            }

            html.push('</ul>');
            this.main.innerHTML = html.join('');
        },

        initEvents: function () {
            this.$stars = $(this.main).find('.' + this.itemClass);

            this.delegate(this.main, 'click', '.' + this.itemClass, this.onClick);

            this.delegate(this.main, 'mouseover', '.' + this.itemClass, this.onMouseOver);

            this.delegate(this.main, 'mouseout', '.' + this.itemClass, this.onMouseOut);
        },

        /**
         * 重绘
         *
         * @protected
         */
        repaint: painter.createRepaint(
            Control.prototype.repaint,
            {
                name: ['value'],
                paint: function (conf, value) {
                    value = parseInt(value || 0, 10);

                    this.resetStars();
                    this.fillStars(value);
                }
            }
        ),

        /**
         * click事件处理
         *
         * @param {Event} e DOM事件对象
         * @fires module:Rating#rated
         * @private
         */
        onClick: function (e) {
            var $target = $(e.target);
            var value = this.value;
            var newValue;

            if (this.isDisabled()) {
                return;
            }

            newValue = parseInt($target.attr('data-value'), 10);

            // 如果星级没变化，则不处理
            if (newValue === value) {
                return;
            }

            this.set('value', newValue);

            /**
             * @event module:Rating#change
             * @type {Object}
             * @property {number} value 星级
             */
            this.fire('change', {
                value: newValue
            });
        },

        /**
         * mouseover事件处理
         *
         * @param {Event} e DOM事件对象
         * @private
         */
        onMouseOver: function (e) {
            var $target = $(e.target);
            var value = parseInt($target.attr('data-value'), 10);

            if (this.isDisabled()) {
                return;
            }
            this.resetStars();
            this.fillStars(value);

            /**
             * @event module:Rating#hover
             * @type {Object}
             * @property {number} value 星级
             */
            this.fire('hover', {
                value: value
            });
        },

        /**
         * mouseout事件处理
         *
         * @param {Event} e DOM事件处理
         * @private
         */
        onMouseOut: function (e) {
            if (this.isDisabled()) {
                return;
            }
            this.resetStars();
            this.fillStars(this.value);

            /**
             * @event module:Rating#hover
             * @type {Object}
             * @property {number} value 星级
             */
            this.fire('hover', {
                value: this.value
            });
        },

        /**
         * 清洗已点亮星星
         *
         * @private
         */
        resetStars: function () {
            this.$stars.removeClass(this.ratedClass);
        },

        /**
         * 填充星星
         *
         * @param  {number} value 需要点亮星星个数
         * @private
         */
        fillStars: function (value) {
            var stars = this.$stars.slice(0, value);
            $(stars).addClass(this.ratedClass);
        },

        /**
         * 获得值
         *
         * @public
         * @return {number} 当前值
         */
        getValue: function () {
            return this.value;
        },

        /**
         * 设值
         *
         * @param {number} value      要设置的值
         * @param {?boolean} fireChange 设置时是否需要触发change事件
         * @public
         */
        setValue: function (value, fireChange) {
            value = parseInt(value, 10);
            this.set('value', value);
            fireChange && this.fire('change', {
                value: value
            });
        }

    });

    return Rating;
});
