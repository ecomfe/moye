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
    var setTextNoSelect = (function(supportCss) {
        var selectEvent;
        return supportCss
            ? function(enabled, noSelectClass) {
                lib[
                enabled 
                ? 'addClass' 
                : 'removeClass'
                ](document.body, noSelectClass);
            }
            : function(enabled) {
                if(enabled) {
                    selectEvent = document.body.onselectstart;
                    document.body.onselectstart = 
                        new Function('event.returnValue = false');
                }
                else {
                    document.body.onselectstart = selectEvent;
                }
            };
    })( lib.browser.ie < 9 ? false : true ) ;



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
         *      如果不设则按class规则查找`options.prefix` + `panel`
         * @property {(string | HTMLElement)} options.thumb 滚动条按钮元素
         *      如果不设则按class规则查找`options.prefix` + `thumb` ，并且将thumb父级元素作为track
         * @property {Number} options.wheelspeed 滚动速度，百分比，越大滚动越快
         * @property {string} options.direction 滚动方向
         * @property {string} options.prefix class默认前缀
         * 
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
            prefix: 'ecl-ui-scrollbar'
        },

        /**
         * 需要绑定 this 的方法名，多个方法以半角逗号分开
         * 
         * @type {string}
         * @private
         */
        binds: 'onMousemove,onMouseup,onThumbdown,onTrackUp,onMouseWheel',

        /**
         * 按下导航条的按钮时处理
         * 
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onThumbdown: function(e) {
            if(this.disabled) {
                return;
            }
            setTextNoSelect(true, this.getClass('noselect') );

            this.mouseStart = this.xAxis
                ? (e.pageX || e.clientX) : (e.pageY||e.clientY);
            this.thumbStart = parseInt(
                this.thumb.style[this.xAxis ? 'left' : 'top'],
                10
            ) || 0;

            lib.on(document, 'mousemove', this.onMousemove);
            lib.on(document, 'mouseup', this.onMouseup);
        },

        /**
         * 拖动时候的事件
         * 
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onMousemove: function(e) {
            //如果滚动条可用
            if(this.scrollRatio < 1) {

                var moveLength = 
                    ( 
                        this.xAxis 
                        ? (e.pageX || e.clientX) 
                        : (e.pageY || e.clientY) 
                    )
                    - this.mouseStart;

                this.thumbPos = Math.min(
                    this.trackSize, 
                    Math.max(0, this.thumbStart + moveLength)
                );
                this.setScrollPercent(this.thumbPos / this.trackSize);
            }
        },

        /**
         * 拖动结束时的事件
         * 
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onMouseup: function() {
            setTextNoSelect(false, this.getClass('noselect') );

            lib.un(document, 'mousemove', this.onMousemove);
            lib.un(document, 'mouseup', this.onMouseup);
        },

        /**
         * 点击滚动条时的动作
         * 
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onTrackUp: function(e) {
            if(this.disabled || lib.getTarget(e) !== this.track) {
                return;
            }
            var pos = Math.min(
                this.trackSize, 
                this.xAxis ? e.offsetX : e.offsetY
            );
            this.setScrollPercent(pos / this.trackSize);
        },

        /**
         * 鼠标滚轮事件
         * 
         * @param {HTMLEvent} e dom事件
         * @private
         */
        onMouseWheel: function(e) {
            if(this.disabled) {
                return;
            }
            var delta = e.wheelDelta ? e.wheelDelta/120 : -e.detail/3;
            var percent = delta * this.options.wheelspeed;

            //这里设置最多滚动距离为2屏
            if(percent * (1 - this.scrollRatio) > 2 * this.scrollRatio) {
                percent = 2*this.scrollRatio;
            }

            var percent = this.curPos - percent;
            this.setScrollPercent(percent);
            //在滚动范围内取消默认行为
            if(percent >= 0.005 && percent <= 0.995) {
                lib.preventDefault(e);
            }
            
        },

        /**
         * 设置滚动的位置
         * 
         * @param {Number} pos 设置滚动的位置比例
         * @private
         * @fires module:ScrollBar#event
         */
        setScrollPercent: function(pos) {

            //取消舍入误差
            if(pos < 0.005) {
                pos = 0;
            }
            else if( 1 - pos < 0.005 ) {
                pos = 1;
            }

            this.thumb.style[this.xAxis ? 'left' : 'top'] = 
                Math.round(pos * this.trackSize) + 'px';

            this.panel[this.scrollDirection] = 
                Math.round(pos * this.panelSize * (1-this.scrollRatio));

            this.curPos = pos;
            var event = {
                position: pos
            };

            this.options.onChange && this.options.onChange(event);
            /**
             * @event  module:ScrollBar#change
             * @property {Number} position 当前的滚动比例
             */
            this.fire('change', event);
        },

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:Control#options
         * @private
         */
        init: function () {
            if(!this.options.main) {
                throw new Error('invalid main');
            }

            var opt = this.options;
            this.disabled = !!opt.disabled;
            this.curPos = 0;

            //当前滚动坐标
            this.xAxis = opt.direction === 'horizontal';

            var sizeProp = this.xAxis ? 'Width' : 'Height';
            this.offsetProp = 'offset' + sizeProp;
            this.clientProp = 'client' + sizeProp;
            this.scrollProp = 'scroll' + sizeProp;
            this.scrollDirection = 'scroll' + (this.xAxis ? 'Left' : 'Top');

            //滚动主元素
            this.main = lib.g(opt.main);

            //需要滚动的元素
            if(!opt.panel) {
                this.panel = lib.q( this.getClass('panel'), this.main)[0];
            }
            else {
                this.panel = lib.g(opt.panel);
            }

            //滚动条按钮
            if(!opt.thumb) {
                this.thumb = lib.q( this.getClass('thumb'), this.main)[0];
            }
            else {
                this.thumb = lib.g(opt.thumb);
            }

            //滚动条
            this.track = this.thumb.offsetParent;
            
            lib.on(this.thumb, 'mousedown', this.onThumbdown);
            lib.on(this.track, 'mouseup', this.onTrackUp);
            lib.on(
                this.panel, 
                wheelEvent, 
                this.onMouseWheel
            );

            var me = this;
            lib.on(this.main, 'mouseenter', 
                me.onMainEnter = function() {
                    lib.addClass(me.main, me.getClass('over') );
                }
            );

            lib.on(me.main, 'mouseleave', 
                me.onMainLeave = function() {
                    lib.removeClass(me.main, me.getClass('over') );
                }
            );

        },



        /**
         * 根据名字构建的css class名称
         *  
         * @param {string} name 模块名字
         * @return {string} 构建的class名称
         * @private
         */
        getClass: function(name) {
            name = name ? '-' + name : '';
            return this.options.prefix + name;
        },

        /**
         * 滚动到指定位置
         * @param { ( Number | string ) } pos 滚动的距离，
         *   可以设置·begin· or ·end· 或者百分比
         * @return {module:ScrollBar} 本对象
         * @public
         */
        scrollTo: function(pos) {
            if(pos === 'begin') {
                pos = 0;
            }
            else if(pos === 'end') {
                pos = 1;
            }
            //滚动距离
            else if(pos > 1) {
                pos = pos / ( this.panelSize *(1 - this.scrollRatio) );
            }
            //滚动百分比
            else {
                pos = pos*1 || 0;
            }
            this.setScrollPercent(pos);
        },

        /**
         * 重新计算滚动比例
         * 
         * @return {module:ScrollBar} 本对象
         */
        refresh: function() {

            this.panelSize = this.panel[this.scrollProp];

            //当前内容的缩放级别
            this.scrollRatio = 
                this.main[this.clientProp]/
                this.panelSize;

            //设置祖先元素为禁用
            lib[this.scrollRatio >=1 
                ? 'addClass' : 'removeClass']
                (
                    this.main, 
                    this.getClass('noscroll')
                );

            this.trackSize = this.track[this.clientProp] 
                - this.thumb[this.offsetProp];

            this.scrollTo(this.curPos);
            this.disabled = this.scrollRatio >= 1;
            
            return this;
        },

        /**
         * 绘制控件
         * 
         * @override
         * @public
         */
        render: function () {
            if(!this.options.main) {
                throw new Error('invalid main');
            }

            this.refresh();
            return this;
        },

        /**
         * 设置是否启用
         * 
         * @param {boolean} enabled 是否启用
         * @private
         */
        setEnabled: function(enabled) {
            var disabled = !enabled;
            //设置祖先元素为禁用
            lib[ disabled ? 'addClass' : 'removeClass'](
                this.main, 
                this.getClass('disable')
            );
            this.disabled = disabled;
        },

        /**
         * 设置启用
         */
        enable: function() {
            this.setEnabled(true);
        },

        /**
         * 设置禁用
         */
        disable: function() {
            this.setEnabled(false);
        },

        /**
         * 销毁，注销事件，解除引用
         * @override
         * @public
         * @fires module:ScrollBar#dispose
         */
        dispose: function() {

            lib.removeClass(document.body, this.getClass('noselect'));
            lib.un(this.thumb, 'mousedown', this.onThumbdown);
            lib.un(this.track, 'mouseup', this.onTrackUp);
            lib.un(this.panel, wheelEvent, this.onMouseWheel);
            lib.un(document, 'mousemove', this.onMousemove);
            lib.un(document, 'mouseup', this.onMouseup);

            lib.un(this.main, 'mouseenter', this.onMainEnter);
            lib.un(this.main, 'mouseleave', this.onMainLeave);

            this.main = this.panel = this.thumb = this.track = null;

            this.parent('dispose');
        }
    });

    return ScrollBar;
});