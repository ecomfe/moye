/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 轮播组件动画库
 * @author  mengke01(mengke01@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
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
     * 设置透明度
     * @param {HTMLElement} element dom元素
     * @param {number} opacity 透明度
     *
     * @type {Function}
     */
    var setOpacity = lib.browser.ie < 9
        ? function (element, opacity) {
            if (opacity === 1) {
                element.style.filter = '';
            }
            else {
                element.style.filter = ''
                    + 'alpha(opacity='
                    + (100 * opacity)
                    + ')';
            }
        }
        : function (element, opacity) {
            if (opacity === 1) {
                element.style.opacity = '';
            }
            else {
                element.style.opacity = opacity;
            }
        };

    /**
     * anim对象接口，子类需重写动画相关函数
     *
     * @requires lib
     * @exports SliderAnim
     */
    var SliderAnim = lib.newClass({

        type: 'SliderAnim',

        /**
         * 初始化函数
         *
         * @param {module:Slider} slider slider主对象
         * @param {Object} options 动画组件选项
         */
        initialize: function (slider, options) {
            this.slider = slider;
            this.options = options;
        },

        /**
         * 切换到指定的索引
         *
         * @param {number} index 指定的索引
         * @param {number} lastIndex 上一个索引
         * @protected
         */
        switchTo: function (index, lastIndex) {
            // overwrite here
        },

        /**
         * 是否动画正在进行
         *
         * @return {boolean} 是否能够切换成功
         * @protected
         */
        isBusy: function () {
            return true;
        },

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
     * @name module:SliderAnim.easing
     */
    SliderAnim.easing = {

        /**
         * easing
         *
         * @param {number} p 当前百分比
         * @return {number} 算子百分比
         */
        easing: function (p) {
            p *= 2;
            return p < 1
                ? 1 / 2 * p * p
                : -1 / 2 * ((--p) * (p - 2) - 1);
        },

        /**
         * backIn
         *
         * @param {number} p 当前百分比
         * @return {number} 算子百分比
         */
        backIn: function (p) {
            var s = 1.70158;
            return p * p * ((s + 1) * p - s);
        },

        /**
         * backOut
         *
         * @param {number} p 当前百分比
         * @return {number} 算子百分比
         */
        backOut: function (p) {
            var s = 1.70158;
            return ((p = p - 1) * p * ((s + 1) * p + s) + 1);
        },

        /**
         * backBoth
         *
         * @param {number} p 当前百分比
         * @return {number} 算子百分比
         */
        backBoth: function (p) {
            var s = 1.70158;
            p *= 2;
            return p < 1
                ? 1 / 2 * (p * p * (((s *= (1.525)) + 1) * p - s))
                : 1 / 2 * ((p -= 2) * p * (((s *= (1.525)) + 1) * p + s) + 2);
        },

        /**
         * linear
         *
         * @param {number} p 当前百分比
         * @return {number} 算子百分比
         */
        linear: function (p) {
            return p;
        },

        /**
         * bounce
         *
         * @param {number} p 当前百分比
         * @return {number} 算子百分比
         */
        bounce: function (p) {
            if (p < (1 / 2.75)) {
                return (7.5625 * p * p);
            }
            else if (p < (2 / 2.75)) {
                return (7.5625 * (p -= (1.5 / 2.75)) * p + 0.75);
            }
            else if (p < (2.5 / 2.75)) {
                return (7.5625 * (p -= (2.25 / 2.75)) * p + 0.9375);
            }
            return (7.5625 * (p -= (2.625 / 2.75)) * p + 0.984375);
        }
    };

    /**
     * 动画组件列表
     *
     * @name module:SliderAnim.anims
     */
    SliderAnim.anims = {};

    /**
     * 添加动画组件
     *
     * @param {string} name 名字
     * @param {module:SliderAnim} Class 动画组件类
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
     *
     * @requires SliderAnim
     * @name module:SliderAnim~TimeLine
     */
    SliderAnim.TimeLine = SliderAnim.extend({

        type: 'TimeLine',

        /**
         * 初始化函数
         *
         * @param {module:Slider} slider slider对象
         * @param {Object} options 动画配置选项
         * @param {Object} options.interval 每一次动画换的执行时间
         * @param {string} options.easing 动画算子
         */
        initialize: function (slider, options) {
            this.$parent(slider, options);
            this.slider = slider;
            this.interval = options.interval || 300;
            this.easingFn = SliderAnim.easing[options.easing || 'easing'];
            this.timeHandler = $.proxy(this.timeHandler, this);
        },

        /**
         * 在切换索引之前的动作
         * @param {number} index 指定的索引
         * @param {number} lastIndex 上一个索引
         * @protected
         */
        beforeSwitch: function (index, lastIndex) {
        },

        /**
         * 切换到指定的索引
         *
         * @param {number} index 目标索引
         * @param {number} lastIndex 上一个索引
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
         *
         * @private
         */
        timeHandler: function () {
            var timePast = new Date() - this.startTime;
            if (timePast >= this.interval) {
                this.tick(1);
                this.timer = 0;
            }
            else {
                this.tick(timePast / this.interval);
                this.timer = requestAnimationFrame(this.timeHandler);
            }
        },

        /**
         * 是否动画正在进行
         * @return {boolean}
         */
        isBusy: function () {
            return !!this.timer;
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
         * @param {number} percent 当前动画进行的百分比
         * @protected
         */
        tick: function (percent) {
            // overwrite here
        }
    });

    /**
     * 基本的轮播效果，无动画切换
     *
     * @name module:SliderAnim.anims.no
     */
    SliderAnim.add('no', SliderAnim.extend({

        type: 'SliderAnimNo',

        /**
         * 切换到指定的索引
         *
         * @param {number} index 指定的索引
         */
        switchTo: function (index) {
            this.slider.stage.scrollLeft = this.slider.stageWidth * index;
        }
    }));


    /**
     * 滑动门动画组件
     *
     * @name module:SliderAnim.anims.slider
     */
    SliderAnim.add('slide', SliderAnim.TimeLine.extend({

        type: 'SliderAnimSlide',

        /**
         * 初始化函数
         *
         * 其他选项参考TimeLine的初始化函数
         *
         * @param {Slider} slider slider对象
         * @param {Object} options 参数
         * @param {string} options.direction 滑动方向 `horizontal`/`vertical`
         */
        initialize: function (slider, options) {

            this.$parent(slider, options);

            var direction = options.direction || 'horizontal';

            // 设置滑动门的方向 `horizontal` or `vertical`
            this.yAxis = direction === 'vertical';

            slider.helper.addPartClasses('stage-' + direction);

            // 是否采用循环滚模式滚动，从结尾平滑滚动到开头，
            // 需要拷贝首节点到末尾来支持
            this.rollCycle = options.rollCycle || false;
        },

        /**
         * 在切换索引之前的动作
         *
         * @param {number} index 指定的索引
         * @param {number} lastIndex 上一个索引
         * @protected
         */
        beforeSwitch: function (index, lastIndex) {

            var stageWidth = this.slider.stageWidth;
            var stageHeight = this.slider.stageHeight;
            var maxIndex = this.slider.capacity - 1;
            var stage = $(this.slider.stage);

            // 如果使用循环滚模式
            if (this.rollCycle) {
                // 初始化要拷贝首节点到最后
                if (!this.cycleNode) {
                    stage.children().first().clone().appendTo(stage);
                    this.cycleNode = true;
                }
            }

            // 这里为了避免reflow使用这种书写方式
            if (this.yAxis) {
                if (this.isBusy()) {
                    this.curPos = stage.scrollTop();
                }
                else {
                    this.curPos = stageHeight * lastIndex;
                }
                this.targetPos = stageHeight * index;
            }
            else {
                if (this.isBusy()) {
                    this.curPos = stage.scrollLeft();
                }
                else {
                    this.curPos = stageWidth * lastIndex;
                }
                this.targetPos = stageWidth * index;

                // 注意，循环模式没有处理正在滚动时的定位问题
                // 所以在使用时可以设置slider的switchDelay大于
                // 滚动动画的时间防止连续点击
                if (this.rollCycle) {
                    // 结尾滚开头
                    if (index === 0 && lastIndex === maxIndex) {
                        this.targetPos = stageWidth * (maxIndex + 1);
                    }
                    // 开头滚结尾
                    else if (index === maxIndex && lastIndex === 0
                        && !this.isBusy()) {
                        this.curPos = stageWidth * (maxIndex + 1);
                    }
                }
            }
        },

        /**
         * 当前动画的tick函数，子类基于此设置动画
         *
         * @param {number} percent 当前动画进行的百分比
         * @protected
         */
        tick: function (percent) {
            var move = (this.targetPos - this.curPos) * this.easingFn(percent);
            var prop = this.yAxis ? 'scrollTop' : 'scrollLeft';
            this.slider.stage[prop] = this.curPos + move;
        }
    }));

    /**
     * 渐变动画组件，通过改变元素的z-index和透明度来改变
     */
    SliderAnim.add('opacity', SliderAnim.TimeLine.extend({

        type: 'SliderAnimOpacity',

        /**
         * 设置目标元素的透明度
         *
         * @private
         */
        setOpacity: setOpacity,

        initialize: function (slider, options) {
            this.$parent(slider, options);
            slider.helper.addPartClasses('stage-opactiy');
        },

        /**
         * 在切换索引之前的动作
         *
         * @param {number} index 指定的索引
         * @protected
         */
        beforeSwitch: function (index) {

            var slider = this.slider;
            var helper = slider.helper;
            var childNodes = $(slider.stage).children();
            var l = childNodes.length;

            if (lib.isUndefined(this.index)) {
                this.index = l - 1;
            }

            if (lib.isUndefined(this.lastIndex)) {
                this.lastIndex = l - 1;
            }

            // 还原当前元素
            this.setOpacity(childNodes[this.index], 1);

            // 移出顶层元素
            $(childNodes[this.index]).removeClass(helper.getPartClassName('top'));
            // 将顶层元素作为背景
            $(childNodes[this.lastIndex]).removeClass(helper.getPartClassName('cover'));
            // 移出背景元素
            $(childNodes[this.index]).addClass(helper.getPartClassName('cover'));

            this.lastIndex = this.index;

            // 设置当前元素
            $(childNodes[this.index = index]).addClass(helper.getPartClassName('top'));

            this.setOpacity(this.curElement = childNodes[index], 0);
        },

        /**
         * 当前动画的tick函数，子类基于此设置动画
         *
         * @param {number} percent 当前动画进行的百分比
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
         *
         * @public
         */
        dispose: function () {
            this.curElement = null;
            this.$parent();
        }
    }));

    return SliderAnim;
});
