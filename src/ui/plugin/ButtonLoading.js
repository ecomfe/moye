/**
 * @file 按钮菊花状态
 * @author leon<lupengyu@baidu.com>
 */

define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');

    var ButtonLoading = Plugin.extend({

        $class: 'ButtonLoading',

        options: {
            text: '请稍候...',
            cooldown: 60000,
            interval: 1000
        },

        activate: function (target) {
            this.target = target;
            target.setLoading = $.proxy(this.setLoading, this);
        },

        setLoading: function (isLoading, text) {

            var target = this.target;

            if (isLoading) {
                this.cache = target.getText();
                target.addState('loading').disable();
                target.setText(text || this.text);
            }
            else {
                target.removeState('loading').enable();
                target.setText(this.cache);
                this.cache = '';
            }

        },

        isLoading: function () {
            return this.target.hasState('loading');
        },

        dispose: function () {
            this.target = null;
        }

    });

    return ButtonLoading;
});
