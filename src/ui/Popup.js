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
             * 弹出层所挂靠的目标
             *
             * 如果不指定, 那么会使用当前触发显示的目标来作为挂靠目标
             *
             * 请注意, 对target的交互并不会触发Popup的显示
             *
             * 触发显示的元素设定请参看triggers和liveTriggers
             *
             * @type {string|HTMLElement}
             */
            target: '',

            /**
             * 触发显示弹出层的节点
             *
             * 可以设定为string(className), 也可以设定为
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
             * 延迟显示/隐藏
             * @TODO
             * @type {Number}
             */
            delay: 0,

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
            this.$parent(options);
            if (options.target) {
                this.target = lib.g(options.target);
            }
            if (!options.content) {
                this.content = this.main.innerHTML;
            }
            if (options.mode === 'over') {
                this.delay = options.delay > 0
                    ? options.delay
                    : 50;
            }
        },

        initStructure: function () {
            $(this.main)
                .css('left', '-2000px')
                .appendTo(document.body)
                .html(this.content || this.main.innerHTML);
        },

        initEvents: function () {
            // 窗口大小变化事件需要一个特殊的delay处理
            this.onWindowResize = lib.delay($.proxy(this.onWindowResize, this), 100);
            this.showBound = $.proxy(this.onTargetClick, this);
            this.hideBound = $.proxy(this.onDocumentClicked, this);
            this.bindTriggersEvents(this.triggers, this.liveTriggers);
            this.delegate(this.main, 'click', this.onMainClick);
        },

        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: 'content',
                paint: function (conf, content) {
                    this.main.innerHTML = content || '';
                }
            },
            function (changes, changesIndex) {
                if (!this.helper.isInStage('RENDERED')) {
                    return this;
                }
                var liveTriggers = changesIndex.liveTriggers;
                var triggers = changesIndex.triggers;
                if (!liveTriggers && !triggers) {
                    return this;
                }
                // 首先把所有的triggers的事件绑定都清空掉
                this.clearTriggersEvents(triggers.oldValue, liveTriggers.oldValue);
                // 然后再绑定一下新的设置
                this.bindTriggersEvents(triggers.newValue, liveTriggers.newValue);
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
         * 绑定triggers的事件处理
         *
         * 如果指定liveTrigger, 那么triggers一定是string类型的selector;
         * 此时应该使用事件代理模式, 将liveTriggers中的triggers类型事件做统一的代理
         *
         * 如果不指定liveTriggers, 那么直接对triggers进行事件绑定
         *
         * @private
         * @param {Array.Element|string} triggers 触发popup显示的元素们
         * @param {Array.Element|string} liveTriggers 动态触发容器
         */
        bindTriggersEvents: function (triggers, liveTriggers) {
            var mode = this.mode;
            var showBound = this.showBound;
            var hideBound = this.hideBound;
            var boundTarget;
            var selector = null;

            if (liveTriggers) {
                boundTarget = $(liveTriggers);
                selector = triggers;
            }
            else {
                boundTarget = $(triggers);
            }

            if (mode === 'over') {
                boundTarget
                    .on('mouseenter', selector, showBound)
                    .on('mouseleave', selector, hideBound);
                $(this.main)
                    .on('mouseenter', showBound)
                    .on('mouseleave', hideBound);
            }
            else {
                boundTarget.on('click', selector, showBound);
            }
        },

        /**
         * 清除triggers的各种事件绑定
         *
         * @param {Array.Element} triggers 触发popup显示的元素们
         * @param {Arra.Element|string} liveTriggers 动态触发显示元素们
         * @private
         */
        clearTriggersEvents: function (triggers, liveTriggers) {
            var mode = this.mode;
            var target;
            var selector = null;

            if (liveTriggers) {
                target = $(liveTriggers);
                selector = triggers;
            }
            else {
                target = $(triggers);
            }

            if (mode === 'hover') {
                target
                    .off('mouseenter', selector, this.showBound)
                    .off('mouseleave', selector, this.hideBound);
            }
            else {
                triggers
                    .off('click', this.showBound);
            }
        },

        /**
         * 显示浮层
         *
         * @fires module:Popup#show 显示事件
         * @public
         */
        show: function () {

            var me = this;

            if (me.hasState('show')) {
                return;
            }

            me.addState('show');

            // 这里使用setTimeout的原因有三个
            // 1. 支持delay参数
            // 2. 在over模式下, 鼠标从trigger向main移动的过程中, 会先触发hide, 再触发show.
            //    必须使用一个timer来延迟hide的动作, 否则就没有办法完成main的mouseenter事件的触发
            // 3. 如果立即绑定document.body的click事件, 还会接收到target的click事件(冒泡上来的)
            //    这时又会有一次处理过程, 会导致targer的clici事件被处理两次, 变成了toggle
            me._showTimer = setTimeout(
                function () {
                    // 重新定位置
                    // 如果有target, 那么定位到target上, 否则定位到当前的trigger上
                    me.locate(me.target || me.trigger);
                    if (me.mode === 'click') {
                        me.delegate(document, 'click', me.onDocumentClicked);
                    }
                    me.delegate(window, 'resize', me.onWindowResize);
                },
                me.delay
            );

            // 清理hide的闹钟
            clearTimeout(me._hideTimer);
        },

        /**
         * 隐藏浮层
         * @public
         */
        hide: function () {

            var me = this;

            if (!me.hasState('show')) {
                return;
            }

            me.removeState('show');


            me._hideTimer = setTimeout(
                function () {
                    // 把自己飞走
                    $(me.main).css('left', '-2000px');
                    // 取消全局事件的绑定
                    if (me.mode === 'click') {
                        me.undelegate(document, 'click', me.onDocumentClicked);
                    }
                    me.undelegate(window, 'resize', me.onWindowResize);
                    me.trigger = null;
                },
                me.delay
            );

            // 清理show的闹钟
            clearTimeout(me._showTimer);
        },

        /**
         * 浏览器可视尺寸改变时处理
         *
         * @private
         */
        onWindowResize: function () {
            this.locate();
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

            var target = e.target;
            var main = this.main;
            var currentTrigger = target === main || $.contains(main, target)
                ? this.trigger
                : $(e.target).closest(this.triggers)[0];

            if (!currentTrigger) {
                return;
            }

            var previousTrigger = this.trigger;

            // 这里针对于同一Popup实例，在多个target间切换时的处理逻辑
            // 效果是从target A切换到target B时，Popup实例直接显示在target B上，而不是隐藏。
            // 之所以会被隐藏是因为document上的`click`钩子
            // 判断当前的target是不是原有target，或者在原有target内部
            // 如果不是，那么先将它隐藏。
            // 这里隐藏主要作用是取消挂载到document上的`click`事件处理，而不是真的想要隐藏它。
            // 如果不把钩子去掉，那会让接下来`显示`之后，事件冒泡上来到钩子上，又把它给隐藏了。
            if (previousTrigger && currentTrigger !== previousTrigger) {
                this.hide();
            }

            /**
             * @event module:Popup#show
             * @type {Object}
             */
            var event = new $.Event('show', {
                trigger: currentTrigger
            });

            this.fire(event);

            // 如果没有被阻止, 那么显示~
            if (event.isDefaultPrevented()) {
                return;
            }

            this.trigger = currentTrigger;
            this.show();
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

            if (e.type !== 'mouseleave'
                && (main === target || $.contains(main, target))
            ) {
                return;
            }

            var event = new $.Event('hide');

            this.fire(event);

            if (event.isDefaultPrevented()) {
                return;
            }

            this.hide();
        },

        /**
         * 浮层哟, 被点击了呢~
         * @param  {Event} e 点击事件
         */
        onMainClick: function (e) {
            /**
             * @event module:Popup#click
             * @type {Object}
             * @property {Event} event 事件源对象
             */
            this.fire(e);
        },

        /**
         * 计算浮层及箭头显示位置
         *
         * @protected
         * @param {Element} target 挂靠目标元素
         */
        locate: function (target) {

            target           = $(target);

            var main         = $(this.main);
            var dir          = this.dir;
            var position     = target.offset();

            // 目标的8个关键坐标点
            var top          = position.top;
            var left         = position.left;
            var width        = target.outerWidth();
            var height       = target.outerHeight();
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

            main.css({
                left: left + offset.x + 'px',
                top: top + offset.y + 'px'
            });

        },

        dispose: function () {
            this.clearTriggersEvents();
            this.$parent();
        }

    });

    return Popup;
});
