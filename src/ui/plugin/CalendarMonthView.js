/**
 * @file moye - CalendarMonthView
 * @author leon(ludafa@outlook.com)
 * @module CalendarMonthView
 * @extends module:Plugin
 */

define(function (require) {

    var $ = require('jquery');
    var Plugin = require('./Plugin');
    var lib = require('../lib');

    var CalendarMonthView = Plugin.extend(/** @lends module:CalendarMonthView.prototype */{

        $class: 'CalendarMonthView',

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
            this.toggle = $.proxy(this.toggle, this);

            calendar.on('show', this.onShow);
            calendar.on('hide', this.onHide);

            // 这里要做一个delay的处理
            // 原因是呢，如果直接把内容刷掉，事件源DOM也就不在popup中了，会导致popup隐藏起来
            // 反正这个货也只有一个参数，这样搞一下就可以解决问题啦
            this.show = lib.delay($.proxy(this.show, this), 10);

            this.main = null;

        },

        onShow: function () {

            var control = this.control;
            var main = control.popup.main;

            control.delegate(
                main,
                'click',
                '[data-role=calendar-month-title]',
                this.toggle
            );

            $(main).addClass('plugin-calendar-month-view');

        },

        onHide: function () {

            this.control.undelegate(
                this.control.popup.main,
                'click',
                '[data-role=calendar-month-title]',
                this.toggle
            );

            this.hide();

        },

        toggle: function () {
            this.isVisible ? this.hide() : this.show();
        },

        hide: function () {

            if (this.isVisible && this.main) {
                this.main.hide();
            }

            this.isVisible = false;
        },

        show: function (date) {

            var control = this.control;

            date = date || control.parse(control.getValue()) || new Date();

            var main = this.main;

            if (!main) {
                main = control.helper.getPartHTML('month-view', 'div');
                main = this.main = $(main).appendTo(control.popup.main);
                main.on('click', '[data-action]', $.proxy(this.onClick, this));
            }

            main.html(this.getNavHTML(date) + this.getGridHTML(date)).show();
            this.isVisible = true;

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

        getNavHTML: function (date) {

            var control = this.control;
            var helper = control.helper;
            var year = date.getFullYear();

            var left = this.isValid(new Date(year - 1, 0, 1), new Date(year - 1, 11, 31))
                ? helper.getPartHTML(
                    'month-view-pager-left',
                    'i',
                    '<i class="moye-icon">' + control.pager.prev + '</i>',
                    {
                        'data-role': 'pager',
                        'data-direction': 'prev',
                        'data-action': 'page',
                        'data-year': year
                    }
                )
                : '';

            var right = this.isValid(new Date(year + 1, 0, 1), new Date(year + 1, 11, 31))
                ? helper.getPartHTML(
                    'month-view-pager-right',
                    'i',
                    '<i class="moye-icon">' + control.pager.next + '</i>',
                    {
                        'data-role': 'pager',
                        'data-direction': 'next',
                        'data-action': 'page',
                        'data-year': year
                    }
                )
                : '';

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

        getGridHTML: function (date) {

            var control = this.control;
            var helper = control.helper;
            var year = date.getFullYear();

            // 先把12个月份的Cell弄出来
            var grid = lib.map(
                lib.range(1, 13),
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

                    var action = isValid ? 'pick' : '';

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

        pick: function (year, month) {
            this.control.set('month', new Date(year, month - 1, 1));
            this.hide();
        },

        onClick: function (e) {

            var target = $(e.currentTarget);
            var action = target.data('action');

            switch (action) {
                case 'page':
                    var year = target.data('year');
                    year += target.data('direction') === 'next' ? 1 : -1;
                    this.show(new Date(year, 1, 1));
                    break;

                case 'pick':
                    this.pick(target.data('year'), target.data('month'));
                    break;

                case 'hide':
                    this.hide();
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

            if (this.main) {
                this.main.off('click');
                this.main.remove();
                this.main = null;
            }

            this.control = null;

        }

    });

    return CalendarMonthView;
});
