/**
 * Moye
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file  提示层控件
 * @author  chris(wfsr@foxmail.com)
 */

define(function (require) {

    var $       = require('jquery');
    var lib     = require('./lib');
    var Control = require('./Control');

    /**
     * 私有函数或方法
     *
     * @type {Object}
     * @namespace
     * @name module:Tip~privates
     */
    var privates = /** @lends module:Tip~privates */ {
        /**
         * 清除各种定时器
         *
         * @private
         */
        clear: function () {
            clearTimeout(this._showTimer);
            clearTimeout(this._hideTimer);
            clearTimeout(this._resizeTimer);
        },

        onClick: function (e) {

            /**
             * @event module:Tip#click
             * @type {Object}
             * @property {Event} event 事件源对象
             */
            this.fire('click', {event: e});
        },

        /**
         * 浏览器可视尺寸改变时处理
         *
         * @private
         */
        onResize: function () {
            clearTimeout(this._resizeTimer);

            var me = this;
            this._resizeTimer = setTimeout(
                function () {
                    me.show(me.current);
                },
                100
            );
        },

        /**
         * 处理文档中的单击事件
         *
         * @param {Event} e 原生事件对象
         * @private
         */
        onDocClick: function (e) {
            var main = this.main;
            var target = $(e.target).closest('.' + this.options.flag);

            if (
                target.is(main)
                    || ~$.inArray(target[0], this.triggers)
                    || $.contains(main, target)
            ) {
                return;
            }

            privates.onHide.call(this);

        },

        /**
         * 显示浮层前处理
         *
         * @param {Event} e DOM 事件对象
         * @fires module:Tip#beforeShow 显示前事件
         * @private
         */
        onShow: function (e) {
            var target = $(e.target).closest('.' + this.options.flag);

            privates.clear.call(this);

            if (!target.length || target.is(this.current)) {
                return;
            }

            var events = this.events;
            var bound  = this._bound;
            if (events) {
                target
                    .on(events.un, bound.onHide)
                    .off(events.on, bound.onShow);

                if (this.current) {
                    $(this.current)
                        .on(events.on, bound.onShow)
                        .off(events.un, bound.onHide);
                }

                if (this.options.mode === 'click') {
                    $(document).on('click', bound.onDocClick);
                }
            }

            this.current = target;

            /**
             * @event module:Tip#beforeShow
             * @type {Object}
             * @property {HTMLElement} target 事件源 DOM 对象
             * @property {Event} e 事件源对象
             */
            this.fire('beforeShow', {target: target.get(0), event: e});

            var delay = this.options.showDelay;
            if (delay) {
                var me = this;
                this._showTimer = setTimeout(function () {
                    me.show(target);
                }, delay);
            }
            else {
                this.show(target);
            }
        },


        /**
         * 隐藏浮层前处理
         *
         * @private
         */
        onHide: function () {

            var me = this;
            var options = this.options;
            privates.clear.call(me);
            if (options.hideDelay) {
                this._hideTimer = setTimeout(function () {
                    me.hide();
                }, options.hideDelay);
            }
            else {
                this.hide();
            }
        },

        onMouseEnter: function () {
            privates.clear.call(this);
        },

        onMouseLeave: function () {
            var me = this;
            var options = me.options;
            privates.clear.call(me);
            if (options.hideDelay) {
                me._hideTimer = setTimeout(
                    function () {
                        me.hide();
                    },
                    options.hideDelay
                );
            }
            else {
                me.hide();
            }
        },

        /**
         * 计算浮层及箭头显示位置
         *
         * @private
         */
        computePosition: function () {
            var options      = this.options;
            var target       = $(this.current);
            var main         = $(this.main);
            var arrow        = this.elements.arrow;
            var dir          = options.arrow;
            var position     = target.offset();
            var prefix       = options.prefix + '-arrow';

            // 目标的8个关键坐标点
            var top          = position.top;
            var left         = position.left;
            var width        = target.width();
            var height       = target.height();
            var right        = left + width;
            var bottom       = top + height;
            var center       = left + (width / 2);
            var middle       = top + (height / 2);

            // 提示层宽高
            var mainWidth    = main.width();
            var mainHeight   = main.height();

            // 箭头宽高
            // FIXME: 如果通过 tpl 修改了控件模板，
            // 或者针对箭头部分改了样式，此处得到结果不对或者报错
            var arrowWidth   = arrow.firstChild.offsetWidth;
            var arrowHeight  = arrow.firstChild.offsetHeight;

            // 视窗范围
            var scrollTop    = lib.getScrollTop();
            var scrollLeft   = lib.getScrollLeft();
            var scrollRight  = scrollLeft + lib.getViewWidth();
            var scrollBottom = scrollTop + lib.getViewHeight();

            // 属性配置优于实例配置
            var dirFromAttr = target.attr('data-tooltips');
            if (dirFromAttr) {
                dir = /[trblc]{2}/.test(dirFromAttr) ? dirFromAttr : '1';
            }

            var second;
            var first;

            // 未指定方向时自动按下右上左顺序计算可用方向（以不超出视窗为原则）
            if (!dir || dir === '1') {

                // 目标宽度大于提示层宽度时优先考虑水平居中
                var horiz = width > mainWidth
                        || left - (mainWidth - width) / 2 > 0
                        && right + (mainWidth - width) / 2 <= scrollRight
                        ? 'c'
                        : left + mainWidth > scrollRight
                            ? 'r'
                            : 'l';

                // 目标高度大于提示层高度时优先考虑垂直居中
                var vertical = height > mainHeight
                        || top - (mainHeight - height) / 2 > 0
                        && bottom + (mainHeight - height) / 2 <= scrollBottom
                        ? 'c'
                        : top + mainHeight > scrollBottom
                            ? 'b'
                            : 't';

                // 如果提示层在目标下边未超出视窗
                if (bottom + arrowHeight + mainHeight <= scrollBottom) {
                    first = 'b';
                    second = horiz;
                }

                // 如果提示层在目标右侧未超出视窗
                else if (right + mainWidth + arrowWidth <= scrollRight) {
                    first = 'r';
                    second = vertical;
                }

                // 如果提示层在目标上边未超出视窗
                else if (top - mainHeight - arrowHeight >= scrollTop) {
                    first = 't';
                    second = horiz;
                }

                // 如果提示层在目标左侧未超出视窗
                else if (left - mainWidth - arrowWidth >= scrollLeft) {
                    first = 'l';
                    second = vertical;
                }

                dir = first + second;
            }
            else {

                // 从 dir 中分拆水平和垂直方向值，方便后续计算
                first = dir.charAt(0);
                second = dir.charAt(1);
            }

            var lrtb   = {l: 'left', r: 'right', t: 'top', b: 'bottom'};
            var offset = options.offset;

            arrow.className = prefix + ' ' + prefix + '-' + lrtb[first];

            // 改变箭头方向后需要校准箭头宽高
            // XXX: 如果通过 tpl 修改了控件模板，
            // 或者针对箭头部分改了样式，此处得到结果不对或者报错
            arrowWidth  = arrow.firstChild.offsetWidth;
            arrowHeight = arrow.firstChild.offsetHeight;

            // 提示层在目标上部或下部显示时的定位处理
            if ({t: 1, b: 1}[first]) {
                left = {
                    l: left + offset.x,
                    c: center - (mainWidth / 2),
                    r: right - mainWidth - offset.x
                }[second];

                top = {
                    t: top - arrowHeight - mainHeight - offset.y,
                    b: bottom + arrowHeight + offset.y
                }[first];

                var middleX = (width - arrowWidth) / 2;

                // 在目标宽于提示层或 dir 为 tc 或 bc 时，箭头相对提示层水平居中
                arrow.style.left = {
                    c: (mainWidth - arrowWidth) / 2,
                    l: middleX - offset.x,
                    r: mainWidth - Math.max(arrowWidth, middleX) + offset.x
                }[width > mainWidth ? 'c' : second] + 'px';
                arrow.style.top = '';

            }

            // 提示层在目标左边或右边显示时的定位处理
            else if ({l: 1, r: 1}[first]) {
                top = {
                    t: top + offset.y,
                    c: middle - (mainHeight / 2),
                    b: bottom - mainHeight - offset.y
                }[second];

                left = {
                    l: left - arrowWidth - mainWidth - offset.x,
                    r: right + arrowWidth + offset.x
                }[first];

                var middleY = (height - arrowHeight) / 2;

                // 在目标高于提示层或 dir 为 lc 或 rc 时，箭头相对提示层垂直居中
                arrow.style.top = {
                    c: (mainHeight - arrowHeight) / 2,
                    t: middleY - offset.y,
                    b: mainHeight - Math.max(arrowHeight, middleY) + offset.y
                }[height > mainHeight ? 'c' : second] + 'px';
                arrow.style.left = '';

            }

            main.css({
                left: left + 'px',
                top: top + 'px'
            });

        }

    };

    /**
     * 提示层控件
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Tip
     * @example
     * new Tip({
     *     mode: 'over',
     *     arrow: "1",
     *     offset: { x: 5, y: 5},
     *     onBeforeShow: function () {
     *       this.title = Math.random();
     *     }
     * }).render();
     *
     */
    var Tip = Control.extend(/** @lends module:Tip.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Tip',

        /**
         * 控件配置项
         *
         * @name module:Tip#options
         * @type {Object}
         * @property {boolean} disabled 控件的不可用状态
         * @property {(string | HTMLElement)} main 控件渲染容器
         * @property {boolean|string=} arrow 提示框的箭头参数，默认为false，不带箭头
         * 可以初始化时通过指定arrow属性为“1”开启箭头模式，也可以手动指定箭头方向：
         * tr | rt | rb | br | bl | lb | lt | tl | tc | rc | bc | lc
         * 也可通过在 triggers 上设置 data-tooltips来指定
         * @property {number=} showDelay 提示框显示的延迟时间，默认值为 100 毫秒
         * @property {number=} hideDelay 提示框消失的延迟时间，默认值为 300 毫秒
         * @property {string=} mode 提示的显示模式，over|click|auto。默认为over
         * @property {string=} title 提示的标题信息，默认为null
         * @property {string} content 提示的内容信息
         * @property {string} prefix 控件class前缀，同时将作为main的class之一
         * @property {string} triggers 自动绑定本控件功能的class
         * @property {string} flag 标识作为trigger的class
         * @property {Object.<string, number>} offset 浮层显示的偏移量
         * @property {number} offset.x x 轴方向偏移量
         * @property {number} offset.y y轴方向偏移量
         * @property {string} tpl 浮层内部HTML模板
         * @readonly
         */
        options: {

            // 提示框的不可用状态，默认为false。处于不可用状态的提示框不会出现。
            disabled: false,

            // 控件渲染主容器
            main: '',

            // 提示框的箭头参数，默认为false，不带箭头
            // 可以初始化时通过指定arrow属性为“1”开启箭头模式
            // 也可以手动指定箭头方向：
            // tr | rt | rb | br | bl | lb | lt | tl | tc | rc | bc | lc。
            // 也可通过在 triggers 上设置 data-tooltips来指定
            arrow: false,

            // 提示框显示的延迟时间，默认值为 100 毫秒
            showDelay: 100,

            // 提示框消失的延迟时间，默认值为 300 毫秒
            hideDelay: 300,

            // 提示的显示模式，over|click|auto。默认为over
            mode: 'over',

            // 提示的标题信息，默认为null
            title: null,

            // 提示的内容信息
            content: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-tip',

            // 自动绑定本控件功能的class
            triggers: 'tooltips',

            // 标识作为trigger的class
            flag: '_ecui_tips',

            // 浮层显示的偏移量
            offset: {

                // x 轴方向偏移量
                x: 0,

                // y 轴方向偏移量
                y: 0
            },

            // 控件模板
            tpl: ''
                + '<div class="{prefix}-arrow {prefix}-arrow-top">'
                +   '<em></em>'
                +   '<ins></ins>'
                + '</div>'
                + '<div class="{prefix}-title"></div>'
                + '<div class="{prefix}-body"></div>'
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Tip#options
         * @private
         */
        init: function (options) {
            options.hideDelay = options.hideDelay < 0
                ? Tip.HIDE_DELAY : options.hideDelay;

            this._disabled  = options.disabled;
            this.title      = options.title;
            this.content    = options.content;

            var prefix = options.prefix;
            var main   = this.main = document.createElement('div');

            main.className  = prefix;
            main.innerHTML  = options.tpl.replace(/{prefix}/g, prefix);
            main.style.left = '-2000px';

            this.events = {
                over: {
                    on: 'mouseenter',
                    un: 'mouseleave'
                },
                click: {
                    on: 'click',
                    un: 'click'
                }
            }[options.mode];

            // 绑定事件方法的 this
            this.bindEvents(privates);
        },


        /**
         * 绘制控件
         *
         * @fires Tip#click
         * @return {Tip} 当前实例
         * @override
         * @public
         */
        render: function () {

            var me      = this;
            var main    = $(this.main);
            var options = this.options;
            var events  = this.events;

            if (!this.rendered) {
                this.rendered = true;

                main.appendTo(document.body);

                var bound = this._bound;

                main.on('click', bound.onClick);

                if (this.options.mode === 'over') {
                    main.on('mouseenter', bound.onMouseEnter);
                    main.on('mouseleave', bound.onMouseLeave);
                }

                var elements = this.elements = {};
                var prefix = options.prefix + '-';

                $.each(
                    'arrow,title,body'.split(','),
                    function (i, name) {
                        elements[name] = main.find('.' + prefix + name)[0];
                    }
                );

                this.addTriggers(options.triggers);

            }

            if (!events && this.triggers) {
                if (options.showDelay) {
                    this._showTimer = setTimeout(function () {
                        me.show(me.triggers[0]);
                    });
                }
                else {
                    this.show(this.triggers[0]);
                }
            }

            return this;
        },

        /**
         * 增加触发 tips 的 DOM
         *
         * @param {(string | HTMLElement | HTMLCollection | Array)} triggers
         * className/dom节点/dom集合或dom节点数组
         * @public
         */
        addTriggers: function (triggers) {
            var options = this.options;
            var events  = this.events;
            var flag    = options.flag;

            this.triggers = typeof triggers === 'string'
                ? $('.' + options.triggers)
                : $(triggers);

            var onShow = this._bound.onShow;

            if (!events) {
                return;
            }

            this.triggers.each(function (i, trigger) {
                trigger = $(trigger);
                if (!trigger.hasClass(flag)) {
                    trigger.addClass(flag);
                    trigger.on(events.on, onShow);
                }
            });

        },

        /**
         * 刷新触发器
         *
         * 用于经常更新的内容，在更新内容后调用此方法会
         * 解除旧 DOM 节点的绑定，再重新查找绑定新节点
         *
         * @param {string} triggers 触发器的 class
         * @param {HTMLElement=} parentNode 指定触发器的共同容器
         * @public
         */
        refresh: function (triggers, parentNode) {
            var events  = this.events;
            var bound = this._bound;

            triggers = typeof triggers === 'string'
                ? $('.' + triggers, parentNode)
                : $(triggers);

            if (!events) {
                return;
            }

            if (this.triggers) {
                triggers.each(function (i, trigger) {
                    trigger = $(trigger);
                    if (!trigger.parent().length) {
                        trigger.off(events.on, bound.onShow);
                        trigger.off(events.un, bound.onHide);
                    }
                });
            }

            this.addTriggers(triggers);
        },

        /**
         * 显示浮层
         *
         * @param {?HTMLElement=} target 触发显示浮层的节点
         * @fires module:Tip#show 显示事件
         * @public
         */
        show: function (target) {
            var options  = this.options;
            var elements = this.elements;

            privates.clear.call(this);

            this.current = target;

            $(window).on('resize', this._bound.onResize);

            elements.body.innerHTML  = this.content;

            var title = $(elements.title);

            if (this.title) {
                title.html(this.title).show();
            }
            else {
                title.empty().hide();
            }

            if (!options.arrow) {
                $(elements.arrow).hide();
            }

            privates.computePosition.call(this);
            this._visible = true;

            /**
             * @event module:Tip#show
             * @type {Object}
             * @property {HTMLElement} target 事件源 DOM 对象
             */
            this.fire('show', {target: target});

        },

        /**
         * 隐藏浮层
         *
         * @fires module:Tip#hide 隐藏事件
         * @public
         */
        hide: function () {
            var main   = this.main;
            var events = this.events;
            var target = this.current;
            var bound  = this._bound;

            if (events && target) {
                $(target)
                    .on(events.on, bound.onShow)
                    .off(events.un, bound.onHide);

                if (this.options.mode === 'click') {
                    $(document).off('click', bound.onDocClick);
                }
            }

            privates.clear.call(this);

            var arrow = this.elements.arrow;
            main.style.left = -main.offsetWidth - arrow.offsetWidth + 'px';
            this._visible = false;

            this.current = null;
            $(window).off('resize', bound.onResize);

            /**
             * @event module:Tip#hide
             */
            this.fire('hide');
        },

        /**
         * 判断提示层是否可见
         *
         * @return {boolean} 可见的状态
         * @public
         */
        isVisible: function () {

            return !!this._visible;

        },

        /**
         * 设置提示层的标题部分内容
         *
         * 如果参数为空，则隐藏提示层的标题部分
         *
         * @param {string} html 作为提示层标题的代码
         * @public
         */
        setTitle: function (html) {
            this.title = html || '';
            $(this.elements.title)[this.title ? 'show' : 'hide']().html(this.title);
        },

        /**
         * 设置提示层显示的内容
         *
         * @param {string} html 要提示的内容的HTML
         * @public
         */
        setContent: function (html) {
            this.content = html || '';
            this.elements.body.innerHTML = this.content;
        },

        /**
         * 销毁控件
         *
         * @override
         */
        dispose: function () {
            var options = this.options;
            var events  = this.events;
            var bound   = this._bound;

            if (!events) {
                return;
            }

            var flag = options.flag;

            $.each(this.triggers || [], function (i, trigger) {
                trigger = $(trigger);
                trigger.hasClass(flag) && trigger.removeClass(flag).off(events.on, bound.onShow);
            });

            var main = this.main;

            if (options.mode === 'over') {
                $(main).off('mouseenter', bound.onMouseEnter);
                $(main).off('mouseleave', bound.onMouseLeave);
            }
            else {
                $(document).off('click', bound.onDocClick);
            }

            this.current = null;
            this.parent();
        }

    });

    return Tip;
});
