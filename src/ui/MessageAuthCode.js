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
            var $main = $(me.main);
            me.main = $main.get(0);
            me.send = options.send;
            me.text = options.text;
        },

        initEvents: function () {
            var me = this;
            var $main = $(me.main);
            var send = me.send;
            var success = $.proxy(me.__onSendSuccess, me);
            var fail = $.proxy(me.__onSendFail, me);

            $main.on('click', function () {
                if (me.hasState('disabled')) {
                    return;
                }
                me.addState('disabled').__showMessage(me.text.sending);
                me.send.call(me).then(success, fail);
            });

        },

        __cooldown: function () {

            var me = this;
            var interval = me.interval;

            me.__clearCooldown();
            me.__cooldownCounter = me.cooldown;
            me.__cooldownTimer = setInterval(function () {
                me.__cooldownCounter -= interval;
                var counter = me.__cooldownCounter;

                if (counter > 0) {
                    me.__showMessage(
                        me.text.cooldown.replace(/\${time}/g, counter / interval)
                    );
                    return;
                }

                me.reset();

            }, interval);

        },

        __clearCooldown: function () {
            var me = this;
            me.__cooldownCounter = 0;
            if (me.__cooldownTimer) {
                clearInterval(me.__cooldownTimer)
                me.__cooldownTimer = 0;
            }
            return me;
        },

        __onSendSuccess: function () {
            var me = this;
            me.__showMessage(me.text.success);
            setTimeout(function () {
                me.__cooldown();
            }, 1000);
        },

        __onSendFail: function () {
            var me = this;
            me.__showMessage(me.text.fail);
            me.removeState('disabled');
        },

        __showMessage: function (tip) {
            $(this.main).text(tip);
            return this;
        },

        reset: function () {
            var me = this;
            me.__clearCooldown();
            me.__showMessage(me.text.normal);
            me.removeState('disabled');
            return me;
        }

    });

    return MessageAuthCode;
});