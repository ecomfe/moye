/**
 * @file moye TextBox校验插件 
 * @author leon <lupengyu@baidu.com>
 */
define(function (require) {

    var $ = require('jquery');
    var Control = require('../Control');
    var lib = require('../lib');


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

            var me = this;
            var main = $(me.main);
            var state = validity.getValidState();
            var valid = validity.isValid();

            message = me.__getIconHTML(state) + me.__getMessage(validity);

            if (me.__validState !== state) {
                me.removeState(me.__validState);
                me.addState(state);
                me.__validState = state;
            }

            main.html(message);

            return me;
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
        __getMessage: function (validity) {

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
            };

        },

        /**
         * 获取一个ICON的HTML
         * 
         * @private
         * @param {string} type icon类型
         * @return {string}
         */
        __getIconHTML: function (type) {

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

            var me = this;

            me.target = target;

            // lib.addPartClasses(me.target, 'validity-tip', me.main);
            // me.skin.push(me.target.type);

            me.render();
            me.place(me.main, target);

            target.tip = me;

            if (!me.auto) {
                return;
            }

            target.on('invalid', $.proxy(me.__onValidityChange, me));
            target.on('valid', $.proxy(me.__onValidityChange, me));

        },

        /**
         * 校验合法性改变事件处理函数
         * 
         * @private
         * @param {Event} e 校验合法性改变事件
         */
        __onValidityChange: function (e) {
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