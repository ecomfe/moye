/**
 * ZXUI (Zhixin UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 滚动条组件
 * @author  mengke01(mengke01@baidu.com)
 */

define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * 鼠标滚轮事件，firefox命名不同
     *
     * @type {string}
     */
    var wheelEvent = lib.browser.firefox ? 'DOMMouseScroll' : 'mousewheel';

    /**
     * 设置文本不能拖选
     * @param {boolean} enabled 是否启用
     * @param {string} noSelectClass 使用class设置禁止选择
     * @type {Function}
     */
    var setTextNoSelect = (function (supportCss) {
        var selectEvent;
        return (supportCss
            ? function (enabled, noSelectClass) {
                lib[enabled ? 'addClass' : 'removeClass'](document.body, noSelectClass);
            }
            : function (enabled) {
                if (enabled) {
                    selectEvent = document.body.onselectstart;
                    document.body.onselectstart = new Function(
                        'event.returnValue = false'
                    );
                }
                else {
                    document.body.onselectstart = selectEvent;
                }
            });
    })(lib.browser.ie < 9 ? false : true);

    /**
     * 私有函数或方法
     *
     * @type {Object}
     * @namespace
     * @name module:ScrollBar~privates
     */
    var privates = /** @lends module:ScrollBar~privates */ {
        /**
         * 按下导航条的按钮时处理
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onThumbdown: function (e) {
            if (this._disabled) {
                return;
            }
            setTextNoSelect(true, privates.getClass.call(this, 'noselect'));

            this.mouseStart = this.xAxis
                ? (e.pageX || e.clientX)
                : (e.pageY || e.clientY);
            this.thumbStart = parseInt(this.thumb.style[this.xAxis ? 'left' : 'top'], 10) || 0;

            lib.on(document, 'mousemove', this._bound.onMousemove);
            lib.on(document, 'mouseup', this._bound.onMouseup);
        },

        /**
         * 拖动时候的事件
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onMousemove: function (e) {
            //如果滚动条可用
            if (this.scrollRatio < 1) {

                var moveLength = (
                    this.xAxis
                        ? (e.pageX || e.clientX)
                        : (e.pageY || e.clientY)
                    )
                    - this.mouseStart;

                this.thumbPos = Math.min(this.trackSize, Math.max(0, this.thumbStart + moveLength));
                privates.setScrollPercent.call(this, this.thumbPos / this.trackSize);
            }
        },

        /**
         * 拖动结束时的事件
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onMouseup: function () {
            setTextNoSelect(false, privates.getClass.call(this, 'noselect'));

            lib.un(document, 'mousemove', this._bound.onMousemove);
            lib.un(document, 'mouseup', this._bound.onMouseup);
        },

        /**
         * 点击滚动条时的动作
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onTrackUp: function (e) {
            if (this._disabled || lib.getTarget(e) !== this.track) {
                return;
            }
            var pos = Math.min(
            this.trackSize, this.xAxis ? e.offsetX : e.offsetY);
            privates.setScrollPercent.call(this, pos / this.trackSize);
        },

        /**
         * 鼠标滚轮事件
         *
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onMouseWheel: function (e) {
            if (this._disabled) {
                return;
            }
            var delta = e.wheelDelta ? e.wheelDelta / 120 : -e.detail / 3;
            var percent = delta * this.options.wheelspeed;

            //这里设置最多滚动距离为2屏
            if (percent * (1 - this.scrollRatio) > 2 * this.scrollRatio) {
                percent = 2 * this.scrollRatio;
            }

            var percent = this.curPos - percent;
            privates.setScrollPercent.call(this, percent);
            //在滚动范围内取消默认行为
            if (this.options.preventWheelScroll
                || (percent >= 0.005 && percent <= 0.995)
            ) {
                lib.preventDefault(e);
            }

        },

        /**
         * 主容器鼠标进入事件
         *
         * @private
         */
        onMainEnter: function () {
            lib.addClass(this.main, privates.getClass.call(this, 'over'));
        },

        /**
         * 主容器鼠标离开事件
         *
         * @private
         */
        onMainLeave: function () {
            lib.removeClass(this.main, privates.getClass.call(this, 'over'));
        },

        /**
         * 设置滚动的位置
         *
         * @param {Number} pos 设置滚动的位置比例
         * @private
         * @fires module:ScrollBar#event
         */
        setScrollPercent: function (pos) {

            //取消舍入误差
            if (pos < 0.005) {
                pos = 0;
            }
            else if (1 - pos < 0.005) {
                pos = 1;
            }

            var axis = this.xAxis ? 'left' : 'top';
            this.thumb.style[axis] = Math.round(pos * this.trackSize) + 'px';

            var top = Math.round(pos * this.panelSize * (1 - this.scrollRatio));
            if (this.posMode) {
                this.panel.style[axis] = (-top) + 'px';
            }
            else {
                this.panel[this.scrollDirection] = top;
            }

            this.curPos = pos;
            var event = {
                position: pos
            };

            /**
             * @event  module:ScrollBar#change
             * @property {Number} position 当前的滚动比例
             */
            this.fire('change', event);
        },

        /**
         * 根据名字构建的css class名称
         *
         * @param {string} name 模块名字
         * @return {string} 构建的class名称
         * @private
         */
        getClass: function (name) {
            name = name ? '-' + name : '';
            return this.options.prefix + name;
        }

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
     *     main: lib.g('ecl-ui-scrollbar-main'),
     *     thumb: lib.g('ecl-ui-scrollbar-thumb'),
     *     disabled: 0
     *});
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
         * @property {(string | HTMLElement)} options.panel 需要滚动的元素，
         * 如果不设则按class规则查找`options.prefix` + `panel`
         * @property {(string | HTMLElement)} options.thumb 滚动条按钮元素
         * 如果不设则按class规则查找`options.prefix` + `thumb` ，
         * 并且将thumb父级元素作为track
         * @property {Number} options.wheelspeed 滚动速度，百分比，越大滚动越快
         * @property {string} options.direction 滚动方向
         * @property {string} options.prefix class默认前缀
         * @property {string} options.mode 使用的模式(`scroll` or `position`)，
         * scrollTop模式or style.top模式
         * 使用的css是不一样的,默认scrollTop模式
         * @property {boolean} options.preventWheelScroll
         * 如果true会始终阻止滚轮滚动页面，及时当前面板已经滚动到头
         * 此处会防止因面板较短导致的页面频繁滚动
         * @property {boolean} options.autoThumbSize
         * 是否自动调整thumb的高度，以适应滚动内容的大小
         * @property {boolean} options.minThumbSize
         * 自动调整thumb高度时，最小的thumb高度(px)
         * @private
         */
        options: {

            //是否禁用组件
            disabled: false,

            //组件控制的主元素
            main: '',

            //需要滚动的元素
            panel: '',

            //组件控制的滑动按钮
            thumb: '',

            //滚轮速度
            wheelspeed: 0.05,

            //滑动门方向`horizontal` or `vertical`
            direction: 'vertical',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-scrollbar',

            //使用的模式，scrollTop模式or style.top模式，使用的css是不一样的
            mode: '',

            //如果true会始终阻止滚轮滚动页面，即使当前已经滚动到头
            preventWheelScroll: false,

            //是否自动调整thumb的高度
            autoThumbSize: true,

            //最小的thumb高度,px
            minThumbSize: 30
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Control#options
         * @private
         */
        init: function () {
            if (!this.options.main) {
                throw new Error('invalid main');
            }

            var opt = this.options;
            this._disabled = !! opt.disabled;
            this.curPos = 0;

            this.bindEvents(privates);

            //当前滚动坐标
            this.xAxis = opt.direction === 'horizontal';

            var sizeProp = this.xAxis ? 'Width' : 'Height';
            this.offsetProp = 'offset' + sizeProp;
            this.clientProp = 'client' + sizeProp;
            this.scrollProp = 'scroll' + sizeProp;
            this.scrollDirection = 'scroll' + (this.xAxis ? 'Left' : 'Top');
            this.posMode = opt.mode === 'position';

            //滚动主元素
            this.main = lib.g(opt.main);

            //需要滚动的元素
            if (!opt.panel) {
                this.panel = lib.q(privates.getClass.call(this, 'panel'), this.main)[0];
            }
            else {
                this.panel = lib.g(opt.panel);
            }

            //滚动条按钮
            if (!opt.thumb) {
                this.thumb = lib.q(privates.getClass.call(this, 'thumb'), this.main)[0];
            }
            else {
                this.thumb = lib.g(opt.thumb);
            }

            //滚动条
            this.track = this.thumb.offsetParent;

            var bound = this._bound;

            lib.on(this.thumb, 'mousedown', bound.onThumbdown);
            lib.on(this.track, 'mouseup', bound.onTrackUp);
            lib.on(this.panel, wheelEvent, bound.onMouseWheel);
            lib.on(this.main, 'mouseenter', bound.onMainEnter);
            lib.on(this.main, 'mouseleave', bound.onMainLeave);

        },

        /**
         * 滚动到指定位置
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
            //滚动距离
            else if (pos > 1) {
                pos = pos / (this.panelSize * (1 - this.scrollRatio));
            }
            //滚动百分比
            else {
                pos = pos * 1 || 0;
            }
            privates.setScrollPercent.call(this, pos);
        },

        /**
         * 重新计算滚动比例
         *
         * @return {module:ScrollBar} 本对象
         * @public
         */
        refresh: function () {

            this.panelSize = this.panel[this.scrollProp];

            //当前内容的缩放级别
            this.scrollRatio = this.main[this.clientProp] / this.panelSize;

            //设置祖先元素为禁用
            lib[
                this.scrollRatio >= 1
                ? 'addClass'
                : 'removeClass'
            ](this.main, privates.getClass.call(this, 'noscroll'));

            //滑块轨道的大小
            var trackLen = this.track[this.clientProp];

            if (this.options.autoThumbSize && this.scrollRatio < 1) {

                var thumbSize = Math.max(
                this.options.minThumbSize, this.scrollRatio * trackLen);

                this.thumb.style[
                    this.xAxis
                    ? 'width'
                    : 'height'
                ] = thumbSize + 'px';
            }

            this.trackSize = trackLen - this.thumb[this.offsetProp];

            this.scrollTo(this.curPos);
            this._disabled = this.scrollRatio >= 1;

            return this;
        },

        /**
         * 绘制控件
         *
         * @override
         * @public
         */
        render: function () {
            if (!this.options.main) {
                throw new Error('invalid main');
            }

            this.refresh();
            return this;
        },

        /**
         * 设置是否启用
         *
         * @param {boolean} enabled 是否启用
         * @public
         */
        setEnabled: function (enabled) {
            var disabled = !enabled;
            //设置祖先元素为禁用
            lib[disabled ? 'addClass' : 'removeClass'](this.main, privates.getClass.call(this, 'disable'));
            this._disabled = disabled;
        },

        /**
         * 设置启用
         *
         * @override
         */
        enable: function () {
            this.setEnabled(true);
        },

        /**
         * 设置禁用
         *
         * @override
         */
        disable: function () {
            this.setEnabled(false);
        },

        /**
         * 销毁，注销事件，解除引用
         *
         * @override
         * @public
         * @fires module:ScrollBar#dispose
         */
        dispose: function () {

            var bound = this._bound;

            lib.removeClass(document.body, privates.getClass.call(this, 'noselect'));
            lib.un(this.thumb, 'mousedown', bound.onThumbdown);
            lib.un(this.track, 'mouseup', bound.onTrackUp);
            lib.un(this.panel, wheelEvent, bound.onMouseWheel);
            lib.un(document, 'mousemove', bound.onMousemove);
            lib.un(document, 'mouseup', bound.onMouseup);

            lib.un(this.main, 'mouseenter', bound.onMainEnter);
            lib.un(this.main, 'mouseleave', bound.onMainLeave);

            this.main = this.panel = this.thumb = this.track = null;

            this.parent('dispose');
        }
    });

    return ScrollBar;
});
