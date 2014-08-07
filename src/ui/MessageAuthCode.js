/**
 * @file 短信校验码控件
 * @author leon <leonlu@outlook.com>
 */

define(function (require) {

    var Control = require('./Control');
    var $ = require('jquery');

    var MessageAuthCode = Control.extend({

        type: 'MessageAuthCode',

        options: {
            text: {
                normal: '获取校验码',
                cooldown: '(${time}秒后)重新获取',
                sending: '正在发送...',
                success: '校验码已发送',
                fail: '服务异常，稍候再试'
            },
            cooldown: 60000,
            interval: 1000,
            main: '',
            send: ''
        },

        init: function (options) {
            var me = this;
            $.extend(me, options);
            me.main = $(me.main).get(0);
            me.send = options.send;
            me.text = options.text;
        },

        /**
         * 初始化事件处理
         * 
         * @protected
         */
        initEvents: function () {
            var me = this;
            var main = $(me.main);
            var success = $.proxy(me._onSendSuccess, me);
            var fail = $.proxy(me._onSendFail, me);

            main.on('click', function () {
                if (me.hasState('disabled')) {
                    return;
                }
                me.addState('disabled')._showMessage(me.text.sending);
                me.send.call(me).then(success, fail);
            });
        },

        /**
         * 倒计时
         * 
         * @private
         * @return {Control} SELF
         */
        _cooldown: function () {

            var me = this;
            var interval = me.interval;

            me._clearCooldown();
            me._cooldownCounter = me.cooldown;
            me._cooldownTimer = setInterval(function () {
                me._cooldownCounter -= interval;
                var counter = me._cooldownCounter;

                if (counter > 0) {
                    me._showMessage(
                        me.text.cooldown.replace(/\${time}/g, counter / interval)
                    );
                    return;
                }

                me.reset();

            }, interval);

            return me;

        },

        /**
         * 清除倒计时
         * 
         * @private
         * @return {Control} SELF
         */
        _clearCooldown: function () {
            var me = this;
            me._cooldownCounter = 0;
            if (me._cooldownTimer) {
                clearInterval(me._cooldownTimer);
                me._cooldownTimer = 0;
            }
            return me;
        },

        /**
         * 校验码发送成功事件处理函数
         * 
         * @private
         */
        _onSendSuccess: function () {
            var me = this;
            me._showMessage(me.text.success);
            setTimeout(function () {
                me._cooldown();
            }, 1000);
        },

        /**
         * 发送校验码请求失败事件处理函数
         * 
         * @private
         */
        _onSendFail: function () {
            this._showMessage(this.text.fail);
            this.removeState('disabled');
        },

        /**
         * 显示提示信息
         * 
         * @private
         * @param {string} tip 提示信息
         * @return {Control} SELF
         */
        _showMessage: function (tip) {
            $(this.main).text(tip);
            return this;
        },

        /**
         * 重置为初始状态
         * 
         * @return {Control} SELF
         */
        reset: function () {
            this._clearCooldown();
            this._showMessage(this.text.normal);
            this.removeState('disabled');
            return this;
        }

    });

    return MessageAuthCode;
});

