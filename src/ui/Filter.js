/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 条件过滤器
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
     * @name module:Filter~privates
     */
    var privates = /** @lends module:Filter~privates */ {

        /**
         * 处理选单点击事件
         * 
         * @param {Event} e 事件源对象
         * @fires module:Filter#change
         * @fires module:Filter#click
         * @private
         */
        onClick: function (e) {

            /**
             * @event module:Filter#click
             * @type {object}
             * @property {Event} event 事件源对象
             */
            this.fire('click', {event: e});

            var target = lib.getTarget(e);
            if (target.type) {

                // HACK: 如果点击的是 单选按钮，先置为非选中状态
                if (target.type === 'radio') {
                    target.checked = false;
                }
                
                target = target.parentNode;
            }

            var options = this.options;
            var checkedClass = options.checkedClass;
            var disabledClass = options.disabledClass;

            var input = target.getElementsByTagName('input')[0];
            var isRadio = input && input.type === 'radio';
            var hasClass = lib.hasClass;
            if (target.tagName === 'LABEL'

                // 忽略禁止状态的选项
                && !hasClass(target, disabledClass)

                // 单选组的第一个选项已选中时的点击忽略
                && !(isRadio && input.checked)
            ) {
                // 防止在 label 外 mouseup 导致 radio/checkbox 未选中
                var isChecked = isRadio
                    ? true
                    : !hasClass(target, checkedClass);

                lib.preventDefault(e);

                var group = this.groups[input.name];
                var checkedItems = lib.q(checkedClass, group);
                if (isRadio) {
                    var lastChecked = lib.q(checkedClass, group)[0];

                    if (lastChecked) {
                        lib.removeClass(lastChecked, checkedClass);
                    }
                }
                else {

                    // 第一个选项（通常叫”不限“或”全部“)的选择具有排他性
                    var firstItem = group.getElementsByTagName('input')[0];
                    if (input === firstItem) {

                        // 当单选按钮处理，选择状态不可切换
                        if (input.checked) {
                            input.checked = true;
                            return;
                        }

                        lib.each(
                            checkedItems,
                            function (item) {
                                lib.removeClass(item, checkedClass);

                                item.getElementsByTagName(
                                    'input'
                                )[0].checked = false;
                            }
                        );                        
                    }
                    else if (firstItem.checked) {
                        firstItem.checked = false;
                        lib.removeClass(firstItem.parentNode, checkedClass);
                    }
                }

                input.checked =  isChecked;

                // HACK: 当点击单/复选框时会导致两次状态变换
                setTimeout(function () {
                    input.checked =  isChecked;
                }, 0);

                var operation = isChecked ? 'addClass' : 'removeClass';
                lib[operation](target, checkedClass);

                var checkedData = isRadio
                    ? {key: input.name, value: [input.value]}
                    : this.getData(input.name);

                // 比较状态变化
                var newValue = checkedData.value.join(',');
                var propertyName = 'data-value';
                if (group.getAttribute(propertyName) !== newValue) {
                    group.setAttribute(propertyName, newValue);

                    /**
                     * @event module:Filter#change
                     * @type {Object}
                     * @property {string} key 过滤项的键名
                     * @property {Array.<string>} value 当前选项组的选中值
                     */
                    this.fire('change', checkedData);
                }
            }
        }
    };

    /**
     * 条件过滤器
     * 
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Filter
     * @example
     * var map = {
     *     '1': [2, 3, 5],
     *     '2': [1, 2, 4]
     * }
     *
     * new Filter({
     *   prefix: 'ecl-ui-filter',
     *   main: me.qq('ecl-ui-filter'),
     *   groups: 'p',
     *   
     *   onChange: function (e) {
     *      
     *     // load data
     *
     *     // disable or enable items
     *     if (e.key === 'type') {
     *         var value = e.value[0];
     *
     *         if (map[value]) {
     *             this.disableItems('special', map[value]);
     *         }
     *         else {
     *             this.enableItems('special');
     *         }
     *     }
     *   }
     *
     * }).render();
     */
    var Filter = Control.extend(/** @lends module:Filter.prototype */{


        /**
         * 控件类型标识
         * 
         * @type {string}
         * @override
         * @private
         */
        type: 'Filter',

        /**
         * 控件配置项
         * 
         * @name module:Filter#options
         * @type {Object}
         * @property {boolean} options.disabled 控件的不可用状态
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
         * @private
         */
        options: {

            // 提示框的不可用状态，默认为false。处于不可用状态的提示框不会出现。
            disabled: false,

            // 控件渲染主容器
            main: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-filter',

            groups: 'p',

            checkedClass: 'checked',

            disabledClass: 'disabled'

        },

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:Filter#options
         * @private
         */
        init: function (options) {
            this.disabled  = options.disabled;

            this.main = options.main && lib.g(options.main);
            this.bindEvents(privates);
        },


        /**
         * 绘制控件
         * 
         * @param {(string= | HTMLElement=)} wrapper 作为组件根元素的DOM节点
         * @throws 如果控件根元素不存在将抛出异常
         * @return {module:Filter} 当前实例
         * @override
         * @public
         */
        render: function (wrapper) {
            var main    = wrapper && lib.g(wrapper) || this.main;
            var options = this.options;

            if (!main) {
                throw new Error('main not found!');
            }

            if (!this.rendered) {
                this.rendered = true;

                var groups = this.groups = {};

                lib.each(
                    main.getElementsByTagName(options.groups),
                    function (group) {

                        // 以第一个 input 标签的 name 作为 key
                        var key = group.getElementsByTagName('input')[0].name;
                        groups[key] = group;
                    }
                );

                lib.on(main, 'click', this._bound.onClick);
            }

            return this;
        },

        /**
         * 获取指定键名的当前选中项数据
         * 
         * @param {string} key 选择项键名
         * @return {Object} 返回指定键名的选中项数据
         * @public
         */
        getData: function (key) {
            var group = this.groups[key];
            var value = [];
            var data = {key: key, value: value};

            if (group) {

                var disabledClass = this.options.disabledClass;
                lib.each(
                    group.getElementsByTagName('input'),
                    function (input) {
                        if (input.checked
                            && !lib.hasClass(input.parentNode, disabledClass)
                        ) {
                            value.push(input.value);
                        }
                    }
                );
            }

            return data;
        },

        /**
         * 禁止指定选项组中指定值的项
         * 
         * @param {string} key 选项组键名
         * @param {Array.<string>} values 要禁止的指定项的值
         * @public
         */
        disableItems: function (key, values) {
            var options = this.options;
            var checkedClass = options.checkedClass;
            var disabledClass = options.disabledClass;
            var group = this.groups[key];
            var comma = ',';

            values = comma + values.join(comma) + comma;

            lib.each(
                group.getElementsByTagName('input'),
                function (input) {
                    var parentNode = input.parentNode;
                    if (~values.indexOf(comma + input.value + comma)) {
                        input.checked = false;
                        lib.removeClass(parentNode, checkedClass);
                        lib.addClass(parentNode, disabledClass);
                    }
                    else {
                        lib.removeClass(parentNode, disabledClass);
                    }
                }
            );
        },

        /**
         * 启用指定选项组
         * 
         * @param {string} key 选项组关键字
         * @public
         */
        enableItems: function (key) {
            var disabledClass = this.options.disabledClass;
            var group = this.groups[key];

            lib.each(
                lib.q(disabledClass, group),
                function (label) {
                    lib.removeClass(label, disabledClass);
                }
            );
        }


    });

    return Filter;
});
