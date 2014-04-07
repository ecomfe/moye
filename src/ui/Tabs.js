/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 
 * @file 选项卡组件
 * @author chris(wfsr@foxmail.com)
 */
 
define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');
    
    /**
     * 私有函数或方法
     * 
     * @type {Object}
     * @namespace
     * @name module:Tabs~privates
     */
    var privates = /** @lends module:Tabs~privates */ {

        /**
         * 点击事件处理
         * 
         * @param {?Event} e DOM 事件对象
         * @fires module:Tabs#change
         * @private
         */
        onClick: function (e) {
            var main = this.main;
            var options = this.options;

            var target = lib.getTarget(e);
            if (target.tagName !== 'LI') {
                target = lib.getAncestorBy(
                    target,
                    function (el) {

                        // 最高访问到控件根容器, 避免到文档根节点
                        return el.tagName === 'LI' || el === main;
                        
                    }
                );
                
                if (target === main) {
                    return;
                }
            }

            var selectedClass = options.prefix + '-selected';
            var hasSelected = lib.hasClass(target, selectedClass);
            var index = target.getAttribute('data-index') | 0;
            if (hasSelected
                || this.onBeforeChange(this.selectedIndex, index) === false
            ) {
                return;
            }

            var labels = this.labels;
            lib.removeClass(labels[this.selectedIndex], selectedClass);
            lib.addClass(labels[index], selectedClass);

            var selectedLabel = labels[index];

            /**
             * @event module:Tabs#change
             * @type {Object}
             * @property {HTMLElement} selected 选中选项卡
             * @property {number} oldIndex 旧的选中选项卡索引值
             * @property {number} newIndex 新的选中选项卡索引值
             */
            this.fire(
                'change',
                {
                    selected: selectedLabel,
                    oldIndex: this.selectedIndex,
                    newIndex: index
                }
            );
            this.selectedIndex = index;
            
        }
    };

    /**
     * 选项卡组件
     * 
     * @constructor
     * @extends module:Control
     * @requires Control
     * @exports Tabs
     */
    var Tabs = Control.extend(/** @lends module:Tabs.prototype */{

        /**
         * 控件类型标识
         * 
         * @type {string}
         * @private
         */
        type: 'Tabs',

        /**
         * 控件配置项
         * 
         * @name module:Tabs#options
         * @type {Object}
         * @property {boolean} options.disabled 控件的不可用状态
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
         * @property {number} selectedIndex 默认选中项的索引值
         * @private
         */
        options: {

            // 提示框的不可用状态，默认为false。处于不可用状态的提示框不会出现。
            disabled: false,

            // 控件渲染主容器
            main: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-tabs',

            // 默认选中项
            selectedIndex: 0
        },

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:Tabs#options
         * @private
         */
        init: function (options) {
            this.main = lib.g(options.main);
            this.labels = lib.q(options.prefix + '-labels', this.main)[0];
            this.selectedIndex = options.selectedIndex | 0;

            this.bindEvents(privates);
        },


        /**
         * 绘制控件
         * 
         * @public
         */
        render: function () {
            var options = this.options;

            if (!this.rendered) {
                this.rendered = true;

                // 先给选项卡父容器添加事件监听
                lib.on(this.labels, 'click', this._bound.onClick);

                // 找出所有选项卡
                var labels =
                    lib.toArray(this.labels.getElementsByTagName('li'));

                // 是否支持伪元素
                var noPseudoElement = lib.browser.ie6;
                lib.each(
                    labels,
                    function (label, i) {
                        // 自动加上索引标识
                        label.setAttribute('data-index', i);

                        // 对于不支持伪元素的 ie6，自动插入一个 <i> 标签
                        // TODO: innerHTML vs dom clone
                        if (noPseudoElement) {
                            label.innerHTML += '<i></i>';
                        }
                    }
                );

                var selectedClass = options.prefix + '-selected';
                var selectedLabel = lib.q(selectedClass, this.labels)[0];

                this.labels = labels;

                if (selectedLabel) {
                    this.selectedIndex = 
                        selectedLabel.getAttribute('data-index') | 0;
                }
                else {
                    selectedLabel = labels[this.selectedIndex];
                    selectedLabel && lib.fire(selectedLabel, 'click');
                }

            }

            return this;
        },

        /**
         * 切换选项卡前判定
         * 
         * 主要用于业务逻辑判断是否允许切换选项卡，默认允许，不允许则需要明确返回 false
         * 
         * @param {number} oldIndex 原选中项索引值
         * @param {number} newIndex 新选中项索引值
         * @return {boolean} 是否允许切换
         * @public
         */
        /* jshint unused:false */
        onBeforeChange: function (oldIndex, newIndex) {
            return true;
        }


    });

    return Tabs;
});
