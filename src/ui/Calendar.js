/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 比 PC-UI WCal 好用的日历控件
 * @author chris(wfsr@foxmail.com)
 */

define(function (require) {

    var $       = require('jquery');
    var lib     = require('./lib');
    var Control = require('./Control');
    var Popup   = require('./Popup');
    var pad     = lib.pad;

    /**
     * 标准日期格式
     *
     * @const
     * @type {string}
     */
    var DATE_FORMAT = 'yyyy-MM-dd';
    var RANGE = null;

    /**
     * 日历
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @requires Popup
     * @exports Calendar
     * @example
     * &lt;input type="text" class="input triggers" /&gt;
     * &lt;input type="button" value="click" class="triggers" /&gt;
     * new Calendar({
     *     dateFormat: 'yyyy-MM-dd(WW)',    // W为星期几，WW带周作前缀
     *     triggers: '.triggers',
     *     target: '.input'
     *  }).render();
     */
    var Calendar = Control.extend(/** @lends module:Calendar.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Calendar',

        /**
         * 控件配置项
         *
         * @name module:Calendar#options
         * @see module:Popup#options
         * @type {Object}
         * @property {boolean} disabled 控件的不可用状态
         * @property {(string | HTMLElement)} main 控件渲染容器
         * @property {string} prefix 控件class前缀，同时将作为main的class之一
         * @property {(string | HTMLElement)} target 计算日历显示时相对位置的目标对象
         * @property {string} triggers 点击显示日历的节点
         * @property {string} dateFormat 日期显示的格式化方式
         * @property {?Object} range 可选中的日期区间
         * @property {?string} value 当前选中的日期
         * @property {Function} process 处理当前显示日历中的每一天，多用于节日样式
         * process(el, classList, dateString)
         * 执行时 this 指向当前实例，el 为当前日的dom节点(A标签)，
         * classList 为 el 即将要应用的class数组引用，dateString 为
         * yyyy-MM-dd格式的当前日期字符串
         * @property {number} monthes 同时显示几个月
         * @property {Object} lang 预设模板
         * @property {string} lang.week 对于 '周' 的称呼
         * @property {string} lang.days 一周对应的显示
         * @property {string} lang.title 每月显示的标题文字
         * @private
         */
        options: {

            // 日期显示的格式化方式
            dateFormat: DATE_FORMAT,

            // 可选中的日期区间
            range: RANGE,

            // 处理每一天的样式
            process: null,

            // 同时显示几个月
            months: 1,

            // 一周的起始日 与new Date().getDay()的返回值含义一致
            // 即: 周一: 0, 周二: 1, ..., 周日: 6
            weekStart: 0,

            // 一些模板
            lang: {

                // 对于 '周' 的称呼
                week: '周',

                // 星期对应的顺序表示
                days: '日,一,二,三,四,五,六',

                // 每月显示的标题文字
                title: '{year}年{month}月'

            }
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         */
        init: function (options) {

            this.$parent(options);

            var main = this.main;

            if (main.tagName === 'INPUT') {
                var wrap = document.createElement('div');
                var parent = main.parentNode;

                if (parent) {
                    parent.insertBefore(wrap, main);
                }

                wrap.appendChild(main);
                this.main = wrap;
                this.input = main;
            }

            // 初始化取值优先级, JS赋值 > DOM赋值
            var value = this.value || this.input && this.input.value;
            var date = this.date = this.from(value);
            this.days  = this.lang.days.split(',');
            this.month = this._getMonthFirstDate(date);
            this.value = this.format(date);
        },

        /**
         * 生成月份翻页
         * @private
         * @param  {string} part 翻页部件
         * @return {string}
         */
        _buildPagerHtml: function (part) {
            var helper = this.helper;
            var id = helper.getPartId(part);
            var className = ''
                + helper.getPartClassName('pager')
                + ' '
                + helper.getPartClassName('pager-' + part);
            return ''
                + '<a href="#" '
                +    'data-direction="' + part + '"'
                +    'class="' + className + '" '
                +    'id="' + id + '">'
                + '</a>';
        },

        _getMonthFirstDate: function (date) {
            var first = new Date(date);
            first.setDate(1);
            return first;
        },

        _getMonthLastDate: function (date) {
            var last = new Date(date);
            last.setMonth(last.getMonth() + 1);
            last.setDate(0);
            return last;
        },

        initStructure: function () {
            var main = this.main;
            var input = this.input;


            if (!input) {
                input = this.input = $('input', main)[0]
                    || $('<input type="text">').appendTo(main).get(0);
            }

            var helper = this.helper;

            var content = ''
                + this._buildPagerHtml('pre')
                + this._buildPagerHtml('next')
                + helper.getPartHTML('content', 'ol');

            var popup = this.popup = new Popup({
                target: input,
                triggers: [input],
                content: content
            });

            popup.render();

            helper.addPartClasses('popup', popup.main);

            this.pre = helper.getPart('pre');
            this.next = helper.getPart('next');
            this.content = helper.getPart('content');
        },

        initEvents: function () {
            var popup = this.popup;
            popup.on('click', $.proxy(this._onPopupClick, this));
            popup.on('hide', $.proxy(this._onPopupHide, this));
            popup.on('show', $.proxy(this._onPopupBeforeShow, this));
        },

        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            // 这两个属性发生变化时, 需要做值同步
            {
                name: ['range', 'value'],
                paint: function (conf, range, value) {
                    // value值与date值同步
                    var date  = this.date = this.from(value);

                    // 如果设定了范围, 而且值超出限定范围, 清空值
                    if (range) {

                        var begin = range.begin;
                        var end   = range.end;

                        if (begin) {
                            begin = range.begin = this.from(begin);
                        }

                        if (end) {
                            end = range.end = this.from(end);
                        }

                        if (date < begin || date > end) {
                            value = this.value = this.date = '';
                            // 如果值被清空, 那么显示的月份要被重置, 取一个在可选范围内的值
                            this.month = this._getMonthFirstDate(begin || end);
                        }

                    }

                    this.input.value = value;
                }
            },
            // 以下四个属性变化时, 都会刷新内容.
            {
                name: ['months', 'month', 'range', 'value'],
                paint: function (conf, months, month) {

                    var content = [];

                    months = this.months = months || 1;
                    month  = this._getMonthFirstDate(month || this.month);
                    this._updatePrevNextStatus(month);

                    for (var i = 0; i < months; i++) {
                        content[i] = this._buildMonth(month);
                        month.setMonth(month.getMonth() + 1);
                    }

                    this.content.innerHTML = content.join('');
                }
            }
        ),

        /**
         * 解释日期类型
         *
         * @param {(string | Date)} value 源日期字符串或对象
         * @param {string} format 日期格式
         * @return {Date} 解释到的日期对象
         * @public
         */
        from: function (value, format) {

            if (!value) {
                return new Date();
            }

            if (lib.isDate(value)) {
                return value;
            }

            format = format || this.dateFormat;
            format = format.split(/[^yMdW]+/i);
            value  = value.split(/\D+/);

            var map = {};

            for (var i = 0, l = format.length; i < l; i++) {
                if (format[i]
                    && value[i]
                    && (format[i].length > 1
                        && value[i].length === format[i].length
                        || format[i].length === 1
                       )
                ) {
                    map[format[i].toLowerCase()] = value[i];
                }
            }

            var year  = map.yyyy
                || map.y
                || ((map.yy < 50 ? '20' : '19') + map.yy);

            var month = (map.m || map.mm) | 0;
            var date  = (map.d || map.dd) | 0;

            return new Date(year | 0, month - 1, date);
        },

        /**
         * 格式化日期
         *
         * @param {Date} date 源日期对象
         * @param {string=} format 日期格式，默认为当前实例的dateFormat
         * @return {string} 格式化后的日期字符串
         * @public
         */
        format: function (date, format) {
            // 控件不包含时间，所以不存在大小写区别
            format = (format || this.dateFormat).toLowerCase();

            if (lib.isString(date)) {
                date = this.from(date);
            }

            var weekStart = this.weekStart;
            var y         = date.getFullYear();
            var M         = date.getMonth() + 1;
            var d         = date.getDate();
            var week      = date.getDay();

            if (weekStart) {
                week = (week - 1 + 7) % 7;
            }

            week = this.days[week];

            var map = {
                yyyy: y,
                yy: y % 100,
                y: y,
                mm: pad(M),
                m: M,
                dd: pad(d),
                d: d,
                w: week,
                ww: this.lang.week + week
            };

            return format.replace(
                /y+|M+|d+|W+/gi,
                function ($0) {
                    return map[$0] || '';
                }
            );
        },

        /**
         * 显示浮层
         *
         * @param {?HTMLElement=} target 触发显示浮层的节点
         * @fires module:Calendar#show 显示事件
         * @public
         */
        show: function (target) {
            this.popup.show();
        },

        /**
         * 隐藏浮层
         *
         * @public
         */
        hide: function () {
            this.popup.hide();
        },

        /**
         * 获取当前选中的日期
         *
         * @return {string} 当前日期格式化值
         * @public
         */
        getValue: function () {
            var date = this.date;
            return date ? this.format(date) : '';
        },

        /**
         * 获取当前选中的日期
         *
         * @return {Date} 获取到的日期
         * @public
         */
        getRawValue: function () {
            return this.date;
        },

        /**
         * 设置允许选中的日期区间
         *
         * @param {Object} range 允许选择的日期区间
         * @public
         */
        setRange: function (range) {
            this.range = null;
            this.set('range', range);
        },

        /**
         * 设置当前选中的日期
         *
         * @param {string} value 要设置的日期
         * @public
         */
        setValue: function (value) {
            this.set('value', value);
        },

        /**
         * 取得指定日期的 yyyyMM 格式化后字符串值
         *
         * @param {?Date=} date 待格式化的日期
         * @return {string} 按 yyyyMM格式化后的日期字符串
         * @private
         */
        _getYYYYMM: function (date) {
            return lib.isString(date)
                ? date
                : this.format(this.from(date), 'yyyyMM');
        },

        /**
        * 构建指定日期所在月的HTML
        * @param {Date} date 需要构建月份日期
        * @return {string}
        * @protected
        */
        _buildMonth: function (date) {

            var helper = this.helper;
            var html   = [
                // 包裹
                '<li class="' + helper.getPartClassName('month') + '">',
                // 月份标题
                this._buildMonthTitle(date),
                // 星期标题
                this._buildWeekTitle(),
                // 日期包裹
                '<p>'
            ];

            var first = this._getMonthFirstDate(date);
            var last = this._getMonthLastDate(date);
            var firstDay = first.getDay();
            var start = new Date(first);
            start.setDate(1 - firstDay);


            for (var i = 0; i < 42; i++) {
                if (start < first) {
                    html.push(this._buildDate(start, 'pre-month'));
                }
                else if (start > last) {
                    html.push(this._buildDate(start, 'next-month'));
                }
                else {
                    html.push(this._buildDate(start));
                }
                start.setDate(start.getDate() + 1);
            }

            // 结束
            html.push('</p></li>');
            return html.join('');
        },

        /**
         * 构建月份标题HTML
         * @param  {Date} date 日期
         * @return {string}
         */
        _buildMonthTitle: function (date) {
            date = {
                year: date.getFullYear(),
                month: date.getMonth() + 1
            };

            var title = this.lang.title.replace(
                 /\{([^\}]+)\}/g,
                 function ($, key) {
                     return date[key] || '';
                 }
            );

            return '<h3>' + title + '</h3>';
        },

        /**
         * 构建星期标题HTML
         * @return {string}
         */
        _buildWeekTitle: function () {
            var html = ['<ul>'];
            var weekendClass = this.helper.getPartClassName('weekend');
            var days = this.days;
            var weekStart = this.weekStart;

            for (var i = 0; i < 7; i++) {
                var day = (weekStart + i) % 7;
                var klass = i === 0 || i === 6 ? weekendClass : '';
                html.push('<li class="'  + klass + '">' + days[day] + '</li>');
            }

            html.push('</ul>');
            return html.join('');
        },

        /**
         * 构建日期HTML
         * @param  {Date} date 日期
         * @param  {string} state 日期状态
         * @return {string}
         */
        _buildDate: function (date, state) {

            var day = date.getDay();
            var value = this.format(date);
            var helper = this.helper;

            var range = this.range;
            var disabled = !!range && (range.begin > date || range.end < date);
            var checked = this.value && this.value === value;
            var TODAY = this.format(new Date());

            var classList = [];

            if (day === 0 || day === 6) {
                classList.push(helper.getPartClassName('weekend'));
            }

            if (state) {
                classList.push(helper.getPartClassName(state));
            }

            if (disabled) {
                classList.push(helper.getPartClassName('disabled'));
            }

            if (checked) {
                classList.push(helper.getPartClassName('checked'));
            }

            if (value === TODAY) {
                classList.push(helper.getPartClassName('today'));
            }


            var handle = {
                classList: classList,
                value: value,
                date: date,
                content: date.getDate()
            };

            if (this.process) {
                handle = this.process(handle);
            }

            return ''
                + '<a href="#" class="' + $.trim(handle.classList.join(' ')) + '"'
                +     'data-week="' + handle.date.getDay() + '" data-date="' + handle.value + '">'
                +     handle.content
                + '</a>';
        },

        /**
         * 翻页
         * @param {sting} direction 可选`pre`和`next`
         * @protected
         */
        _page: function (direction) {
            var date = new Date(this.month);
            var delta = direction === 'next' ? 1 : -1;
            date.setMonth(date.getMonth() + delta);
            date.setDate(1);
            this.set('month', date);
        },

        /**
         * 更新上下月按钮状态
         *
         * @param {Date} month 当前选择的月份
         * @private
         */
        _updatePrevNextStatus: function (month) {
            var range = this.range;
            if (!range) {
                return;
            }
            var targetMonth = this._getYYYYMM(month);
            $(this.pre)[range.begin && targetMonth <= this._getYYYYMM(range.begin) ? 'hide' : 'show']();
            $(this.next)[range.end && targetMonth >= this._getYYYYMM(range.end) ? 'hide' : 'show']();
        },

        /**
         * 选择日期
         *
         * @param {Element} element 点击的当前事件源对象
         * @fires module:Calendar#pick
         * @private
         */
        _pick: function (element) {

            element = $(element);

            var value = element.data('date');

            if (this.value === value) {
                this.hide();
                return;
            }

            var date  = this.from(value, DATE_FORMAT);

            value = this.format(date);

            /**
             * @event module:Calendar#pick
             * @type {Object}
             * @property {string} value 选中日期的格式化
             * @property {string} week 选中日期的格式化星期
             * @property {Date} date 选中的日期对象
             */
            var event = new $.Event({
                value: value,
                type: 'change'
            });

            // 释放`change`事件
            this.fire(event);

            // 如果默认动作被阻止, 那么我们就停止
            if (event.isDefaultPrevented()) {
                return;
            }

            // 否则, 进行选中某个日期的默认动作
            // 1. 缓存最后值
            // 2. 把输入框设定一下值
            // 3. 把输入框设为焦点
            // 4. 隐藏浮层
            this.hide();
            $(this.input).focus();
            this.set('value', value);
        },


        /**
         * 处理选单点击事件
         *
         * @param {Event} e `Popup`的`click`事件
         * @private
         */
        _onPopupClick: function (e) {

            var helper  = this.helper;
            var element = $(e.target).closest('a', this.popup.main);

            if (!element.is('a')) {
                return;
            }

            e.preventDefault();

            // 翻页
            if (element.hasClass(helper.getPrimaryClassName('pager'))) {
                this._page(element.data('direction'));
                return;
            }

            // 选中
            if (!element.hasClass(helper.getPrimaryClassName('disabled'))) {
                this._pick(element);
            }

        },

        /**
         * 转发Popup的onBeforeShow事件
         *
         * @param {Event} e `Popup`的`show`事件对象
         * @fires module:Calendar#show
         * @protected
         */
        _onPopupBeforeShow: function (e) {

            var event = new $.Event({
                type: 'show'
            });

            /**
             * @event module:Calendar#show
             * @type {Event}
             */
            this.fire(event);

            if (event.isDefaultPrevented()) {
                e.preventDefault();
                return;
            }

            var date = this.date;

            if (date) {
                this.set('month', this._getMonthFirstDate(date));
            }
        },


        /**
         * 监听 module:Popup 的隐藏事件
         *
         * @fires module:Calendar#hide 隐藏事件
         * @param {Event} e `Popup`的`hide`事件对象
         * @protected
         */
        _onPopupHide: function (e) {
            /**
             * @event module:Calendar#hide
             */
            this.fire(e);
        },

        /**
         * 验证控件输入状态
         *
         * @return {boolean} 是否为指定格式的日期值
         * @public
         */
        checkValidity: function () {
            return this.validate();
        },

        /**
         * 验证控件
         *
         * @return {boolean} 验证结果
         * @public
         */
        validate: function () {
            var value = this.target.value;

            if (value) {
                var date = this.from(value);
                if (this.format(date) === value) {

                    var range = this.range;
                    var min   = '';
                    var max   = '9999-12-31';

                    if (range) {
                        min = range.begin
                            && this.format(range.begin, DATE_FORMAT)
                            || min;
                        max = range.end
                            && this.format(range.end, DATE_FORMAT)
                            || max;

                        value = this.format(date, DATE_FORMAT);

                        return value >= min && value <= max;
                    }
                    return true;
                }
            }

            return false;
        },

        dispose: function () {
            this.popup.dispose();
            this.popup = null;
        }


    });

    /**
     * 全局日期格式
     *
     * @const
     * @type {string}
     */
    Calendar.DATE_FORMAT = DATE_FORMAT;

    /**
     * 可选中的日期区间
     *
     * @const
     * @type {?Object}
     */
    Calendar.RANGE = RANGE;

    return Calendar;
});
