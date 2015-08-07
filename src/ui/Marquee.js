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


    /**
     * 方向 - css padding
     *
     * @const
     * @type {string}
     */
    var MAP_GAP = {
        left: 'padding-right',
        right: 'padding-left',
        up: 'padding-bottom',
        down: 'padding-top'
    };

    var behaviors = {

        /**
         * 内容长度大于容器长度，连续滚动（首尾相连的）
         */
        continous: function bContinus() {
            this.timeoutID = setTimeout($.proxy(bContinus, this), this.speed);
            var text = this.item;
            text.css(this.getDirection(), this.pos + 'px');
            this.pos--;

            if (this.pos < -this.max) {
                // 马上在后面添加一个副本
                text.append(this.itemHtml);
                var eles = text.find('span');
                var len = eles.length;

                if (len <= 2 && !this.vertical) {
                    this.max = this.direction === 'left' ? (this.max + this.width) : this.max;
                    this.pos = this.direction === 'left' ? this.pos : (this.pos + this.width);
                    return;
                }
                else if (len <= 2 && this.vertical) {
                    this.max = this.direction === 'up' ? (this.max + this.height) : this.max;
                    this.pos = this.direction === 'up' ? this.pos : (this.pos + this.height);
                    return;
                }

                eles.eq(0).remove();
                this.pos += this.vertical ? this.height : this.width;
            }
        },

        /**
         * 循环滚动
         */
        scroll: function bScroll() {
            this.timeoutID = setTimeout($.proxy(bScroll, this), this.speed);
            var text = this.item;
            text.css(this.getDirection(), this.pos + 'px');
            this.pos--;

            if (this.pos < -this.max) {
                this.initPosition();
            }

        }
    };

    /**
     * 获取不同滚动方式的限制值
     * @type {Object}
     */
    var initMax = {
        continous: function () {
            switch (this.direction) {
                case 'left':
                    this.max = this.width - this.main.width();
                    break;
                case 'down':
                case 'right':
                    this.max = 0;
                    break;
                case 'up':
                    this.max = this.height - this.main.height();
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
                case 'up':
                    this.max = this.height;
                    break;
                case 'down':
                    this.max = this.main.outerHeight();
                    break;
            }
        }
    };

    function clear() {
        this.timeoutID && clearTimeout(this.timeoutID);
        this.timeoutID = null;
    }

    /**
     * 走马灯控件
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Marquee
     * @example
     * &lt;div id="example" class="ui-marquee" /&gt;
     * new Marquee({
     *     main: $('#example'),
     *     content: 'XXXXXXXXXX'
     *  }).render();
     */
    var Marquee = Control.extend(/** @lends module:Marquee.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Marquee',


        /**
         * 控件配置项
         *
         * @name module:Marquee#options
         * @type {Object}
         * @property {number} speed 动画速度
         * @property {(string | HTMLElement)} main 控件渲染容器
         * @property {string} direction 滚动方向 可选值（默认为 left）：left | right | up | down
         * @property {string} content 提示的内容信息，可以是html
         * @property {boolean} hoverable 是否鼠标悬停
         * @property {boolean} auto 是否自动开始动画
         * @property {number} continus类型时，循环滚动的间距
         * @property {string} behavior 滚动方式 可选值（默认为 continous）: continous | scroll
         * @private
         */
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
             * 可选值: continous | scroll
             * TODO: alternate | slide
             *
             * @type {number}
             * @defaultvalue
             */
            behavior: 'continous'
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
            this.main = $(this.main);

            if ($.inArray(this.direction, ['left', 'right', 'up', 'down']) < 0) {
                this.direction = 'left';
            }

            /**
             * 是否是垂直方向上的运动
             * @type {bool}
             */
            this.vertical = $.inArray(this.direction, ['up', 'down']) >= 0;

            if (this.vertical) {
                this.helper.addPartClasses('vertical');
            }

            this.helper.addPartClasses(this.behavior);
        },

        initStructure: function () {
            this.content = this.content || this.main.data('content') || '';

            this.itemHtml = '<span style="' + this.getGapStr() + '">' + this.content + '</span>';
            this.main.html('<span>' + this.itemHtml + '</span>');

            var span = this.main.children('span');
            this.item = span;
            this.width = this.width || span.outerWidth();
            this.height = this.height || span.outerHeight();
            this.initPosition();

            // 初始化位置
            this.item.css(this.getDirection(), this.pos);

            // continous特殊处理，内容长度小于容器长度，自动把滚动方式置为scroll
            if (this.behavior === 'continous'
                && (!this.vertical && this.width < this.main.width()
                || this.vertical && this.height < this.main.height())
            ) {

                this.vertical ? this.height -= this.gap : this.width -= this.gap;

                this.behavior = 'scroll';
                this.helper.removePartClasses('continus');
                this.helper.addPartClasses('scroll');
                this.item.children('span').css('padding', '0');
            }

            initMax[this.behavior].call(this);

            this.start = $.proxy(behaviors[this.behavior], this);
            this.stop = $.proxy(clear, this);

            if (this.auto) {
                this.start();
                return;
            }
            this.timeoutID = null;
        },

        /**
         * 初始化事件绑定
         *
         * @protected
         */
        initEvents: function () {
            if (this.hoverable) {
                $(this.main).on('mouseenter', this.stop);
                $(this.main).on('mouseleave', this.start);
            }
        },

        /**
         * 根据direction，返回position对应的属性
         *
         * @return {string}
         * @protected
         */
        getDirection: function () {
            var MAP_DIRECTION = {
                up: 'top',
                down: 'bottom'
            };

            return MAP_DIRECTION[this.direction] || this.direction;
        },

        /**
         * 根据direction，返回设置间距的css字符串
         *
         * @return {string}
         * @protected
         */
        getGapStr: function () {

            if (this.behavior !== 'continous') {
                return '';
            }

            return MAP_GAP[this.direction] + ':' + this.gap + 'px';
        },


        /**
         * 设置初始位置
         *
         * @protected
         */
        initPosition: function () {
            switch (this.direction) {
                case 'right':
                    this.pos = this.width;
                    break;
                case 'up':
                    this.pos = this.main.outerHeight();
                    break;
                case 'down':
                    this.pos = this.height;
                    break;
                case 'left':
                    this.pos = this.main.outerWidth();
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
