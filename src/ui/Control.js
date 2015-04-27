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
    var main = require('./main');
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
         * 控件处于某些状态时, 忽略其某些交互
         * TODO 暂时无用
         * @type {Array}
         */
        ignoreStates: ['disable'],

        /**
         * 将DOM元素element的eventName事件处理函数handler的作用域绑定到当前Control实例
         * @return {Control} SELF
         */
        delegate: function (/*element, eventName, selectors, data, handler*/) {
            var helper = this.helper;
            helper.delegate.apply(helper, arguments);
            return this;
        },

        /**
         * 取消一个代理
         * @return {Control} SELF
         */
        undelegate: function (/*element, eventName, selector, handler*/) {
            var helper = this.helper;
            helper.undelegate.apply(helper, arguments);
            return this;
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 配置参数
         * @protected
         */
        initialize: function (options) {

            var helper = this.helper = new Helper(this);

            helper.changeStage('NEW');
            this.currentStates = {};

            options = options || {};

            // 处理配置参数中, 以onXxx开头的事件绑定
            // 这里会把这一类的事件绑定参数给清除掉, 后边init时不会有这些参数的干扰
            // {@link Module:lib#configurable.bindEvents}
            this.bindEvents(options);

            // 调用init接口, 进行参数的初始化
            this.init(options);

            /**
             * 控件的主元素
             *
             * @type {HTMLElement}
             * @protected
             * @readonly
             */
            this.main = this.main ? lib.g(this.main) : this.createMain();
            this.id   = this.id || lib.guid();

            if (this.hasOwnProperty('states')) {
                var states = this.states;
                if (lib.isString(states)) {
                    this.states = [states];
                }
            }

            if (this.hasOwnProperty('skin')) {
                var skin = this.skin;
                if (lib.isString(skin)) {
                    this.skin = [skin];
                }
            }

            // 初始化上下文
            helper.initContext();
            // 子控件容器
            this.children = [];
            this.childrenIndex = {};
            helper.initPlugins();
            helper.changeStage('INITED');
        },

        /**
         * 初始化参数
         *
         * 可以帮你把原型上的options和传递进来的参数自动合并到控件实例上
         *
         * @param {Object} options 参数
         */
        init: function (options) {
            if (!this.helper.isInStage('NEW')) {
                return;
            }
            this.setOptions(options);
        },


        /**
         * 渲染控件
         *
         * @return {module:Control} 当前实例
         * @protected
         */
        render: function () {

            if (this.helper.isInStage('INITED')) {

                /**
                 * @event beforerender
                 *
                 * 开始初次渲染
                 */
                this.fire('beforerender');

                this.initStructure();
                this.initEvents();

                // 为控件主元素添加id
                $(this.main).attr(
                    main.getConfig('instanceAttr'),
                    this.id
                );

                this.helper.addPartClasses();

                if (this.states && this.states.length) {
                    for (var i = this.states.length - 1; i >= 0; i--) {
                        this.addState(this.states[i]);
                    }
                }

            }

            // 由子控件实现
            this.repaint();

            if (this.helper.isInStage('INITED')) {

                // 切换控件所属生命周期阶段
                this.helper.changeStage('RENDERED');

                /**
                 * @event afterrender
                 *
                 * 结束初次渲染
                 */
                this.fire('afterrender');
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
         * @param {Array.string} changes 发生变化的属性名们
         * @param {Object} changesIndex 发生变化的属性名和属性值
         * @return {Control}
         */
        repaint: function (changes, changesIndex) {

            if (this.helper.isInStage('INITED')) {

                // 常用几个与状态相关的属性，直接在这里给转化成状态
                // 禁用状态
                if (this.disabled) {
                    this.disable();
                    delete this.disabled;
                }

                // 隐藏状态
                if (this.hidden) {
                    this.hide();
                    delete this.hidden;
                }

                // 只读状态(必须是输入控件才搞一下)
                if (lib.isFunction(this.getValue)) {
                    this.setReadOnly(!!this.readOnly);
                    delete this.readOnly;
                }

            }

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

            return changesIndex;
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
         * @return {Control}
         * @public
         */
        appendTo: function (wrap) {
            if (this.helper.isInStage('INITED')) {
                this.render();
            }
            wrap.appendChild(this.main);
            return this;
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
            this.helper.addStateClasses(state);

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
            this.helper.removeStateClasses(state);

            me.fire('statechange', {
                state: state,
                action: 'remove'
            });

            return me;
        },

        toggleState: function (state) {
            this.hasState(state)
                ? this.removeState(state)
                : this.addState(state);
            return this;
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

        show: function () {
            return this.removeState('hidden');
        },

        hide: function () {
            return this.addState('hidden');
        },

        toggle: function () {
            return this.toggleState('hidden');
        },

        /**
         * 设置控件状态为禁用
         *
         * @fires module:Control#disable
         * @public
         */
        disable: function () {

            this.addState('disabled');

            // 顺手把子控件也给禁用了
            this.helper.disableChildren();

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

            this.removeState('disabled');

            // 顺手把子控件也给启用了
            this.helper.enableChildren();
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
            return this.hasState('disabled');
        },

        /**
         * 是否为只读状态
         * @return {boolean}
         */
        isReadOnly: function () {
            return this.hasState('readonly');
        },

        setReadOnly: function (isReadOnly) {
            if (isReadOnly) {
                this.addState('readOnly');
            }
            else {
                this.removeState('readOnly');
            }
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
            var childrenIndex = this.childrenIndex;

            var oldParent = control.getParent();

            if (oldParent) {
                oldParent.removeChild(control);
            }

            control.setParent(this);

            name = name || control.childName;

            if (name) {
                childrenIndex[name] = control;
            }

            // 把子控件塞到父控件的上下文中
            control.setContext(this.context);

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
            var childrenIndex = this.childrenIndex;

            for (var i = children.length - 1; i >= 0; i--) {
                if (children[i] === control) {
                    children.splice(i, 1);
                }
            }

            var name = control.childName;

            delete childrenIndex[name];

            control.setParent(null);
        },

        /**
         * 获取子控件
         *
         * @param {string} name 子控件名
         * @return {module:Control} 获取到的子控件
         * @public
         */
        getChild: function (name) {
            return this.childrenIndex[name];
        },

        /**
         * 设置父控件
         * @param {Control} parent 父控件
         * @return {Control}
         */
        setParent: function (parent) {
            this.parent = parent;
            return this;
        },

        /**
         * 获取父控件
         * @return {Control}
         */
        getParent: function () {
            return this.parent;
        },

        /**
         * 批量初始化子控件
         *
         * @param {HTMLElement} wrap 容器DOM元素
         * @public
         */
        initChildren: function () {
            this.helper.initChildren();
        },

        setContext: function (context) {

            var currentContext = this.context;

            if (context === currentContext) {
                return;
            }

            if (currentContext) {
                this.context.remove(this);
            }

            context.add(this);

            $(this.main).attr(
                main.getConfig('contextAttr'),
                context.id
            );

            this.context = context;
        },

        /**
         * 销毁控件
         *
         * @fires module:Control#dispose
         * @public
         */
        dispose: function () {

            this.fire('beforedispose');

            // 销毁插件
            this.helper.disposePlugins();

            // 销毁子控件
            // {@link Module:helper/children.disposeChildren()}
            this.helper.disposeChildren();

            // 销毁事件池
            // {@link Module:lib/interface/obserable.destroyEvents()}
            this.destroyEvents();

            // 更新状态
            this.helper.changeStage('DISPOSED');

            /**
             * @event module:Control#afterdispose
             */
            this.fire('afterdispose');
        },

        /**
         * 销毁控件并移除main元素
         */
        destroy: function () {
            this.dispose();
            if (this.main) {
                $(this.main).remove();
                this.main = null;
            }
        },

        /**
         * 使用插件
         *
         * @public
         * @param {Plugin} plugin 插件
         * @return {Control}
         */
        use: function (plugin) {
            var plugins = this.plugins;

            // 存入队列
            if (!this.plugins) {
                plugins = this.plugins = [];
            }

            plugin = this.helper.createPluginInstance(plugin);

            plugins.push(plugin);

            // 如果控件已经渲染过了，那么直接执行插件
            // 否则控件会在渲染时，执行插件
            if (!this.helper.isInStage('NEW')) {
                plugin.activate(this);
            }

            return this;
        }

    }).implement(lib.observable).implement(lib.configurable);

    return Control;
});
