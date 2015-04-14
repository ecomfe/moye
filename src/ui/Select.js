/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 下拉选择菜单
 * @author chris(wfsr@foxmail.com)
 * @author Leon(leon@outlook.com)
 */

define(function (require) {

    var $       = require('jquery');
    var lib     = require('./lib');
    var Control = require('./Control');
    var Popup   = require('./Popup');

    /**
     * 下拉选择菜单
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Select
     */
    var Select = Control.extend(/** @lends module:Select.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Select',

        /**
         * 控件配置项
         *
         * @private
         * @name module:Select#options
         * @type {Object}
         * @property {boolean} options.disabled 控件的不可用状态
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @property {number} options.maxLength 显示选中值时的限度字节长度
         * @property {string} options.ellipsis maxLength 限制后的附加的后缀字符
         * @property {(string | HTMLElement)} options.target 计算选单显示时
         * 相对位置的目标对象
         * @property {number} options.columns 选项显示的列数，默认为 1 列
         * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
         * @property {string} options.isNumber 控件值的类型是否限制为数字
         * @property {?Array=} options.datasource 填充下拉项的数据源
         * 推荐格式 { text: '', value: '' }, 未指定 value 时会根据 valueUseIndex 的
         * 设置使用 text 或自动索引值，可简写成字符串 '北京, 上海, 广州' 或
         * '北京:010, 上海:021, 广州:020'
         * @property {bool} options.valueUseIndex datasource 未指定 value 时是否
         * 使用自动索引值
         */
        options: {

            // 显示选中值时的限度字节长度
            maxLength: 16,

            // maxLength 限制后的附加的后缀字符
            ellipsis: '...',

            // 显示列数
            columns: 1,

            // 选中项的 class
            selectedClass: 'selected',

            // 数据源
            datasource: [],

            // datasource 项未指定 value 时
            valueUseIndex: false,

            // 在没有选项被选中时的显示值
            emptyText: '请选择',

            // 触发展开的交互动作
            mode: 'click',

            /**
             * 数据适配器
             * 在生成控件时重写此参数, 可以灵活适配各种数据格式
             * @type {Object}
             */
            adapter: {

                /**
                 * 适配下拉选项数据, 数据流动方向: 用户数据 => 控件数据
                 * @param {Object} option datasource中的一项
                 * @return {Object} 返回一个选项数据对象, 格式为 {name: 'name', value: 'value'}
                 */
                toOption: function (option) {
                    return option;
                },

                /**
                 * 适配提示文本
                 * 当某个选项被选中时, 会调用此方法来适配显示的文本
                 * @param  {Object} option datasource中的一茂
                 * @return {string} 适合显示的文本
                 */
                toLabel: function (option) {
                    return option.name;
                }

            },

            /**
             * 自动在label结尾处添加一个小三角icon作为状态指示器
             * @type {Boolean}
             */
            indicator: {
                normal: '&#xe604;',
                expanded: '&#xe603;'
            }

        },

        /**
         * 初始化参数
         * @param  {Object} options 参数
         */
        init: function (options) {
            this.$parent(options);
            this.datasource = this.datasource || [];
            var option = this.getOption(this.value);
            this.value = option ? option.value : null;
        },

        /**
         * 在datasource中查找value为value的项
         * @param  {string} value 值
         * @return {Object}
         */
        getOption: function (value) {
            for (var i = 0, datasource = this.datasource, len = datasource.length; i < len; ++i) {
                var option = this.adapter.toOption.call(this, datasource[i]);
                if (option.value === value) {
                    return option;
                }
            }
            return null;
        },

        initStructure: function () {

            var skins = ['select'];
            var columns = +this.columns;

            if (columns) {
                skins.push('select-columns' + columns);
            }

            var helper = this.helper;

            var popup = this.popup = new Popup({
                main: helper.createPart('popup'),
                target: this.main,
                triggers: [this.main],
                skin: skins,
                mode: this.mode
            });

            popup
                .on('click', $.proxy(this.onPopupClick, this))
                .on('show', $.proxy(this.onPopupShow, this))
                .on('hide', $.proxy(this.onPopupHide, this))
                .render();

            helper.addPartClasses('popup', popup.main);
            this.addChild(popup);

            this.main.innerHTML = ''
                + helper.getPartHTML(
                    'input',
                    'input',
                    '',
                    {type: 'hidden', value: this.value}
                )
                + helper.getPartHTML(
                    'label',
                    'a',
                    '',
                    {href: '#'}
                )
                + this.getIndicatorHTML();
        },

        initEvents: function () {
            this.delegate(this.main, 'click', this.onMainClicked);
        },

        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: ['datasource'],
                paint: function (conf, datasource) {

                    if (!lib.isArray(datasource)) {
                        datasource = (datasource + '').split(/\s*[,]\s*/);
                    }

                    var html = [];
                    var valueUseIndex = !!this.valueUseIndex;

                    for (var i = 0, len = datasource.length; i < len; ++i) {

                        var item = datasource[i];

                        if (!lib.isObject(item)) {
                            var data = item.split(/\s*[:]\s*/);
                            item = {
                                text: data[0]
                            };
                            item.value = data.length > 1
                                ? data[1]
                                : (valueUseIndex ? i : data[0]);
                        }

                        html.push(this.getOptionHTML(item, i));
                    }

                    this.popup.main.innerHTML = html.join('');
                }
            },
            {
                name: ['value'],
                paint: function (conf, value) {

                    var helper = this.helper;
                    var datasource = this.datasource || [];
                    var selectedClass = helper.getPartClassName('option-selected');
                    var optionClass = helper.getPrimaryClassName('option');

                    value = this.isNumber ? +value : value;

                    // 在子元素里遍历, 如果其值与value相等, 则选中, 不相等则清空选项的选中样式
                    // 如果没有任何选项与value相等, 此时要显示defalutLabel, 并去掉`已选择`状态
                    var option = lib.reduce(
                        $('.' + optionClass, this.popup.main),
                        function (result, element, i) {
                            var item = $(element);
                            var option = this.adapter.toOption.call(this, datasource[i]);

                            // 否则移除它的选中样式
                            if (option.value !== value) {
                                item.removeClass(selectedClass);
                            }
                            // 如果value与option相等(也就是找到了)
                            // 或者value是undefined(这里我们把第一个项作为选中值)
                            else {
                                item.addClass(selectedClass);
                                result = option;
                            }
                            return result;
                        },
                        null,
                        this
                    );

                    var input = helper.getPart('input');
                    var text;

                    // 找到了结果
                    if (option) {
                        text = this.adapter.toLabel.call(this, option);
                        input.value = value;
                        this.addState('selected');
                    }
                    // 没找到结果
                    else {
                        text = this.emptyText;
                        this.value = input.value = '';
                        this.removeState('selected');
                    }

                    helper.getPart('label').innerHTML = text;
                }
            }
        ),

        getIndicatorHTML: function () {
            var indicator = this.indicator;
            if (indicator === false) {
                return '';
            }
            return this.helper.getPartHTML(
                'indicator',
                'i',
                this.hasState('expanded') ? this.indicator.expanded : this.indicator.normal
            );
        },

        /**
         * 生成选项的HTML
         * @param {Object} option 选项配置
         * @param {number} index  当前选项的序号
         * @return {string}
         */
        getOptionHTML: function (option, index) {
            option = this.adapter.toOption.call(this, option, index);
            return ''
                + '<a href="#" class="' + this.helper.getPartClassName('option') + '" data-action="select" '
                +     'data-value="' + option.value + '" '
                +     'data-index="' + index + '">'
                +     option.name
                + '</a>';
        },

        /**
         * 填充数据
         *
         * @param {(Array | string)} datasource 要填充的数据源
         * 参考 options.datasource
         * @public
         */
        fill: function (datasource) {
            this.set('datasource', datasource);
        },

        /**
         * 选取选项
         *
         * @param {Element} target 点击的当前事件源对象
         * @protected
         */
        pick: function (target) {
            var value = $(target).data('value');
            if (value !== this.value) {
                this.set('value', value);
                /**
                 * @event module:Select#change
                 * @type {Object}
                 * @property {string} value 选中项的值
                 * @property {string} name 选中项的文字
                 * @property {Date} shortText 选中项的文字的切割值
                 */
                this.fire('change', {
                    value: value
                });
            }
        },

        /**
         * 获取控件当前值
         *
         * @param {bool} isNumber 是否需要返回数字类型的值
         * @return {(string | number)} 返回当前选中项的值
         * @public
         */
        getValue: function (isNumber) {
            var value = this.helper.getPart('input').value;
            return isNumber ? +value : value;
        },

        /**
         * 设置值
         * @param {string} value 值
         * @return {Select}
         */
        setValue: function (value) {
            this.set('value', value);
            return this;
        },

        /**
         * 处理选单点击事件
         *
         * @param {Event} e 从`Popup`传来的点击事件对象
         * @protected
         */
        onPopupClick: function (e) {
            var target = e.target;
            if (target.tagName === 'A') {
                e.preventDefault();
                this.pick(target);
                this.popup.hide();
            }
        },

        /**
         * 转发Popup的onBeforeShow事件
         *
         * @param {Event} e 事件参数
         * @fires module:Select#beforeShow
         * @protected
         */
        onPopupShow: function (e) {
            if (this.isDisabled()) {
                e.preventDefault();
                return;
            }
            // 转发事件
            this.fire(e);
            // 如果没有被阻止, 那就执行默认动作.
            if (!e.isDefaultPrevented()) {
                this.addState('expanded');
                this.helper.getPart('indicator').innerHTML = this.indicator.expanded;
            }
        },

        /**
         * 隐藏浮层后的处理，主要是为了去掉高亮样式
         * @param {Event} e 浮层隐藏事件对象
         * @protected
         */
        onPopupHide: function (e) {
            // 转发事件
            this.fire(e);
            // 如果没有被阻止, 那就执行默认动作.
            if (!e.isDefaultPrevented()) {
                this.removeState('expanded');
                this.helper.getPart('indicator').innerHTML = this.indicator.normal;
            }
        },

        onMainClicked: function (e) {
            e.preventDefault();
        },

        dispose: function () {
            this.undelegate(this.main, 'click', this.onMainClicked);
            this.popup.destroy();
            this.$parent();
        }


    });

    return Select;
});
