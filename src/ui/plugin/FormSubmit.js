/**
 * @file 表单的控件按钮插件
 *       FIXME: 该插件不能使用 `use` 方式加载，其初始化依赖组件的`afterrender`事件
 *       如果该组件已经渲染过了，再 `use` 将不会奏效
 * @author Leon(lupengyu@baidu)
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');

    /**
     * 表单提交按钮插件
     *
     * @extends module:Plugin
     * @exports FormSubmit
     */
    var FormSubmit = Plugin.extend(/** @lends module:FormSubmit.prototype */{

        $class: 'FormSubmit',

        /**
         * @override
         */
        initialize: function (options) {

            /**
             * 触发提交的组件 Id 或者 DOM 元素 Id
             *
             * @type {Array.<string>}
             */
            this.triggers = options.triggers || [];

            /**
             * 触发提交事件类型，默认 'click'
             *
             * @type {string}
             */
            this.triggerEventType = options.triggerEventType || 'click';

            this.id = this.id || lib.guid();
            this.bounds = [];
        },

        /**
         * @override
         */
        activate: function (control) {
            this.$parent(control);
            this.control = control;
            this.submit = $.proxy(this.submit, this);
            control.once('afterrender', $.proxy(this.bindEvents, this));
        },

        /**
         * 初始化事件绑定
         *
         * @private
         */
        bindEvents: function () {
            var triggers = this.triggers;
            var eventType = this.triggerEventType;

            for (var i = triggers.length - 1; i >= 0; i--) {
                var trigger = triggers[i];
                var target = this.control.context.get(trigger);
                if (target) {
                    target.on(eventType, this.submit);
                }
                else {
                    target = lib.g(trigger);
                    if (target) {
                        this.bounds.push({
                            element: target,
                            eventType: eventType
                        });
                        $(target).on(eventType + '.' + this.id, this.submit);
                    }
                }
            }

        },

        /**
         * 提交表单
         *
         * 实际上是触发控件的提交动作
         *
         * @param {Event} e 源事件
         */
        submit: function (e) {
            this.control.onSubmit(e);
        },

        /**
         * @override
         */
        dispose: function () {
            this.triggers = null;
            for (var i = this.bounds.length - 1; i >= 0; i--) {
                var bounds = this.bounds[i];
                $(bounds.element).off(bounds.eventType + '.' + this.id, this.submit);
            }
            this.control = null;

            this.$parent();
        }

    });

    return FormSubmit;

});
