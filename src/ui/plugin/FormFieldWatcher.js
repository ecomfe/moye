/**
 * @file 表单字段变化监听器
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
     * 表单字段变化监听器插件
     *
     * @extends module:Plugin
     * @exports FormFieldWatcher
     */
    var FormFieldWatcher = Plugin.extend(/** @lends module:FormFieldWatcher.prototype */{

        $class: 'FormFieldWatcher',

        /**
         * 表单字段变化监听选项配置
         *
         * @property {Object} options 选项配置
         * @property {Array.<string>} options.eventTypes 要监听变化的事件类型
         */
        options: {
            eventTypes: ['change', 'input']
        },

        /**
         * @override
         */
        initialize: function (options) {
            this.$parent(options);
            this.fireFieldChange = $.proxy(this.fireFieldChange, this);
        },

        /**
         * @override
         */
        activate: function (control) {
            if (this.isActivated()) {
                return;
            }

            this.control = control;
            control.once('afterrender', $.proxy(this.bindEvents, this));
            this.$parent();
        },

        /**
         * @override
         */
        inactivate: function () {
            if (!this.isActivated()) {
                return;
            }

            var controls = this.controls;
            var fireFieldChange = this.fireFieldChange;
            if (controls) {
                var eventTypes = this.eventTypes;
                lib.each(controls, function (control) {
                    for (var i = eventTypes.length - 1; i >= 0; i--) {
                        control.un(eventTypes[i], fireFieldChange);
                    }
                });
            }

            this.controls = null;
            this.$parent();
        },

        /**
         * 初始化事件绑定
         *
         * @private
         */
        bindEvents: function () {
            var fireFieldChange = this.fireFieldChange;
            var controls = this.controls = this.control.getInputControls();
            var eventTypes = this.eventTypes;
            lib.each(controls, function (control) {
                for (var i = eventTypes.length - 1; i >= 0; i--) {
                    control.on(eventTypes[i], fireFieldChange);
                }
            });
        },

        /**
         * 触发域变化事件
         *
         * @fires module:FormFieldWatcher#fieldchange
         * @private
         * @param {Object} e 事件对象
         */
        fireFieldChange: function (e) {

            /**
             * @event module:FormFieldWatcher#fieldchange 域输入变化事件
             * @param {Object} e 事件对象
             */
            this.control.fire('fieldchange', {
                target: e.target,
                originEvent: e
            });
        },

        /**
         * @override
         */
        dispose: function () {
            this.control = null;
            this.$parent();
        }

    });

    return FormFieldWatcher;

});
