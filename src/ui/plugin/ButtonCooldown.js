/**
 * @file 按钮冷却插件
 * @author leon<lupengyu@baidu.com>
 */

define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');

    var ButtonCooldown = Plugin.extend({

        $class: 'ButtonCooldown',

        options: {
            message: '!{count}秒',
            cooldown: 60000,
            interval: 1000
        },

        activate: function (target) {
            this.target = target;
            target.startCooldown  = $.proxy(this.startCooldown, this);
            target.stopCooldown   = $.proxy(this.stopCooldown, this);
            target.isCooling      = $.proxy(this.isCooling, this);
            this.updateButtonText = $.proxy(this.updateButtonText, this);
        },

        dispose: function () {
            this.target = null;
        },

        /**
         * 开始一个冷却计时器
         * @param  {number} cooldown 冷却总时长
         * @param  {number} interval 更新间隔
         * @param  {string} message 冷却提示文字
         * @return {Control}
         */
        startCooldown: function (cooldown, interval, message) {
            this.stopCooldown();
            this.cache = this.target.getText();
            this.interval = interval || this.interval;
            this.message = message || this.message;
            this.cooldown = cooldown;
            this.updateButtonText();
            this.cooldownTimer = setInterval(this.updateButtonText, this.interval);
            this.target.disable();
            return this.target;
        },

        /**
         * 停止冷却
         * @return {Control}
         */
        stopCooldown: function () {
            clearInterval(this.cooldownTimer);
            this.cooldown = 0;
            this.cooldownTimer = 0;
            this.target.enable();
            this.restore();
            return this.target;
        },

        isCooling: function () {
            return !!this.cooldownTimer;
        },

        /**
         * 更新按钮的文字
         * @private
         */
        updateButtonText: function () {
            var count = this.cooldown;

            count > 0
                ? this.target.setText(lib.format(this.message, {count: count / this.interval}))
                : this.stopCooldown();

            this.cooldown -= this.interval;
        },

        /**
         * 恢复按钮开始冷却前的文本
         * @private
         */
        restore: function () {
            if (this.cache) {
                this.target.setText(this.cache);
                this.cache = '';
            }
        }

    });

    return ButtonCooldown;

});
