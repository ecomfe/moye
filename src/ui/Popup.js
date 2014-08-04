/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file  弹出层
 * @author  chris(wfsr@foxmail.com)
 */


define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * 私有函数或方法
     *
     * @type {Object}
     * @namespace
     * @name module:Popup~privates
     */
    var privates = /** @lends module:Popup~privates */ {

        /**
         * 浏览器可视尺寸改变时处理
         *
         * @private
         */
        onResize: function () {
            clearTimeout(this._resizeTimer);

            var me = this;

            this._resizeTimer = setTimeout(function () {
                me.show();
            }, 100);
        },

        /**
         * 显示浮层前处理
         *
         * @param {Event} e DOM 事件对象
         * @fires module:Popup#beforeShow 显示前事件
         * @private
         */
        onShow: function (e) {


            if (this._disabled) {
                return;
            }

            var trigger = e.target;
            var oldTarget = this.target;

            // 这里针对于同一Popup实例，在多个target间切换时的处理逻辑
            // 效果是从target A切换到target B时，Popup实例直接显示在target B上，而不是隐藏。
            // 之所以会被隐藏是因为document上的`click`钩子
            // 判断当前的target是不是原有target，或者在原有target内部
            // 如果不是，那么先将它隐藏。
            // 这里隐藏主要作用是取消挂载到document上的`click`事件处理，而不是真的想要隐藏它。
            // 如果不把钩子去掉，那会让接下来`显示`之后，事件冒泡上来到钩子上，又把它给隐藏了。
            if (oldTarget
                && oldTarget !== trigger
                && !$.contains(oldTarget, trigger)
            ) {
                this.hide();
            }

            var $trigger = $(e.target);
            var liveTriggers = this.liveTriggers;

            if (liveTriggers) {
                var cls = this.options.triggers;
                while (!$trigger.hasClass(cls)) {
                    if ($.inArray(trigger, this.liveTriggers) !== -1) {
                        break;
                    }
                    trigger = trigger.parent();
                }
                if (!$trigger.hasClass(cls)) {
                    return;
                }
            }

            /**
             * @event module:Popup#beforeShow
             * @type {Object}
             * @property {Event} event 事件源对象
             */
            this.fire('beforeShow', { event: e });

            this.show();

            this.trigger = trigger;

            var guid = this.guid;
            var bound = this._bound;

            this._timer = setTimeout(function () {

                // 这里使用了guid作为事件类型的namespace
                // 因为这里貌似有个问题，off的时候会把document上的所有click都给干掉
                // 只能用namespace来加以区分，来能避免多个popup之间钩子的干扰
                $(document).on('click.' + guid, bound.onHide);
                $(window).on('resize.' + guid, bound.onResize);

            }, 0);
        },

        /**
         * 隐藏浮层前处理
         *
         * @private
         */
        onHide: function (e) {
            var target = e.target;
            var main   = this.main;

            if (!main || main === target || $.contains(main, target)) {
                return;
            }

            this.hide();

            clearTimeout(this._resizeTimer);
        },

        /**
         * 计算浮层及箭头显示位置
         *
         * @private
         */
        computePosition: function () {
            var options      = this.options;
            var target       = $(this.target || this.triggers[0]);
            var main         = $(this.main);
            var dir          = options.dir;
            var position     = target.offset();

            // 目标的8个关键坐标点
            var top = position.top;
            var left = position.left;
            var width        = target.outerWidth();  // target[0].offsetWidth;
            var height       = target.outerHeight(); // target[0].offsetHeight;
            var right        = left + width;
            var bottom       = top + height;
            var center       = left + (width / 2);
            var middle       = top + (height / 2);

            // 提示层宽高
            var mainWidth    = main.width();
            var mainHeight   = main.height();


            var win          = $(window);

            // 视窗范围
            var scrollTop    = win.scrollTop();
            var scrollLeft   = win.scrollLeft();
            var scrollRight  = scrollLeft + win.width();
            var scrollBottom = scrollTop + win.height();

            // 属性配置优于实例配置
            var dirFromAttr = target.attr('data-popup');
            if (dirFromAttr) {
                dir = /[trbl]{2}/.test(dirFromAttr) ? dirFromAttr : '1';
            }

            var second;
            var first;

            // 未指定方向时自动按下右上左顺序计算可用方向（以不超出视窗为原则）
            if (dir === 'auto') {

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
                if (bottom + mainHeight <= scrollBottom) {
                    first = 'b';
                    second = horiz;
                }

                // 如果提示层在目标右侧未超出视窗
                else if (right + mainWidth <= scrollRight) {
                    first = 'r';
                    second = vertical;
                }

                // 如果提示层在目标上边未超出视窗
                else if (top - mainHeight >= scrollTop) {
                    first = 't';
                    second = horiz;
                }

                // 如果提示层在目标左侧未超出视窗
                else if (left - mainWidth >= scrollLeft) {
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

            var offset = options.offset;

            // 提示层在目标上部或下部显示时的定位处理
            if ({ t: 1, b: 1 }[first]) {
                left = {
                    l: left,
                    c: center - (mainWidth / 2),
                    r: right - mainWidth
                }[second];

                top = {
                    t: top - mainHeight,
                    b: bottom
                }[first];

            }

            // 提示层在目标左边或右边显示时的定位处理
            else if ({ l: 1, r: 1 }[first]) {
                top = {
                    t: top,
                    c: middle - (mainHeight / 2),
                    b: bottom - mainHeight
                }[second];

                left = {
                    l: left - mainWidth - offset.x,
                    r: right + offset.x
                }[first];

            }

            main.css(
                {
                    left: left + offset.x + 'px',
                    top: top + offset.y + 'px'
                }
            );

        }
    };

    /**
     * 弹出层控件
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Popup
     * @see module:City
     * @see module:Calendar
     */
    var Popup = Control.extend(/** @lends module:Popup.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Popup',

        /**
         * 控件配置项
         *
         * @name module:Popup#options
         * @type {Object}
         * @property {boolean} disabled 控件的不可用状态
         * @property {(string | HTMLElement)} main 控件渲染容器
         * @property {(string | HTMLElement)} target 计算弹出层相对位置的目标对象
         * @property {string | Array.<HTMLElement>} triggers 触发显示弹出层的节点
         * 当指定了 liveTriggers 时只能用 string 类型指定 class
         * @property {string | HTMLElement} liveTriggers 动态 triggers 的父元素节点
         * @property {string} content 提示的内容信息
         * @property {string} dir 弹出层相对 target 的位置，支持8个方向
         * 可选值（默认为 bl）：
         * tr | rt | rb | br | bl | lb | lt | tl | tc | rc | bc | lc
         * 也可通过在 triggers 上设置 data-popup来指定
         * @property {string} prefix 控件class前缀，同时将作为main的class之一
         * @property {Object.<string, number>} offset 弹出层显示的偏移量
         * @property {number} offset.x x 轴方向偏移量
         * @property {number} offset.y y轴方向偏移量
         * @private
         */
        options: {

            /**
             * 提示框的不可用状态，默认为false。处于不可用状态的提示框不会出现。
             *
             * @type {boolean}
             * @default
             */
            disabled: false,

            /**
             * 控件渲染主容器
             *
             * @type {(string | HTMLElement)}
             */
            main: '',

            /**
             * 计算弹出层相对位置的目标对象
             *
             * @type {(string | HTMLElement)}
             */
            target: '',

            /**
             * 触发显示弹出层的节点class
             *
             * 当指定了 liveTriggers 时只能用 string 类型指定 class
             *
             * @type {string | Array.<HTMLElement>}
             */
            triggers: '',

            /**
             * 动态 triggers 的父元素节点
             *
             * @type {string | HTMLElement}
             */
            liveTriggers: '',

            /**
             * 显示的内容
             *
             * @type {string}
             */
            content: '',

            /**
             * 弹出层显示在 trigger 的相对位置
             *
             * 可选值：tr | rt | rb | br | bl | lb | lt | tl | tc | rc | bc | lc
             * 也可通过在 triggers 上设置 data-popup来指定
             *
             * @type {string}
             * @defaultvalue
             */
            dir: 'bl',

            /**
             * 控件class前缀，同时将作为main的class之一
             *
             * @type {string}
             * @defaultvalue
             */
            prefix: 'ecl-hotel-ui-popup',

            /**
             * 浮层显示的偏移量
             *
             * @type {string}
             */
            offset: {

                /**
                 * x 轴方向偏移量
                 *
                 * @type {number}
                 * @defaultvalue
                 */
                x: 0,

                /**
                 * y 轴方向偏移量
                 *
                 * @type {string}
                 * @defaultvalue
                 */
                y: 0
            }
        },


        /**
         * 控件初始化
         *
         * @param {Object} options 配置项
         * @see module:Popup#options
         * @private
         */
        init: function (options) {
            this.guid = lib.guid();
            this._disabled  = options.disabled;
            this.content   = options.content;

            this.bindEvents(privates);

            if (options.target) {
                this.target = lib.g(options.target);
            }

            var prefix = options.prefix;
            var main   = $(options.main || '<div>');

            main.addClass(prefix);

            if (!options.main) {
                main.css('left', '-2000px');
            }

            var triggers     = options.triggers;
            var liveTriggers = options.liveTriggers;
            var bound        = this._bound;

            if (liveTriggers) {

                liveTriggers = lib.isString(liveTriggers)
                    ? $('.' + liveTriggers)
                    : $(liveTriggers);

                this.liveTriggers = liveTriggers
                    .on('click', bound.onShow)
                    .toArray();

            }
            else {

                triggers = lib.isString(triggers)
                    ? $('.' + options.triggers)
                    : $(options.triggers);

                this.triggers = triggers
                    .on('click', bound.onShow)
                    .toArray();
            }

            this.main = main.get(0);

        },

        /**
         * 绘制控件
         *
         * @fires module:Popup#click 点击事件
         * @return {module:Popup} 当前实例
         * @override
         * @public
         */
        render: function () {
            var main = $(this.main);

            if (this.content) {
                main.html(this.content);
            }

            if (!this.rendered) {
                var me = this;
                me.rendered = true;
                main
                    .appendTo(document.body)
                    .on(
                        'click',
                        function (e) {

                            /**
                             * @event module:Popup#click
                             * @type {Object}
                             * @property {Event} event 事件源对象
                             */
                            me.fire('click', { event: e });
                        }
                    );

            }

            return this;
        },

        /**
         * 显示浮层
         *
         * @fires module:Popup#show 显示事件
         * @public
         */
        show: function () {
            privates.computePosition.call(this);

            /**
             * @event module:Popup#show
             */
            this.fire('show');
        },

        /**
         * 隐藏浮层
         *
         * @fires module:Popup#hide 隐藏事件
         * @public
         */
        hide: function () {
            this.main.style.left = '-2000px';

            /**
             * @event module:Popup#hide
             */
            this.fire('hide');

            var bound = this._bound;

            // 这里使用了guid作为事件类型的namespace
            // 因为这里貌似有个问题，off的时候会把document上的所有click都给干掉
            // 只能用namespace来加以区分，来能避免多个popup之间钩子的干扰
            $(document).off('click.' + this.guid, bound.onHide);
            $(window).off('resize.' + this.guid, bound.onResize);

            clearTimeout(this._timer);
            clearTimeout(this._resizeTimer);
        }

    });

    return Popup;
});
