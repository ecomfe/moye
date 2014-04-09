/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 弹框组件
 * @author mengke(mengke01@baidu.com)
 */

define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * 移除当前的元素
     *
     * @param {HTMLDomElement} domElement 当前元素
     * @inner
     */

    function remove(domElement) {
        domElement && domElement.parentNode.removeChild(domElement);
    }

    /**
     * 对目标字符串进行格式化
     * 从tangram中抽出
     * @see http://1.5.13-tangram.baidu.com.r.bae.baidu.com:8081
     * /api.html#baidu.string.format|tangram
     *
     * @param {string} source 目标字符串
     * @param {(...Object|...string)} opts 提供相应数据的对象或多个字符串
     * @return {string} 格式化后的字符串
     * @inner
     */
    function format(source, opts) {
        source = String(source);
        var data = Array.prototype.slice.call(arguments, 1);
        var toString = Object.prototype.toString;
        if (data.length) {
            // ie 下 Object.prototype.toString.call(null) == '[object Object]'
            data = data.length === 1
            ? (
                opts !== null
                    && /\[object (Array|Object)\]/.test(toString.call(opts))
                ? opts
                : data
            )
            : data;
            return source.replace(/#\{(.+?)\}/g, function (match, key) {
                var replacer = data[key];
                // chrome 下 typeof /a/ == 'function'
                if ('[object Function]' === toString.call(replacer)) {
                    replacer = replacer(key);
                }
                return ('undefined' === typeof replacer ? '' : replacer);
            });
        }
        return source;
    }


    /**
     * 遮罩层管理类，提供遮罩层的操作函数
     * 
     * @requires lib
     * @requires Dialog
     * @module Mask
     */
    var Mask = lib.newClass( /** @lends module:Mask.prototype */ {

        /**
         * 初始化函数
         *
         * @private
         * @param {Object} opts 初始化选项
         * @see module:Mask.create
         * @private
         */
        initialize: function (opts) {
            var div = document.createElement('div');
            div.id = opts.id;
            div.className = opts.className;
            lib.setStyles(div, opts.styles);
            document.body.appendChild(div);
            this.mask = div;
            Mask.curMasks++;

            if (6 === lib.browser.ie && !Mask.ie6frame) {
                Mask.ie6frame = document.createElement(''
                    + '<iframe'
                    + ' src="about:blank"'
                    + ' frameborder="0"'
                    + ' style="position:absolute;left:0;top:0;z-index:1;'
                    + 'filter:alpha(opacity=0)"'
                    + '></iframe>'
                );
                document.body.appendChild(Mask.ie6frame);
            }
        },

        /**
         * 重新绘制遮盖层的位置
         * 参考esui2
         * 
         * @see https://github.com/erik168/ER/blob/master/src/esui/Mask.js
         * @public
         */
        repaint: function () {
            var width = Math.max(
            document.documentElement.clientWidth, Math.max(
            document.body.scrollWidth, document.documentElement.scrollWidth));

            var height = Math.max(
            document.documentElement.clientHeight, Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight));

            this.mask.style.width = width + 'px';
            this.mask.style.height = height + 'px';

            if (Mask.ie6frame) {
                Mask.ie6frame.style.width = width + 'px';
                Mask.ie6frame.style.height = height + 'px';
            }
        },

        /**
         * 显示一个遮罩层
         *
         * @public
         */
        show: function () {
            if (Mask.ie6frame) {
                Mask.ie6frame.style.zIndex = this.mask.style.zIndex - 1;
                lib.show(Mask.ie6frame);
            }
            lib.show(this.mask);
        },

        /**
         * 隐藏一个遮罩层
         *
         * @public
         */
        hide: function () {
            if (Mask.ie6frame) {
                lib.hide(Mask.ie6frame);
            }
            lib.hide(this.mask);
        },

        /**
         * 注销一个遮罩层
         *
         * @public
         */
        dispose: function () {
            remove(this.mask);
            Mask.curMasks--;

            if (Mask.curMasks <= 0 && Mask.ie6frame) {
                remove(Mask.ie6frame);
                Mask.curMasks = 0;
                Mask.ie6frame = null;
            }
        }
    });

    /**
     * 当前已经生成的Mask个数
     *
     * @type {number}
     */
    Mask.curMasks = 0;

    /**
     * 创建一个遮罩层
     *
     * @param {Object} opts 遮罩选项
     * @param {string} opts.id 编号
     * @param {string} opts.className 类别名称
     * @param {Object} opts.styles 样式集合
     * @return {HTMLElement} 遮罩元素
     */
    Mask.create = function (opts) {
        return new Mask(opts);
    };

    /**
     * 私有函数或方法
     * 
     * @type {Object}
     * @namespace
     * @name module:Dialog~privates
     */
    var privates = /** @lends module:Dialog~privates */ {

        /**
         * 获得指定dialog模块的dom元素
         *
         * @param {string} name 模块名字
         * @return {HTMLElement} 模块的DOM元素
         * @private
         */
        getDom:  function (name) {
            return lib.q(this.options.prefix + '-' + name, this.main)[0];
        },

        /**
         * 根据名字构建的css class名称
         *
         * @param {string} name 模块名字
         * @return {string} 构建的class名称
         * @private
         */
        getClass: function (name) {
            name = name ? '-' + name : '';
            var skin = this.options.skin;
            return this.options.prefix + name + (skin ? ' ' + skin + name : '');
        },

        /**
         * 渲染主框架
         *
         * @private
         */
        renderDOM: function () {
            var opt = this.options;
            var data = {
                closeClass: privates.getClass.call(this, 'close'),
                headerClass: privates.getClass.call(this, 'header'),
                bodyClass: privates.getClass.call(this, 'body'),
                footerClass: privates.getClass.call(this, 'footer'),

                title: opt.title,
                content: opt.content,
                footer: opt.footer
            };

            //渲染主框架内容
            var main = this.createElement('div', {
                'class': privates.getClass.call(this)
            });

            lib.setStyles(main, {
                width: opt.width,
                top: opt.top,
                position: opt.fixed ? 'fixed' : 'absolute',
                zIndex: opt.level
            });

            main.innerHTML = format(this.options.tpl, data);

            document.body.appendChild(main);
            this.main = main;

            //如果显示mask，则需要创建mask对象
            if (this.options.showMask) {
                this.mask = Mask.create({
                    className: privates.getClass.call(this, 'mask'),
                    styles: {
                        zIndex: this.options.level - 1
                    }
                });
            }
        },

        /**
         * 绑定组件相关的dom事件
         *
         * @private
         */
        bind: function () {
            //绑定关闭按钮
            lib.on(
                privates.getDom.call(this, 'close'),
                'click',
                this._bound.onClose
            );

        },

        /**
         * 获得头部区域的dom元素
         *
         * @return {HTMLElement} 模块的DOM元素
         * @private
         */
        getHeaderDom: function () {
            return privates.getDom.call(this, 'header');
        },

        /**
         * 获得内容区域的dom元素
         *
         * @return {HTMLElement} 模块的DOM元素
         * @private
         */
        getBodyDom: function () {
            return privates.getDom.call(this, 'body');
        },

        /**
         * 获得尾部区域的dom元素
         *
         * @return {HTMLElement} 模块的DOM元素
         * @private
         */
        getFooterDom: function () {
            return privates.getDom.call(this, 'footer');
        },

        /**
         * 处理关闭窗口
         * 
         * @private
         */
        onClose: function (e) {
            privates.onHide.call(this, e);
        },

        /**
         * 当视窗大小改变的时候，调整窗口位置
         * 
         * @private
         */
        onResize: function () {
            var me = this;
            clearTimeout(me._resizeTimer);
            me._resizeTimer = setTimeout(function () {
                me.adjustPos();
            }, 100);
        },

        /**
         * 当触发展示的时候
         * 
         * @fires module:Dialog#beforeshow
         * @private
         */
        onShow: function (e) {
            var me = this;

            /**
             * @event module:Dialog#beforeshow
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            me.fire('beforeshow', {
                event: e
            });
            me.show();
        },

        /**
         * 当触发隐藏的时候
         * 
         * @fires module:Dialog#beforehide
         * @private
         */
        onHide: function (e) {

            /**
             * @event module:Dialog#beforehide
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            this.fire('beforehide', {
                event: e
            });
            this.hide();
        }

    };

    /**
     * 对话框
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Dialog
     * @example
     * new Dialog({
     *     main: '',
     *     content: '内容',
     *     footer: '底部',
     *     width: '600px',
     *     title: '标题',
     *     top: '50px',
     *     left: '',
     *     fixed: 1,
     *     showMask: 1,
     *     leve: 10
     *
     *  }).render();
     */
    var Dialog = Control.extend( /** @lends module:Dialog.prototype */ {

        /**
         * 控件类型标识
         *
         * @type {string}
         * @override
         * @private
         */
        type: 'Dialog',

        /**
         * 控件配置项
         *
         * @name module:Dialog#options
         * @type {Object}
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
         * @property {string} options.title 控件标题
         * @property {string} options.content 控件内容
         * @property {string} options.skin 控件的皮肤
         * @property {string} options.width 控件的默认宽度
         * @property {string} options.top 控件距视窗上边缘的高度，默认为auto，会使组件相对于视窗垂直居中
         * @property {string} options.left 控件距视窗左边缘的宽度，默认为auto，会使组件相对于视窗水平居中
         * @property {string} options.fixed 是否固定，不随视窗滚动
         * @property {string} options.showMask 是否显示覆盖层
         * @property {string} options.level 当前dialog的z-index
         * @property {string} options.dragable 是否可以拖动,暂未实现
         * @property {string} options.tpl 默认的框架模板
         * @property {string} options.footer 控件脚注
         * @private
         */
        options: {

            // 控件渲染主容器,会将容器内的html部分迁移到dialog的body中
            main: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-dialog',

            //控件标题
            title: '',

            //控件内容，如果没有指定主渲染容器，则content内容塞到dialog的body中
            content: '',

            //控件脚注
            footer: '',

            //控件的皮肤
            skin: '',

            //控件的默认宽度
            width: '',

            //控件距视窗上边缘的高度，默认为auto，会使组件相对于视窗垂直居中
            top: '',

            //控件距视窗左边缘的宽度，默认为auto，会使组件相对于视窗水平居中
            left: '',

            //是否固定，不随视窗滚动，不支持IE6，IE6自动设置为fixed=0
            fixed: 1,

            //是否显示覆盖层
            showMask: 1,

            //当前dialog的z-index
            level: 10,

            //是否可以拖动,暂未实现
            dragable: 1,

            //模板框架
            tpl: ''
                + '<div class="#{closeClass}">×</div>'
                + '<div class="#{headerClass}">#{title}</div>'
                + '<div class="#{bodyClass}">#{content}</div>'
                + '<div class="#{footerClass}">#{footer}</div>'
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Control#options
         * @private
         */
        init: function (options) {
            this._disabled = options.disabled;
            this.bindEvents(privates);
        },


        /**
         * 设置dialog的标题
         *
         * @param {string} content 对话框的标题
         * @public
         */
        setTitle: function (content) {
            privates.getHeaderDom.call(this).innerHTML = content;
        },

        /**
         * 设置dialog的主体内容，可以是HTML内容
         *
         * @param {string} content 内容字符串
         * @public
         */
        setContent: function (content) {
            privates.getBodyDom.call(this).innerHTML = content;
        },

        /**
         * 设置dialog的页脚内容
         *
         * @param {string} content 内容字符串
         * @public
         */
        setFooter: function (content) {
            privates.getFooterDom.call(this).innerHTML = content;
        },

        /**
         * 调整弹窗位置
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
                    //这里固定为0.35的位置
                    cssOpt.top = (
                    lib.getViewHeight() - this.main.offsetHeight) * 0.35 + 'px';
                }

                lib.setStyles(this.main, cssOpt);
            }

            //absolute则需要动态计算left，top使dialog在视窗的指定位置
            else {
                if (!left) {
                    var scrollLeft = window.pageXOffset
                        || document.documentElement.scrollLeft
                        || document.body.scrollLeft;
                    left = (scrollLeft
                        + (lib.getViewWidth()
                        - this.main.offsetWidth) / 2)
                        + 'px';
                }

                if (!top) {
                    var scrollTop = window.pageYOffset
                        || document.documentElement.scrollTop
                        || document.body.scrollTop;
                    //这里固定为0.35的位置
                    top = (scrollTop
                        + (lib.getViewHeight() - this.main.offsetHeight) * 0.35)
                        + 'px';
                }

                lib.setStyles(this.main, {
                    position: 'absolute',
                    left: left,
                    top: top
                });
            }

            //修正mask的遮罩
            this.mask && this.mask.repaint();
        },

        /**
         * 显示组件
         * @public
         * @fires module:Dialog#show
         */
        show: function () {
            var me = this;

            lib.on(window, 'resize', this._bound.onResize);

            me.mask && me.mask.show();

            //移除hide状态的class
            lib.each(privates.getClass.call(this, 'hide').split(' '), function (className) {
                lib.removeClass(me.main, className);
            });

            me.adjustPos();

            /**
             * @event module:Dialog#show
             */
            me.fire('show');

            return me;
        },


        /**
         * 隐藏组件
         * @public
         *
         * @fires module:Dialog#hide
         */
        hide: function () {
            var me = this;
            me.mask && me.mask.hide();

            //添加hide的class
            lib.each(privates.getClass.call(this, 'hide').split(' '), function (className) {
                lib.addClass(me.main, className);
            });


            /**
             * @event module:Dialog#hide
             */
            me.fire('hide');

            //注销resize
            lib.un(window, 'resize', this._bound.onResize);
            clearTimeout(me._resizeTimer);
            return me;
        },

        /**
         * 绘制控件
         *
         * @override
         * @public
         */
        render: function () {
            var options = this.options;
            if (!this.rendered) {

                //TODO IE6浏览器不支持fixed定位
                if (options.fixed && 6 === lib.browser.ie) {
                    options.fixed = 0;
                }

                privates.renderDOM.call(this);

                //设置渲染的内容
                if (options.main) {
                    var ctl = lib.g(options.main);
                    ctl && privates.getBodyDom.call(this).appendChild(ctl);
                }

                privates.bind.call(this);
                this.rendered = true;
            }
            return this;
        },

        /**
         * 销毁，注销事件，解除引用
         *
         * @public
         * @fires module:Dialog#dispose
         * @fires module:Dialog#beforedispose
         */
        dispose: function () {

            /**
             * @event module:Dialog#beforedispose
             */
            this.fire('beforedispose');

            //注销dom事件
            var bound = this._bound;
            lib.un(privates.getDom.call(this, 'close'), 'click', bound.onClose);
            lib.un(window, 'resize', bound.onResize);

            clearTimeout(this._resizeTimer);

            this.mask && this.mask.dispose();

            /**
             * @event module:Dialog#dispose
             */
            this.parent('dispose');

        }
    });

    /**
     * 对话框的遮罩层管理类
     *
     * @type {Mask}
     */
    Dialog.Mask = Mask;

    return Dialog;
});