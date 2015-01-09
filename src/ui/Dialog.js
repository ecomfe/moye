/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 弹框组件
 * @author mengke(mengke01@baidu.com)
 * @author Leon(leon@outlook.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var Mask = require('./Mask');

    /**
     * 对话框
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Dialog
     * @example
     * new Dialog({
     *     main: '',
     *     content: '内容',
     *     footer: '底部',
     *     width: '600px',
     *     title: '标题',
     *     top: '50px',
     *     left: '',
     *     fixed: 1,
     *     mask: 1,
     *     leve: 10
     *
     *  }).render();
     */
    var Dialog = Control.extend({

        /**
         * 控件类型标识
         *
         * @type {string}
         * @override
         * @private
         */
        type: 'Dialog',

        /**
         * 控件配置项
         *
         * @name module:Dialog#options
         * @type {Object}
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @property {string} options.title 控件标题
         * @property {string} options.content 控件内容
         * @property {number} options.width 控件的默认宽度. 这个是必填的. 我们也提供了默认宽度, 400px;
         * @property {number} options.height 控件的默认高度, 这个参数是可选的.
         *                                   在不设定此高度时, 我们会根据对话框的实际高度来做视窗居中定位.
         * @property {string} options.mask 是否显示覆盖层
         * @property {string} options.level 当前dialog的z-index
         * @property {string} options.footer 控件脚注
         * @property {Array.Object} options.buttons 控件脚注中的按钮
         * @property {Array.Object} options.buttons.text 脚注按钮的文字
         * @property {Array.Object} options.buttons.part 控件按钮的标识
         */
        options: {

            // 控件标题
            title: '',

            // 控件内容，如果没有指定主渲染容器，则content内容塞到dialog的body中
            content: '',

            // 是否有关闭按钮，默认有，内容为x
            close: 'x',

            // 控件脚注
            footer: '',

            // 控件的默认宽度
            width: 400,

            // 是否显示覆盖层
            mask: true,

            // 当遮罩被点击时, 相当于点击close
            maskClickClose: true,

            // 隐藏时自动销毁
            hideDispose: false,

            // 当前dialog的z-index
            level: 10,

            // 按钮们
            buttons: null
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
            // 这里先把窗口的`resize`事件处理函数给包裹一下, 做一个300毫秒的延迟
            // this._onWindowResize = lib.delay($.proxy(this._onWindowResize, this), 300);
        },

        initStructure: function () {

            var helper = this.helper;

            var html = [
                this.close ? helper.getPartHTML('close', 'div', this.close) : '',
                helper.getPartHTML('header', 'div'),
                helper.getPartHTML('body', 'div'),
                helper.getPartHTML('footer', 'div')
            ];

            var level = this.level;

            $(this.main)
                .html(html.join(''))
                .css('zIndex', level)
                .appendTo(document.body);

            if (this.mask) {
                this.mask = Mask.create({
                    skin: 'dialog',
                    level: level - 1
                }).render();
            }

        },

        initEvents: function () {
            this.delegate(this.main, 'click', this._onMainClicked);
            if (this.mask && this.maskClickClose) {
                this.mask.on('click', $.proxy(this._onCloseClicked, this));
            }
        },

        /**
         * 当窗口主内容被点击时的处理
         * @param {Event} e 点击事件对象
         */
        _onMainClicked: function (e) {

            var target = $(e.target);
            var helper = this.helper;
            var main = this.main;

            this.fire(e);

            var close = target.closest(
                '.' + helper.getPrimaryClassName('close'),
                main
            )[0];

            if (close) {
                this._onCloseClicked();
                return;
            }

            // 找部件呀找部件, 好恶心~!
            var footerBotton = target.closest(
                '.' + helper.getPrimaryClassName('button'),
                main
            )[0];

            if (footerBotton) {

                e.preventDefault();

                this.fire('buttonclick', {
                    target: e.target,
                    part: target.data('part')
                });

                return;
            }

        },

        /**
         * 当窗口大小改变时的处理
         * @param {Event} e 窗口变化事件
         */
        _onWindowResize: function (e) {
            this._position();
        },

        /**
         * 当触发隐藏的时候
         *
         * @fires module:Dialog#beforehide
         * @private
         */
        _onCloseClicked: function () {

            /**
             * @event module:Dialog#beforehide
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            var event = new $.Event('hide');

            this.fire(event);

            if (event.isDefaultPrevented()) {
                return;
            }

            this.hide();
        },

        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: ['width', 'height'],
                paint: function (conf, width, height) {
                    var main = $(this.main);
                    width = this.width = parseInt(width, 10) || main.width();
                    height = this.height = parseInt(height, 10) || main.height();
                    $(this.main).css({
                        width: width + 'px',
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
                    this.helper.getPart('header').innerHTML = title;
                }
            },
            {
                name: ['content'],
                paint: function (conf, content) {
                    this.helper.getPart('body').innerHTML = content;
                }
            },
            {
                // 这两个属性是有冲突的
                // 如果有`footer`, 那么就抛弃`buttons`
                name: ['buttons', 'footer'],
                paint: function (conf, buttons, footerHTML) {

                    var footer = this.helper.getPart('footer');

                    if (footerHTML) {
                        footer.innerHTML = footerHTML;
                        this.buttons = null;
                    }

                    if (buttons) {
                        footer.innerHTML = lib
                            .map(
                                buttons,
                                this.getFooterButtonHTML,
                                this
                            )
                            .join('');
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
                        this.set({
                            width: 0,
                            height: 0
                        });
                        // 显示遮罩
                        this.mask && this.mask.show();
                    }
                    else {
                        this
                            // 切换状态
                            .removeState('visible')
                            // 解除窗口`resize`事件的侦听
                            .undelegate(window, 'resize', this._onWindowResize);

                        // 隐藏遮罩
                        this.mask && this.mask.hide();
                    }
                }
            }
        ),

        getFooterButtonHTML: function (conf) {

            var part = conf.part;
            var helper = this.helper;
            var className = ''
                + helper.getPartClassName(part)
                + ' '
                + helper.getPartClassName('button');

            return ''
                + '<a id="' + helper.getPartId(part) + '" '
                +     'data-part="' + part + '"'
                +     'class="' + className + '" '
                +     'href="#">'
                +     conf.text
                + '</a>';
        },

        /**
         * 调整Dialog大小
         *
         * @param {number} width 宽度
         * @return {Dialog}
         */
        setWidth: function (width) {
            this.set('width', width);
            return this;
        },

        /**
         * 设定高度
         * @param {number} height 高度
         * @return {Dialog}
         */
        setHeight: function (height) {
            this.set('height', height);
            return this;
        },

        /**
         * 设置dialog的标题
         *
         * @param {string} title 对话框的标题
         * @return {Dialog}
         * @public
         */
        setTitle: function (title) {
            this.set('title', title);
            return this;
        },

        /**
         * 返回当前窗口的title部分
         * @return {Element}
         */
        getTitle: function () {
            return this.helper.getPart('title');
        },

        /**
         * 设置dialog的主体内容，可以是HTML内容
         *
         * @param {string} content 内容字符串
         * @return {Dialog}
         * @public
         */
        setContent: function (content) {
            this.set('content', content);
            return this;
        },

        /**
         * 返回当前窗口的内容部分
         * @return {Element}
         */
        getContent: function () {
            return this.helper.getPart('body');
        },

        /**
         * 设置dialog的页脚内容
         *
         * @param {string} footer 内容字符串
         * @return {Dialog}
         * @public
         */
        setFooter: function (footer) {
            this.set('footer', footer);
            return this;
        },

        /**
         * 返回当前窗口的footer部分
         * @return {Element}
         */
        getFooter: function () {
            return this.helper.getPart('footer');
        },

        /**
         * 显示窗口
         * @public
         * @return {Dialog}
         */
        show: function () {
            this.set('visible', true);
            return this;
        },

        /**
         * 隐藏窗口
         * @public
         * @return {Dialog}
         */
        hide: function () {
            this.set('visible', false);
            if (this.hideDispose) {
                this.dispose();
            }
            return this;
        },

        /**
         * 添加一个按钮
         * @param {string} part 按钮标识, 例如: confirm/cancel
         * @param {string} text 按钮文字
         * @return {Element}
         */
        addFooterButton: function (part, text) {
            var buttons = this.buttons || [];
            this.set(
                'buttons',
                buttons.concat({
                    part: part,
                    text: text
                })
            );
            return this;
        },

        /**
         * 获取一个按钮
         * @param  {string} part 按钮标识
         * @return {Element}
         */
        getFooterButton: function (part) {
            return this.helper.getPart(part);
        },

        /**
         * 销毁，注销事件，解除引用
         *
         * @public
         * @fires module:Dialog#dispose
         * @fires module:Dialog#beforedispose
         */
        dispose: function () {

            /**
             * @event module:Dialog#dispose
             */
            this.$parent('dispose');

            this.undelegate(this.main, 'click', this._onMainClicked);
            $(this.main).remove();

            // 销毁遮罩
            if (this.mask) {
                this.mask.dispose();
            }

        }
    });

    /**
     * 对话框的遮罩层管理类
     *
     * @type {Mask}
     */
    Dialog.Mask = Mask;

    Dialog.DEFAULT_ALERT_OPTIONS = {
        title: '警告',
        close: false,
        skin: 'alert',
        buttons: [{
            part: 'confirm',
            text: '确认'
        }],
        hideDispose: true,
        maskClickClose: false
    };

    /**
     * 警告窗口
     * @param  {Ojbect} options 参数
     * @return {Promise} 当用户点击了ok时, 此promise会被`resolve`
     */
    Dialog.alert = function (options) {

        var dialog = new Dialog(
            lib.extend(
                {},
                Dialog.DEFAULT_ALERT_OPTIONS,
                options
            )
        );

        var defer = new $.Deferred();

        dialog
            .render()
            .on('buttonclick', function (e) {
                if (e.part === 'confirm') {
                    defer.resolve();
                    this.hide();
                }
            })
            .show();

        return defer.promise();
    };

    Dialog.DEFAULT_CONFIRM_OPTIONS = {
        title: '请确认',
        close: false,
        skin: 'confirm',
        buttons: [{
            text: '确认',
            part: 'confirm'
        }, {
            text: '取消',
            part: 'cancel'
        }],
        hideDispose: true,
        maskClickClose: false
    };

    /**
     * 确认窗口
     * @param  {Object} options 窗口参数
     * @return {Promise}
     */
    Dialog.confirm = function (options) {

        var dialog = new Dialog(
            lib.extend(
                {},
                Dialog.DEFAULT_CONFIRM_OPTIONS,
                options
            )
        );

        var defer = new $.Deferred();

        dialog
            .render()
            .on('buttonclick', function (e) {
                var part = e.part;
                var result = part === 'confirm' ? 'resolve' : 'reject';
                defer[result](part);
                this.hide();
            })
            .show();

        return defer.promise();

    };

    return Dialog;
});
