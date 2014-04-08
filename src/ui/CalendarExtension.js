/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 对 Calendar 的扩展
 * @author chris(wfsr@foxmail.com)
 */

define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');
    var Calendar = require('./Calendar');

    /**
     * 私有函数或方法
     * 
     * @type {Object}
     * @namespace
     * @name module:CalendarExtension~Menu~privates
     */
    var menuPrivites = /** @lends module:CalendarExtension~Menu~privates */ {

        /**
         * 显示前事件处理
         * 
         * @param {Event} e DOM 事件源对象
         * @private
         */
        onShow: function (e) {
            this.show(this.target, true);
        },


        /**
         * 选择菜单隐藏前处理
         * 
         * @param {Event} e DOM 事件源对象
         * @private
         */
        onHide: function (e) {
            this.hide();
        },

        /**
         * 点击事件处理
         * 
         * @param {Event} e DOM 事件源对象
         * @fires CalendarExtension~Menu#click
         * @fires CalendarExtension~Menu#pick
         * @private
         */
        onClick: function (e) {
            var target = lib.getTarget(e);

            if (target.tagName === 'A') {

                lib.stopPropagation(e);

                /**
                 * @event CalendarExtension~Menu#click
                 * @type {Object}
                 * @property {HTMLElement} target 当前点击的元素
                 */
                this.fire('click', { target: target });

                if (this.check(target)) {
                    var value = target.innerHTML;
                    this.target.innerHTML = value;
                    this.select(value);
                    this.hide();

                    /**
                     * @event CalendarExtension~Menu#pick
                     * @type {Object}
                     * @property {string} value 当前选中的值
                     * @property {HTMLElement} target 当前点击的元素
                     */
                    this.fire('pick', {value: value, target:  this.target});
                }

            }
        }      
    };

    /**
     * 年月选择菜单
     * 
     * @memberof module:CalendarExtension
     * @extends module:Control
     * @inner
     */
    var Menu = Control.extend(/** @lends CalendarExtension~Menu.prototype */{

        /**
         * 控件类型标识
         * 
         * @type {string}
         * @private
         */
        type: 'Calendar.Menu',

        /**
         * 控件配置项
         * 
         * @name CalendarExtension~Menu#options
         * @type {Object}
         * @property {number} start 初始化时的起始数字
         * @property {number} end 初始化时的结束数字
         * @property {string} className 控件容器的 className
         * @property {string} selectedClass 选中的数字的 className
         * @private
         */
        options: {
            start: 1,
            end: 12,
            className: '',
            selectedClass: 'current'
        },

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see CalendarExtension~Menu#options
         * @private
         */
        init: function (options) {
            var main = this.main = document.createElement('div');
            lib.addClass(main, options.className);
            this.bindEvents(menuPrivites);
        },

        /**
         * 绘制控件
         * 
         * @return {Menu} 当前实例
         * @override
         * @public
         */
        render: function () {
            var options = this.options;

            if (!this.rendered) {
                this.rendered = true;

                var main = this.main;
                this.build(options.start, options.end);
                this.elements = main.getElementsByTagName('a');

                var bound = this._bound;
                lib.on(main, 'mouseenter', bound.onShow);
                lib.on(main, 'mouseleave', bound.onHide);
                lib.on(main, 'click', bound.onClick);

                if (options.target) {
                    this.setTarget(lib.g(options.target));
                }
            }

            return this;
        },

        /**
         * 构建HTML
         * 
         * @param {number} start 起始数字
         * @param {number} end 结束数字
         * @public
         */
        build: function (start, end) {

            if (lib.isArray(start)) {
                end = start[1];
                start = start[0];
            }

            this.start = start;
            this.end = end;

            var html = [];

            for (var i = start; i <= end; i++) {
                html.push('<a href="#">' + i + '</a>');
            }

            this.fire('build', { html: html });

            this.main.innerHTML = html.join('');
        },

        /**
         * 设置当前的绑定目标元素
         * 
         * @param {HTMLElement} target 新的目标鲜红
         * @public
         */
        setTarget: function (target) {
            if (target) {
                this.target = target;
            }
        },

        /**
         * 根据值选中选项
         * 
         * @param {(number | string)} value 要选中项的值
         * @public
         */
        select: function (value) {
            var options = this.options;
            var klass = options.selectedClass;
            var selected = this.query(klass)[0];
            var selectedValue = selected && selected.innerHTML;

            selected && lib.removeClass(selected, klass);
            if (selectedValue !== value) {
                var el = this.elements[value - this.start];
                el && lib.addClass(el, klass);
            }
        },
        /**
         * 显示选择菜单
         * 
         * @param {HTMLElement} target 选单显示时要参考的元素
         * @param {boolean} noEvent 是否不广播 beforeShow 事件
         * @fires CalendarExtension~Menu#beforeShow
         * @public
         */
        show: function (target, noEvent) {

            /**
             * @event CalendarExtension~Menu#beforeShow
             * @type {Object}
             * @property {HTMLElement} target 选单显示时要参考的元素
             */
            !noEvent && this.fire('beforeShow', { target:　target　});

            var main = this.main;
            if (target !== this.target) {
                this.setTarget(target);
                target.parentNode.parentNode.appendChild(main);
            }
            this.select(target.innerHTML | 0);
            lib.show(main);
        },
        /**
         * 隐藏选择菜单
         * 
         * @public
         */
        hide: function () {
            lib.hide(this.main);
        },

        /**
         * 检查是否选中可用的数字
         * 
         * @return {boolean} 可用数字点击时返回 true，否则 false
         * @public
         */
        check: function () {
            return true;
        }
    });

    /**
     * 月选择菜单工厂方法
     * 
     * @param {Object} options 选择菜单参数
     * @see Menu#options
     * @return {Menu} 月选择菜单实例
     */
    Menu.month = function (options) {
        var menu = new Menu(options);
        return menu.render();
    };

    /**
     * 年选择菜单工厂方法
     * 
     * @param {Object} options 选择菜单参数
     * @see Menu#options
     * @return {Menu} 年选择菜单实例
     */
    Menu.year = function (options) {
        var menu = new Menu(options);
        var size = 20;

        var getRange = function (value) {
            var remainder = value % size;
            var start = value - remainder + 1;
            var end = start + size - 1;
            return [start, end];            
        };

        menu.on('build', function (e) {
            var html = e.html;
            html.push('<a href="#" data-cmd="prev">&lt;</a>');
            html.push('<a href="#" data-cmd="back">返回</a>');
            html.push('<a href="#" data-cmd="next">&gt;</a>');
        });

        menu.on('beforeShow', function (e) {
            var el = e.target;
            var value = el.innerHTML | 0;

            this.build(getRange(value));
        });
        menu.on('click', function (e) {
            var cmd = e.target.getAttribute('data-cmd');

            switch (cmd) {
                case 'prev':
                    this.build(getRange(this.start - size));
                    break;
                case 'next':
                    this.build(getRange(this.start + size));
                    break;
                case 'back':
                    this.build(getRange(this.target.innerHTML | 0));
                    break;
                default:
                    break;
            }
        });


        menu.check = function (el) {
            return !el.getAttribute('data-cmd');
        };
        return menu.render();
    };

    /**
     * 私有函数或方法
     * 
     * @type {Object}
     * @namespace
     * @name module:CalendarExtension~privates
     */
    var privates = /** @lends module:CalendarExtension~privates */ {

        /**
         * 绘制选择菜单
         * 
         * @param {HTMLElement} related 作参考绑定的元素
         * @param {string} type 要绘制的选择菜单类型
         * @private
         */
        renderMenu: function (related, type) {
            var menu = this.menus[type];

            if (!menu) {
                menu = (this.menus[type] = Menu[type]({
                    className: 'menu-' + type + '-options'
                }));

                var calendar = this.calendar;
                menu.on('pick', function (e) {
                    var head = e.target.parentNode;
                    var links = head.getElementsByTagName('a');
                    var year = links[0].innerHTML | 0;
                    var month = links[1].innerHTML | 0;

                    var monthElement = head.parentNode;

                    lib.each(
                        lib.q(monthElement.className, monthElement.parentNode),
                        function (el, i) {
                            if (el === monthElement) {
                                var date = new Date(year, month - 1, 1);
                                date.setMonth(month - i - 1);
                                calendar.setValue(date);
                            }
                        }
                    );
                });
            }
            menu.show(related);
        },

        /**
         * 鼠标进入事件处理
         * 
         * @param {Event} e DOM 事件源对象
         * @private
         */
        onOver: function (e) {
            var el = lib.getTarget(e);
            var type = el.getAttribute('data-menu-type');
            if (type) {
                privates.renderMenu.call(this, el, type);

                var main = this.main;
                var bound = this._bound;
                lib.un(main, 'mouseover', bound.onOver);
                lib.on(main, 'mouseout', bound.onOut);
            }
        },

        /**
         * 鼠标移出事件处理
         * 
         * @param {Event} e DOM 事件源对象
         * @private
         */
        onOut: function (e) {
            var el = lib.getTarget(e);
            var type = el.getAttribute('data-menu-type');
            if (type) {
                var menu = this.menus[type];
                menu && menu.hide();

                var main = this.main;
                var bound = this._bound;
                lib.on(main, 'mouseover', bound.onOver);
                lib.un(main, 'mouseout', bound.onOut);
            }
        },

        /**
         * 鼠标点击事件处理
         * 
         * @param {Event} e DOM 事件源对象
         * @private
         */
        onClick: function (e) {
            privates.onHide.call(this, e);
        },

        /**
         * 隐藏前事件处理
         * 
         * @param {Event} e DOM 事件源对象
         * @private
         */
        onHide: function (e) {
            lib.forIn(this.menus, function (menu) {
                menu.hide();
            });
        }        
    };

    /**
     * Calendar 扩展类
     * 
     * 增加年份和月份的快速选择跳转
     * 
     * @requires lib
     * @requires Control
     * @requires Calendar
     * @exports CalendarExtension
     * @see module:Calendar
     * @example
     * &lt;input type="text" class="input triggers" /&gt;
     * &lt;input type="button" value="click" class="triggers" /&gt;
     * 与 Calendar 使用方式一致
     * new CalendarExtension({
     *     dateFormat: 'yyyy-MM-dd(WW)',    // W为星期几，WW带周作前缀
     *     triggers: '.triggers',
     *     target: '.input'
     *  }).render();
     */
    var CalendarExtension = lib.newClass(
        /** @lends module:CalendarExtension.prototype */{

        /**
         * 初始化
         * 
         * @param {Object} options 透传给 module:Calendar 的配置参数
         * @see module:Calendar#options
         * @private
         */
        initialize: function (options) {
            options = options || {};
            options.lang = options.lang || {};
            options.lang.title = ''
              + '<a href="#" data-menu-type="year"'
              + ' class="{prefix}-menu-year-handler">{year}</a>年'
              + '<a href="#" data-menu-type="month"'
              + ' class="{prefix}-menu-month-handler">{month}</a>月';

            this.calendar = new Calendar(options);
            this.menus = {};
            Control.prototype.bindEvents.call(this, privates);
        },

        /**
         * 绘制控件
         * 
         * @return {module:Calendar} module:Calendar 实例
         * @see module:Calendar#render
         * @public
         */
        render: function () {
            var calendar = this.calendar;
            var value = calendar.render.apply(calendar, arguments);

            var main = this.main = calendar.main;

            var bound = this._bound;
            lib.on(main, 'mouseover', bound.onOver);
            lib.on(main, 'mouseout', bound.onOut);
            lib.on(main, 'click', bound.onClick);

            calendar.on('hide', bound.onHide);

            return value;
        },

        /**
         * 销毁控件
         * 
         * @public
         */
        dispose: function () {
            lib.forIn(this.menus, function (menu) {
                menu.dispose();
            });

            var main = this.main;
            var bound = this._bound;
            lib.un(main, 'mouseover', bound.onOver);
            lib.un(main, 'mouseout', bound.onOut);
            lib.un(main, 'click', bound.onClick);

            this.calendar.un('hide', bound.onHide);
            this.calendar.dispose();
        }

    });
    
    return CalendarExtension;

});
