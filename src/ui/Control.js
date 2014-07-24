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
    var Helper = require('./Helper');

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
         * 缓存被代理后的事件处理函数
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

            this.helper = new Helper(this);

            this.helper.changeStage('NEW');
            this.currentStates = {};

            options = this.setOptions(options);

            /**
             * 控件的主元素
             *
             * @type {HTMLElement}
             * @protected
             * @readonly
             */
            this.main   = options.main ? lib.g(options.main) : this.createMain();
            this.id     = options.hasOwnProperty('id') ? options.id : lib.guid();
            this.skin   = options.hasOwnProperty('skin') ? options.skin : [];
            this.states = options.hasOwnProperty('states') ? options.states : [];

            delete options.id;
            delete options.skin;
            delete options.states;

            if (this.init) {
                this.init(options);
                this.init = null;
            }

            this.children = [];

            this.helper.changeStage('INITED');
        },


        /**
         * 渲染控件
         * 
         * @return {module:Control} 当前实例
         * @abstract
         * @protected
         */
        render: function () {

            if (this.helper.isInStage('INITED')) {

                this.initStructure();
                this.initEvents();

                // 为控件主元素添加id
                $(this.main).attr('data-ui-id', this.helper.getPartId());

                this.helper.addPartClasses();

                if (this.states) {
                    for (var i = this.states.length - 1; i >= 0; i--) {
                        this.addState(this.states[i]);
                    };
                }

                if (this.plugins) {
                    for (var i = 0, len = this.plugins.length; i < len; i++) {
                        this.plugins[i].execute(this);
                    }
                }

            }

            // 由子控件实现
            this.repaint();

            if (this.helper.isInStage('INITED')) {
                // 切换控件所属生命周期阶段
                this.helper.changeStage('RENDERED');
            }

            return this;

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
            return this;
        },

        /**
         * 重绘视图
         * 
         * @abstract
         * @return {Control} self
         */
        repaint: function (changes, changesIndex) {
            return this;
        },

        /**
         * 设置属性值
         * 
         * 当设定的属性值与当前值不一致时，会触发repaint动作
         * 
         * @param {string} name 属性名
         * @param {*} value 属性值
         * @return {Control} SELF
         */
        set: function (name, value) {

            var properties;

            // 处理重载
            if (lib.isObject(name)) {
                properties = name;
            }
            else {
                properties = {};
                properties[name] = value;
            }

            // 如果不在RENDERED状态，直接赋值
            if (!this.helper.isInStage('RENDERED')) {
                $.extend(this, properties);
                return this;
            }

            // 如果在RENDERED状态，检测属性值变化
            var changes = [];
            var changesIndex = {};

            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var newValue = properties[key];
                    var oldValue = this[key];
                    var isChanged = this.isPropertyChanged(key, newValue, oldValue);

                    if (isChanged) {
                        this[key] = newValue;
                        var record = {
                            name: key,
                            oldValue: oldValue,
                            newValue: newValue
                        };
                        changes.push(record);
                        changesIndex[key] = record;
                    }
                }
            }

            // 如果有变化，那么触发repaint
            if (changes.length) {
                this.repaint(changes, changesIndex);
            }

            return this;
        },

        /**
         * 返回属性值
         * 
         * @param {string} name 属性名
         * @return {*} 属性值
         */
        get: function (name) {
            return this[name];
        },

        /**
         * 判断一个属性是否发生了变化
         * 
         * 默认算法就是判断是否完全相等
         * 
         * @protected
         * @param {string} name 属性名
         * @param {*} newValue 原属性值
         * @param {*} oldValue 新属性值
         * @return {boolean}
         */
        isPropertyChanged: function (name, newValue, oldValue) {
            return newValue !==  oldValue;
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
         * @deprecated
         * @see lib.q
         * @param {string} className 元素的class，只能指定单一的class，
         * 如果为空字符串或者纯空白的字符串，返回空数组。
         * @return {Array} 获取的元素集合，查找不到或className参数错误时返回空数组
         * @public
         */
        query: function (className) {
            return $('.' + className, this.main).toArray();
        },
        
        /**
         * 创建主素
         * 
         * 如果在options中不指定主元素，那么会自动生成一个div元素作为其主元素。
         * 子类可以覆盖此方法来重写
         * 
         * @protected
         * @return {HTMLElement} 创建后的元素
         */
        createMain: function () {
            return document.createElement('div');
        },

        /**
         * 增加状态
         * 
         * @param {string} state 状态
         * @fires module:Control#statechange
         * @return {Control} self
         */
        addState: function (state) {

            if (this.hasState(state)) {
                return this;
            }

            this.currentStates[state] = true;
            lib.addStateClasses(this, state);

            this.fire('statechange', {
                state: state,
                action: 'add'
            });

            return this;
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
         * 使用插件
         * 
         * @public
         * @param {Plugin} plugin 插件
         */
        use: function (plugin) {
            var plugins = this.plugins;

            // 存入队列
            if (!this.plugins) {
                plugins = this.plugins = [];
            }

            plugins.push(plugin);

            // 如果控件已经渲染过了，那么直接执行插件
            // 否则控件会在渲染时，执行插件
            if (this.helper.isInStage('RENDERED')) {
                plugin.execute(this);
            }

            return this;
        }

    }).implement(lib.observable).implement(lib.configurable);

    return Control;
});
