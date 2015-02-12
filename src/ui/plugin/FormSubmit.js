/**
 * @file 表单的控件按钮插件
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');

    var FormSubmit = Plugin.extend({

        $class: 'FormSubmit',

        initialize: function (options) {
            this.triggers = options || [];
            this.id = this.id || lib.guid();
            this.bounds = [];
        },

        activate: function (control) {
            this.$parent(control);
            this.control = control;
            this.submit = $.proxy(this.submit, this);
            control.on('afterrender', $.proxy(this.bindEvents, this));
        },

        /**
         * 初始化事件绑定
         */
        bindEvents: function () {

            for (var i = this.triggers.length - 1; i >= 0; i--) {
                var trigger    = this.triggers[i];
                var targetType = trigger.type;
                var eventType  = trigger.eventType || FormSubmit.defaults.eventType;
                var targetId   = trigger.id;
                var target;

                if (targetType === 'control') {
                    target = this.control.context.get(targetId);
                    if (target) {
                        target.on(eventType, this.submit);
                    }
                }
                else {
                    target = lib.g(targetId);
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

        dispose: function () {
            this.triggers = null;
            for (var i = this.bounds.length - 1; i >= 0; i--) {
                var bounds = this.bounds[i];
                $(bounds.element).off(bounds.eventType + '.' + this.id, this.submit);
            }
            this.$parent();
        }

    });

    FormSubmit.defaults = {
        eventType: 'click'
    };

    return FormSubmit;

});
