/**
 * Moye (Zhixin UI)
 * Copyright 2015 Baidu Inc. All rights reserved.
 *
 * @file 延迟按需加载
 *
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');

    /**
     * 私有函数或方法
     *
     * @type {Object}
     * @namespace
     * @name module:Lazyload~privates
     */
    var privates = /** @lends module:Lazyload~privates */ {
        /**
         * 计算在可视区域内的延迟加载元素
         *
         * @private
         */
        compute: function () {

            // 滚动条坐标
            var scroll = {
                x: lib.getScrollLeft(),
                y: lib.getScrollTop()
            };

            // 可视区域大小
            var size = {
                x: lib.getViewWidth(),
                y: lib.getViewHeight()
            };

            var me = this;

            if (!this.imgs || !this.imgs.length) {
                return;
            }

            // 剔除已加载的未加载图片元素数组
            this.imgs = $.grep(this.imgs, function (img) {

                var $img = $(img);

                var src = $img.attr(me.src);

                // 图片的坐标数据
                var cd = $img.offset();

                cd.right = cd.left + $img.width();
                cd.bottom = cd.top + $img.height();

                var isOverRight = cd.left - me.offset.x >= scroll.x + size.x;
                var isOverBottom = cd.top - me.offset.y >= scroll.y + size.y;
                var isLessLeft = cd.right + me.offset.x <= scroll.x;
                var isLessTop = cd.bottom + me.offset.y <= scroll.y;

                // 如果在可视区域之内
                if (!(isOverRight || isOverBottom) && !(isLessLeft || isLessTop)) {

                    var tmpImg = document.createElement('img');

                    tmpImg.onload = function (e) {

                        if (lib.isFunction(me.effect)) {
                            me.effect(img);
                            me.onLoad(img);
                            return;
                        }

                        $img.hide();
                        $img.attr('src', src);
                        $img.removeAttr(me.src);
                        $img[me.effect](me.effectSpeed, function () {
                            me.onLoad(img);
                        });

                        tmpImg = null;
                    };

                    tmpImg.onerror = me.onError;

                    tmpImg.src = src;

                    return false;
                }

                // 保留在可视区域之外的图片
                return true;

            });


            // 如果图片全部加载过，可从监听集合中移除
            if (!this.imgs.length) {
                this.dispose();
            }

        },

        /**
         * 窗口滚动时执行的事件
         *
         * @private
         */
        onScroll: function () {
            clearTimeout(this._timer);
            this._timer = setTimeout(this._bound.compute, this.delay);
            this.scrolled = true;
            this._bound.compute();
        }
    };

    /**
     * 延迟按需加载
     *
     * @requires lib
     * @exports Lazyload
     */
    var Lazyload = lib.newClass(/** @lends module:Lazyload.prototype*/{

        /**
         * 控件类型标识
         *
         * @private
         * @type {string}
         */
        type: 'Lazyload',

        tag: 'data-lazyload-id',

        /**
         * 控件配置项
         *
         * @name module:Lazyload#options
         * @type {Object}
         * @property {string} options.main 控件渲染容器
         * @property {string} options.src 图片的真实地址属性, 通过该属性判断是否为需要延迟加载的图片
         * @property {?Array.<HTMLElement>} options.src 需要延迟加载的图片元素数组
         * @property {number} delay 滚动时延迟计算的时间，防止快速滚动的图片被加载
         * @property {string} effect 图片显示的效果, 可选值 show/fadeIn
         * @property {number} effectSpeed 显示效果的持续时间
         * @property {Object} options.offset 调整判断是否在可视区域的偏移量
         * @property {number} options.offset.x 调整判断是否在可视区域的水平偏移量
         * @property {number} options.offset.y 调整判断是否在可视区域的垂直偏移量
         * @property {Funtion} onLoad 图片加载完成后的回调函数
         * @property {Funtion} onError 图片加载失败后的回调函数
         * @private
         */
        options: {

            main: 'body',

            src: '_src',

            imgs: null,

            delay: 100,

            effect: 'show',

            effectSpeed: 0,

            offset: {
                y: 32,
                x: 0
            },

            onLoad: $.noop,

            onError: $.noop
        },

        /**
         * 初始化
         *
         * @param {Object} options 控件配置项
         * @private
         */
        initialize: function (options) {

            this.setOptions(options);

            var main = this.main = $(options.main || document.body)[0];

            this.imgs = options.imgs || $('img[' + this.src + ']', main).toArray();

            // 确保方法的上下文 this 是当前实例
            this._bound = {
                onScroll: $.proxy(privates.onScroll, this),
                compute: $.proxy(privates.compute, this)
            };

            this.add();

        },


        /**
         * 添加延迟操作的元素
         *
         * @param {HTMLElement|Array.<HTMLElement>} imgs 需要加的做延迟加载的图片
         * @return {module:Lazyload} 当前实例
         * @public
         */
        add: function (imgs) {

            var me = this;

            imgs = imgs || [];

            if (!lib.isArray(imgs)) {
                imgs = [imgs];
            }

            // 过滤非图片元素或已经加载完成的元素
            imgs = $.grep(imgs, function (img) {
                return img.tagName.toLowerCase() === 'img' && $(img).attr(me.src);
            });

            this.imgs = this.imgs.concat(imgs);

            if (this.imgs.length) {
                $(window).on('scroll', this._bound.onScroll);
                $(window).on('resize', this._bound.onScroll);
            }

            if (!this.scrolled) {
                this._bound.onScroll();
            }

            return this;
        },

        /**
         * 注销图片延迟加载
         *
         * @param  {HTMLElement|Array.<HTMLElement>} imgs 需要剔除的图片元素数组
         * @return {module:Lazyload} 当前实例
         * @public
         */
        remove: function (imgs) {

            var me = this;

            if (!lib.isArray(imgs)) {
                imgs = [imgs];
            }

            lib.each(imgs, function (img) {
                var index = $.inArray(img, me.imgs);
                if (index !== -1) {
                    me.imgs.splice(index, 1);
                }
            });

            if (!me.imgs.length) {
                me.dispose();
            }

            return me;
        },

        /**
         * 解绑事件及去除删除图片元素的引用
         *
         * @return {module:Lazyload} 当前实例
         * @public
         */
        dispose: function () {

            $(window).off('scroll', this._bound.onScroll);
            $(window).off('resize', this._bound.onScroll);

            this.scrolled = false;

            return this;
        }

    }).implement(lib.configurable);

    return Lazyload;
});
