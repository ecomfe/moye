/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 条件过滤器
 * @author chris(wfsr@foxmail.com)
 */

define(function (require) {

    var $ = require('jquery');
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

            var me = this;

            /**
             * @event module:Filter#click
             * @type {object}
             * @property {Event} event 事件源对象
             */
            me.fire('click', { event: e });

            var $target = $(e.target);
            var $input  = $target;                 // 这里先将$input默认设定为$target，后面会修正，可以减少一次DOM查找
            var tagName = $target.prop('tagName');
            var type    = $target.prop('type');

            // 如果点击的不是INPUT和LABEL那就忽略
            if (tagName !== 'LABEL' && tagName !== 'INPUT') {
                return;
            }

            // 如果直接点击了input，那么我们需要向上选择到它的父结点label
            if (tagName === 'INPUT') {

                // HACK: 如果点击的是 单选按钮，先置为非选中状态
                if (type === 'radio') {
                    $target.prop('checked', false);
                }

                // 向上选择到label一层
                $target = $target.parent();
            }
            else {

                // 当点击的元素是LABEL，那么要阻止默认。。。
                // 原理: 当label包含的for属性，或者label中包含中input时，
                // 当label被点击时，浏览器会自动触发一次input完整真实的click事件
                // 导致我们在外层监听的click监听事件处理函数被执行两次
                // 这里可以通过阻止默认事件，来阻止上边描述的事情
                // 但同时也阻止了浏览器对input状态的自动维护
                // 好在我们可以自己处理
                e.preventDefault();
                $input = $target.find('input');
            }

            var options = me.options;
            var checkedClass = options.checkedClass;
            var disabledClass = options.disabledClass;

            var isRadio = $input.attr('type') === 'radio';

            // 以下条件时，直接跳过，没有其他效果
            if (
                // 如果点击对象不是label
                $target.prop('tagName') !== 'LABEL'

                // 禁止状态的选项
                || $target.hasClass(disabledClass)

                // 单选组的第一个选项已选中时的点击忽略
                || isRadio && $input.prop('checked')
            ) {
                return;
            }

            // 我们只按照label上的class中是否包含checked来决定checkbox的值
            // 防止在 label 外 mouseup 导致 radio/checkbox 未选中
            var isChecked = isRadio ? true : !$target.hasClass(checkedClass);

            var $group = $(me.groups[$input.attr('name')]);
            var $checkedItems = $group.find('.' + checkedClass);

            if (isRadio) {

                // 保证选项中只有一个选项被选中
                $checkedItems.removeClass(checkedClass);
            }
            else {

                var tag = me.options.allTag;

                // 属性`data-all`的值如果与options.allTag相同，那么此INPUT为`全部`
                // 对此INPUT选择具有排他性
                if ($target.attr(tag)) {

                    // 当单选按钮处理，选择状态不可切换
                    if ($target.hasClass('checked')) {

                        // 如果是点中了INPUT，此时的`全部`可能已经被点掉了，所以强制选中它
                        $input.prop('checked', true);
                        return;
                    }

                    // 清除其他被选中的选项样式并取消它们的input的checked状态
                    $checkedItems.removeClass(checkedClass).find('input').prop('checked', false);
                }

                // 如果选中的不是`全部`并且`全部`还在选中状态，那么取消它的选中状态
                else {
                    $group.find('label[data-all]')
                        .removeClass(checkedClass)
                        .find('input')
                        .prop('checked', false);
                }

            }

            $input.prop('checked', isChecked);

            $target.toggleClass(checkedClass);

            var name = $input.attr('name');

            var checkedData = isRadio
                ? { key: name, value: [ $input.attr('value') ] }
                : me.getData(name);

            // 比较状态变化
            var newValue = checkedData.value.join(',');

            var propertyName = 'data-value';

            // 如果值没有变化，那么就不释放change事件了
            if ($group.attr(propertyName) === newValue) {
                return;
            }

            // 更新值
            $group.attr(propertyName, newValue);

            /**
             * @event module:Filter#change
             * @type {Object}
             * @property {string} key 过滤项的键名
             * @property {Array.<string>} value 当前选项组的选中值
             */
            me.fire('change', checkedData);

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

            allTag: 'data-all',

            groups: 'p',

            item: 'label',

            checkedClass: 'checked',

            disabledClass: 'disabled'

        },

        init: function (options) {
            this.$parent(options);
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Filter#options
         * @private
         */
        initStructure: function (options) {
            var me = this;

            me.disabled  = options.disabled;

            me.main = typeof options.main === 'string'
                    ? $('#' + options.main)
                    : $(options.main);

            me.main = me.main[0];


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
            var me      = this;
            var $main    = typeof wrapper === 'string'
                        ? $('#' + wrapper)            // 如果是string，那么是id
                        : $(wrapper || me.main);      // 如果是HTMLElement，那直接$包裹一下
                                                      // 如果是falsy，那么使用me.main

            var options = me.options;

            if (!$main.length) {
                throw new Error('main not found!');
            }

            if (!me.rendered) {
                me.rendered = true;

                var groups = me.groups = {};

                $(me.group).each(function (index, group) {
                    groups[$('input', group).attr('name')] = group;
                });

                $main.on('click', $.proxy(privates.onClick, this));
            }

            return me;
        },

        /**
         * 获取指定键名的当前选中项数据
         *
         * @param {string} key 选择项键名
         * @return {Object} 返回指定键名的选中项数据
         * @public
         */
        getData: function (key) {
            var me    = this;
            var group = me.groups[key];
            var data  = { key : key };
            var value = data.value = [];

            // 如果没有指定key的filter群组，那么返回空值
            if (!group) {
                return data;
            }

            var checkedClass  = me.options.checkedClass;
            var all           = [];
            var isAllSelected = false;

            // 找到那些被标识了选中状态的LABEL
            $('label', group).each(function (i, label) {

                var $label = $(label);
                var $input = $label.find('input');
                var v      = $input.val();

                v && all.push(v);

                if (!$label.hasClass(checkedClass)) {
                    return;
                }

                if ($label.attr('data-all')) {
                    isAllSelected = true;
                }
                else {
                    value.push(v);
                }

            });

            if (isAllSelected) {
                data.value = all;
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

            if (!group) {
                return;
            }

            values = values.join(comma);

            $('input', group).each(function (i, input) {
                var $input = $(input);
                var $label = $input.parent();

                if (lib.contains(values, $input.attr('value'), comma)) {
                    $input.prop('checked', false);
                    $label.removeClass(checkedClass).addClass(disabledClass);
                }
                else {
                    $label.removeClass(disabledClass);
                }
            });

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

            if (!group) {
                return;
            }

            $('.' + disabledClass, group).removeClass(disabledClass);

        }


    });

    return Filter;
});
