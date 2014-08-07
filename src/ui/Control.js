/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 控件基类
 * @author chris(wfsr@foxmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');

    var guid = 0;

    /**
     * 控件基类
     *
     * 只可继承，不可实例化
     *
     * @requires lib
     * @exports Control
     */
    var Control = lib.newClass(/** @lends module:Control.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @readonly
         * @public
         */
        type: 'Control',

        /**
         * 控件可用状态
         *
         * @type {boolean}
         * @private
         */
        _disabled: false,


        /**
         * 将事件方法绑定 this
         *
         * @param {Object.<string, Function>} provider 提供事件方法的对象
         * @protected
         */
        bindEvents: function (provider) {
            var me = this;
            var bound = this._bound || {};

            $.each(provider, function (name, fn) {
                if (/^on[A-Z]/.test(name)) {
                    bound[name] = $.proxy(fn, me);
                }
            });

            this._bound = bound;
        },

        /**
         * 将DOM元素element的eventName事件处理函数handler的作用域绑定到当前Control实例
         * 
         * 每个handler的代理函数都会被缓存，并重复利用。
         * 但element/eventName并不会被区别对待。
         * 也就是说，如果handler是同一函数，那么会使用之前生成的代理函数。
         * 
         * @protected
         * @param {HTMLElement} element 事件来源HTMLElement
         * @param {string} eventName 事件类型
         * @param {[type]} handler 事件处理函数
         * @return {Control} SELF
         */
        delegate: function (element, eventName, handler) {

            var cached = this._delegation;

            // 初始化缓存池
            if (!cached) {
                cached = this._delegation = {};
            }

            var guid = handler.guid;

            // 函数代理
            var proxy;

            // 如果缓存的proxy函数存在，那么直接使用缓存的
            if (guid && cached[guid]) {
                proxy = cached[guid].proxy;
            }
            // 否则新生成一个代理函数
            else {
                proxy = $.proxy(handler, this);
                guid = handler.guid;
            }

            var handleObj = cached[guid];

            // 写缓存
            if (!cached[guid]) {
                handleObj = cached[guid] = {
                    total: 0
                };
            }

            handleObj.total++;
            handleObj.proxy = proxy;

            // 通过命名空间来保证$(element).off(xxx)可以正确地解除事件绑定
            // 如果不使用命名空间，$(element).off(xxx)会把所有的处理函数全都取消掉
            // 这里第一级是eventName，第二级是Control实例id，第三级是代理函数id
            var fullEventName = eventName + '.' + this.guid + '.' + guid;

            // 绑定事件
            $(element).on(fullEventName, proxy);

            return this;
        },

        /**
         * 取消一个代理
         * 
         * @protected
         * @param {HTMLElement} element 事件来源HTMLElement
         * @param {string} eventName 事件类型
         * @param {[type]} handler 事件处理函数
         * @return {Control} SELF
         */
        undelegate: function (element, eventName, handler) {

            var cached = this._delegation;
            var guid = handler.guid;

            // 我们的代理函数缓存在缓存池中
            // 如果缓存池中没有代理函数，直接返回
            if (
                // 整个缓存池为空
                !cached 
                // 我们的代理过的handler一定会有guid，没有guid就无法位置缓存
                // 如果handler.guid为空，就直接返回
                || !guid
                // 代理函数不存在 -- 这个应该不会发生的。。。
                || !cached[guid]
            ) {
                return this;
            }

            // 通过命名空间来保证$(element).off(xxx)可以正确地解除事件绑定
            // 如果不使用命名空间，$(element).off(xxx)会把绑定的所有代理函数全都取消掉
            // 这里第一级是eventName，第二级是Control实例id，第三级是代理函数id
            var fullEventName = eventName + '.' + this.guid + '.' + guid;
            var handleObj = cached[guid];
            var proxy = handleObj.proxy;

            // 计数减1
            handleObj.total--;

            // 解绑事件
            $(element).off(fullEventName, proxy);

            // 清洗缓存对象
            if (!handleObj.total) {
                delete cached[guid];
            }

            // 如果缓存池为空，那么清除缓存池
            if ($.isEmptyObject(cached)) {
                delete this._delegation;
            }

            return this;
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 配置参数
         * @protected
         */
        initialize: function (options) {

            options = this.setOptions(options);

            if (this.binds) {
                lib.binds(this, this.binds);
            }

            if (this.init) {
                this.init(options);
                this.init = null;
            }

            // 强制添加guid
            if ($.type(this.id) === 'undefined') {
                this.id = guid++;
            }

            this.children = [];
        },


        /**
         * 渲染控件
         *
         * @return {module:Control} 当前实例
         * @abstract
         * @protected
         */
        render: function () {
            throw new Error('not implement render');
        },

        /**
         * 将控件添加到页面的某个元素中
         *
         * @param {HTMLElement} wrap 被添加到的页面元素
         * @public
         */
        appendTo: function (wrap) {
            this.main = wrap || this.main;
            this.render();
        },

        /**
         * 通过 className 查找控件容器内的元素
         *
         * @param {string} className 元素的class，只能指定单一的class，
         * 如果为空字符串或者纯空白的字符串，返回空数组。
         * @return {Array} 获取的元素集合，查找不到或className参数错误时返回空数组
         * @public
         */
        query: function (className) {
            return $('.' + className, this.main).toArray();
        },

        /**
         * 创建一个元素，并设置属性
         *
         * @param {string} tagName 标签名
         * @param {Object=} properties 标签属性
         * @deprecated
         * @return {HTMLElement} 创建后的元素
         */
        createElement: function (tagName, properties) {
            var element = document.createElement(tagName || 'div');
            for (var prop in properties) {
                element[prop] = properties[prop];
            }
            return element;
        },

        /**
         * 设置控件状态为禁用
         *
         * @fires module:Control#disable
         * @public
         */
        disable: function () {
            this._disabled = true;

            /**
             * @event module:Control#disable
             */
            this.fire('disable');
        },

        /**
         * 设置控件状态为启用
         *
         * @fires module:Control#enable
         * @public
         */
        enable: function () {
            this._disabled = false;

            /**
             * @event module:Control#enable
             */
            this.fire('enable');
        },

        /**
         * 获取控件可用状态
         *
         * @return {boolean} 控件的可用状态值
         * @public
         */
        isDisabled: function () {
            return this._disabled;
        },


        /**
         * 添加子控件
         *
         * @param {module:Control} control 控件实例
         * @param {string} name 子控件名
         * @public
         */
        addChild: function (control, name) {
            var children = this.children;

            name = name || control.childName;

            if (name) {
                children[name] = control;
            }

            children.push(control);
        },

        /**
         * 移除子控件
         *
         * @param {module:Control} control 子控件实例
         * @public
         */
        removeChild: function (control) {
            var children = this.children;
            for (var name in children) {
                if (children.hasOwnProperty(name)) {
                    if (children[name] === control) {
                        delete this[name];
                    }
                }
            }
        },

        /**
         * 获取子控件
         *
         * @param {string} name 子控件名
         * @return {module:Control} 获取到的子控件
         * @public
         */
        getChild: function (name) {
            return this.children[name];
        },

        /**
         * 批量初始化子控件
         *
         * @param {HTMLElement} wrap 容器DOM元素
         * @public
         */
        initChildren: function (wrap) {
            throw new Error('not implement initChildren');
        },

        /**
         * 销毁控件
         *
         * @fires module:Control#dispose
         * @public
         */
        dispose: function () {

            var child;
            while ((child = this.children.pop())) {
                child.dispose();
            }

            for (var type in this._listners) {
                this.un(type);
            }

            var main = this.main;
            if (main && main.parentNode) {
                main.parentNode.removeChild(main);
                delete this.main;
            }

            /**
             * @event module:Control#dispose
             */
            this.fire('dispose');
        }

    }).implement(lib.observable).implement(lib.configurable);

    return Control;
});
