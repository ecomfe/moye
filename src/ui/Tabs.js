/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.

 * @file 选项卡组件
 * @author chris(wfsr@foxmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * 选项卡组件
     *
     * @constructor
     * @extends module:Control
     * @requires Control
     * @exports Tabs
     */
    var Tabs = Control.extend(/** @lends module:Tabs.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Tabs',

        /**
         * 控件配置项
         *
         * @name module:Tabs#options
         * @type {Object}
         * @property {string} item 标签项的selector样式
         * @property {boolean} allowClose 是否可以关闭
         * @property {number} activeIndex 默认选中项的索引值
         * @property {Array.Object} tabs  标签们的配置
         * @private
         */
        options: {

            // 是否允许关闭标签
            // allowClose: false,

            // 选中项
            activeIndex: 0,

            // 选项标签标识
            item: 'li',

            // 切换方式, 可选`click`/`mouseover`
            mode: 'click',

            // 标签配置
            tabs: []
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Tabs#options
         * @private
         */
        init: function (options) {
            this.$parent(options);

            this.activeIndex = +options.activeIndex || 0;

            // 获取tabs配置
            this.tabs = this.tabs && this.tabs.length
                ? this.tabs
                : $(this.main).data('tabs') || [];

            this._onSwitch = $.proxy(this._onSwitch, this);
        },

        initEvents: function () {
            // 先给选项卡父容器添加事件监听
            $(this.main).on(this.mode, this.item, this._onSwitch);
        },

        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: 'tabs',
                paint: function (conf, tabs) {

                    var main = $(this.main);
                    var helper = this.helper;

                    if (this.helper.isInStage('INITED') && main.data('dom-inited')) {
                        return;
                    }

                    var html = [];

                    // 是否支持伪元素
                    var noPseudoElement = lib.browser.ie6;
                    var item = this.item;

                    for (var i = 0, len = tabs.length; i < len; i++) {

                        var clazz = ''
                            + helper.getPartClassName('item')
                            + ' '
                            + (i === 0 ? helper.getPartClassName('item-first') : '');

                        html[i] = ''
                            + '<' + item + ' class="' + clazz + '" data-index="' + i + '">'
                            +     tabs[i].title
                            + '</' + item + '>';

                        if (noPseudoElement) {
                            html[i] += '<i></i>';
                        }
                    }

                    main.html(html.join(''));

                }
            },
            {
                name: 'activeIndex',
                paint: function (conf, activeIndex) {
                    var activeClass = this.helper.getPartClassName('active');
                    $(this.item, this.main).each(function (i) {
                        if (i === activeIndex) {
                            $(this).addClass(activeClass);
                        }
                        else {
                            $(this).removeClass(activeClass);
                        }
                    });
                }
            }
        ),


        add: function (tab) {
            var activeIndex = this.activeIndex;
            var tabs = this.tabs.slice().concat(tab);
            this.tabs = null;
            this.activeIndex = null;
            this.set({
                tabs: tabs,
                activeIndex: activeIndex
            });
        },

        /**
         * 移除标签
         * @param  {number} index 标签序号
         * @return {Tabs}
         */
        remove: function (index) {
            var activeIndex = this.activeIndex;

            // 如果移除的是当前激活的标签, 把激活标签弄成0
            // 如果激活标签在被移除标签后面, 那把它-1
            // 否则激活标签不变
            activeIndex = activeIndex === index
                ? 0
                : (activeIndex > index ? activeIndex - 1 : activeIndex);

            var tabs = this.tabs.slice();
            tabs.splice(index, 1);
            this.activeIndex = this.tabs = null;

            this.set({
                tabs: tabs,
                activeIndex: activeIndex
            });

            return this;
        },

        /**
         * 选择标签
         * @param  {number} index 标签序号
         * @return {Tabs}
         */
        select: function (index) {
            this.set('activeIndex', index);
            return this;
        },

        /**
         * 点击事件处理
         *
         * @param {?Event} e DOM 事件对象
         * @fires module:Tabs#change
         * @private
         */
        _onSwitch: function (e) {
            var main        = this.main;
            var target      = $(e.target).closest(this.item, main);

            if (!target.is(this.item)) {
                return;
            }

            var activeIndex = this.activeIndex;
            var index       = target.data('index');

            if (activeIndex === index) {
                return;
            }

            var event = new $.Event('change', {
                activeIndex: index
            });

            /**
             * @event module:Tabs#change
             * @type {Object}
             * @property {HTMLElement} activeIndex 选中标签序号
             */
            this.fire(event);

            if (event.isDefaultPrevented()) {
                return;
            }

            var activeClass = this.helper.getPartClassName('active');
            var items       = $(this.item, main);

            items.eq(activeIndex).removeClass(activeClass);
            items.eq(index).addClass(activeClass);

            this.activeIndex = index;
        }


    });

    return Tabs;
});
