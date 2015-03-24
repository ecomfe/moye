/**
 * @file moye - Tab - Bar
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');

    var TabBar = Plugin.extend({

        $class: 'TabBar',

        initialize: function (options) {

            this.$parent(options);
        },

        activate: function (ctr) {

            this.$parent(ctr);

            this.control = ctr;
            ctr.helper.addPartClasses('plugin-tabbar');
            ctr.on('afterrender', $.proxy(this.onAfterrender, this));
            ctr.on('change', $.proxy(this.onChange, this));

        },

        /**
         * Tab切换时
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
         */
        onAfterrender: function () {
            var items = $(this.control.itemClass, this.control.main);
            var barClass = '.' + this.control.helper.getPartClassName('bar');
            $(barClass, this.control.main).css({
                width: items.eq(this.control.activeIndex).outerWidth()
            });
            this.setBar(this.control.activeIndex);
        },

        setBar: function (i) {
            var items = $(this.control.itemClass, this.control.main);
            var barClass = '.' + this.control.helper.getPartClassName('bar');
            $(barClass, this.control.main).stop().animate({
                left: items.eq(i).position().left,
                width: items.eq(i).outerWidth()
            }, 500);
        },

        inactivate: function () {
            var control = this.control;
            control.off('change');
            control.off('afterrender');
            this.control = null;
        }

    });

    return TabBar;
});
