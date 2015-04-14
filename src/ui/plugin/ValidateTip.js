/**
 * @file moye TextBox校验插件
 * @author leon <lupengyu@baidu.com>
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');
    var Tip = require('../Tip');

    /**
     * 校验结果信息Tip插件
     *
     * @extends module:Plugin
     * @exports ValidateTip
     */
    var ValidateTip = Plugin.extend({

        $class: 'ValidateTip',

        /**
         * 校验结果信息Tip的选项定义
         *
         * @property {Object} options 校验信息Tip配置
         * @property {Array.<string>} options.listener 要监听的校验事件名
         * @property {Object} options.message 校验结果显示的消息Tip配置，
         *                    配置选项定义见{@link module:Tip}
         * @property {Object} options.icon 校验过程中显示的Tip配置，
         *                    配置选项定义见{@link module:Tip}
         */
        options: {
            listen: ['validating', 'aftervalidate', 'change'],
            message: {
                skin: 'validate-tip',
                arrow: 'rc',
                offset: {
                    x: 5
                }
            },
            icon: {
                content: '校验中...',
                skin: 'validate-tip-icon',
                arrow: 'rc',
                offset: {
                    x: 5
                }
            }
        },

        /**
         * @override
         */
        activate: function (target) {
            var main = target.main;

            var msg = this.message;
            if (msg) {
                this.message = new Tip(
                    lib.extend({target: main}, lib.clone(msg))
                ).render();
            }

            var icon = this.icon;
            if (icon) {
                this.icon = new Tip(
                    lib.extend({target: main}, lib.clone(icon))
                ).render();
            }

            var bound = $.proxy(this.onValidityChange, this);
            lib.each(this.listen, function (eventName) {
                target.on(eventName, bound);
            });

            this.target = target;
        },

        /**
         * 显示tip
         *
         * @public
         * @param {Validity} validity 合法性
         */
        show: function (validity) {
            var popup = this.message;
            popup.set('content', this.getMessage(validity));
            popup.show();
        },

        /**
         * 隐藏tip
         *
         * @public
         */
        hide: function () {
            this.message.hide();
        },

        /**
         * 显示校验中状态
         */
        showLoading: function () {
            if (this.icon) {
                this.icon.show();
            }
        },

        /**
         * 隐藏校验中状态
         */
        hideLoading: function () {
            if (this.icon) {
                this.icon.hide();
            }
        },

        /**
         * 获取提示文字
         *
         * @private
         * @param {Validity} validity 校验合法性实例
         * @return {string}
         */
        getMessage: function (validity) {
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
            var type = e.type;
            switch (type) {
                case 'validating':
                    this.showLoading();
                    this.hide();
                    break;
                case 'aftervalidate':
                    this.show(e.validity);
                    this.hideLoading();
                    break;
                case 'change':
                    this.hide(); // 输入变化隐藏之前验证结果信息
                    break;
            }
        },

        /**
         * 销毁
         *
         * @override
         */
        dispose: function () {
            this.message.destroy();
            this.icon && this.icon.destroy();
            this.target = this.icon = this.message = null;
            this.$parent();
        }

    });

    return ValidateTip;

});

