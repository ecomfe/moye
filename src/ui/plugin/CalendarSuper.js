/**
 * @file moye - CalendarSuper
 * @author leon(ludafa@outlook.com)
 * @module CalendarSuper
 * @extends module:Plugin
 */

define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');

    var YEAR_VIEW_CELL_COUNT = 24;
    var MONTH_VIEW_CELL_COUNT = 12;

    var CalendarSuper = Plugin.extend(/** @lends module:CalendarSuper.prototype */{

        $class: 'CalendarSuper',

        /**
         * 激活
         *
         * @public
         * @param {module:Tab} calendar 日历控件
         */
        activate: function (calendar) {

            this.$parent(calendar);

            this.control = calendar;

            this.onShow = $.proxy(this.onShow, this);
            this.onHide = $.proxy(this.onHide, this);

            calendar.getMonthTitleHTML = $.proxy(this.getControlMonthTitleHTML, this);

            calendar.on('show', this.onShow);
            calendar.on('hide', this.onHide);

            // 这里要做一个delay的处理
            // 原因是呢，如果直接把内容刷掉，事件源DOM也就不在popup中了，会导致popup隐藏起来
            // 反正这个货也只有一个参数，这样搞一下就可以解决问题啦
            this.showMonthView = lib.delay($.proxy(this.showMonthView, this), 10);
            this.showYearView = lib.delay($.proxy(this.showYearView, this), 10);

        },

        getControlMonthTitleHTML: function (date) {

            var control = this.control;
            var helper = control.helper;

            var year = date.getFullYear();
            var month = date.getMonth();

            var title = ''
                + '<label '
                +    'class="' + helper.getPartClassName('title-year') + '"'
                +    'data-role="calendar-view" '
                +    'data-action="view-year" '
                +    'data-year="' + year + '">'
                +     year + '年'
                +    '<i class="moye-icon">&#xe60e;</i>'
                + '</label>'
                + '<label '
                +     'class="' + helper.getPartClassName('title-month') + '"'
                +     'data-role="calendar-view" '
                +     'data-action="view-month" '
                +     'data-year="' + year + '" '
                +     'data-month="' + month + '">'
                +     (month + 1) + '月'
                +     '<i class="moye-icon">&#xe60e;</i>'
                + '</label>';

            return helper.getPartHTML(
                'month-title',
                'div',
                title,
                {
                    'data-role': 'calendar-month-title'
                }
            );

        },

        onShow: function () {

            var control = this.control;
            var main = control.popup.main;

            control.delegate(
                main,
                'click',
                '[data-role=calendar-view]',
                $.proxy(this.onInitialViewClicked, this)
            );

            $(main).addClass('plugin-calendar-month-view');

        },

        onHide: function () {

            this.control.undelegate(
                this.control.popup.main,
                'click',
                '[data-role=calendar-view]',
                $.proxy(this.onInitialViewClicked, this)
            );

            this.hideMonthView();
            this.hideYearView();

        },

        onInitialViewClicked: function (e) {

            var target = $(e.currentTarget);
            var action = target.data('action');

            switch (action) {

                case 'view-year':
                    this.showYearView(new Date(target.data('year'), 0, 1));
                    break;

                case 'view-month':
                    this.showMonthView(new Date(target.data('year'), target.data('month'), 1));
                    break;

            }

        },

        showYearView: function (date) {

            var control = this.control;

            date = date || control.parse(control.getValue()) || new Date();

            var main = this.yearView;

            if (!main) {
                main = control.helper.getPartHTML('year-view', 'div');
                main = this.yearView = $(main).appendTo(control.popup.main);
                main.on('click', '[data-action]', $.proxy(this.onClick, this));
            }

            main.html(this.getYearViewNavHTML(date) + this.getYearGridHTML(date)).show();
            this.isYearViewVisible = true;

        },

        getYearViewNavHTML: function (date) {

            var control = this.control;
            var helper = control.helper;
            var year = date.getFullYear();

            var begin = Math.floor(year / YEAR_VIEW_CELL_COUNT) * YEAR_VIEW_CELL_COUNT;
            var end = begin + YEAR_VIEW_CELL_COUNT;

            var isValid = this.isValid(
                new Date(begin - YEAR_VIEW_CELL_COUNT, 0, 1),
                new Date(end - YEAR_VIEW_CELL_COUNT, 0, 1)
            );

            var left = helper.getPartHTML(
                'year-view-pager-left',
                'div',
                isValid ? '<i class="moye-icon">' + control.pager.prev + '</i>' : '',
                {
                    'data-role': 'pager',
                    'data-direction': 'prev',
                    'data-action': isValid ? 'year-page' : '',
                    'data-year': year
                }
            );

            isValid = this.isValid(
                new Date(begin + YEAR_VIEW_CELL_COUNT, 0, 1),
                new Date(end + YEAR_VIEW_CELL_COUNT, 0, 1)
            );

            var right = helper.getPartHTML(
                'year-view-pager-right',
                'div',
                isValid ? '<i class="moye-icon">' + control.pager.next + '</i>' : '',
                {
                    'data-role': 'pager',
                    'data-direction': 'next',
                    'data-action': isValid ? 'year-page' : null,
                    'data-year': year
                }
            );

            var title = helper.getPartHTML(
                'year-view-title',
                'label',
                begin + '年 - ' + (end - 1) + '年',
                {
                    'data-role': 'year-view-title',
                    'data-action': 'hide'
                }
            );

            return helper.getPartHTML(
                'year-view-nav',
                'div',
                title + left + right
            );

        },

        getYearGridHTML: function (date) {

            var control = this.control;
            var helper = control.helper;
            var year = date.getFullYear();

            var begin = Math.floor(year / YEAR_VIEW_CELL_COUNT) * YEAR_VIEW_CELL_COUNT;
            var end = begin + YEAR_VIEW_CELL_COUNT;

            var grid = lib.range(begin, end);

            grid = lib.map(grid, function (year) {

                var begin = new Date(year, 0, 1);
                var end = new Date(begin);
                end.setYear(end.getFullYear() + 1);
                end.setDate(0);

                var isValid = this.isValid(begin, end);

                var className = ''
                    + helper.getPartClassName('year-view-cell')
                    + ' '
                    + (isValid ? '' : helper.getPartClassName('year-view-cell-disabled'));

                var action = isValid ? 'pick-year' : '';

                return ''
                    + '<td '
                    +     'class="' + className + '"'
                    +     'data-role="year-view-cell"'
                    +     'data-action="' + action + '"'
                    +     'data-year="' + year + '">'
                    +     year
                    + '</td>';

            }, this);

            grid = lib.reduce(
                grid,
                function (result, cell, index) {

                    var rowIndex = Math.floor(index / 4);
                    var row = result[rowIndex];

                    if (!row) {
                        row = result[rowIndex] = [];
                    }

                    row.push(cell);

                    return result;

                },
                []
            );

            grid = lib.map(grid, function (row) {
                return '<tr>' + row.join('') + '</tr>';
            });

            var popup = $(control.popup.main);

            return helper.getPartHTML(
                'month-view-grid',
                'table',
                grid.join(''),
                {
                    style: 'height:' + (popup.height() - popup.find('[data-role=calendar-month-title]').height()) + 'px'
                }
            );

        },

        hideYearView: function () {

            if (this.isYearViewVisible && this.yearView) {
                this.yearView.hide();
            }

            this.isYearViewVisible = false;
        },

        showMonthView: function (date) {

            var control = this.control;

            date = date || control.parse(control.getValue()) || new Date();

            var main = this.monthView;

            if (!main) {
                main = control.helper.getPartHTML('month-view', 'div');
                main = this.monthView = $(main)
                    .appendTo(control.popup.main)
                    .css({
                        'z-index': 9
                    });
                main.on('click', '[data-action]', $.proxy(this.onClick, this));
            }

            main.html(this.getMonthNavHTML(date) + this.getMonthGridHTML(date)).show();
            this.isMonthViewVisible = true;

        },

        hideMonthView: function () {

            if (this.isMonthViewVisible && this.monthView) {
                this.monthView.hide();
            }

            this.isMonthViewVisible = false;
        },

        hasIntersection: function (range1, range2) {
            return !(range1.begin > range2.end || range1.end < range2.begin);
        },

        isValid: function (begin, end) {

            var control = this.control;
            var range = control.range;

            if (!range) {
                return true;
            }

            return this.hasIntersection(
                {
                    begin: control.parse(range.begin),
                    end: control.parse(range.end)
                },
                {
                    begin: begin,
                    end: end
                }
            );

        },

        getMonthNavHTML: function (date) {

            var control = this.control;
            var helper = control.helper;
            var year = date.getFullYear();

            var isValid = this.isValid(new Date(year - 1, 0, 1), new Date(year - 1, 11, 31));

            var left = helper.getPartHTML(
                'month-view-pager-left',
                'div',
                isValid ? '<i class="moye-icon">' + control.pager.prev + '</i>' : '',
                {
                    'data-role': 'pager',
                    'data-direction': 'prev',
                    'data-action': isValid ? 'month-page' : '',
                    'data-year': year
                }
            );

            isValid = this.isValid(new Date(year + 1, 0, 1), new Date(year + 1, 11, 31));

            var right = helper.getPartHTML(
                'month-view-pager-right',
                'div',
                isValid ? '<i class="moye-icon">' + control.pager.next + '</i>' : '',
                {
                    'data-role': 'pager',
                    'data-direction': 'next',
                    'data-action': isValid ? 'month-page' : '',
                    'data-year': year
                }
            );

            var title = helper.getPartHTML(
                'month-view-title',
                'label',
                year + '年',
                {
                    'data-role': 'month-view-title',
                    'data-action': 'hide'
                }
            );

            return helper.getPartHTML(
                'month-view-nav',
                'div',
                title + left + right
            );

        },

        getMonthGridHTML: function (date) {

            var control = this.control;
            var helper = control.helper;
            var year = date.getFullYear();

            // 先把12个月份的Cell弄出来
            var grid = lib.map(
                lib.range(1, MONTH_VIEW_CELL_COUNT + 1),
                function (i) {

                    var begin = new Date(year, i - 1, 1);
                    var end = new Date(begin);
                    end.setMonth(end.getMonth() + 1);
                    end.setDate(0);

                    var isValid = this.isValid(begin, end);

                    var className = ''
                        + helper.getPartClassName('month-view-cell')
                        + ' '
                        + (isValid ? '' : helper.getPartClassName('month-view-cell-disabled'));

                    var action = isValid ? 'pick-month' : '';

                    return ''
                        + '<td data-month="' + i + '" '
                        +     'data-role="month-view-cell" '
                        +     'data-action="' + action + '"'
                        +     'data-year="' + year + '"'
                        +     'data-month="' + i + '"'
                        +     'class="' + className + '">'
                        +     i + '月'
                        + '</td>';
                },
                this
            );

            // 分成4组
            grid = lib.reduce(
                grid,
                function (result, cell, index) {

                    var rowIndex = Math.floor(index / 3);
                    var row = result[rowIndex];

                    if (!row) {
                        row = result[rowIndex] = [];
                    }

                    row.push(cell);

                    return result;
                },
                []
            );

            // 再拼成行
            grid = lib.map(grid, function (row) {
                return '<tr>' + row.join('') + '</tr>';
            });

            var popup = $(control.popup.main);

            return helper.getPartHTML(
                'month-view-grid',
                'table',
                grid.join(''),
                {
                    style: 'height:' + (popup.height() - popup.find('[data-role=calendar-month-title]').height()) + 'px'
                }
            );

        },

        pickMonth: function (year, month) {
            this.control.set('month', new Date(year, month - 1, 1));
            this.hideMonthView();
        },

        pickYear: function (year) {
            this.showMonthView(new Date(year, 0, 1));
            this.hideYearView();
        },

        onClick: function (e) {

            var target = $(e.currentTarget);
            var action = target.data('action');

            var year;

            switch (action) {

                case 'year-page':
                    year = target.data('year');
                    year += (target.data('direction') === 'next' ? 1 : -1) * YEAR_VIEW_CELL_COUNT;
                    this.showYearView(new Date(year, 1, 1));
                    break;

                case 'month-page':
                    year = target.data('year');
                    year += target.data('direction') === 'next' ? 1 : -1;
                    this.showMonthView(new Date(year, 1, 1));
                    break;

                case 'pick-year':
                    this.pickYear(target.data('year'));
                    break;

                case 'pick-month':
                    this.pickMonth(target.data('year'), target.data('month'));
                    break;

                case 'hide':
                    this.hideYearView();
                    this.hideMonthView();
                    break;
            }

        },

        /**
         * 去激活
         *
         * @public
         * @override
         */
        inactivate: function () {

            var control = this.control;

            var main = control.popup.main;

            control.undelegate(
                main,
                'click',
                '[data-role=calendar-month-title]',
                this.toggle
            );

            if (main) {
                $(main).removeClass('plugin-calendar-month-view');
            }

            control.un('show', this.onShow);
            control.un('hide', this.onHide);

            if (this.monthView) {
                this.monthView.off('click');
                this.monthView.remove();
                this.monthView = null;
            }

            if (this.yearView) {
                this.yearView.off('click');
                this.yearView.remove();
                this.yearView = null;
            }

            this.control = null;

        }

    });

    return CalendarSuper;
});
