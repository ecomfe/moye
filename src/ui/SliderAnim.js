/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 轮播组件动画库
 * @author  mengke01(mengke01@baidu.com)
 */

define(function (require) {

    var lib = require('./lib');

    /**
     * requestAnimationFrame接口
     *
     * @type {Function}
     */
    var requestAnimationFrame = (function () {
        return window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || function (callback) {
                return setTimeout(callback, 1000 / 60);
            };
    })();

    /**
     * cancelAnimationFrame接口
     *
     * @type {Function}
     */
    var cancelAnimationFrame = (function () {
        return window.cancelAnimationFrame
            || window.webkitCancelAnimationFrame
            || window.mozCancelAnimationFrame
            || window.oCancelAnimationFrame
            || function (id) {
                clearTimeout(id);
            };
    })();

    /**
     * anim对象接口，子类需重写动画相关函数
     *
     * @extends module:SliderAnim
     * @requires lib
     * @exports SliderAnim
     * @param {module:Slider} slider slider主对象
     * @example
     * new SliderAnim(slider, animOptions)
     * @memberof module:Slider
     */
    var SliderAnim = lib.newClass(/*@lends SliderAnim.prototype*/{

        /**
         * 初始化函数
         *
         * @param {module:Slider} slider slider主对象
         * @param {Object} options 动画组件选项
         * @constructor
         */
        initialize: function (slider, options) {
            this.slider = slider;
            this.options = options;
        },

        /**
         * 切换到指定的索引
         *
         * @param {Number} index 指定的索引
         * @param {Number} lastIndex 上一个索引
         * @return {boolean} 是否能够切换成功
         * @protected
         */
        switchTo: function ( /*index, lastIndex*/ ) {
            //overwrite here
        },

        /**
         * 是否动画正在进行
         *
         * @return {boolean} 是否能够切换成功
         * @protected
         */
        isBusy: function () {},

        /**
         * 启用动画，用于多动画效果切换
         *
         * @protected
         */
        enable: function () {},

        /**
         * 禁用动画，用于多动画效果切换
         *
         * @protected
         */
        disable: function () {},

        /**
         * 刷新动画，用于在更新dom节点的时候进行更新
         *
         * @protected
         */
        refresh: function () {},

        /**
         * 注销动画
         *
         * @protected
         */
        dispose: function () {
            this.slider = null;
            this.options = null;
        }
    });

    /**
     * 动画算子
     *
     * @type {Object}
     */
    SliderAnim.easing = {

        /**
         * easing
         * get from qwrap
         * @see http://dev.qwrap.com/resource/js/components/anim/easing.js
         *
         * @param {Number} p 当前百分比
         * @return {Number} 算子百分比
         */
        easing: function (p) {
            if ((p /= 0.5) < 1) {
                return 1 / 2 * p * p;
            }
            return -1 / 2 * ((--p) * (p - 2) - 1);
        },

        /**
         * backIn
         *
         * @param {Number} p 当前百分比
         * @return {Number} 算子百分比
         */
        backIn: function (p) {
            var s = 1.70158;
            return p * p * ((s + 1) * p - s);
        },

        /**
         * backOut
         *
         * @param {Number} p 当前百分比
         * @return {Number} 算子百分比
         */
        backOut: function (p) {
            var s = 1.70158;
            return ((p = p - 1) * p * ((s + 1) * p + s) + 1);
        },

        /**
         * backBoth
         *
         * @param {Number} p 当前百分比
         * @return {Number} 算子百分比
         */
        backBoth: function (p) {
            var s = 1.70158;
            if ((p /= 0.5) < 1) {
                return 1 / 2 * (p * p * (((s *= (1.525)) + 1) * p - s));
            }
            return 1 / 2 * ((p -= 2) * p * (((s *= (1.525)) + 1) * p + s) + 2);
        },

        /**
         * lineer
         *
         * @param {Number} p 当前百分比
         * @return {Number} 算子百分比
         */
        lineer: function (p) {
            return p;
        },

        /**
         * bounce
         *
         * @param {Number} p 当前百分比
         * @return {Number} 算子百分比
         */
        bounce: function (p) {
            if (p < (1 / 2.75)) {
                return (7.5625 * p * p);
            } else if (p < (2 / 2.75)) {
                return (7.5625 * (p -= (1.5 / 2.75)) * p + 0.75);
            } else if (p < (2.5 / 2.75)) {
                return (7.5625 * (p -= (2.25 / 2.75)) * p + 0.9375);
            }
            return (7.5625 * (p -= (2.625 / 2.75)) * p + 0.984375);
        }
    };

    /**
     * 动画组件列表
     *
     * @type {Object}
     */
    SliderAnim.anims = {};

    /**
     * 添加动画组件
     *
     * @param {string} name 名字
     * @param {SliderAnim} Class 动画组件类
     * @return {boolean} 是否添加成功
     */
    SliderAnim.add = function (name, Class) {
        if (!this.anims[name]) {
            this.anims[name] = Class;
            return true;
        }
        return false;
    };

    /**
     * 按时间线轮播组件基类
     * @exports SliderAnim.TimeLine
     * @type {TimeLine}
     */
    var TimeLine = SliderAnim.extend( /*@lends TimeLine.prototype*/ {

        /**
         * 初始化函数
         * @constructor
         *
         * @param {module:Slider} slider slider对象
         * @param {Object} options 动画配置选项
         * @param {Object} options.interval 每一次动画换的执行时间
         * @param {string} options.easing 动画算子
         */
        initialize: function (slider, options) {
            var me = this;
            me.slider = slider;
            me.interval = options.interval || 300;
            me.easingFn = SliderAnim.easing[options.easing || 'easing'];

            var _timeHandler = me.timeHandler;
            me.timeHandler = function () {
                _timeHandler.apply(me);
            };
        },

        /**
         * 在切换索引之前的动作
         * @param {Number} index 指定的索引
         * @param {Number} lastIndex 上一个索引
         */
        beforeSwitch: function ( /*index, lastIndex*/ ) {},

        /**
         * 切换到指定的索引
         *
         * @param {Number} index 目标索引
         * @param {Number} lastIndex 上一个索引
         * @return {boolean} 是否成功切换
         */
        switchTo: function (index, lastIndex) {
            this.beforeSwitch(index, lastIndex);
            this.startTime = new Date();
            if (!this.timer) {
                this.timer = requestAnimationFrame(this.timeHandler);
            }
        },

        /**
         * 计时器函数
         * @private
         */
        timeHandler: function () {
            var timePast = new Date() - this.startTime;
            if (timePast >= this.interval) {
                this.tick(1);
                this.timer = 0;
            } else {
                this.tick(timePast / this.interval);
                this.timer = requestAnimationFrame(this.timeHandler);
            }
        },

        /**
         * 是否动画正在进行
         */
        isBusy: function () {
            return this.timer !== 0;
        },

        /**
         * 禁用动画，用于多动画效果切换
         */
        disable: function () {
            cancelAnimationFrame(this.timer);
            this.timer = 0;
        },

        /**
         * 注销动画
         */
        dispose: function () {
            this.disable();
            this.slider = null;
        },

        /**
         * 当前动画的tick函数，子类需重写此函数
         *
         * @param {Number} percent 当前动画进行的百分比
         * @protected
         */
        tick: function ( /*percent*/ ) {
            //overwrite here
        }
    });

    /**
     * 导出动画基类，方便外层扩展
     *
     * @type {TimeLine}
     */
    SliderAnim.TimeLine = TimeLine;



    /**
     * 基本的轮播效果，无动画切换
     */
    SliderAnim.add('no', SliderAnim.extend({
        /**
         * 切换到指定的索引
         *
         * @param {Number} index 指定的索引
         * @return {boolean} 是否能够切换成功
         */
        switchTo: function (index) {
            this.slider.stage.scrollLeft = this.slider.stageWidth * index;
        }
    }));


    /**
     * 滑动门动画组件
     */
    SliderAnim.add('slide', TimeLine.extend({

        /**
         * 初始化函数
         * @constructor
         *
         * @param {module:Slider} slider slider对象
         * @param {string} options.direction 滑动方向，
         *      `horizontal` or `vertical`
         *
         * 其他选项参考TimeLine的初始化函数
         * @see module:SliderAnim.TimeLine#initialize
         */
        initialize: function (slider, options) {
            this.parent('initialize', slider, options);

            //设置滑动门的方向 `horizontal` or `vertical`
            this.yAxis = options.direction === 'vertical';
        },

        /**
         * 在切换索引之前的动作
         * @param {Number} index 指定的索引
         * @param {Number} lastIndex 上一个索引
         */
        beforeSwitch: function (index, lastIndex) {

            var stageWidth = this.slider.stageWidth;
            var stageHeight = this.slider.stageHeight;

            //这里为了避免reflow使用这种书写方式
            if (this.yAxis) {

                if (this.isBusy()) {
                    this.curPos = this.slider.stage.scrollTop;
                } else {
                    this.curPos = stageHeight * lastIndex;
                }
                this.targetPos = stageHeight * index;
            } else {
                if (this.isBusy()) {
                    this.curPos = this.slider.stage.scrollLeft;
                } else {
                    this.curPos = stageWidth * lastIndex;
                }
                this.targetPos = stageWidth * index;
            }
        },

        /**
         * 当前动画的tick函数，子类基于此设置动画
         *
         * @param {Number} percent 当前动画进行的百分比
         * @protected
         */
        tick: function (percent) {
            var move = (this.targetPos - this.curPos) * this.easingFn(percent);
            this.slider.stage[
            this.yAxis ? 'scrollTop' : 'scrollLeft'] = this.curPos + move;
        }
    }));

    /**
     * 渐变动画组件，通过改变元素的z-index和透明度来改变
     */
    SliderAnim.add('opacity', TimeLine.extend({

        /**
         * 设置目标元素的透明度
         *
         * @param {HTMLElement} element dom元素
         * @param {Number} opacity 透明度
         * @private
         */
        setOpacity: function (element, opacity) {
            if (opacity === 1) {
                element.style.filter = '';
                element.style.opacity = '';
            } else if (lib.browser.ie < 9) {
                element.style.filter = ''
                    + 'alpha(opacity='
                    + (100 * opacity)
                    + ')';
            } else {
                element.style.opacity = opacity;
            }
        },

        /**
         * 在切换索引之前的动作
         * @param {Number} index 指定的索引
         */
        beforeSwitch: function (index) {
            var childNodes = this.slider.getChildren(
            this.slider.stage);
            var l = childNodes.length;

            if (undefined === this.index) {
                this.index = l - 1;
            }

            if (undefined === this.lastIndex) {
                this.lastIndex = l - 1;
            }

            //还原当前元素
            this.setOpacity(childNodes[this.index], 1);

            //设置当前的元素为cover元素
            // 移出顶层元素
            lib.removeClass(
            childNodes[this.index], this.slider.getClass('top'));
            //将顶层元素作为背景
            lib.removeClass(
            childNodes[this.lastIndex], this.slider.getClass('cover'));
            //移出背景元素
            lib.addClass(
            childNodes[this.index], this.slider.getClass('cover'));


            this.lastIndex = this.index;

            //设置当前元素
            lib.addClass(
            childNodes[this.index = index], this.slider.getClass('top'));

            this.setOpacity(
            this.curElement = childNodes[index], 0);
        },

        /**
         * 当前动画的tick函数，子类基于此设置动画
         *
         * @param {Number} percent 当前动画进行的百分比
         * @protected
         */
        tick: function (percent) {
            var move = this.easingFn(percent);
            this.setOpacity(this.curElement, move);
            if (percent === 1) {
                this.curElement = null;
            }
        },

        /**
         * 注销动画
         */
        dispose: function () {
            this.curElement = null;
            this.parent('dispose');
        }
    }));

    return SliderAnim;
});