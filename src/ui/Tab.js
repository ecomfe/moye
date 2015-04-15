/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.

 * @file 选项卡组件
 * @author chris(wfsr@foxmail.com)
 * @author Leon(leon@outlook.com)
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {

    var $ = require('jquery');

    var Control = require('./Control');

    /**
     * 选项卡组件
     *
     * @constructor
     * @extends module:Control
     * @requires Control
     * @exports Tab
     */
    var Tab = Control.extend(/** @lends module:Tab.prototype */{
        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Tab',

        /**
         * 控件配置项
         *
         * @name module:Tab#options
         * @type {Object}
         * @property {number} slideInterval 在auto模式 下自动切换的间隔,单位ms
         * @property {number} activeIndex 选中项
         * @property {string} mode 切换方式, 可选click/hover/auto
         * @private
         */
        options: {

            slideInterval: 2000,

            activeIndex: 0,

            // 切换方式, 可选click/hover/auto
            mode: 'click'
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Tab#options
         * @private
         */
        init: function (options) {
            this.$parent(options);

            this.activeIndex = +options.activeIndex || 0;

            this.itemClass = '.' + this.helper.getPartClassName('item');

            this.onSwitch = $.proxy(this.onSwitch, this);

        },

        initEvents: function () {
            // 先给选项卡父容器添加事件监听
            switch (this.mode) {
                case 'click':
                    $(this.main).on('click', this.itemClass, this.onSwitch);
                    break;

                case 'hover':
                    $(this.main).on('mouseenter', this.itemClass, this.onSwitch);
                    break;

                case 'auto':
                    $(this.main).on('click', this.itemClass, this.onSwitch);
                    this.startAutoSlide();
            }
        },

        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: 'activeIndex',
                paint: function (conf, activeIndex) {
                    var activeClass = this.helper.getPartClassName('item-active');
                    var items = $(this.itemClass, this.main);
                    items
                        .eq(activeIndex).addClass(activeClass)
                        .siblings().removeClass(activeClass);

                    items.each(function (index, item) {
                        var itemPanelName = $(item).data('panel');
                        if (itemPanelName) {
                            var itemPanel = $(itemPanelName);
                            if (itemPanel.length) {
                                activeIndex === index ? itemPanel.show() : itemPanel.hide();
                            }
                        }
                    });

                    this.activeIndex = activeIndex;
                }
            }
        ),

        /**
         * 切换至下一个项
         */
        next: function () {
            var items = $(this.itemClass, this.main);
            var activeIndex = this.activeIndex + 1;
            if (items.length <= activeIndex) {
                activeIndex = 0;
            }
            this.select(activeIndex);
        },

        /**
         * 启动自动轮播
         */
        startAutoSlide: function () {
            if (!this.autoSlideId) {
                this.autoSlideId = setInterval(
                    $.proxy(this.next, this),
                    this.slideInterval
                );
            }
        },

        /**
         * 停止自动轮播
         */
        stopAutoSlide: function () {
            if (this.autoSlideId) {
                clearInterval(this.autoSlideId);
                this.autoSlideId = null;
            }
        },

        /**
         * 选择标签
         * @param {number} index 标签序号
         * @param {boolean} silent 为true则不触发change事件
         * @return {Tab}
         */
        select: function (index, silent) {
            var activeIndex = this.activeIndex;

            if (activeIndex === index) {
                return;
            }

            if (!silent) {
                var event = new $.Event('change', {
                    activeIndex: index
                });

                /**
                 * @event module:Tab#change
                 * @type {Object}
                 * @property {number} activeIndex 选中标签序号
                 */
                this.fire(event);

                if (event.isDefaultPrevented()) {
                    return;
                }
            }

            this.set('activeIndex', index);

            return this;
        },

        /**
         * 点击事件处理
         *
         * @param {?Event} e DOM事件对象
         * @fires module:Tab#change
         * @private
         */
        onSwitch: function (e) {
            var target = $(e.currentTarget);

            if (!target.is(this.itemClass)) {
                return;
            }

            this.select(target.data('index'));
        }

    });

    return Tab;
});
