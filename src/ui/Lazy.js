/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 延迟按需加载
 * @author chris(wfsr@foxmail.com)
 * @author ludafa <leonlu@outlook.com>
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');

    /**
     * 修复非常规布局下的元素宽高
     *
     * @param {HTMLElement} node 元素节点
     * @param {?string=} attr 指定要修复的宽度或高度
     * @return {number} 实时计算后的宽度或高度
     * @inner
     */
    var fixSize = function (node, attr) {
        var size = 0;
        node = $(node);

        if (node.css('display') === 'none') {
            return size;
        }

        // 如果不是刻意隐藏的元素，按非常规布局计算
        var prop = 'offset' + lib.capitalize(attr || 'Height');

        // 计算所有子元素的宽度或高度之和
        node.children().each(function (i, el) {
            var oh = el[prop];
            if (!oh) {
                oh = fixSize(el, attr);
            }
            size += oh;
        });

        return size;
    };

    /**
     * 私有函数或方法
     *
     * @type {Object}
     * @namespace
     * @name module:Lazy~privates
     */
    var privates = /** @lends module:Lazy~privates */ {
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

            // 最后一次滚动条坐标
            var lastScroll = this.lastScroll;

            // 滚动方向
            var dir = {
                left: scroll.x < lastScroll.x,
                top: scroll.y < lastScroll.y
            };

            this.lastScroll = scroll;

            // 可视区域大小
            var size = {
                x: lib.getViewWidth(),
                y: lib.getViewHeight()
            };

            var els = this.els;
            for (var key in els) {
                if (!els.hasOwnProperty(key)) {
                    continue;
                }

                // [HTMLElement, Function, Object]
                // @see module:Lazy#add
                var data = els[key];
                var el = $(data[0]);

                // 元素坐标
                var cd = el.offset();

                var options = data[2] || {};
                options.x = options.x || 10;
                options.y = options.y || 10;

                cd.width = el.width();
                cd.height = el.height();

                // 宽高为0时可能是非常规布局导致，不代表子元素宽高也为0，需实时计算修复
                if (cd.width > 0 && cd.height === 0) {
                    cd.height = fixSize(data[0]);
                }
                else if (cd.width === 0 && cd.height > 0) {
                    cd.width = fixSize(data[0], 'Width');
                }

                // 是否在可视区域之内
                var visible = false;

                var isOverRight = cd.left - options.x >= scroll.x + size.x;
                var isOverBottom = cd.top - options.y >= scroll.y + size.y;
                var isLessLeft = cd.left + cd.width + options.x <= scroll.x;
                var isLessTop = cd.top + options.y + cd.height <= scroll.y;

                if (!(isOverRight || isOverBottom) && !(isLessLeft || isLessTop)) {
                    if (!options.trigger) {
                        data[1](scroll, size, cd, dir, data[0]);
                    }
                    visible = true;
                }
                if (options.trigger) {
                    data[1](visible, scroll, size, cd, dir, data);
                }
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
        }
    };

    /**
     * 延迟按需加载
     *
     * @requires lib
     * @exports Lazy
     */
    var Lazy = lib.newClass(/** @lends module:Lazy.prototype*/{

        /**
         * 控件类型标识
         *
         * @private
         * @type {string}
         */
        type: 'Lazy',

        tag: 'data-lazy-id',

        /**
         * 初始化
         *
         * @private
         */
        initialize: function () {

            // 所有延迟加载的元素集合
            this.els = {};

            // 手动维护的延迟加载的元素的数量
            this.count = 0;

            // 延迟计算的时间（毫秒），在此时间内连续的计算需求会被取消
            this.delay = 100;

            // 滚动条最后的坐标，主要用于判断滚动方向
            this.lastScroll = {
                x: lib.getScrollLeft(),
                y: lib.getScrollTop()
            };

            // 确保方法的上下文 this 是当前实例
            this._bound = {
                onScroll: $.proxy(privates.onScroll, this),
                compute: $.proxy(privates.compute, this)
            };

        },


        /**
         * 添加延迟操作的元素
         *
         * @param {HTMLElement} el 用于判断是否在可视区域的的参考元素
         * @param {Function} callback 判断到元素在可视区域后执行的回调
         * @param {Object} options 用于调整判断是否在可视区域的配置
         * @return {module:Lazy} 当前实例
         * @public
         */
        add: function (el, callback, options) {

            var guid = el.getAttribute(this.tag) || lib.guid();

            if (!this.els[guid]) {
                el.setAttribute(this.tag, guid);
                this.els[guid] = [ el, callback, options ];
                if (!this.count) {
                    $(window).on('scroll', this._bound.onScroll);
                    $(window).on('resize', this._bound.onScroll);
                }
                this.count++;
            }

            if (!this.scrolled) {
                this._bound.onScroll();
            }

            return this;
        },

        /**
         * 移除延迟操作的元素
         *
         * @param {HTMLElement} el 用于判断是否在可视区域的的参考元素
         * @return {module:Lazy} 当前实例
         * @public
         */
        remove: function (el) {
            var guid = el.getAttribute(this.tag);
            if (guid in this.els) {
                delete this.els[guid];
                this.count--;
                if (!this.count) {
                    $(window).off('scroll', this.onScroll);
                    $(window).off('resize', this.onScroll);
                }
            }
            return this;
        }
    });


    (function (Lazy) {
        var lazy;

        /**
         * 获取 Lazy 的共享实例
         *
         * @return {module:Lazy} 共享的 module#Lazy 实例
         * @inner
         */
        var getInstance = function () {
            return lazy || (lazy = new Lazy());
        };

        /**
         * 添加延迟操作的元素
         *
         * @see module:Lazy#add
         * @static
         */
        Lazy.add = function () {
            return getInstance().add.apply(lazy, arguments);
        };

        /**
         * 移除延迟操作的元素
         *
         * @see module:Lazy#remove
         * @static
         */
        Lazy.remove = function () {
            return getInstance().remove.apply(lazy, arguments);
        };

    })(Lazy);

    return Lazy;
});

