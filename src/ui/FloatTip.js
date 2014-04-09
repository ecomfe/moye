/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 浮动提示组件
 * @author mengke(mengke01@baidu.com)
 */

define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * 私有函数或方法
     * 
     * @type {Object}
     * @namespace
     * @name module:FloatTip~privates
     */
    var privates = /** @lends module:FloatTip~privates */ {


        /**
         * 根据名字构建的css class名称
         *
         * @param {string} name 模块名字
         * @return {string} 构建的class名称
         * @private
         */
        getClass: function (name) {
            name = name ? '-' + name : '';
            return this.options.prefix + name;
        },

        /**
         * 获得指定dialog模块的dom元素
         *
         * @param {string} name 模块名字
         * @param {string} scope 查找范围
         * @return {HTMLElement} 模块的DOM元素
         * @private
         */
        getDom: function (name, scope) {
            return lib.q(privates.getClass.call(this, name), lib.g(scope))[0];
        },

        /**
         * 构造主元素
         * 
         * @private
         */
        create: function () {
            var opt = this.options;
            var cls = {
                content: opt.content,
                iconClass: privates.getClass.call(this, 'icon'),
                contentClass: privates.getClass.call(this, 'content')
            };

            //渲染主框架内容
            var main = this.createElement('div', {
                'class': privates.getClass.call(this)
            });

            lib.setStyles(main, {
                width: opt.width,
                left: opt.left,
                top: opt.top,
                position: opt.fixed ? 'fixed' : 'absolute',
                zIndex: opt.level
            });

            main.innerHTML = this.options.tpl.replace(
                /#\{([\w-.]+)\}/g,
                function ($0, $1) {
                    return cls[$1] || '';
                }
            );

            document.body.appendChild(main);
            this.main = main;

        }        
    };

    /**
     * 对话框
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports FloatTip
     * @example
     *
     * FloatTip.show('上传成功', 2000, function (e) {
     *      console.log('隐藏了');
     * });
     *
     */
    var FloatTip = Control.extend(/** @lends module:FloatTip.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @override
         * @private
         */
        type: 'FloatTip',

        /**
         * 控件配置项
         *
         * @name module:FloatTip#options
         * @type {Object}
         * @property {string} options.prefix class默认前缀
         * @property {string} options.content 提示内容
         * @property {number} options.level 提示框层级
         * @property {string} options.width 控件的默认宽度
         * @property {string} options.top 控件距视窗上边缘的高度，默认为auto，会使组件相对于视窗垂直居中
         * @property {string} options.left 控件距视窗左边缘的宽度，默认为auto，会使组件相对于视窗水平居中
         * @property {string} options.fixed 是否固定，不随视窗滚动
         *
         * @private
         */
        options: {

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-floattip',

            //提示内容
            content: '',

            //控件的默认宽度
            width: '',

            //控件距视窗上边缘的高度，默认为auto，会使组件相对于视窗垂直居中
            top: '',

            //控件距视窗左边缘的宽度，默认为auto，会使组件相对于视窗水平居中
            left: '',

            //是否固定，不随视窗滚动，不支持IE6，IE6自动设置为fixed=0
            fixed: 1,

            //提示框的层级
            level: '',

            //模板框架
            tpl: ''
                +   '<i class="#{iconClass}"></i>'
                +   '<div class="#{contentClass}">#{content}</div>'
        },


        /**
         * 设置提示内容
         * @param {string} content 内容字符串
         * @public
         */
        setContent: function (content) {
            privates.getDom.call(this, 'content').innerHTML = content;
        },

        /**
         * 绘制控件
         *
         * @override
         * @public
         */
        render: function () {
            if (!this.rendered) {
                var options = this.options;
                //TODO IE6浏览器不支持fixed定位
                if (options.fixed && 6 === lib.browser.ie) {
                    options.fixed = 0;
                }

                privates.create.call(this);
                this.rendered = true;
            }
            return this;
        },


        /**
         * 调整弹窗位置
         *
         * @public
         */
        adjustPos: function () {
            var left = this.options.left;
            var top = this.options.top;

            //如果fixed则需要修正下margin-left
            if (this.options.fixed) {
                var cssOpt = {
                    left: left,
                    top: top
                };

                if (!left) {
                    cssOpt.left = '50%';
                    cssOpt.marginLeft = (-this.main.offsetWidth / 2) + 'px';
                }

                if (!top) {
                    //这里固定为0.4的位置
                    cssOpt.top = (lib.getViewHeight() - this.main.offsetHeight)
                        * 0.4 + 'px';
                }

                lib.setStyles(this.main, cssOpt);
            }

            //absolute则需要动态计算left，top使dialog在视窗的指定位置
            else {
                if (left === '') {
                    left = (lib.getViewWidth() - this.main.offsetWidth) / 2;
                    left += lib.getScrollLeft();
                    left += 'px';
                }

                if (top === '') {
                    //这里固定为0.35的位置
                    top = (lib.getViewHeight() - this.main.offsetHeight) * 0.4;
                    top += lib.getScrollTop();
                    top += 'px';
                }

                lib.setStyles(this.main, {
                    position: 'absolute',
                    left: left,
                    top: top
                });
            }
        },


        /**
         * 显示组件
         * 
         * @public
         */
        show: function () {
            lib.removeClass(this.main, privates.getClass.call(this, 'hide'));
            this.adjustPos();
            return this;
        },

        /**
         * 隐藏组件
         * 
         * @public
         */
        hide: function () {
            lib.addClass(this.main, privates.getClass.call(this, 'hide'));
            return this;
        }
    });

    return FloatTip;
});