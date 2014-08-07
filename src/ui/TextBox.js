/**
 * @file 文本输入框
 * @author leon <lupengyu@baidu.com>
 */
define(function (require) {

    var $       = require('jquery');
    var Control = require('./Control');
    var helper  = require('./helper');
    
    var TextBox = Control.extend({

        type: 'textbox',

        options: {
            main: '',
            plugins: []
        },

        init: function (options) {
            var me = this;
            var $main = $(options.main);

            me.main = $main.get(0);
            me.id = options.id || helper.guid();
            me.input = options.input ? $(options.input) : $main.find('input');
            me.plugins = options.plugins;
        },

        initEvents: function () {
            var me = this;
            var main = $(me.main);
            var input = me.input;

            Control.prototype.initEvents.apply(me);

            input.on('input', $.proxy(me._on, me));
            input.on('blur', $.proxy(me._on, me));
            input.on('focus', $.proxy(me._on, me));

            main.attr('data-ctrl-id', me.id);
            return me;
        },

        _on: function (e) {
            this.fire(e.type, e);
        },

        getValue: function () {
            return this.input.val();
        }

    });

    return TextBox;

});