/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 轮播组件
 * @author  mengke01(mengke01@baidu.com)
 */
define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');
    var Anim = require('./SliderAnim');

    /**
     * 获得当前元素的所有子元素
     *
     * @param {HTMLElement} element 当前元素
     * @return {Array.<HTMLElement>} 子元素集合
     */

    function getChildren(element) {

        if (element.children) {
            return element.children;
        }

        for (
            var children = [], curElement = element.firstChild;
            curElement;
            curElement = curElement.nextSibling
        ) {
            if (curElement.nodeType === 1) {
                children.push(curElement);
            }
        }
        return children;
    }

    /**
     * 私有函数或方法
     * 
     * @type {Object}
     * @namespace
     * @name module:Slider~privates
     */
    var privates = /** @lends module:Slider~privates */ {

        /**
         * 清除自动播放计时器
         * @private
         */
        clearSwitchTimer: function () {
            clearTimeout(this._switchTimer);
            this._switchTimer = 0;
        },

        /**
         * 进入主窗口的事件
         *
         * @private
         */
        onEnter: function () {
            if (this.options.auto) {
                privates.clearSwitchTimer.call(this);
            }
        },

        /**
         * 离开主窗口的事件
         *
         * @private
         */
        onLeave: function () {
            //如果使用自动轮播，则触发轮播计时
            if (this.options.auto) {
                this.play();
            }
        },

        /**
         * 自动切换处理事件
         * @private
         */
        onSwitch: function () {
            this.next();
            this.play();
        },

        /**
         * 上一个按钮点击事件
         *
         * @private
         */
        onPrevClick: function () {
            var me = this;
            if (!me._switchDelayTimer) {
                me._switchDelayTimer = setTimeout(function () {
                    privates.clearSwitchDelayTimer.call(me);
                    me.prev();
                }, me.options.switchDelay);
            }
        },

        /**
         * 下一个按钮点击事件
         *
         * @private
         */
        onNextClick: function () {
            var me = this;
            if (!me._switchDelayTimer) {
                me._switchDelayTimer = setTimeout(function () {
                    privates.clearSwitchDelayTimer.call(me);
                    me.next();
                }, me.options.switchDelay);
            }
        },

        /**
         * 索引的点击事件
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onIndexClick: function (e) {
            var me = this;
            var target = lib.getTarget(e);
            if (target['data-index'] !== '' && !me._switchDelayTimer) {
                var index = target.getAttribute('data-index');
                me._switchDelayTimer = setTimeout(function () {
                    privates.clearSwitchDelayTimer.call(me);
                    me.go(+index);
                }, me.options.switchDelay);
            }
        },

        /**
         * 清除切换延迟
         *
         * @private
         */
        clearSwitchDelayTimer: function () {
            clearTimeout(this._switchDelayTimer);
            this._switchDelayTimer = 0;
        },

        /**
         * 切换到当前索引，设置选中项目
         * 
         * @private
         */
        setCurrent: function () {
            var opt = this.options;

            //如果不是循环模式，则设置prev按钮为不可点击
            if (opt.prevElement) {
                lib[
                    this.index === 0 && !opt.circle ? 'addClass' : 'removeClass'
                ](opt.prevElement, this.getClass('prev-disable'));
            }

            //如果不是循环模式，则设置next按钮为不可点击
            if (opt.nextElement) {
                lib[
                    this.index === this.count - 1 && !opt.circle
                    ? 'addClass'
                    : 'removeClass'
                ](opt.nextElement, this.getClass('next-disable'));
            }

            //选中索引条目
            if (opt.indexElment) {
                var elements = getChildren(opt.indexElment);
                elements[this.lastIndex] && lib.removeClass(
                elements[this.lastIndex], this.getClass('index-selected'));
                elements[this.index] && lib.addClass(
                elements[this.index], this.getClass('index-selected'));
            }

        },


    };


    /**
     * 轮播组件
     *
     * 提供图片以及滚动框的轮播
     * @extends module:Slider
     * @requires lib
     * @requires Control
     * @exports Slider
     * @example
     * new Slider({
     *     main: lib.q('pager-container')[0],
     *     onChange: function (e) {
     *
     *     }
     *  }).render();
     */
    var Slider = Control.extend(/** @lends module:Slider.prototype */{

        /**
         * 获得元素的子元素集合
         *
         * @type {Function}
         */
        getChildren: getChildren,

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Slider',

        /**
         * 控件配置项
         *
         * @name module:Slider#optioins
         * @type {Object}
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         *
         * @property {HTMLElement=} options.stage 控件动画容器，
         * 如果不设则按class规则查找`options.prefix` + `stage`
         *
         * @property {HTMLElement=} options.prevElement prev按钮的容器，
         * 如果不设则按class规则查找`options.prefix` + `prev`
         *
         * @property {HTMLElement=} options.nextElement next按钮的容器，
         * 如果不设则按class规则查找`options.prefix` + `next`
         *
         * @property {HTMLElement=} options.indexElment 轮播索引按钮的容器，
         * 会将第一级子元素设为索引元素，
         * 如果不设则按class规则查找`options.prefix` + `index`
         *
         * @property {boolean} options.auto 是否自动轮播
         * @property {boolean} options.circle 是否播放到结尾时回到起始，
         * 在自动轮播下，需要设置为true
         * @property {Number} options.autoInterval 自动切换动画的延迟时间
         * @property {Number} options.switchDelay 点击切换索引的延迟时间
         * @property {Function} options.onChange 当播放索引改变时的事件
         * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
         *
         * @property {string} options.anim 使用的轮播动画，
         * 默认提供`no`,`slide`,`opacity`
         * @property {Object} options.animOptions 轮播动画选项，
         * 不同的动画效果配置可能不一样
         * @property {string} options.animOptions.easing 使用的动画算子
         * @property {Number} options.animOptions.interval 每次动画时间间隔
         * @property {string} options.animOptions.direction 滑动门的滚动方向
         * `horizontal` or `vertical`
         * 
         * @property {boolean} options.animOptions.rollCycle 是否用循环滚模式 
         *      默认滚动到头会直接滚回去，循环滚会平滑一点
         *
         * @private
         */
        options: {

            // 控件主容器
            main: '',

            // 控件动画容器
            stage: '',

            //prev按钮的容器
            prevElement: '',

            //next按钮的容器
            nextElement: '',

            //轮播索引按钮的容器，会将第一级子元素设为索引元素，
            indexElment: '',

            //是否自动轮播
            auto: true,

            //是否播放到结尾时回到起始，在自动轮播下，需要设置为true
            circle: true,

            //自动切换动画的延迟时间
            autoInterval: 2000,

            //点击切换索引的延迟时间
            switchDelay: 50,

            //当播放索引改变时的事件
            onChange: null,

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-slider',

            //使用的轮播动画
            anim: 'slide',

            //轮播动画选项
            animOptions: {

                //使用的动画算子
                easing: '',

                //每次动画时间间隔
                interval: 200,

                //滑动门的滚动方向
                direction: '',

                //是否用循环滚模式
                rollCycle: ''
            }
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Slider#options
         * @private
         */
        init: function (options) {

            this._disabled = options.disabled;

            this.bindEvents(privates);

            var bound = this._bound;

            if (options.main) {
                this.main = lib.g(options.main);
                lib.addClass(this.main, options.prefix);
                lib.on(this.main, 'mouseenter', bound.onEnter);
                lib.on(this.main, 'mouseleave', bound.onLeave);

                //根据class查找未知的元素
                options.stage = lib.g(options.stage) || lib.q(this.getClass('stage'), this.main)[0];

                //根据class查找未知的元素
                options.prevElement = lib.g(options.prevElement) || this.query(this.getClass('prev'))[0];

                options.nextElement = lib.g(options.nextElement) || this.query(this.getClass('next'))[0];

                options.indexElment = lib.g(options.indexElment) || this.query(this.getClass('index'))[0];

                if (options.prevElement) {
                    lib.on(options.prevElement, 'click', bound.onPrevClick);
                }

                if (options.nextElement) {
                    lib.on(options.nextElement, 'click', bound.onNextClick);
                }

                if (options.indexElment) {
                    lib.on(options.indexElment, 'click', bound.onIndexClick);
                }

                //设置当前的动画组件
                var AnimClass = typeof options.anim === 'string'
                    ? Anim.anims[options.anim]
                    : options.anim;
                this.curAnim = new AnimClass(this, options.animOptions);
            }
        },


        /**
         * 根据名字构建的css class名称
         *
         * @param {string} name 模块名字
         * @return {string} 构建的class名称
         * @public
         */
        getClass: function (name) {
            name = name ? '-' + name : '';
            return this.options.prefix + name;
        },

        /**
         * 获得轮播的索引
         *
         * @param {Number} index 设置的索引
         * @return {Number} 计算后的索引
         * @public
         */
        getIndex: function (index) {

            var goTo = this.index;

            if (index === 'start') {
                goTo = 0;
            } else if (index === 'end') {
                goTo = this.count - 1;
            } else {
                goTo = +index || 0;
            }

            if (goTo === this.index) {
                return -1;
            }

            if (goTo >= this.count) {
                goTo = this.options.circle ? 0 : this.count - 1;
            } else if (goTo < 0) {
                goTo = this.options.circle ? this.count - 1 : 0;
            }

            return goTo;
        },


        /**
         * 如果是自动播放，则激活轮播
         * @public
         */
        play: function () {
            if (this.options.auto) {
                privates.clearSwitchTimer.call(this);
                this._switchTimer = setTimeout(this._bound.onSwitch, this.options.autoInterval);
            }
        },

        /**
         * 刷新当前播放舞台
         *
         * @return {module:Slider} 当前对象
         * @public
         */
        refresh: function () {
            //使用第一个轮播元素的宽和高为舞台的宽和高
            var me = this;
            var opt = this.options;
            var childNodes = getChildren(opt.stage);

            //设置item样式
            lib.each(
                childNodes,
                function (item) {
                    lib.addClass(item, me.getClass('item'));
                }
            );

            //设置索引项目
            if (opt.indexElment) {
                lib.each(
                    getChildren(opt.indexElment),
                    function (item, index) {
                        item.setAttribute('data-index', index);
                    }
                );
            }

            me.stage = opt.stage;
            me.index = 0;
            me.count = childNodes.length;
            me.stageWidth = opt.stage.clientWidth;
            me.stageHeight = opt.stage.clientHeight;

            privates.setCurrent.call(this);
            me.curAnim.refresh();
        },

        /**
         * 绘制控件
         *
         * @return {module:Slider} 当前实例
         * @override
         * @public
         */
        render: function () {
            this.refresh();
            this.play();
            return this;
        },

        /**
         * 切换到前一个
         *
         * @return {module:Slider} 当前对象
         * @public
         */
        prev: function () {
            this.go(this.index - 1);
            return this;
        },

        /**
         * 切换到后一个
         *
         * @return {module:Slider} 当前对象
         * @public
         */
        next: function () {
            this.go(this.index + 1);
            return this;
        },

        /**
         * 切换到的索引
         *
         * @param {Number|string} index 切换到的索引，可以设置数字或者'start'|'end'
         * @return {module:Slider} 当前对象
         * @fires module:Slider#change
         * @public
         */
        go: function (index) {

            var goTo = this.getIndex(index);
            if (goTo === -1) {
                return;
            }

            //如果可以切换到当前的索引
            if (false !== this.curAnim.switchTo(goTo, this.index)) {

                this.lastIndex = this.index;
                this.index = goTo;

                privates.setCurrent.call(this);

                var event = {
                    index: goTo,
                    lastIndex: this.lastIndex
                };

                /**
                 * @event module:Slider#change
                 * @type {Object}
                 * @property {number} index 当前的索引
                 */
                this.fire('change', event);
            }
        },

        /**
         * 销毁，注销事件，解除引用
         * 
         * @fires module:Slider#dispose
         * @override
         * @public
         */
        dispose: function () {
            //停止动画
            privates.clearSwitchDelayTimer.call(this);
            privates.clearSwitchTimer.call(this);

            this.curAnim.dispose();
            this.curAnim = null;

            var bound = this._bound;

            //注销按钮事件
            var options = this.options;
            if (options.prevElement) {
                lib.un(options.prevElement, 'click', bound.onPrevClick);
            }

            if (options.nextElement) {
                lib.un(options.nextElement, 'click', bound.onNextClick);
            }

            if (options.indexElment) {
                lib.un(options.indexElment, 'click', bound.onIndexClick);
            }

            //注销舞台事件
            lib.un(this.main, 'mouseenter', bound.onEnter);
            lib.un(this.main, 'mouseleave', bound.onLeave);

            this.main = this.stage = this.options = null;

            this.parent('dispose');
        }

    });

    /**
     * Anim对象引用，用来作为接口扩展
     *
     * @type {Anim}
     */
    Slider.Anim = Anim;

    return Slider;
});