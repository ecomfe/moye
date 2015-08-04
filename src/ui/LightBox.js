/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file LightBox 查看大图组件
 * @author cxtom(cxtom2008@gmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Mask = require('./Mask');
    var Control = require('./Control');
    var Panel = require('./Panel');


    var privates = {

        /**
         * 判断url是否为图片
         *
         * @param  {string}  str  一个链接
         * @return {boolean} 是否为图片
         * @private
         */
        isImage: function (str) {
            return lib.isString(str)
                && str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
        },

        /**
         * 获取某元素应该被显示的宽高
         *
         * @param  {HTMLElement} dom    HTML元素DOM对象
         * @param  {number}      index  元素的索引
         * @return {Object}      元素显示的宽高
         * @private
         */
        getSize: function (dom, index) {

            var obj = {};
            var fixed = {};
            var limit = {};

            lib.each(
                ['width', 'height'],
                function (name) {
                    obj[name] = dom[name];

                    var body = $(window)[name]() * 0.9;
                    limit[name] = Math.min(body, obj[name]);

                    fixed[name] = this.elements && this.elements[index][name];
                },
                this
            );

            if (fixed.width && fixed.height) {
                return fixed;
            }

            if (fixed.width) {
                obj.height *= fixed.width / obj.width;
                obj.width = fixed.width;
            }
            else if (fixed.height) {
                obj.width *= fixed.height / obj.height;
                obj.height = fixed.height;
            }

            // 按比例缩放
            if (this.autoScale) {
                var wProp = limit.width / obj.width;
                var hProp = limit.height / obj.height;

                if (wProp < hProp) {
                    obj.height *= wProp;
                    obj.width = limit.width;
                }
                else {
                    obj.width *= hProp;
                    obj.height = limit.height;
                }
            }

            return obj;
        },


        /**
         * 显示某个元素（图片）
         *
         * @param  {number}    index  显示元素的索引
         * @return {Promise}
         * @private
         */
        showElement: function (index) {
            var element = this.elements[index];
            var type = element.type;
            var me = this;
            /* eslint-disable new-cap */
            var dtd = $.Deferred();
            /* eslint-enable new-cap */

            var content = '';
            var dom = null;

            switch (type) {
                case 'image':
                    dom = $('<img>')
                            .attr('src', element.src)
                            .attr('id', me.helper.getPartId('image') + index)
                            .addClass(me.helper.getPartClassName('image'));
                    content = dom.prop('outerHTML');
                    me.setContent(content);

                    var showImage = function () {
                        element = $.extend(element, privates.getSize.call(me, dom.get(0), index));
                        me.current = index;

                        me.setTitle(element.title);
                        privates.showIcons.call(me);

                        me.show();

                        dtd.resolve();
                    };

                    dom.load(showImage);

                    dom.error(function () {
                        dtd.reject();
                    });

                    break;

                default:

                    break;
            }

            return dtd.promise();
        },

        /**
         * 当触发隐藏的时候
         *
         * @fires module:LightBox#beforehide
         * @private
         */
        onCloseClicked: function () {

            /**
             * @event module:LightBox#hide
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            var event = this.fire('hide');

            if (!event.isDefaultPrevented()) {
                this.hide();
            }

        },

        /**
         * 当触发翻页时
         *
         * @param {Object} e 事件传入对象
         * @param {string | number} action 当前事件 可选值：prev|next；或者是直接传入要显示的索引
         *
         * @fires module:LightBox#change
         * @private
         */
        onChange: function (e, action) {

            if (lib.isNumber(action)) {
                index = action;
            }
            else {
                var total = this.elements.length;
                var index = action === 'next' ? this.current + 1 : this.current - 1;
            }


            if (index < 0) {
                index = this.cyclic ? total + index : 0;
            }
            else if (index >= total) {
                index = this.cyclic ? index - total : 0;
            }

            /**
             * @event module:LightBox#change
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            var event = this.fire('change', {
                activeIndex: index
            });

            if (event.isDefaultPrevented()) {
                return;
            }

            var me = this;
            var element = me.elements[index];

            if (element) {
                privates.showElement
                    .call(this, index)
                    .then(function () {
                        me.set({
                            width: element.width,
                            height: element.height
                        });
                    });
            }
        },

        /**
         * 当触发显示时
         *
         * @param  {Object} e 事件对象
         * @private
         */
        onShow: function (e) {

            e.preventDefault();

            var target = $(e.currentTarget);

            var index = this.current = target.data('index');

            var me = this;

            privates.showElement
                .call(this, index)
                .then(function () {
                    me.fire('show');
                });

        },

        /**
         * 处理各个图标的显示，包括：关闭、下一页、上一页
         *
         * @private
         */
        showIcons: function () {

            var prev = $(this.helper.getPart('prev')).css('display', 'block');
            var next = $(this.helper.getPart('next')).css('display', 'block');


            if (this.cyclic) {
                return;
            }

            var count = this.elements.length - 1;

            if (this.current <= 0) {
                prev.css('display', 'none');
            }

            if (this.current >= count) {
                next.css('display', 'none');
            }
        }

    };


    /**
     * 查看大图
     * TODO: 支持flash、视频、iframe等
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @requires Panel
     * @requires Mask
     * @exports LightBox
     * @example
     * new LightBox({
     *     triggers: '.lightbox'
     * }).render();
     */
    var LightBox = Control.extend(/** @lends module:LightBox.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @override
         * @private
         */
        type: 'LightBox',

        /**
         * 控件配置项
         *
         * @name module:LightBox#options
         * @type {Object}
         * @property {string | Array.<HTMLElement>} options.triggers 触发显示的元素的选择器
         * @property {number} options.padding  元素与外边框之间的间距
         * @property {boolean} options.mask  是否显示覆盖层
         * @property {number} options.level 当前LightBox的z-index
         * @property {boolean} options.autoScale 是否根据浏览器可视区域缩放，不超过窗口高度的90%
         * @property {boolean} options.cyclic 是否循环翻页
         * @property {boolean} options.maskClickClose 当遮罩被点击时, 相当于点击close
         */
        options: {

            /**
             * 触发显示的元素的选择器
             *
             * 如果是a标签的元素，则获取href属性；
             * 如果是其它标签，就读取data-url属性
             *
             * @type {string | Array.<HTMLElement>}
             */
            triggers: '.lightbox',

            /**
             * 元素与外边框之间的间距
             *
             * @type {number}
             */
            padding: 10,

            /**
             * 是否显示覆盖层
             *
             * @type {boolean}
             */
            mask: true,

            /**
             * 是否根据浏览器可视区域缩放，不超过窗口高度的90%
             *
             * @type {boolean}
             */
            autoScale: true,

            /**
             * 当遮罩被点击时, 相当于点击close
             *
             * @type {boolean}
             */
            maskClickClose: true,

            /**
             * 当前LightBox的z-index
             *
             * @type {number}
             */
            level: 10,

            /**
             * 当前LightBox的z-index
             *
             * @type {boolean}
             */
            cyclic: false
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
            this.visible = false;
        },

        /**
         * 初始化控件结构
         *
         * @private
         */
        initStructure: function () {

            var helper = this.helper;
            var main = this.main;

            lib.each(
                [
                    'content',
                    'title'
                ],
                function (part) {
                    if (part) {
                        var panel = this.createPanel(part).appendTo(main);
                        this.addChild(panel, part);
                        helper.addPartClasses(part, panel.main);

                        panel.main.style.padding = this.padding + 'px';
                    }
                },
                this
            );

            var level = this.level;

            main = $(main)
                .css('zIndex', level)
                .appendTo(document.body);


            // 遮罩
            if (this.mask) {
                this.mask = Mask.create({
                    skin: 'lightbox',
                    level: level - 1
                }).render();
            }

            var me = this;
            me.elements = [];
            me.current = me.current || 0;
            var triggers = $(me.triggers);
            var count = triggers.length;
            triggers.each(function (index, element) {
                element = $(element);

                var href = element.attr('href') || element.data('url');
                if (!href) {
                    return;
                }

                var type;
                if (privates.isImage(href)) {
                    type = 'image';
                }
                else {
                    return;
                }

                me.elements.push({
                    src: href,
                    width: element.data('width') || 0,
                    height: element.data('height') || 0,
                    type: type,
                    title: element.attr('title')
                        || element.data('title')
                        || ((index + 1) + ' / ' + count)
                });
                element.data('index', index);
            });

            var icons = ['close'];
            if (count > 1) {
                icons.push('prev');
                icons.push('next');
            }
            this.createIcons(icons);

        },

        /**
         * 创建一个Panel控件
         *
         * @param  {string} part 名称
         * @return {Panel}
         * @protected
         */
        createPanel: function (part) {
            var id = this.id + part;
            return new Panel({
                id: id
            });
        },


        /**
         * 创建组件内的图标，并会绑定相应的事件
         *
         * @param  {Array.<string> | string}  icons   icon的名称，如close, next, prev
         * @public
         */
        createIcons: function (icons) {

            if (lib.isString(icons)) {
                icons = [].push(icons);
            }

            lib.each(
                icons,
                function (part) {
                    $(this.main).append(
                        this.helper.createPart(
                            part,
                            'i',
                            this.getIconHTML(part),
                            {
                                'data-action': part
                            }
                        )
                    );
                },
                this
            );
        },


        /**
         * 获取相应的iconfont编码
         *
         * @param  {string} name  icon的名称，如close, next, prev
         * @return {string} iconfont编码
         * @protected
         */
        getIconHTML: function (name) {
            var icons = {
                close: '&#xe602;',
                prev: '&#xe608;',
                next: '&#xe609;'
            };
            return icons[name] || '';
        },


        /**
         * 事件绑定
         *
         * @private
         */
        initEvents: function () {

            this.showBound = $.proxy(privates.onShow, this);
            this.hideBound = $.proxy(privates.onHide, this);
            this.changeBound = $.proxy(privates.onChange, this);

            this.delegate(this.main, 'click', '[data-action]', this.onMainClicked);

            this.bindTriggersEvents(this.triggers);

            if (this.mask && this.maskClickClose) {
                this.mask.on('click', $.proxy(privates.onCloseClicked, this));
            }
        },


        /**
         * 绑定triggers的事件处理
         *
         * @private
         * @param {Array.<Element> | string} triggers 触发lightbox显示的元素们
         * @protected
         */
        bindTriggersEvents: function (triggers) {
            var boundTarget = $(triggers);

            boundTarget.on('click', this.showBound);
        },

        /**
         * 清除绑定triggers的事件处理
         *
         * @private
         * @param {Array.<Element> | string} triggers 触发lightbox显示的元素们
         * @protected
         */
        clearTriggersEvents: function (triggers) {
            var boundTarget = $(triggers);

            boundTarget.off('click', this.showBound);
        },

        /**
         * 当窗口主内容被点击时的处理
         *
         * @param {Event} e 点击事件对象
         * @protected
         */
        onMainClicked: function (e) {

            var target = $(e.currentTarget);
            var action = target.data('action');

            // 内置的动作处理
            if (action === 'close') {
                privates.onCloseClicked.call(this, e);
                return;
            }

            if (action === 'prev'
                || action === 'next') {

                privates.onChange.call(this, e, action);
                return;
            }

            // 否则我们放一个NB的事件哟
            this.fire(action, {
                target: target[0]
            });

        },


        /**
         * 重绘
         *
         * @override
         */
        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: ['width', 'height'],
                paint: function (conf, width, height) {

                    $(this.getChild('title').main).css({
                        bottom: this.padding + 'px',
                        left: this.padding + 'px',
                        width: width - this.padding * 2 + 'px'
                    });

                    $(this.getChild('content').main).css({
                        width: width + 'px',
                        height: height + 'px'
                    });

                    width = width + this.padding * 2;
                    height = height + this.padding * 2;

                    $(this.main).css({
                        width: width + 'px',
                        height: height + 'px',
                        marginLeft: -width / 2 + 'px',
                        marginTop: -height / 2 + 'px'
                    });
                    // 兼容ie6的定位问题
                    lib.fixed(this.main, {
                        top: '50%',
                        left: '50%'
                    });
                }
            },
            {
                name: ['title'],
                paint: function (conf, title) {
                    var panel = this.getChild('title');
                    if (panel) {
                        panel.set('content', title);
                    }
                }
            },
            {
                name: ['content'],
                paint: function (conf, content) {
                    var panel = this.getChild('content');
                    if (panel) {
                        panel.set('content', content);
                    }
                }
            },
            {
                name: ['visible'],
                paint: function (conf, visible) {
                    if (visible) {
                        // 切换状态, 先把自己给显示出来
                        this.addState('visible');
                        // 然后我们利用宽高, 重置一下左/上的缩进
                        var element = this.elements[this.current];
                        this.set({
                            width: element.width,
                            height: element.height
                        });
                        // 显示遮罩
                        this.mask && this.mask.show();
                    }
                    else {
                        // 切换状态
                        this.removeState('visible');
                        // 隐藏遮罩
                        this.mask && this.mask.hide();
                    }
                }
            }
        ),

        /**
         * 暴露选择某一张图（元素）的接口
         *
         * @param  {number} index 元素索引
         * @return {LightBox}
         * @public
         */
        select: function (index) {
            privates.onChange.call(this, null, index);
            return this;
        },

        /**
         * 调整LightBox宽度
         *
         * @param {number} width 宽度
         * @return {LightBox}
         * @public
         */
        setWidth: function (width) {
            this.set('width', width);
            return this;
        },

        /**
         * 设定高度
         *
         * @param {number} height 高度
         * @return {LightBox}
         * @public
         */
        setHeight: function (height) {
            this.set('height', height);
            return this;
        },

        /**
         * 设定标题
         *
         * @param {string} title 标题
         * @return {LightBox}
         * @public
         */
        setTitle: function (title) {
            this.set('title', title);
            return this;
        },

        /**
         * 获取当前页
         *
         * @return {number}
         * @public
         */
        getCurrent: function () {
            return this.current;
        },

        /**
         * 设置dialog的主体内容，可以是HTML内容
         *
         * @param {string} content 内容字符串
         * @return {LightBox}
         * @public
         */
        setContent: function (content) {
            this.set('content', content);
            return this;
        },

        /**
         * 返回当前窗口的内容部分
         *
         * @return {Element}
         * @public
         */
        getContent: function () {
            return this.helper.getPart('content');
        },

        /**
         * 显示窗口
         *
         * @return {LightBox}
         * @public
         */
        show: function () {
            this.set('visible', true);
            return this;
        },

        /**
         * 隐藏窗口
         *
         * @return {LightBox}
         * @public
         */
        hide: function () {
            this.set('visible', false);
            return this;
        },

        /**
         * 销毁，注销事件，解除引用
         *
         * @public
         * @fires module:LightBox#dispose
         * @fires module:LightBox#beforedispose
         */
        dispose: function () {

            /**
             * @event module:LightBox#dispose
             */
            this.$parent('dispose');

            this.clearTriggersEvents(this.triggers);

            this.showBound = null;
            this.hideBound = null;
            this.elements = [];

            this.undelegate(this.main, 'click', this.onMainClicked);
            $(this.main).remove();

            // 销毁遮罩
            if (this.mask) {
                this.mask.dispose();
            }

        }


    });

    return LightBox;
});
