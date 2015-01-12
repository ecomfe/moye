/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 轮播组件
 * @author mengke01(mengke01@baidu.com)
 * @author leon(ludafa@outlook.com)
 */

define(function (require) {

    var $       = require('jquery');
    var lib     = require('./lib');
    var Control = require('./Control');
    var Anim    = require('./SliderAnim');

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
        clearSwitchDelayTimer: function () {
            clearTimeout(this._switchDelayTimer);
            this._switchDelayTimer = 0;
        },

        /**
         * 进入主窗口的事件
         *
         * @private
         */
        onEnter: function () {
            if (this.auto) {
                this.stop();
            }
        },

        /**
         * 离开主窗口的事件
         *
         * @private
         */
        onLeave: function () {
            if (this.auto) {
                this.play();
            }
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
                    me.goPrev();
                }, me.switchDelay);
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
                    me.goNext();
                }, me.switchDelay);
            }
        },

        /**
         * 索引的点击事件
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onPagerClick: function (e) {
            var me = this;
            var target = e.target;
            // hack 在IE7下取出的属性值是number
            var index = target.getAttribute('data-index') + '';

            if (index && !me._switchDelayTimer) {
                me._switchDelayTimer = setTimeout(function () {
                    privates.clearSwitchDelayTimer.call(me);
                    me.go(+index);
                }, me.switchDelay);
            }
        }

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
         * @property {HTMLElement=} options.indexElement 轮播索引按钮的容器，
         * 会将第一级子元素设为索引元素，
         * 如果不设则按class规则查找`options.prefix` + `index`
         *
         * @property {boolean} options.auto 是否自动轮播
         * @property {boolean} options.circle 是否播放到结尾时回到起始，
         * 在自动轮播下，需要设置为true
         * @property {Number} options.autoInterval 自动切换动画的时间间隔
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

            index: 0,

            // 控件主容器
            main: '',

            // prev按钮的内容
            prev: '&lt;',

            // next按钮的内容
            next: '&gt;',

            // 是否使用向左向右箭头
            arrow: true,

            // 是否使用翻页器
            pager: true,

            // 是否自动轮播
            auto: true,

            // 是否播放到结尾时回到起始，在自动轮播下，需要设置为true
            circle: true,

            // 自动切换动画的延迟时间
            autoInterval: 2000,

            // 点击切换索引的延迟时间
            switchDelay: 50,

            // 当播放索引改变时的事件
            onChange: null,

            // 使用的轮播动画
            anim: 'slide',

            // 轮播动画选项
            animOptions: {

                // 使用的动画算子
                easing: 'easing',

                // 每次动画时间间隔
                interval: 200,

                // 滑动门的滚动方向
                direction: 'horizontal',

                // 是否用循环滚模式
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

            this.$parent(options);

            this.capacity  = this.capacity || +this.main.getAttribute('data-capacity') || 0;

            // 设置当前的动画组件
            var AnimClass = lib.isString(this.anim)
                ? Anim.anims[this.anim]
                : this.anim;

            this.curAnim = new AnimClass(this, this.animOptions);
        },

        /**
         * 构建DOM内容
         */
        initStructure: function () {
            var main     = this.main;
            var helper   = this.helper;
            var capacity = this.capacity;

            if (capacity > 0) {
                if (this.arrow) {
                    this.addArrow('prev', this.prev);
                    this.addArrow('next', this.next);
                }
                if (this.pager) {
                    this.addPager(capacity);
                }
            }

            this.stage = $('.' + helper.getPrimaryClassName('stage'), main)
                .children()
                .addClass(helper.getPartClassName('item'))
                .end()
                .get(0);

            this.refresh();
        },

        /**
         * 添加箭头
         * @param {string} part    方向
         * @param {string} content 箭头内容
         */
        addArrow: function (part, content) {
            var arrow = $(this.helper.createPart(part, 'i', content));
            this[part + 'Arrow'] = arrow
                .appendTo(this.main)
                .css('marginTop', -arrow.height() / 2)
                .get(0);
        },

        /**
         * 添加分页器
         * @param {number} capacity 容量
         */
        addPager: function (capacity) {

            var html = [];
            for (var i = 0; i < capacity; i++) {
                html.push('<i data-index="' + i + '"></i>');
            }

            var helper = this.helper;
            var pager = this.pager;

            // 如果设定的pager是一个DOM元素, 那么把它当作pager的主元素
            // 为它添加样式和id
            if (lib.isElement(pager)) {
                this.pager = pager;
                // 添加样式
                pager = $(pager).addClass(helper.getPartClassName('pager'));
                // 添加id, 优先级, 原有id > 生成id
                pager.attr('id', pager.attr('id') || helper.getPartId());
            }
            else {
                pager = $(this.helper.createPart('pager', 'div', html.join('')));
            }

            this.pager = pager
                .appendTo(this.main)
                .css('marginLeft', -pager.width() / 2)
                .get(0);
        },

        /**
         * 初始化事件绑定
         */
        initEvents: function () {
            var main = this.main;

            this
                .delegate(main, 'mouseenter', privates.onEnter)
                .delegate(main, 'mouseleave', privates.onLeave);

            if (this.arrow) {
                this.delegate(this.prevArrow, 'click', privates.onPrevClick);
                this.delegate(this.nextArrow, 'click', privates.onNextClick);
            }
            if (this.pager) {
                this.delegate(this.pager, 'click', privates.onPagerClick);
            }

            if (this.auto) {
                this.play();
            }

        },

        /**
         * 获得轮播的索引
         *
         * @param {number} to 设置的索引
         * @return {number} 计算后的索引
         * @protected
         */
        _getNextPage: function (to) {
            var from     = this.index;
            var capacity = this.capacity;
            var circle   = this.circle;

            if (to === 'start') {
                to = 0;
            }
            else if (to === 'end') {
                to = this.capacity - 1;
            }
            else {
                to = +to || 0;
            }

            if (to === from) {
                return -1;
            }

            if (to >= capacity) {
                to = circle ? 0 : capacity - 1;
            }
            else if (to < 0) {
                to = circle ? capacity - 1 : 0;
            }

            return to;
        },

        isPlaying: function () {
            return !!this.timer;
        },

        /**
         * 如果是自动播放，则激活轮播
         * @public
         */
        play: function () {

            var me = this;

            if (me.isPlaying()) {
                return;
            }


            me.timer = setInterval(
                function () {
                    me.goNext();
                },
                me.autoInterval
            );

        },

        /**
         * 停止播放
         * @public
         */
        stop: function () {
            if (!this.isPlaying()) {
                return;
            }
            clearInterval(this.timer);
            this.timer = null;
        },

        /**
         * 刷新当前播放舞台
         *
         * @return {Slider} 当前对象
         * @public
         */
        refresh: function () {
            var stage = $(this.stage);
            var children = stage.children();

            this.index = 0;
            this.capacity = children.length;
            this.stageWidth = stage.width();
            this.stageHeight = stage.height();

            this._updateControlPart(0, 0);
            return this;
        },

        /**
         * 切换到前一个
         *
         * @return {Slider} 当前对象
         * @public
         */
        goPrev: function () {
            this.go(this.index - 1);
            return this;
        },

        /**
         * 切换到后一个
         *
         * @return {Slider} 当前对象
         * @public
         */
        goNext: function () {
            this.go(this.index + 1);
            return this;
        },

        /**
         * 切换到的索引
         *
         * @param {Number|string} to 切换到的索引，可以设置数字或者'start'|'end'
         * @return {Slider} 当前对象
         * @fires module:Slider#change
         * @public
         */
        go: function (to) {

            var from = this.index;

            if (to === from) {
                return this;
            }

            // 获取到正确的目标页码
            to = this._getNextPage(to);

            // 如果可以切换到当前的索引
            if (false === this.curAnim.switchTo(to, from)) {
                return;
            }

            this.index = to;
            this._updateControlPart(from, to);

            /**
             * @event module:Slider#change
             * @type {Object}
             * @property {number} index 当前的索引
             */
            this.fire('change', {
                index: to,
                lastIndex: this.lastIndex
            });
        },

        /**
         * 更新当前组件中的各个控制部件
         * @param {number} from 从指定的页码
         * @param {number} to   到指定的页面
         * @protected
         */
        _updateControlPart: function (from, to) {

            var helper = this.helper;
            var act;

            if (this.arrow) {
                // 如果不是循环模式，则设置prev按钮为不可点击
                act = to === 0 && !this.circle
                    ? 'addClass' : 'removeClass';
                $(this.prevArrow)[act](helper.getPartClassName('prev-disable'));
                // 如果不是循环模式，则设置next按钮为不可点击
                act = to === this.capacity - 1 && !this.circle
                    ? 'addClass' : 'removeClass';
                $(this.nextArrow)[act](helper.getPartClassName('next-disable'));
            }

            // 选中索引条目
            if (this.pager) {
                var selectedClass = helper.getPartClassName('pager-selected');
                $(this.pager)
                    .find(':eq(' + from + ')')
                    .removeClass(selectedClass)
                    .end()
                    .find(':eq(' + to + ')')
                    .addClass(selectedClass);
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
            // 停止动画
            privates.clearSwitchDelayTimer.call(this);

            if (this.isPlaying()) {
                this.stop();
            }

            this.curAnim.dispose();
            this.curAnim = null;

            if (this.arrow) {
                this.undelegate(this.prevArrow, 'click', privates.onPrevClick);
                this.undelegate(this.nextArrow, 'click', privates.onNextClick);
                this.prevArrow = this.nextArrow = null;
            }

            if (this.pager) {
                this.undelegate(this.pager, 'click', privates.onPagerClick);
                this.pager = null;
            }

            // 注销舞台事件

            var main = this.main;

            this
                .undelegate(main, 'mouseenter', privates.onEnter)
                .undelegate(main, 'mouseleave', privates.onLeave);

            this.main = this.stage = null;

            this.$parent();
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
