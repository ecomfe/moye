/**
 * @file moye - Tab - Bar
 * @author kaivean(kaisey2012@163.com)
 * @module TabBar
 * @extends module:Plugin
 */

define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');

    var TabBar = Plugin.extend(/** @lends module:TabBar.prototype */{

        $class: 'TabBar',

        /**
         * 激活
         *
         * @public
         * @param {module:Tab} ctr 标签控件
         */
        activate: function (ctr) {

            this.$parent(ctr);

            this.control = ctr;
            ctr.helper.addPartClasses('plugin-tabbar');
            ctr.on('afterrender', $.proxy(this.onAfterrender, this));
            ctr.on('change', $.proxy(this.onChange, this));

        },

        /**
         * Tab切换时
         *
         * @private
         * @param  {event} e 输入事件
         */
        onChange: function (e) {
            var me = this;
            setTimeout(function () {
                if (!e.isDefaultPrevented()) {
                    me.setBar(e.activeIndex);
                }
            }, 0);
        },

        /**
         * 控件渲染后
         *
         * @private
         */
        onAfterrender: function () {
            var items = $(this.control.itemClass, this.control.main);
            var barClass = '.' + this.control.helper.getPartClassName('bar');
            $(barClass, this.control.main).css({
                width: items.eq(this.control.activeIndex).outerWidth()
            });
            this.setBar(this.control.activeIndex);
        },

        /**
         * 设定当前 bar 的位置
         *
         * @private
         * @param {number} i 位置
         */
        setBar: function (i) {
            var items = $(this.control.itemClass, this.control.main);
            var barClass = '.' + this.control.helper.getPartClassName('bar');
            $(barClass, this.control.main).stop().animate({
                left: items.eq(i).position().left,
                width: items.eq(i).outerWidth()
            }, 500);
        },

        /**
         * 去激活
         *
         * @public
         * @override
         */
        inactivate: function () {
            var control = this.control;
            control.off('change');
            control.off('afterrender');
            this.control = null;
        }

    });

    return TabBar;
});
