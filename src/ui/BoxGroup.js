/**
 * Moye (Zhixin UI)
 * Copyright 2015 Baidu Inc. All rights reserved.
 *
 * @file 单复选框组件
 * @author dengxiaohong01(dengxiaohong01@baidu.com)
 */

define(
    function (require) {

        var $ = require('jquery');
        var Control = require('./Control');

        /**
         * 单复选框组件
         *
         * @extends module:Control
         * @requires lib
         * @requires Control
         * @exports BoxGroup
         */
        var BoxGroup = Control.extend(/** @lends module:Select.prototype */{
            /**
             * 控件类型标识
             *
             * @type {string}
             * @override
             * @private
             */
            type: 'BoxGroup',

            /**
             * 控件配置项
             *
             * @private
             * @name module:BoxGroup#options
             * @type {Object}
             * @property {boolean} options.disabled 控件的不可用状态
             * @property {(string | HTMLElement)} options.main 控件渲染容器
             * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
             */
            options: {

                // 控件渲染主容器
                main: '',

                // 是单选还是复选(checkbox| radio)
                boxType: 'checkbox',

                // 被选中时的样式
                activeClass: 'checked',

                //  单复选是哪种样式(default |radio-circle |checkbox-tick)
                styleClass: 'default',

                // 数据源
                datasource: [],

                // 选中的元素 Array, 单选时取第一个
                value: []
            },

            init: function (options) {
                this.$parent(options);
            },

            repaint: require('./painter').createRepaint(
                Control.prototype.repaint,
                {
                    name: 'datasource',
                    paint: function (conf, datasource) {
                        var main = $(this.main);
                        if (this.helper.isInStage('INITED') && main.data('dom-inited')) {
                            return;
                        }
                        datasource = this.datasource = datasource || [];
                        var html = [];
                        for (var i = 0, len = datasource.length; i < len; i++) {
                            var item = datasource[i];
                            var state = $.inArray(item.value, this.value) > -1;
                            html[i] = this.getItemHTML(state, item);
                        }

                        main.html(html.join(''));
                        return this;
                    }
                },
                {
                    name: 'value',
                    paint: function (conf, value) {
                        var main = $(this.main);
                        if (this.helper.isInStage('INITED') && main.data('dom-inited')) {
                            return;
                        }
                        value = this.value = value || [];

                        $('label', main).each(function () {
                            var me = $(this);
                            var value = me.attr('value');

                            var bool = $.inArray(value, this.value) > -1;
                            var act = bool? 'addClass' : 'removeClass';

                            // 操作元素添加或移除activeClass 并指定checked属性的值
                            me[act](this.activeClass).find('input').attr(
                                'checked', bool);
                        });
                    }
                }
            ),

            initEvents: function () {
                this.delegate(this.main, 'click', this._onClick);
            },

            /**
             * 主元素被点击时的处理函数
             * @param {Event} e 事件源对象
             * @fires module:BoxGroup#change
             * @fires module:BoxGroup#click
             * @private
             */
            _onClick: function (e) {

                var me = this;

                /**
                 * @event module:BoxGroup#click
                 * @type {object}
                 * @property {Event} event 事件源对象
                 */
                me.fire('click', { event: e });

                var $target = $(e.target);

                // 这里先将$input默认设定为$target，后面会修正，可以减少一次DOM查找
                var $input  = $target;

                var tagName = $target.prop('tagName');

               var isRadio = (me.boxType === 'radio');

                // 如果点击的不是INPUT、I、LABEL那就忽略
                if (tagName !== 'LABEL' && tagName !== 'INPUT' && tagName !== 'I') {
                    return;
                }

                // 如果直接点击了input, i,那么我们需要向上选择到它的父结点label
                if (tagName === 'INPUT' || tagName === 'I') {
                     e.preventDefault() || (e.returnValue = false);
                    // 向上选择到label一层
                    $target = $target.parent();
                } else {
                    // 当点击的元素是LABEL，那么要阻止默认。。。
                    // 原理: 当label包含的for属性，或者label中包含中input时，
                    // 当label被点击时，浏览器会自动触发一次input完整真实的click事件
                    // 导致我们在外层监听的click监听事件处理函数被执行两次
                    // 这里可以通过阻止默认事件，来阻止上边描述的事情
                    // 但同时也阻止了浏览器对input状态的自动维护
                    // 好在我们可以自己处理
                    e.preventDefault() || (e.returnValue = false);
                    $input = $target.find('input');
                }

                // 复选点击同一个则反选,单选同一个则忽略

                //  单选同一个忽略
                if (isRadio && $input.prop('checked')) {
                    return;
                }
                // 此时点击的是未选中的单选或者复选框 所以则反选
                var activeClass = me.activeClass;
                var $checkedItems = $(me.main).find('.' + activeClass);

                if (isRadio) {
                    //单选保证选项中只有一个选项被选中
                    $checkedItems.removeClass(activeClass)
                                 .find('input').prop('checked', false);
                }

                var checked = !$target.hasClass(activeClass);
                $target.toggleClass(activeClass)
                       .find('input')
                       .attr('checked', checked);

                this.fire('change', {
                    target: this
                });

            },
            getItemHTML: function (state, item) {
                var checkedClass = state ? (' ' + this.activeClass) : '';
                return ''
                    + '<label class="' + this.styleClass + checkedClass + '">'
                    +     '<i class="icon icon-un"></i>'
                    +     '<i class="icon icon-on"></i>'
                    +     '<input type="' + this.boxType + '" name="'
                    +         item.name + '" value="' + item.value + '">'
                    +      item.name
                    + '</label>';
            },

            /**
             * 判断一个DOM是否为当前所选中的荐
             * @param  {Element} item 某个DOM元素
             * @return {Boolean}
             */
            isActiveItem: function (item) {
                item = $(item);
                return item.is('label') && item.hasClass(this.activeClass);
            },

            /**
             * 获得值
             *
             * @return {Array}
             */
            getValue: function () {
                var value = [];
                var main = $(this.main);
                $('.' + this.activeClass, main).each(function () {
                    value.push($(this).find('input').attr('value'));
                });
                return value;
            },

            /**
             * 设定值
             * @param {Array} value 值
             * @return {BoxGroup}
             */
            setValue: function (value) {

                this.value = null;

                return this.set('value', value);
            },

            dispose: function () {
                this.undelegate(this.main, 'click', this._onClick);
                Control.prototype.dispose.apply(this, arguments);
            }
        });

        return BoxGroup;
    }
);
