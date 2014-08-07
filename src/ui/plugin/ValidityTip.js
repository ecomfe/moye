/**
 * @file moye TextBox校验插件 
 * @author leon <lupengyu@baidu.com>
 */
define(function (require) {

    var $ = require('jquery');
    var Control = require('../Control');

    var ValidityTip = Control.extend({

        type: 'validate-tip',

        options: {
            auto: true,
            icon: true
        },

        /**
         * 初始化参数
         * 
         * @param {object} options 参数们
         */
        init: function (options) {
            $.extend(this, options);
        },

        /**
         * 显示tip
         * 
         * @public
         * @param {Validity} validity 合法性
         * @return {ValidityTip} self
         */
        show: function (validity) {

            var main = $(this.main);
            var state = validity.getValidState();
            var message = this._getIconHTML(state) + this._getMessage(validity);

            if (this._validState !== state) {
                this.removeState(this._validState);
                this.addState(state);
                this._validState = state;
            }

            main.html(message);

            return this;
        },

        /**
         * 隐藏tip
         * 
         * @public
         * @return {ValidityPlugin} self
         */
        hide: function () {
            $(this.main).hide();
            return this;
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
        _getMessage: function (validity) {

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
         * 获取一个ICON的HTML
         * 
         * @private
         * @param {string} type icon类型
         * @return {string}
         */
        _getIconHTML: function (type) {

            var conf = this.icon;

            // if ($.type(conf) === 'boolean' && !conf) {
            //     return '';
            // }

            // if (type === 'valid' && !conf.valid) {
            //     return  '';
            // }

            // if (type === 'invalid' && !conf.invalid) {
            //     return '';
            // }

            if (!conf) {
                return '';
            }

            return ''
                + '<i class="iconfont">'
                +     (type === 'valid' ? '&#xe607;' : '&#xe608;')
                + '</i>';

        },

        /**
         * 放置tip
         * 
         * @param {DOMElement} main tip的main元素
         * @param {Control} control 插件寄生的控件
         */
        place: function (main, control) {
            $(main).insertAfter(control.main);
        },

        /**
         * 执行插件
         * 
         * @public
         * @param {Control} target 控件
         */
        execute: function (target) {

            this.target = target;
            this.render();
            this.place(this.main, target);

            target.tip = this;

            if (!this.auto) {
                return;
            }

            target.on('invalid', $.proxy(this._onValidityChange, this));
            target.on('valid', $.proxy(this._onValidityChange, this));

        },

        /**
         * 校验合法性改变事件处理函数
         * 
         * @private
         * @param {Event} e 校验合法性改变事件
         */
        _onValidityChange: function (e) {
            this.show(e.validity);
        },

        /**
         * 销毁
         */
        dispose: function () {
            $(this.main).remove();
            this.target.tip = null;
            this.target = null;
        }

    });

    return function (options) {
        return new ValidityTip(options || {});
    };

});

