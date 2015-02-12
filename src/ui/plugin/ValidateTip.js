/**
 * @file moye TextBox校验插件
 * @author leon <lupengyu@baidu.com>
 */
define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');
    var Popup = require('../Popup');

    var ValidateTip = Plugin.extend({

        $class: 'ValidateTip',

        options: {
            listen: ['invalid', 'valid', 'validating'],
            icon: {
                content: '校验中...'
            }
        },

        activate: function (target) {

            var main = target.main;

            this.message = new Popup({
                target: main,
                mode: 'static',
                skin: 'validate-tip'
            }).render();

            var icon = this.icon;

            if (icon) {
                this.icon = new Popup(lib.extend(icon, {
                    target: main,
                    mode: 'static',
                    skin: 'validate-tip-icon',
                    dir: 'rc',
                    offset: {
                        x: -30
                    }
                })).render();
            }

            var bound = $.proxy(this.onValidityChange, this);

            lib.each(this.listen, function (eventName) {
                target.on(eventName, bound);
            });

            this.target = target;
        },

        inactivate: function () {

        },


        /**
         * 显示tip
         *
         * @public
         * @param {Validity} validity 合法性
         * @return {ValidateTip} self
         */
        show: function (validity) {
            var message = this.getMessage(validity);
            var popup = this.message;
            popup.set('content', message);
            popup.show();
            return this;
        },

        /**
         * 隐藏tip
         *
         * @public67890
         * @return {ValidityPlugin} self
         */
        hide: function () {
            this.message.hide();
            return this;
        },

        showLoading: function () {
            if (this.icon) {
                this.icon.show();
            }
        },

        hideLoading: function () {
            if (this.icon) {
                this.icon.hide();
            }
        },

        /**
         * 获取提示文字
         *
         * 如果是非状态，会返回出错的具体原因
         * 如果是合法状态，会返回空
         *
         * @private
         * @param {Validity} validity 校验合法性实例
         * @return {string}
         */
        getMessage: function (validity) {

            if (validity.isValid()) {
                return '';
            }

            var message = validity.getCustomMessage();

            if (message) {
                return message;
            }

            var states = validity.getStates();

            for (var i = states.length - 1; i >= 0; i--) {
                if (!states[i].getState()) {
                    return states[i].getMessage();
                }
            }

        },

        /**
         * 校验合法性改变事件处理函数
         *
         * @private
         * @param {Event} e 校验合法性改变事件
         */
        onValidityChange: function (e) {
            if (e.type === 'validating') {
                this.showLoading();
                this.hide();
            }
            else {
                this.show(e.validity);
                this.hideLoading();
            }
        },

        /**
         * 销毁
         */
        dispose: function () {
            $(this.main).remove();
            this.message.dispose();
            this.icon && this.icon.dispose();
            this.target = this.bound = this.message = null;
        }

    });

    return function (options) {
        return new ValidateTip(options || {});
    };

});

