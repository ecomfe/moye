/**
 * @file Radio
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');

    var Radio = Control.extend({

        options: {
            item: 'label',
            activeClass: 'active'
        },

        init: function (options) {
            $.extend(this, this.options, options);
        },

        initStructure: function () {
            var me = this;
            $(this.item, this.main).each(function (index, item) {
                if (me.isActiveItem(item)) {
                    me.current = item;
                }
            });
        },

        initEvents: function () {
            this.delegate(this.main, 'click', this.onClick);
        },

        onClick: function (e) {
            var item = this.item;
            var target = $(e.target).closest(item, this.main);

            if (this.isActiveItem(target)) {
                return;
            }

            var activeClass = this.activeClass;

            target.addClass(activeClass);

            if (this.current) {
                $(this.current).removeClass(activeClass);
            }

            this.current = target;

            this.fire('change', {
                target: this
            });
        },

        /**
         * 判断一个DOM是否为当前所选中的荐
         * @param  {Element} item 某个DOM元素
         * @return {Boolean}
         */
        isActiveItem: function (item) {
            item = $(item);
            return item.is(this.item) && item.hasClass(this.activeClass);
        },

        /**
         * 获得值
         *
         * 如果item上有value值，对应的是item为input:radio情况，那么使用value
         * 如果item上没有value值，对应的是item为label/li等情况，那么使用data-value
         *
         * @return {string}
         */
        getValue: function () {
            var current = this.current;
            if (!current) {
                return '';
            }
            return this.getValueFromDom(current);
        },

        getValueFromDom: function (dom) {
            dom = $(dom);
            return dom.attr('value') || dom.attr('data-value');
        },

        /**
         * 设定值
         * @param {string} value 值
         * @return {Control} SELF
         */
        setValue: function (value) {
            var me = this;
            $(this.item, this.main).each(function (index, item) {
                var itemValue = me.getValueFromDom(item);
                var item = $(item);
                var activeClass = this.activeClass;
                if (value == itemValue) {
                    item.addClass(activeClass)
                    me.current = item;
                }
                else {
                    item.removeClass(activeClass);
                }
            });
            return this;
        },

        dispose: function () {
            this.current = null;
            this.undelegate(this.main, 'click', this.onClick);
            Control.prototype.dispose.apply(this, arguments);
        }

    });


    return Radio;
});
