/**
 * @file MOYE 按钮
 * @author leon(leonlu@outlook.com)
 */

define(function (require) {

    var $       = require('jquery');
    var Control = require('./Control');
    var painter = require('./painter');

    /**
     * 按钮组件
     *
     * @extends module:Control
     * @requires Control
     * @requires painter
     * @exports Button
     * @example
     * <div class="content">
     *   <button id="button1">ok</button>
     * </div>
     * new Button({
     *     main: document.getElementById('button1')
     *  }).render();
     */
    var Button = Control.extend(/** @lends module:Button.prototype */{

        /**
         * 控件类型标识
         *
         * @readonly
         * @type {string}
         * @public
         */
        type: 'Button',


        /**
         * 控件默认选项配置
         *
         * @name module:BoxGroup#options
         * @type {Object}
         * @property {Object} options 控件选项配置
         * @property {string} options.text button的值
         * @publc
         */
        options: {
            text: ''
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Button#options
         * @override
         */
        init: function (options) {
            this.$parent(options);
            this.text = this.text || this.main.innerHTML;
        },

        /**
         * 初始化Button事件绑定
         *
         * @override
         */
        initEvents: function () {
            this.delegate(this.main, 'click', this.onClick);
        },

        /**
         * 重绘Button控件
         *
         * @override
         */
        repaint: painter.createRepaint(
            Control.prototype.repaint,
            {
                name: ['text'],
                paint: function (conf, text) {
                    this.setText(text);
                }
            }
        ),

        /**
         * 禁用Button
         *
         * @return {module:Button} 当前 Button 实例
         * @public
         */
        disable: function () {
            if (!this.hasState('disabled')) {
                this.addState('disabled');
                $(this.main).attr('disabled', true);
            }
            return this;
        },

        /**
         * 启用Button
         *
         * @return {Button}
         * @public
         */
        enable: function () {
            if (this.hasState('disabled')) {
                this.removeState('disabled');
                $(this.main).attr('disabled', false);
            }
            return this;
        },

        /**
         * 设定按钮文本
         *
         * @param {string} text 文本
         * @return {module:Button} 当前 Button 实例
         * @public
         */
        setText: function (text) {
            this.main.innerHTML = text;
            return this;
        },

        /**
         * 获取按钮文本
         *
         * @return {string}
         * @public
         */
        getText: function () {
            return this.main.innerHTML;
        },

        /**
         * 点击事件处理函数
         *
         * @fires module:Button#click
         * @param {Event} e 点击事件
         * @private
         */
        onClick: function (e) {
            // 搞成按钮的A标签点击都要被阻止跳转
            if (this.main.tagName === 'A') {
                e.preventDefault();
            }
            if (!this.hasState('disabled')) {
                this.fire('click', e);
            }
        },

        /**
         * 销毁单复选框控件实例
         *
         * @override
         */
        dispose: function () {
            this.undelegate(this.main, 'click', this.onClick);
        }

    });

    return Button;

});
