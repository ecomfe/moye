/**
 * @file 按钮冷却插件
 * @author leon<ludafa@outlook.com>
 */

define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');

    /**
     * 按钮冷却插件
     *
     * @extends module:Plugin
     * @requires module:Plugin
     * @exports ButtonCountdown
     */
    var ButtonCooldown = Plugin.extend(/** @lends module:ButtonCountdown.prototype */{

        $class: 'ButtonCooldown',

        /**
         * 默认参数
         *
         * @type {Object}
         * @param {string} options.message  提示消息模板
         * @param {number} options.cooldown 冷却时长
         * @param {number} options.interval 时间间隔
         */
        options: {
            message: '!{count}秒',
            cooldown: 60000,
            interval: 1000
        },

        /**
         * 激活
         *
         * @public
         * @override
         * @param {module:Button} target 目标控件
         */
        activate: function (target) {
            this.target = target;
            target.startCooldown  = $.proxy(this.startCooldown, this);
            target.stopCooldown   = $.proxy(this.stopCooldown, this);
            target.isCooling      = $.proxy(this.isCooling, this);
            this.updateButtonText = $.proxy(this.updateButtonText, this);
        },

        /**
         * 销毁插件
         *
         * @public
         */
        dispose: function () {
            this.target = null;
            this.$parent();
        },

        /**
         * 开始一个冷却计时器
         *
         * @public
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
         *
         * @public
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

        /**
         * 是否正在冷却
         *
         * @public
         * @return {boolean}
         */
        isCooling: function () {
            return !!this.cooldownTimer;
        },

        /**
         * 更新按钮的文字
         *
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
         *
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
