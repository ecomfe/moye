/**
 * Moye
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file  提示层控件
 * @author  chris(wfsr@foxmail.com)
 * @author  liulangyu(liulangyu90316@gmail.com)
 */

define(function (require) {

    var $       = require('jquery');
    var Control = require('./Control');
    var Popup   = require('./Popup');

    /**
     * 提示层控件
     *
     * @extends module:Popup
     * @requires lib
     * @requires Control
     * @requires Popup
     * @exports Tip
     * @example
     * new Tip({
     *     mode: 'over',
     *     arrow: "1",
     *     offset: {x: 5, y: 5},
     *     onBeforeShow: function () {
     *         this.title = Math.random();
     *     }
     * }).render();
     *
     */
    var Tip = Popup.extend(/** @lends module:Tip.prototype */{

        type: 'Tip',

        /**
         * 控件配置项
         *
         * @name module:Tip#options
         * @type {Object}
         * @property {boolean|string=} arrow 提示框的箭头参数，默认为false，不带箭头
         * 可以初始化时通过指定arrow属性为“1”开启箭头模式，也可以手动指定箭头方向：
         * tr | rt | rb | br | bl | lb | lt | tl | tc | rc | bc | lc
         * 也可通过在 triggers 上设置 data-tooltips来指定
         * @property {number=} showDelay 提示框显示的延迟时间，默认值为 100 毫秒
         * @property {number=} hideDelay 提示框消失的延迟时间，默认值为 300 毫秒
         * @property {string=} mode 提示的显示模式，over|click|static。默认为over
         * @property {string=} title 提示的标题信息，默认为null
         * @property {string} content 提示的内容信息
         * @property {string} prefix 控件class前缀，同时将作为main的class之一
         * @property {string} triggers 自动绑定本控件功能的class
         * @property {Object.<string, number>} offset 浮层显示的偏移量
         * @property {number} offset.x x 轴方向偏移量
         * @property {number} offset.y y轴方向偏移量
         * @property {string} tpl 浮层内部HTML模板
         * @readonly
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
             * 触发显示弹出层的节点(TODO 接口变化)
             *
             * 可以设定为string(className), 也可以设定为
             *
             * 当指定了 liveTriggers 时只能用 string 类型指定 class
             *
             * @type {string | Array.<HTMLElement>}
             */
            triggers: '.tooltips',

            /**
             * 动态 triggers 的父元素节点
             *
             * @type {string | HTMLElement}
             */
            liveTriggers: '',

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

            /**
             * 弹出模式
             * 可选值: click | over | static
             *
             * click: 当trigger被点击时展现, 当点击到trigger之外的元素时隐藏;
             * over: 当trigger有鼠标经过时展现, 当有鼠标移出时隐藏;
             * static: 不需要指定trigger, 只有当调用`show`方法时展现;
             *
             * @type {string}
             */
            mode: 'over',

            // 提示的内容信息
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
             * 浮层显示的偏移量
             *
             * @type {Object}
             */
            offset: {

                /**
                 * x 轴方向偏移量
                 *
                 * @type {number | string}
                 * @defaultvalue
                 */
                x: 0,

                /**
                 * y 轴方向偏移量
                 *
                 * @type {number | string}
                 * @defaultvalue
                 */
                y: 0
            }
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Tip#options
         * @private
         */
        init: function (options) {
            // 处理dir和arrow
            options.arrow && (options.dir = options.arrow);

            this.$parent(options);
        },

        /**
         * 初始化tip dom
         *
         * @private
         * @override
         */
        initStructure: function () {
            var me = this;

            var helper = me.helper;
            // 拼DOM
            var html = ''
                + helper.getPartHTML('arrow', 'div', '<em></em><ins></ins>')
                + helper.getPartHTML('body', 'div', me.body || '');

            // 给样式, 弄到DOM树上
            $(me.main)
                .css('left', '-2000px')
                .appendTo(document.body)
                .html(html);

            // 把部件绑定到自己身上
            me.elements = {
                arrow: helper.getPart('arrow'),
                body: helper.getPart('body')
            };
        },

        /**
         * 初始化事件绑定
         *
         * @private
         */
        initEvents: function () {
            this.$parent();
        },

        /**
         * 重绘
         *
         * @protected
         * @override
         */
        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: 'content',
                paint: function (conf, content) {
                    this.setContent(content);
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
         * 设置提示层显示的内容
         *
         * @param {string} html 要提示的内容的HTML
         * @public
         */
        setContent: function (html) {
            this.content = html || '';
            $(this.elements.body).html(this.content);
        },

        /**
         * 刷新触发器
         *
         * 用于经常更新的内容，在更新内容后调用此方法会
         * 解除旧 DOM 节点的绑定，再重新查找绑定新节点
         *
         * @param {string} triggers 触发器的 class
         * @public
         */
        refresh: function (triggers) {
            this.clearTriggersEvents(this.triggers, this.liveTriggers);

            this.triggers = triggers;
            this.bindTriggersEvents(this.triggers, this.liveTriggers);
        },

        /**
         * 计算浮层及箭头显示位置
         *
         * @public
         * @param {Element} target 挂靠目标元素
         */
        locate: function (target) {
            this.$parent(target);

            // 定位箭头
            var main = $(this.main);
            var arrow = this.elements.arrow;
            if (this.arrow === false) {
                $(arrow).hide();
                return;
            }

            target           = $(target);
            var lrtb         = {l: 'left', r: 'right', t: 'top', b: 'bottom'};
            var offset       = this.offset;
            var offsetX      = offset.x;
            var offsetY      = offset.y;
            var position     = target.offset();

            var width        = target.outerWidth();
            var height       = target.outerHeight();
            var top          = position.top;
            var left         = position.left;
            var right        = left + width;
            var bottom       = top + height;

            var helper       = this.helper;

            var dir          = this._dir;
            var first        = dir.charAt(0);
            var second       = dir.charAt(1);

            // 提示层宽高
            var mainWidth    = main.outerWidth();
            var mainHeight   = main.outerHeight();

            arrow.className = ''
                + helper.getPartClassName('arrow')
                + ' '
                + helper.getPartClassName('arrow-' + lrtb[first]);

            var arrowWidth  = arrow.firstChild.offsetWidth;
            var arrowHeight = arrow.firstChild.offsetHeight;

            // 提示层在目标上部或下部显示时的定位处理
            if ({t: 1, b: 1}[first]) {
                var middleX = (width - arrowWidth) / 2;

                // 在目标宽于提示层或 dir 为 tc 或 bc 时，箭头相对提示层水平居中
                $(arrow).css({
                    left: {
                        c: (mainWidth - arrowWidth) / 2,
                        l: middleX - offsetX,
                        r: mainWidth - Math.max(arrowWidth, middleX) + offsetX
                    }[width > mainWidth ? 'c' : second] + 'px',
                    top: ''
                });

                // 修正main 的 top
                top = {
                    t: top - arrowHeight - mainHeight - offsetY,
                    b: bottom + arrowHeight + offsetY
                }[first];
                main.css('top', top + 'px');
            }

            // 提示层在目标左边或右边显示时的定位处理
            else if ({l: 1, r: 1}[first]) {
                var middleY = (height - arrowHeight) / 2;

                // 在目标高于提示层或 dir 为 lc 或 rc 时，箭头相对提示层垂直居中
                $(arrow).css({
                    top: {
                        c: (mainHeight - arrowHeight) / 2,
                        t: middleY - offsetY,
                        b: mainHeight - Math.max(arrowHeight, middleY) + offsetY
                    }[height > mainHeight ? 'c' : second] + 'px',
                    left: ''
                });

                // 修正main 的 left
                left = {
                    l: left - arrowWidth - mainWidth - offsetX,
                    r: right + arrowWidth + offsetX
                }[first];
                main.css('left', left + 'px');
            }
        }
    });

    return Tip;
});
