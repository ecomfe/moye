/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 控件基类
 * @author chris(wfsr@foxmail.com)
 */

define(function (require) {

    var lib = require('./lib');

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

            lib.forIn(provider, function (fn, name) {
                if (/^on[A-Z]/.test(name)) {
                    bound[name] = lib.bind(fn, me);
                }
            });

            this._bound = bound;
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
                this.bindEvents(this.binds);
            }
            if (this.init) {
                this.init(options);
                this.init = null;
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
         * @see lib.q
         * @param {string} className 元素的class，只能指定单一的class，
         * 如果为空字符串或者纯空白的字符串，返回空数组。
         * @return {Array} 获取的元素集合，查找不到或className参数错误时返回空数组
         * @public
         */
        query: function (className) {
            return lib.q(className, this.main);
        },
        
        /**
         * 创建一个元素，并设置属性
         * 
         * @param {string} tagName 标签名
         * @param {Object=} properties 标签属性
         * @return {HTMLElement} 创建后的元素
         */
        createElement: function (tagName, properties) {
            tagName = tagName || 'div';
            var element = document.createElement(tagName);

            for (var prop in properties) {
                element.setAttribute(prop, properties[prop]);
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
