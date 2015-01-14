/**
 * @file 表单的控件按钮插件
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');
    var Control = require('../Control');

    var FormSubmit = Plugin.extend({

        $class: 'FormSubmit',

        initialize: function (options) {
            this.$parent(options);
            this.triggers = options || [];
            this.submit = $.proxy(this.submit, this);
            this.id = this.id || lib.guid();
        },

        activate: function (control) {
            this.$parent(control);
            var control = this.control = control;
            control.on('afterrender', $.proxy(this.bindEvents, this));
        },

        inactivate: function () {
            // TODO
        },

        /**
         * 初始化事件绑定
         */
        bindEvents: function () {

            var me = this;
            var control = this.control;
            var triggers = this.triggers;

            for (var i = triggers.length - 1; i >= 0; i--) {
                var trigger = triggers[i];
                var type = trigger.type;
                var hanlder = 'bind' + lib.capitalize(type);
                this[hanlder] && this[hanlder](trigger.id, trigger.eventType);
            };

        },

        /**
         * 对控件进行事件绑定, 将指定的控件的指定事件代理到表单的提交动作
         * @param  {object} conf 触发配置
         */
        bindControl: function (controlId, eventType) {
            var control = this.control.context.get(controlId);
            eventType = eventType || FormSubmit.defaults.eventType;
            if (control) {
                control.on(eventType, this.submit);
            }
        },

        /**
         * 对一个DOM元素做事件绑定
         * @param  {string} elementId 元素id
         * @param  {string} eventType 事件类型
         */
        bindElement: function (elementId, eventType) {
            var element = lib.g(elementId);

            eventType = eventType || FormSubmit.defaults.eventType;

            if (element) {
                $(element).on(eventType + '.' + this.id, this.submit);
            }
        },

        /**
         * 提交表单
         *
         * 实际上是触发控件的提交动作
         *
         * @param  {Event} e 源事件
         */
        submit: function (e) {
            this.control.submit();
        },

        dispose: function () {
            this.triggers = null;
            this.$parent();
            // TODO
        }

    });

    FormSubmit.defaults = {
        eventType: 'click'
    };

    return FormSubmit;

});
