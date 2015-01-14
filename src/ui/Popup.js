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
        onWindowResize: function () {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout($.proxy(this.show, this), 100);
        },

        /**
         * 当挂接目标被点击时处理函数
         *
         * @param {Event} e DOM 事件对象
         * @fires module:Popup#beforeShow 显示前事件
         * @private
         */
        onTargetClick: function (e) {

            if (this.isDisabled()) {
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
                var cls = this.triggers;
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
             * @event module:Popup#show
             * @type {Object}
             */
            var event = new $.Event('show');

            this.fire(event);

            // 如果没有被阻止, 那么显示~
            if (event.isDefaultPrevented()) {
                return;
            }

            this.show();
            this.trigger = trigger;
        },

        /**
         * 隐藏浮层前处理
         *
         * @private
         * @param {Event} e 隐藏浮层事件
         */
        onDocumentClicked: function (e) {
            var target = e.target;
            var main   = this.main;

            if (!main || main === target || $.contains(main, target)) {
                return;
            }

            var event = new $.Event('hide');

            this.fire(event);

            if (event.isDefaultPrevented()) {
                return;
            }

            this.hide();
            clearTimeout(this._resizeTimer);
        },

        /**
         * 浮层哟, 被点击了呢~
         * @param  {Event} e 点击事件
         */
        onClick: function (e) {
            /**
             * @event module:Popup#click
             * @type {Object}
             * @property {Event} event 事件源对象
             */
            this.fire(e);
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
             * 弹出模式
             * 可选值: click | over
             * @type {String}
             */
            mode: 'click',

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
            if (options.target) {
                this.target = lib.g(options.target);
            }
            if (!options.content) {
                this.content = this.main.innerHTML;
            }
            this.$parent(options);
        },

        initStructure: function () {
            $(this.main)
                .appendTo(document.body)
                .css('left', '-2000px')
                .html(this.content || this.main.innerHTML);
        },

        initEvents: function () {
            var triggers = this._resolveTriggers(this.liveTriggers || this.triggers);
            this.delegate(triggers, 'click', privates.onTargetClick);
            this.triggers = triggers.toArray();
            this.delegate(this.main, 'click', privates.onClick);
        },

        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: 'content',
                paint: function (conf, content) {
                    this.main.innerHTML = content || '';
                }
            },
            {
                name: ['triggers', 'liveTriggers'],
                paint: function (conf, triggers, liveTriggers) {
                    if (this.triggers) {
                        this.undelegate(this.triggers, 'click', privates.onTargetClick);
                    }
                    triggers = this._resolveTriggers(liveTriggers || triggers);
                    this.delegate(triggers, 'click', privates.onTargetClick);
                    this.triggers = triggers.toArray();
                }
            }
        ),

        /**
         * 设定挂靠的Element
         * @param {Element} target 挂靠元素
         * @return {Popup}
         */
        setTarget: function (target) {
            this.target = target;
            return this;
        },

        /**
         * 解析触发器配置为jquery对象
         * @param  {string|Array.Element} triggers 触发器配置
         * @return {jQuery}
         */
        _resolveTriggers: function (triggers) {
            // 这里做一个优先级取舍, liveTriggers优先于triggers
            // 如果有liveTriggers, 那么就舍弃triggers
            return triggers = lib.isString(triggers)
                ? $('.' + triggers)
                : $(triggers);
        },

        /**
         * 显示浮层
         *
         * @fires module:Popup#show 显示事件
         * @public
         */
        show: function () {
            var me = this;
            // 算好自己的位置
            me._computePosition.call(me);

            // 做一个延迟绑定, 如果直接给绑定上, 这次点击还会继续冒泡上来
            // 正好丢到了这个新绑定上, 就会有额外的问题, 比如给隐藏了
            me._timer = setTimeout(function () {
                me.delegate(document, 'click', privates.onDocumentClicked);
                me.delegate(window, 'resize', privates.onWindowResize);
            }, 0);
        },

        /**
         * 隐藏浮层
         *
         * @fires module:Popup#hide 隐藏事件
         * @public
         */
        hide: function () {
            // 把自己飞走
            $(this.main).css('left', '-2000px');

            // 取消全局事件的绑定
            this.undelegate(document, 'click', privates.onDocumentClicked);
            this.undelegate(window, 'resize', privates.onWindowResize);

            // 清理各种闹钟
            clearTimeout(this._timer);
            clearTimeout(this._resizeTimer);
        },

        /**
         * 计算浮层及箭头显示位置
         *
         * @protected
         */
        _computePosition: function () {

            var target       = $(this.target || this.triggers[0]);
            var main         = $(this.main);
            var dir          = this.dir;
            var position     = target.offset();

            // 目标的8个关键坐标点
            var top          = position.top;
            var left         = position.left;
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

            var offset = this.offset;

            // 提示层在目标上部或下部显示时的定位处理
            if ({t: 1, b: 1}[first]) {
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
            else if ({l: 1, r: 1}[first]) {
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

    });

    return Popup;
});
