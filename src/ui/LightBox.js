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


    /**
     * 获取图片的原始尺寸
     *
     * @param  {HTMLElement} img 图片DOM对象
     * @return {Object}      图片的长宽
     */
    function getNaturalSize(img) {
        var size = {
            width: img.naturalWidth,
            height: img.naturalHeight
        };
        if (img.naturalWidth) {
            return size;
        }

        var image = new Image();
        image.src = img.src;
        size.width = image.width;
        size.height = image.height;
        return size;
    }


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
         * @property {boolean} options.showLoading 是否显示正在加载的图标
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
            triggers: '[data-role="lightbox-image"]',

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
             * 是否显示加载图标
             *
             * @type {boolean}
             */
            showLoading: true,

            /**
             * 是否显示页码
             *
             * @type {boolean}
             */
            showPage: true,

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
             * 是否循环播放，最后一张点击下一页回到第一张
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

            if (lib.browser.ie && lib.browser.ie < 10) {
                this.hideCloseIcon = true;
            }
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
                ['content', 'title'],
                function (part) {
                    $(helper.createPart(part))
                        .appendTo(main)
                        .css('padding', this.padding + 'px');
                },
                this
            );

            var level = this.level;

            main = $(main)
                .css('zIndex', level)
                .appendTo(document.body);

            if (this.showLoading) {
                var load = $('<div>')
                    .addClass(this.helper.getPartClassName('loading'))
                    .css('zIndex', level + 1)
                    .appendTo(document.body);

                this.load = load.get(0);

                // 兼容ie6的定位问题
                lib.fixed(this.load, {
                    top: '50%',
                    left: '50%'
                });
            }


            // 遮罩
            if (this.mask) {
                this.mask = Mask.create({
                    skin: 'lightbox',
                    level: level - 1
                }).render();
            }

            if (this.showPage) {
                $(this.main).append(this.helper.createPart('page', 'span'));
            }

            this.initElements();

            var icons = ['close', 'prev', 'next'];
            this.createIcons(icons);

        },

        /**
         * 初始化元素
         *
         * @private
         */
        initElements: function () {
            var me = this;
            this.elements = [];
            this.current = this.current || 0;
            var triggers = $(this.triggers);
            this.total = triggers.length;

            triggers.each(function (index, element) {

                element = $(element);

                me.elements.push({
                    src: element.data('lightbox-url'),
                    width: 0,
                    height: 0,
                    inlineSize: {
                        width: element.data('lightbox-width') || 0,
                        height: element.data('lightbox-height') || 0
                    },
                    title: element.data('lightbox-title')
                });

                element.data('lightbox-index', index);

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
                                'data-lightbox-action': part
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

            this.delegate(this.main, 'click', '[data-lightbox-action]', this.onMainClicked);

            this.bindTriggersEvents(this.triggers);

            if (this.mask && this.maskClickClose) {
                this.mask.on('click', $.proxy(this.onCloseClicked, this));
            }

            if (this.autoScale) {
                this.onWindowResize = lib.debounce.call(this, this.onWindowResize, 100);
                this.delegate(window, 'resize', this.onWindowResize);
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

            this.delegate(document.body, 'click', triggers, this.onShow);
        },

        /**
         * 清除绑定triggers的事件处理
         *
         * @private
         * @param {Array.<Element> | string} triggers 触发lightbox显示的元素们
         * @protected
         */
        clearTriggersEvents: function (triggers) {

            this.undelegate(document.body, 'click', triggers, this.onShow);
        },

        /**
         * 获取某元素应该被显示的宽高
         *
         * @param  {number}      index  元素的索引
         * @return {Object}      元素显示的宽高
         * @private
         */
        getSize: function (index) {

            var obj = {};
            var limit = {};
            var inlineSize = this.elements[index].inlineSize;
            var realSize = this.elements[index].realSize;
            var fixed = {};

            lib.each(
                ['width', 'height'],
                function (name) {
                    obj[name] = realSize[name];

                    var body = $(window)[name]() * 0.8;
                    limit[name] = Math.min(body, obj[name]);
                    fixed[name] = inlineSize[name];
                },
                this
            );

            // 长宽均已经固定，直接返回
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

                if (wProp < hProp && wProp < 1) {
                    obj.height *= wProp;
                    obj.width = limit.width;
                }
                else if (hProp < wProp && hProp < 1) {
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
        showImage: function (index) {

            var element = this.getElement(index);
            var me = this;
            /* eslint-disable new-cap */
            var dtd = new $.Deferred();
            /* eslint-enable new-cap */

            if (this.showLoading) {
                $(this.load).show();
            }

            var img = this.helper.createPart('image', 'img');
            img.src = element.src;
            $(this.helper.getPart('content')).empty().append(img);

            var onloadImage = function () {

                if (!element.realSize) {
                    element.realSize = getNaturalSize(img);
                }

                var size = me.getSize(index);
                var title = element.title;

                element = lib.extend(element, size);
                me.current = index;
                me.showIcons();
                me.setTitle(title);

                me.showLoading && $(me.load).hide();
                me.show();

                dtd.resolve();

            };

            if (img.complete) {
                onloadImage();
            }
            else {
                img.onload = onloadImage;
            }

            img.onerror = function () {
                me.hide();
                me.showLoading && $(this.load).hide();
                dtd.reject();
            };

            return dtd.promise();
        },

        /**
         * 当触发隐藏的时候
         *
         * @fires module:LightBox#hide
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
         * @param {number} index 传入要显示的索引
         *
         * @fires module:LightBox#change
         * @private
         */
        onChange: function (index) {

            if (index === this.current) {
                return;
            }

            this.initElements();

            var total = this.total;

            if (index < 0) {
                index = total + index;
            }
            else if (index >= total) {
                index = index - total;
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
                this.showImage(index).then(function () {
                    me.set({
                        width: element.width,
                        height: element.height
                    });
                });
            }
        },

        /**
         * 窗口resize事件监听函数，在可视状态下
         *
         * @private
         */
        onWindowResize: function () {

            if (this.currentStates.visiable) {
                var size = this.getSize(this.current);
                this.set(size);
            }

        },

        /**
         * 当触发显示时
         *
         * @param  {Object} e 事件对象
         *
         * @fires module:LightBox#show
         * @private
         */
        onShow: function (e) {

            e.preventDefault();

            this.initElements();

            var target = $(e.currentTarget);
            var index = target.data('lightbox-index');
            var me = this;

            this.showImage(index)
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

            if (this.hideCloseIcon) {
                $(this.helper.getPart('close')).hide();
            }

            var prev = $(this.helper.getPart('prev')).show();
            var next = $(this.helper.getPart('next')).show();

            if (this.total === 0) {
                prev.hide();
                next.hide();
                return;
            }

            if (this.cyclic) {
                return;
            }

            var count = this.elements.length - 1;

            if (this.current <= 0) {
                prev.hide();
            }
            else if (this.current >= count) {
                next.hide();
            }

        },

        /**
         * 当窗口主内容被点击时的处理
         *
         * @param {Event} e 点击事件对象
         * @protected
         */
        onMainClicked: function (e) {

            var target = $(e.currentTarget);
            var action = target.data('lightbox-action');

            // 内置的动作处理
            if (action === 'close') {
                this.onCloseClicked(e);
                return;
            }

            if (action === 'prev'
                || action === 'next') {

                var index = action === 'next' ? this.current + 1 : this.current - 1;

                this.onChange(index);
                return;
            }

            // 否则我们放一个自定义的事件
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

                    var helper = this.helper;

                    // 按宽度和padding对标题、页码、图片进行定位
                    $(helper.getPart('title')).css({
                        bottom: this.padding + 'px',
                        left: this.padding + 'px',
                        width: width - this.padding * 2 + 'px'
                    });

                    $(helper.getPart('page')).css({
                        bottom: this.padding + 'px',
                        right: this.padding + 'px'
                    });

                    $(helper.getPart('content')).css({
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
                    var part = this.helper.getPart('title');
                    if (!title) {
                        $(part).hide();
                    }
                    else if (part) {
                        $(part).show();
                        part.innerHTML = title;
                    }

                }
            },
            {
                name: ['visible'],
                paint: function (conf, visible) {
                    if (visible) {
                        // 切换状态, 先把自己给显示出来
                        this.addState('visible');

                        // 然后我们利用获取要显示的图片的宽高，重置元素的样式
                        var element = this.getElement(this.current);
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
         * 暴露选择显示某一张图（元素）的接口
         *
         * @param  {number} index 元素索引
         * @return {LightBox}
         * @public
         */
        select: function (index) {
            this.onChange(index);

            if (!this.currentStates.visible) {
                this.addState('visible');
            }
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

            // 显示页码
            if (this.showPage) {
                this.helper.getPart('page').innerHTML = this.getPageHTML();
            }
            return this;
        },

        /**
         * 获取页码的HTML
         *
         * @return {string} HTML字符串
         * @public
         */
        getPageHTML: function () {
            return (this.current + 1) + '/' + this.total;
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
         * 获取当前某个图片对应的配置
         *
         * @param {number} index 索引
         * @return {number}
         * @public
         */
        getElement: function (index) {
            return this.elements[index];
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

            this.elements = [];

            this.undelegate(this.main, 'click', this.onMainClicked);
            $(this.main).remove();

            if (this.autoScale) {
                this.undelegate(window, 'resize', this.onWindowResize);
            }

            if (this.showLoading) {
                $(this.load).remove();
            }

            // 销毁遮罩
            if (this.mask) {
                this.mask.dispose();
            }

        }


    });

    return LightBox;
});
