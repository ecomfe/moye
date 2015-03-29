/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 图片延迟加载
 * @author chris(wfsr@foxmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Lazy = require('./Lazy');

    /**
     * 私有函数或方法
     *
     * @type {Object}
     * @namespace
     * @name module:LazyImg~privates
     */
    var privates = /** @lends module:LazyImg~privates */ {

        /**
         * 加载在可视区域的图片
         *
         * @param {Object} scroll 滚动条坐标
         * @param {Object} size 窗口大小
         * @private
         */
        load: function (scroll, size) {
            var _src   = this.options.src;
            var offset = this.options.offset;

            // 剔除已加载的未加载图片元素数组
            this.imgs = $.grep(this.imgs, function (img) {

                img = $(img);

                var el = img.parent();
                var src = img.attr(_src);

                if (!el.height() || !src) {
                    return false;
                }

                // 图片的坐标数据
                var cd = img.offset();

                cd.right = cd.left + img.width();
                cd.bottom = cd.top + img.height();

                var isOverRight = cd.left - offset.x >= scroll.x + size.x;
                var isOverBottom = cd.top - offset.y >= scroll.y + size.y;
                var isLessLeft = cd.right + offset.x <= scroll.x;
                var isLessTop = cd.bottom + offset.y <= scroll.y;

                // 如果在可视区域之内
                if (!(isOverRight || isOverBottom) && !(isLessLeft || isLessTop)) {
                    img.attr('src', src);
                    img.removeAttr(_src);
                    return false;
                }

                // 保留在可视区域之外的图片
                return true;

            });


            // 如果图片全部加载过，可从监听集合中移除
            if (!this.imgs.length) {
                Lazy.remove(this.main);
            }
        }
    };
    /**
     * 图片延迟加载
     *
     * @requires lib
     * @requires Lazy
     * @exports LazyImg
     */
    var LazyImg = lib.newClass(/** @lends module:LazyImg.prototype*/{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'LazyImg',

        /**
         * 控件配置项
         *
         * @name module:LazyImg#options
         * @type {Object}
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @property {string} options.src 图片的真实地址属性
         * @property {?Array.<HTMLElement>} options.src 需要延迟加载的图片元素数组
         * @property {Object} options.offset 调整判断是否在可视区域的偏移量
         * @property {number} options.offset.x 调整判断是否在可视区域的水平偏移量
         * @property {number} options.offset.y 调整判断是否在可视区域的垂直偏移量
         * @private
         */
        options: {

            // 控件渲染主容器
            main: '',

            // 图片的真实地址属性
            src: '_src',

            // 需要延迟加载的图片元素数组
            imgs: null,

            // 调整判断是否在可视区域的偏移量
            offset: {
                y: 32
            }
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:LazyImg#options
         * @private
         */
        initialize: function (options, main) {
            this.setOptions(options);
            main = this.main = lib.g(options.main) || $('.' + options.main)[0];
            this.imgs = options.imgs || $('img', main).toArray();

            Lazy.add(main, $.proxy(privates.load, this), options.offset);
        }

    }).implement(lib.configurable);

    /**
     * 图片延迟加载的快捷 API
     *
     * @param {?string=} className 要延迟加载的元素区域的 className
     * @param {?Object=} options 实例化 LazyImg 的配置参数
     * @see module:LazyImg#options
     * @static
     */
    LazyImg.load = function (className, options) {


        if (lib.isObject(className)) {
            options = className;
            className = null;
        }

        options = options || {};
        className = className || 'lazy-img';

        $('.' + className).each(function (i, el) {

            /* jshint -W031 */
            new LazyImg(
                $.extend(
                    options,
                    {
                        main: el
                    }
                )
            );
        });
    };

    return LazyImg;
});

