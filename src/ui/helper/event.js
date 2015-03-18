/**
* Copyright 2014 Baidu Inc. All rights reserved.
*
* @file 事件处理相关的小工具
* @author leon <leonlu@outlook.com>
*/

define(function (require) {

    var lib = require('../lib');

    return {

        /**
         * 事件代理
         *
         * 这里调用接口与jQuery的`on`方法的类似，有几点区别：
         *
         * 1. 我们的绑定会自动带有namespace，安全，不会移除其他控件/野生绑定的绑定；
         * 2. 回调函数执行作用域自动绑定到当前控件实例，即this指向control本身。
         *
         *   > 如果需要获取触发事件的元素可以从e参数上获取
         *   > e.target：事件根源
         *   > e.currentTarget：符合selector要求的元素
         *
         * @param  {Element}  element   目标元素
         * @param  {string}   eventName 事件名称
         * @param  {string}   selector  代理元素的选择器(jquery标准)
         * @param  {*}        data      附加数据，参见jquery的on函数所支持的data参数
         * @param  {Function} handler   处理函数
         * @return {Helper}
         */
        delegate: function (element, eventName, selector, data, handler) {

            var control = this.control;

            if (handler == null && data == null) {
                handler = selector;
                selector = data = null;
            }
            else if (handler == null) {
                handler = data;
                data = null;
            }

            handler = $.proxy(handler, control)

            eventName += '.' + control.id + '.' + handler.guid;

            $(element).on(eventName, selector, data, handler);

            return this;
        },

        /**
         * 取消事件代理
         * @param  {Element}  element   目标元素
         * @param  {string}   eventName 事件名称
         * @param  {string}   selector  代理元素的选择器(jquery标准)
         * @param  {Function} handler   处理函数
         * @return {Helper}
         */
        undelegate: function (element, eventName, selector, handler) {

            // 作为一个控件，你不能取消别人加的绑定
            // 所以至少有控件id这一段的namespace
            eventName = eventName || '';
            eventName += '.' + this.control.id;

            // 这一段可能有，没有的话就可干掉所有当前控件的事件绑定
            if (handler && handler.guid) {
                eventName += '.' + handler.guid;
            }

            $(element).off(eventName, selector, handler);

            return this;
        }

    };


});
