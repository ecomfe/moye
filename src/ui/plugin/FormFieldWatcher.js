/**
 * @file 表单字段变化监听器
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');

    var FormFieldWatcher = Plugin.extend({

        $class: 'FormFieldWatcher',

        options: {
            eventTypes: ['change', 'input']
        },

        initialize: function (options) {
            this.$parent(options);
            this.trigger = $.proxy(this.trigger, this);
        },

        activate: function (control) {
            if (this.isActivated()) {
                return;
            }
            this.control = control;
            control.once('afterrender', $.proxy(this.bind, this));
            this.$parent();
        },

        inactivate: function () {

            if (!this.isActivated()) {
                return;
            }

            var controls = this.controls;
            var trigger = this.trigger;
            if (controls) {
                lib.each(controls, function (control) {
                    control.off('change', trigger);
                    control.off('input', trigger);
                });
            }

            this.controls = null;
            this.$parent();
        },

        bind: function () {
            var trigger = this.trigger;
            var controls = this.controls = this.control.getInputControls();
            lib.each(controls, function (control) {
                control.on('change', trigger);
                control.on('input', trigger);
            });
        },

        trigger: function (e) {
            this.control.fire('fieldchange', {
                target: e.target,
                originEvent: e
            });
        }

    });

    return FormFieldWatcher;

});
