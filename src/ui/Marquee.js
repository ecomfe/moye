/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file  走马灯控件
 * @author  cxtom(cxtom2010@gmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');


    var MAP_GAP = {
        left: 'padding-right',
        right: 'padding-left',
        up: 'padding-bottom',
        down: 'padding-top'
    };

    var behaviors = {

        /**
         * 连续滚动（首尾相连的）
         */
        continus: function () {
            this.timeoutID = setTimeout($.proxy(arguments.callee, this), this.speed);
            var text = this.item;
            text.css(this.getDirection(), this.pos);
            this.pos--;

            // 内容长度大于容器长度
            if (this.pos < -this.max) {
                // 马上在后面添加一个副本
                text.append(this.itemHtml);
                var eles = text.find('span');
                if (eles.length <= 2) {
                    this.max = this.direction === 'left' ? (this.max + this.width) : this.max;
                    this.pos = this.direction === 'left' ? this.pos : (this.pos + this.width);
                    return;
                }

                $(eles[0]).remove();
                this.pos += this.width;
            }
        },

        /**
         * 循环滚动
         */
        scroll: function () {
            this.timeoutID = setTimeout($.proxy(arguments.callee, this), this.speed);
            var text = this.item;
            text.css(this.getDirection(), this.pos);
            this.pos--;

            if (this.pos < -this.max) {
                this.pos = this.direction === 'left' ? this.main.outerWidth() : this.width;
            }

        }
    };

    /**
     * 获取不同滚动方式的限制值
     * @type {Object}
     */
    var initMax = {
        continus: function () {
            switch (this.direction) {
                case 'left':
                    this.max = this.width - this.main.width();
                    break;
                case 'right':
                    this.max = 0;
                    break;
            }
        },
        scroll: function () {
            switch (this.direction) {
                case 'left':
                    this.max = this.width;
                    break;
                case 'right':
                    this.max = this.main.outerWidth();
                    break;
            }
        }
    };

    function clear() {
        this.timeoutID && clearTimeout(this.timeoutID);
        this.timeoutID = null;
    }

    /**
     * 弹出层控件
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Marquee
     */
    var Marquee = Control.extend(/** @lends module:Marquee.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Marquee',

        options: {
            /**
             * 动画速度
             *
             * @type {number}
             * @defaultvalue
             */
            speed: 16,

            /**
             * 动画方向
             * 可选值: left | right
             * TODO:  up | down
             *
             * @type {string}
             * @defaultvalue
             */
            direction: 'left',

            /**
             * 显示内容
             *
             * @type {string}
             * @defaultvalue
             */
            content: '',

            /**
             * 鼠标悬停停止
             *
             * @type {boolean}
             * @defaultvalue
             */
            hoverable: true,

            /**
             * 是否自动开始
             *
             * @type {boolean}
             * @defaultvalue
             */
            auto: true,

            /**
             * 循环滚动间距,单位px
             *
             * @type {number}
             * @defaultvalue
             */
            gap: 80,

            /**
             * 动画类型
             * 可选值: continus | scroll
             * TODO: alternate | slide
             *
             * @type {number}
             * @defaultvalue
             */
            behavior: 'continus'
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 配置项
         * @see module:Marquee#options
         * @protected
         */
        init: function (options) {
            this.$parent(options);
            this.timeoutID = null;

            if ($.inArray(this.direction, ['left', 'right', 'up', 'down']) < 0) {
                this.direction = 'left';
            }
        },

        initStructure: function () {
            this.content = this.content || $(this.main).data('content') || '';

            this.itemHtml = '<span style="' + this.getGapStr() + '">' + this.content + '</span>';
            this.main.html('<span>' + this.itemHtml + '</span>');

            var span = this.main.children('span');
            this.item = span;
            this.width = span.outerWidth();
            this.height = span.outerHeight();
            this.initPosition();

            this.item.css(this.getDirection(), this.pos);

            // 内容长度小于容器长度，自动把滚动方式置为scroll
            if (this.behavior === 'continus' && this.width < this.main.width()) {
                this.behavior = 'scroll';
            }
            $.proxy(initMax[this.behavior], this)();
            this.start = $.proxy(behaviors[this.behavior], this);
            this.stop = $.proxy(clear, this);

            if (this.auto) {
                this.start();
                return;
            }
            this.timeoutID = null;
        },

        initEvents: function () {
            if (this.hoverable) {
                $(this.main).on('mouseenter', this.stop);
                $(this.main).on('mouseleave', this.start);
            }
        },

        getDirection: function () {
            var dir;
            switch (this.direction) {
                case 'left':
                case 'right':
                    dir = this.direction;
                    break;
                // case 'up':
                //     dir = 'top';
                //     break;
                // case 'down':
                //     dir = 'bottom';
                //     break;
            }

            return dir;
        },

        getGapStr: function () {

            if (this.behavior !== 'continus') {
                return '';
            }

            return MAP_GAP[this.direction] + ':' + this.gap + 'px';
        },

        initPosition: function () {
            switch (this.direction) {
                case 'right':
                    this.pos = this.item.outerWidth();
                    break;
                // case 'up':
                //     this.pos = this.main.height();
                //     this.max = this.height - this.main.height();
                //     break;
                // case 'down':
                //     this.pos = this.item.outerHeight();
                //     this.max = 0;
                //     break;
                case 'left':
                default:
                    this.pos = this.main.width();
                    break;
            }
        },

        /**
         * 销毁Marquee控件
         *
         * @public
         */
        dispose: function () {

            this.stop();

            if (this.hoverable) {
                $(this.main).off('mouseenter', this.stop);
                $(this.main).off('mouseleave', this.start);
            }
            this.item = null;
            this.itemHtml = '';
            this.start = $.noop;
            this.stop = $.noop;
            $(this.main).html('');
            this.$parent();
        }

    }).implement(lib.observable).implement(lib.configurable);

    return Marquee;
});
