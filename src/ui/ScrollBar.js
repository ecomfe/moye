/**
 * ZXUI (Zhixin UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 滚动条组件
 * @author  mengke01(mengke01@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * 鼠标滚轮事件，firefox命名不同
     *
     * @type {string}
     */
    var WHEEL_EVENT_NAME = lib.browser.firefox ? 'DOMMouseScroll' : 'mousewheel';

    /**
     * 设置文本不能拖选
     * @param {boolean} enabled 是否启用
     * @param {string} noSelectClass 使用class设置禁止选择
     * @type {Function}
     */
    var setTextNoSelect = lib.browser.ie < 9
        ? function (enabled) {
            var body = $(document.body);
            var prevent = function (e) {
                e.preventDefault();
            };
            body[enabled ? 'on' : 'off']('selectstart', prevent);
        }
        : function (enabled, noSelectClass) {
            $(document.body)[enabled ? 'addClass' : 'removeClass'](noSelectClass);
        };

    /**
     * 滚动条组件
     *
     * @extends module:ScrollBar
     * @requires lib
     * @requires Control
     * @exports ScrollBar
     * @example
     *
     * var scrollbar = new ScrollBar({
     *     main: document.getElementById('scrollbar1');
     * });
     *
     *
     */
    var ScrollBar = Control.extend(/** @lends module:ScrollBar.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @override
         * @private
         */
        type: 'ScrollBar',

        /**
         * 控件配置项
         *
         * @name module:ScrollBar#options
         * @type {Object}
         * @property {boolean} options.disabled 是否禁用组件
         * @property {(string | HTMLElement)} options.main 主元素
         * @property {Number} options.wheelspeed 滚动速度，百分比，越大滚动越快
         * @property {string} options.direction 滚动方向
         * @property {boolean} options.preventWheelScroll
         * 如果true会始终阻止滚轮滚动页面，及时当前面板已经滚动到头
         * 此处会防止因面板较短导致的页面频繁滚动
         * @property {boolean} options.autoThumbSize
         * 是否自动调整thumb的高度，以适应滚动内容的大小
         * @property {boolean} options.minThumbSize
         * 自动调整thumb高度时，最小的thumb高度(px)
         * @property {boolean} options.hoverShow
         * 如果true，则鼠标移动进入才显示滚动条
         * @private
         */
        options: {

            // 需要滚动的元素
            panel: '',

            // 滚轮速度
            wheelspeed: 0.05,

            // 滑动门方向`horizontal` or `vertical`
            direction: 'vertical',

            // 如果true会始终阻止滚轮滚动页面，即使当前已经滚动到头
            preventWheelScroll: false,

            // 是否自动调整thumb的高度
            autoThumbSize: true,

            // 最小的thumb高度,px
            minThumbSize: 30,

            // 鼠标移动进入才显示滚动条
            hoverShow: true
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Control#options
         * @private
         */
        init: function (options) {

            this.$parent(options);

            this.curPos = 0;

            // 当前滚动坐标
            this.xAxis = this.direction === 'horizontal';

            var sizeProp = this.xAxis ? 'Width' : 'Height';
            this.offsetProp = 'offset' + sizeProp;
            this.clientProp = 'client' + sizeProp;
            this.scrollProp = 'scroll' + sizeProp;
            this.scrollDirection = 'scroll' + (this.xAxis ? 'Left' : 'Top');

            // this.onThumbdown = lib.throttle.call(this, this.onThumbdown, 50);
            // this.onMouseup = lib.throttle.call(this, this.onMouseup, 50);

        },

        initStructure: function () {

            var main = this.main;
            var helper = this.helper;

            if (this.xAxis) {
                $(main).addClass(helper.getPartClassName('horizontal'));
            }

            // 需要滚动的元素
            var panel = $('[data-role="scrollbar-content"]', main)[0];

            if (panel) {
                $(panel)
                    .attr('id', helper.getPartId('body'))
                    .data('part', 'body')
                    .addClass(helper.getPartClassName('body'));
            }
            else {
                panel = helper.createPart('body', 'div', this.content || '', {
                    'data-role': 'scrollbar-content'
                });

                $(main).append(panel);
            }

            this.panel = panel;

            this.track = helper.createPart('track', 'div', '', {
                'data-role': 'scrollbar-track'
            });
            $(main).append(this.track);

            this.thumb = helper.createPart('thumb', 'div', '', {
                'data-role': 'scrollbar-thumb'
            });
            $(this.track).append(this.thumb);

            this.refresh();

            if (this.hoverShow) {
                this.track.style.display = 'none';
            }

        },

        startMouseListener: function () {

            this
                .delegate(this.thumb, 'mousedown', this.onThumbdown)
                .delegate(this.track, 'mousedown', this.onTrackMouseDown)
                .delegate(this.main, WHEEL_EVENT_NAME, this.onMouseWheel);

            if (this.hoverShow) {
                this.delegate(this.main, 'mouseenter', this.onMainEnter);
                this.delegate(this.main, 'mouseleave', this.onMainLeave);
            }

        },

        stopMouseListener: function () {

            this
                .undelegate(this.thumb, 'mousedown', this.onThumbdown)
                .undelegate(this.track, 'mousedown', this.onTrackMouseDown)
                .undelegate(this.main, WHEEL_EVENT_NAME, this.onMouseWheel);

            if (this.hoverShow) {
                this.undelegate(this.main, 'mouseenter', this.onMainEnter);
                this.undelegate(this.main, 'mouseleave', this.onMainLeave);
            }

        },


        /**
         * 重绘Button控件
         *
         * @override
         */
        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: ['disable'],
                paint: function (conf, disable) {
                    if (disable) {
                        this.addState('disable');

                        this.stopMouseListener();
                    }
                    else {
                        this.removeState('disable');

                        this.startMouseListener();
                    }
                }
            }
        ),

        /**
         * 滚动到指定位置
         *
         * @param { ( Number | string ) } pos 滚动的距离，
         * 可以设置·begin· or ·end· 或者百分比
         * @return {module:ScrollBar} 本对象
         * @public
         */
        scrollTo: function (pos) {
            if (pos === 'begin') {
                pos = 0;
            }
            else if (pos === 'end') {
                pos = 1;
            }
            // 滚动距离
            else if (pos > 1) {
                pos = pos / (this.panelSize * (1 - this.scrollRatio));
            }
            // 滚动百分比
            else {
                pos = pos * 1 || 0;
            }
            this.setScrollPercent(pos);

            return this;
        },

        /**
         * 重新计算滚动比例
         *
         * @return {module:ScrollBar} 本对象
         * @public
         */
        refresh: function () {

            this.panelSize = this.panel[this.scrollProp];

            // 当前内容的缩放级别
            this.scrollRatio = this.main[this.clientProp] / this.panelSize;

            var act = this.scrollRatio >= 1
                ? 'addState'
                : 'removeState';

            // 设置祖先元素为禁用
            this[act]('noscroll');

            // 滑块轨道的大小
            var trackLen = this.track[this.clientProp];

            if (this.options.autoThumbSize && this.scrollRatio < 1) {

                var thumbSize = Math.max(
                    this.options.minThumbSize,
                    this.scrollRatio * trackLen
                );

                this.thumb.style[this.xAxis ? 'width' : 'height'] = thumbSize + 'px';
            }

            this.trackSize = trackLen - this.thumb[this.offsetProp];

            this.scrollTo(this.curPos);
            this.setEnabled(this.scrollRatio < 1);

            return this;
        },

        /**
         * 按下滚动条的按钮时处理
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onThumbdown: function (e) {

            setTextNoSelect(true, this.helper.getStateClassName('noselect'));

            this.mouseStart = this.xAxis
                ? (e.pageX || e.clientX)
                : (e.pageY || e.clientY);

            this.thumbStart = parseInt(this.thumb.style[this.xAxis ? 'left' : 'top'], 10) || 0;

            this.delegate(document.body, 'mousemove', this.onMousemove);
            this.delegate(document.body, 'mouseup', this.onMouseup);

            this.isMouseDown = true;
            this.isMouseLeave = false;
        },

        /**
         * 拖动时候的事件
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onMousemove: function (e) {

            // 如果滚动条可用
            if (this.scrollRatio < 1) {

                var moveLength = (
                        this.xAxis
                            ? (e.pageX || e.clientX)
                            : (e.pageY || e.clientY)
                    )
                    - this.mouseStart;

                this.thumbPos = Math.min(this.trackSize, Math.max(0, this.thumbStart + moveLength));
                this.setScrollPercent(this.thumbPos / this.trackSize);
            }
        },

        /**
         * 拖动结束时的事件
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onMouseup: function (e) {

            setTextNoSelect(false, this.helper.getStateClassName('noselect'));

            this.undelegate(document.body, 'mousemove', this.onMousemove);
            this.undelegate(document.body, 'mouseup', this.onMouseup);


            if (this.isMouseLeave) {
                this.onMainLeave();
            }
            this.isMouseDown = false;

        },

        /**
         * 点击滚动条时的动作
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onTrackMouseDown: function (e) {

            if (e.target !== this.track) {
                return;
            }

            var pos = Math.min(this.trackSize, this.xAxis ? e.offsetX : e.offsetY);
            this.setScrollPercent(pos / this.trackSize);
        },

        /**
         * 鼠标滚轮事件
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onMouseWheel: function (e) {

            var origin  = e.originalEvent || e;
            var delta   = origin.wheelDelta ? (origin.wheelDelta / 120) : -(origin.detail / 3);
            var percent = delta * this.options.wheelspeed;

            // 这里设置最多滚动距离为2屏
            if (percent * (1 - this.scrollRatio) > 2 * this.scrollRatio) {
                percent = 2 * this.scrollRatio;
            }

            percent = this.curPos - percent;
            this.setScrollPercent(percent);
            // 在滚动范围内取消默认行为
            if (this.options.preventWheelScroll
                || (percent >= 0.005 && percent <= 0.995)
            ) {
                e.preventDefault();
            }

        },

        /**
         * 主容器鼠标进入事件
         *
         * @private
         */
        onMainEnter: function () {
            if (this.isMouseDown) {
                this.isMouseLeave = false;
            }
            else {
                $(this.track).fadeIn(150);
            }
        },

        /**
         * 主容器鼠标离开事件
         *
         * @private
         */
        onMainLeave: function () {
            if (this.isMouseDown) {
                this.isMouseLeave = true;
            }
            else {
                $(this.track).fadeOut(150);
            }
        },

        /**
         * 设置滚动的位置
         *
         * @param {number} pos 设置滚动的位置比例
         * @private
         * @fires module:ScrollBar#event
         */
        setScrollPercent: function (pos) {

            // 取消舍入误差
            if (pos < 0.005) {
                pos = 0;
            }
            else if (1 - pos < 0.005) {
                pos = 1;
            }

            var axis = this.xAxis ? 'left' : 'top';
            this.thumb.style[axis] = Math.round(pos * this.trackSize) + 'px';

            var top = Math.round(pos * this.panelSize * (1 - this.scrollRatio));

            this.panel.style[axis] = (-top) + 'px';

            this.curPos = pos;
            var event = {
                position: pos
            };

            /**
             * @event  module:ScrollBar#change
             * @property {Number} position 当前的滚动比例
             */
            this.fire('scroll', event);
        },

        /**
         * 设置是否启用
         *
         * @param {boolean} enabled 是否启用
         * @public
         */
        setEnabled: function (enabled) {

            this.set('disable', !enabled);

        },

        /**
         * 销毁，注销事件，解除引用
         *
         * @override
         * @public
         * @fires module:ScrollBar#dispose
         */
        dispose: function () {

            $(document.body).removeClass(this.helper.getStateClassName('noselect'));

            this.stopMouseListener();

            this.panel = this.thumb = this.track = null;

            this.$parent();
        }
    });

    return ScrollBar;
});
