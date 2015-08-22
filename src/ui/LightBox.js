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
     * 没有获取到图片的宽高时使用的默认宽高
     *
     * @type {Object}
     * @const
     */
    var DEFAULT_SIZE = {
        width: 500,
        height: 300
    };

    /**
     * 获取图片的原始尺寸，必须在图片加载完成后调用
     *
     * @param  {HTMLElement} img 图片DOM对象
     * @return {Object}      图片的长宽
     */
    function getNaturalSize(img) {

        var size = {};

        if (img.naturalWidth) {
            return {
                width: img.naturalWidth,
                height: img.naturalHeight
            };
        }

        var image = new Image();
        image.src = img.src;
        size.width = image.width;
        size.height = image.height;

        return size;
    }

    /**
     * 查看大图
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @requires Mask
     * @exports LightBox
     * @example
     * new LightBox().render();
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
         * @property {boolean} options.mask  是否显示覆盖层
         * @property {number} options.level 当前LightBox的z-index
         * @property {boolean} options.showLoading 是否显示正在加载的图标
         * @property {boolean} options.showPage 是否显示页码
         * @property {boolean} options.autoScale 是否根据浏览器可视区域缩放，不超过窗口高度的90%
         * @property {boolean} options.cyclic 是否循环翻页
         * @property {boolean} options.maskClickClose 当遮罩被点击时, 相当于点击close
         * @property {string}  options.errorMessage 图片加载错误时显示的内容，也可传入一张默认图片的html字符串
         */
        options: {

            /**
             * 触发显示的元素的选择器
             * 需要设置 data-lightbox-url 参数，表示图片的地址
             * DOM dataset参数
             *     data-lightbox-title: 显示的标题
             *     data-lightbox-width: 固定显示图片的宽度
             *     data-lightbox-height: 固定显示图片的高度
             *
             * @type {string | Array.<HTMLElement>}
             */
            triggers: '[data-role="lightbox-image"]',

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
            cyclic: false,

            /**
             * 图片加载错误时显示的内容
             *
             * @type {string}
             */
            errorMessage: '图片加载失败，请稍后重试'
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

            var content = $(this.helper.createPart('content')).appendTo(main);
            $(helper.createPart('image', 'img')).appendTo(content);

            var components = ['title', 'message'];
            if (this.showPage) {
                components.push('page');
            }
            lib.each(
                components,
                function (part) {
                    $(helper.createPart(part)).appendTo(content);
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

            var icons = ['close', 'prev', 'next'];
            this.createIcons(icons);

        },

        /**
         * 初始化所有元素的配置
         *
         * @private
         */
        initElements: function () {

            this.elements = [];
            this.current = this.current || 0;
            var triggers = $(this.triggers);
            this.total = triggers.length;

            this.elements = lib.map(
                triggers,
                function (element, index) {

                    element = $(element);
                    element.data('lightbox-index', index);

                    return {
                        src: element.data('lightbox-url'),
                        inlineSize: {
                            width: element.data('lightbox-width') || 0,
                            height: element.data('lightbox-height') || 0
                        },
                        title: element.data('lightbox-title')
                    };
                }
            );
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

            this.delegate(document.body, 'click', this.triggers, this.onShow);

            if (this.mask && this.maskClickClose) {
                this.mask.on('click', $.proxy(this.onCloseClicked, this));
            }

            if (this.autoScale) {
                this.onWindowResize = lib.debounce.call(this, this.onWindowResize, 100);
            }
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
            var realSize = getNaturalSize(this.helper.getPart('image'));
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

            if (!obj.width || !obj.height) {
                return DEFAULT_SIZE;
            }

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
         * @private
         */
        showImage: function (index) {

            var element = this.getElement(index);
            var helper = this.helper;

            helper.getPart('image').src = element.src;
            this.removeState('error');

            var size = this.getSize(index);
            var title = element.title;

            this.current = index;
            this.showIcons();
            this.setTitle(title);

            if (this.showPage) {
                helper.getPart('page').innerHTML = this.getPageHTML();
            }

            this.set(size);

            this.showLoading && $(this.load).css('visibility', '');

            if (!this.hasState('visible')) {
                this.show();
                this.fire('show');
            }

        },


        /**
         * 加载图片
         *
         * @param  {number}    index  加载图片的索引
         * @return {Promise}
         * @private
         */
        loadImage: function (index) {

            var defer = new $.Deferred();

            var element = this.getElement(index);
            this.showLoading && $(this.load).css('visibility', 'visible');

            var img = new Image();
            img.src = element.src;

            // IE下若图片已缓存，有可能不会执行onload
            if (img.complete) {
                defer.resolve(index);
            }
            else {
                img.onload = function () {
                    defer.resolve(index);
                };
            }

            img.onerror = function () {
                defer.reject(index);
            };


            return defer.promise();
        },


        /**
         * 当图片加载失败时触发
         *
         * @param {number} index 图片索引
         * @fires module:LightBox#loaderror
         * @private
         */
        showErrorMessage: function (index) {

            this.showLoading && $(this.load).css('visibility', 'hidden');

            /**
             * @event module:LightBox#loaderror
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            var event = this.fire('loaderror');

            if (event.isDefaultPrevented()) {
                return;
            }

            this.addState('error');

            var message = this.helper.getPart('message');
            $(message).html(this.errorMessage);

            if (!this.hasState('visible')) {
                this.show();
            }

            this.current = index;
            this.set(DEFAULT_SIZE);

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

            this.loadImage(index).then(
                $.proxy(this.showImage, this),
                $.proxy(this.showErrorMessage, this)
            );

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
            index = this.calculateIndex(index);

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
                this.loadImage(index).then(
                    $.proxy(this.showImage, this),
                    $.proxy(this.showErrorMessage, this)
                );
            }
        },

        /**
         * 计算索引，把索引限制在范围之内
         *
         * @param  {number} index 图片索引
         * @return {number}       在范围之内的图片索引
         */
        calculateIndex: function (index) {
            var total = this.total;

            if (index < 0) {
                index = total + index;
            }
            else if (index >= total) {
                index = index - total;
            }

            return index;
        },

        /**
         * 窗口resize事件监听函数，在可视状态下
         *
         * @private
         */
        onWindowResize: function () {

            if (this.hasState('error')) {
                return;
            }

            var size = this.getSize(this.current);
            this.set(size);
        },

        /**
         * 开始对resize事件侦听
         *
         * @private
         * @return {Popup}
         */
        startResizeListener: function () {

            this.autoScale && this.delegate(window, 'resize', this.onWindowResize);

            return this;
        },

        /**
         * 停止对resize事件侦听
         *
         * @private
         * @return {Popup}
         */
        stopResizeListener: function () {

            this.autoScale && this.undelegate(window, 'resize', this.onWindowResize);

            return this;
        },

        /**
         * 处理各个图标的显示，包括：关闭、下一页、上一页
         *
         * @private
         */
        showIcons: function () {

            var prev = $(this.helper.getPart('prev')).show();
            var next = $(this.helper.getPart('next')).show();

            if (this.total <= 0) {
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

                    // 设置title和content的宽高
                    $(helper.getPart('content')).css({
                        width: width + 'px',
                        height: height + 'px'
                    });
                    $(helper.getPart('title')).outerWidth(width);

                    var main = $(this.main);
                    width = main.outerWidth();
                    height = main.outerHeight();

                    $(this.main).css({
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
                        $(part).css('visibility', 'hidden');
                    }
                    else if (part) {
                        $(part).css('visibility', '').html(title);
                    }
                }
            },
            {
                name: ['visible'],
                paint: function (conf, visible) {
                    if (visible) {
                        // 切换状态, 先把自己给显示出来
                        this.addState('visible');
                        // 开始对resize事件的监听
                        this.startResizeListener();
                        // 显示遮罩
                        this.mask && this.mask.show();
                    }
                    else {
                        // 切换状态
                        this.removeState('visible');
                        // 隐藏遮罩
                        this.mask && this.mask.hide();
                        // 取消对resize事件的监听
                        this.stopResizeListener();
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

            if (!this.hasState('visible')) {
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

            // 隐藏，同时会取消resize的监听
            this.hasState('visible') && this.hide();

            this.undelegate(document.body, 'click', this.triggers, this.onShow);

            this.elements = [];

            this.undelegate(this.main, 'click', this.onMainClicked);

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
