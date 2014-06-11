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

    var LIFE_CYCLE = {
        NEW: 0,
        INITED: 1,
        RENDERED: 2,
        DISPOSED: 4
    };

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
         * 控件初始化
         * 
         * @param {Object} options 配置参数
         * @protected
         */
        initialize: function (options) {

            var me = this;

            me.changeStage('NEW');
            me.currentStates = {};

            options = me.setOptions(options);

            /**
             * 控件的主元素
             *
             * @type {HTMLElement}
             * @protected
             * @readonly
             */
            me.main = options.main ? options.main : document.createElement('div');

            if (options.hasOwnProperty('skin')) {
                me.skin = options.skin;
            }

            if (options.hasOwnProperty('states')) {
                me.states = options.states;
            }

            if (options.hasOwnProperty('id')) {
                me.id = options.id;
            }

            delete options.id;
            delete options.skin;

            if (me.init) {
                me.init(options);
                me.init = null;
            }

            me.children = [];

            me.changeStage('INITED');
        },


        /**
         * 渲染控件
         * 
         * @return {module:Control} 当前实例
         * @abstract
         * @protected
         */
        render: function () {
            var me = this;

            if (me.isInStage('INITED')) {

                me.initStructure();
                me.initEvents();

                // 为控件主元素添加id
                if (!me.main.id) {
                    me.main.id = lib.getId(me);
                }

                lib.addPartClasses(me);

                if (me.states) {
                    for (var i = me.states.length - 1; i >= 0; i--) {
                        me.addState(me.states[i]);
                    };
                }

                if (me.plugins) {
                    for (var i = 0, len = me.plugins.length; i < len; i++) {
                        me.plugins[i].execute(me);
                    }
                }

            }

            // 由子控件实现
            me.repaint();

            if (me.isInStage('INITED')) {
                // 切换控件所属生命周期阶段
                me.changeStage('RENDERED');
            }

            return me;

        },
                
        /**
         * 初始化DOM结构
         * 
         * @abstract
         * @return {Control} self
         */
        initStructure: function () {
            return this;
        },

        /**
         * 初始化事件绑定
         * 
         * @return {Control} self
         */
        initEvents: function () {
            if (this.binds) {
               this.bindEvents(this.binds);
            }
            return this;
        },

        /**
         * 重绘视图
         * 
         * @abstract
         * @return {Control} self
         */
        repaint: function () {},

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
         * @deprecated
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
         * @deprecated
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
         * 增加状态
         * 
         * @param {string} state 状态
         * @fires module:Control#statechange
         * @return {Control} self
         */
        addState: function (state) {

            var me = this;

            if (me.hasState(state)) {
                return me;
            }

            me.currentStates[state] = true;
            lib.addStateClasses(me, state);

            me.fire('statechange', {
                state: state,
                action: 'add'
            });

            return me;
        },

        /**
         * 移除状态
         * 
         * @param {string} state 状态
         * @fires module:Control#statechange
         * @return {Control} self
         */
        removeState: function (state) {
            var me = this;

            if (!me.hasState(state)) {
                return me;
            }

            me.currentStates[state] = false;
            lib.removeStateClasses(me, state);
            
            me.fire('statechange', {
                state: state,
                action: 'remove'
            });

            return me;
        },

        /**
         * 判断控件是否处于指定状态
         *
         * @param {string} state 状态名
         * @return {boolean}
         */
        hasState: function (state) {
            return !!this.currentStates[state];
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
        },

        /**
         * 判断控件是否处于相应的生命周期阶段
         * 
         * @param {string} stage 生命周期阶段
         * @return {boolean}
         */
        isInStage: function (stage) {
            if (LIFE_CYCLE[stage] == null) {
                throw new Error('Invalid life cycle stage: ' + stage);
            }
            return this.stage === LIFE_CYCLE[stage];
        },

        /**
         * 改变控件的生命周期阶段
         * 
         * @param {string} stage 生命周期阶段
         * @return {SELF}
         */
        changeStage: function (stage) {
            if (LIFE_CYCLE[stage] === null) {
                throw new Error('Invalid life cycle stage: ' + stage);
            }
            this.stage = LIFE_CYCLE[stage];
            return this;
        },

        /**
         * 使用插件
         * 
         * @public
         * @param {Plugin} plugin 插件
         */
        use: function (plugin) {
            var me = this;
            var plugins = me.plugins;

            // 存入队列
            if (!me.plugins) {
                plugins = me.plugins = [];
            }

            plugins.push(plugin);

            // 如果控件已经渲染过了，那么直接执行插件
            // 否则控件会在渲染时，执行插件
            if (me.isInStage('RENDERED')) {
                plugin.execute(me);
            }

            return me;
        }

    }).implement(lib.observable).implement(lib.configurable);

    return Control;
});
