define('ui/Calendar', [
    'require',
    'jquery',
    './lib',
    './Control',
    './Popup'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var Popup = require('./Popup');
    var DATE_FORMAT = 'yyyy-MM-dd';
    function pad(n) {
        return (n > 9 ? '' : '0') + n;
    }
    var cache = {};
    var privates = {
            onClick: function (args) {
                var e = args.event;
                if (!e) {
                    return;
                }
                var el = e.target;
                var tag = el.tagName;
                var target = this.target;
                var $el = $(el);
                while (tag !== 'A' && el !== this.main) {
                    el = el.parentNode;
                    tag = el.tagName;
                }
                switch (tag) {
                case 'A':
                    e.preventDefault();
                    var prefix = this.options.prefix;
                    var preClass = prefix + '-pre';
                    var nextClass = prefix + '-next';
                    var disClass = prefix + '-disabled';
                    if ($el.hasClass(preClass)) {
                        privates.showPreMonth.call(this);
                        e.stopPropagation();
                    } else if ($el.hasClass(nextClass)) {
                        privates.showNextMonth.call(this);
                        e.stopPropagation();
                    } else if (!$el.hasClass(disClass)) {
                        el.getAttribute('data-date') && privates.pick.call(this, el);
                    }
                    break;
                default:
                    if (target) {
                        target.select();
                    }
                    break;
                }
                this.fire('click', args);
            },
            onBeforeShow: function (arg) {
                this.fire('beforeShow', arg);
                var popup = this.popup;
                var target = this.target;
                var value = target.value;
                if (value) {
                    value = this.from(value);
                    this.value = this.format(value);
                }
                if (!popup.content) {
                    this.date = this.from(value || this.value);
                    privates.build.call(this);
                }
                var lastDate = this.lastDate || '';
                var lastTarget = this.lastTarget;
                var current = privates.getYYYYMM.call(this, this.date);
                var yM = privates.getYYYYMM.call(this, value);
                if (lastDate && lastDate !== this.format(value) || current !== yM) {
                    this.date = this.from(value || this.value);
                    lastDate = lastDate && privates.getYYYYMM.call(this, lastDate);
                    if (lastDate !== yM || current !== yM) {
                        privates.build.call(this);
                    } else {
                        privates.updateStatus.call(this);
                    }
                } else if (value !== lastDate || target !== lastTarget) {
                    privates.updateStatus.call(this);
                }
            },
            onHide: function () {
                this.fire('hide');
            },
            showPreMonth: function () {
                var date = this.date;
                date.setDate(0);
                privates.build.call(this, date);
            },
            showNextMonth: function () {
                var date = this.date;
                date.setDate(1);
                date.setMonth(date.getMonth() + 1);
                privates.build.call(this, date);
            },
            updateStatus: function () {
                var options = this.options;
                var prefix = options.prefix;
                var process = options.process;
                var first = options.first;
                var now = new Date();
                var checkedValue = this.target.value && this.format(this.from(this.value), DATE_FORMAT);
                var nowValue = this.format(now, DATE_FORMAT);
                var range = this.range;
                var min = '';
                var max = '9999-12-31';
                if (range) {
                    min = range.begin && this.format(range.begin, DATE_FORMAT) || min;
                    max = range.end && this.format(range.end, DATE_FORMAT) || max;
                }
                var preClass = prefix + '-pre-month';
                var nextClass = prefix + '-next-month';
                var disClass = prefix + '-disabled';
                var todayClass = prefix + '-today';
                var checkedClass = prefix + '-checked';
                var weekendClass = prefix + '-weekend';
                var monthes = this.main.getElementsByTagName('p');
                var i, len, j, day, days, klass, value, className, inRange;
                for (i = 0, len = monthes.length; i < len; i++) {
                    days = monthes[i].getElementsByTagName('a');
                    for (j = 0; day = days[j]; j++) {
                        klass = [];
                        value = day.getAttribute('data-date');
                        className = day.className;
                        inRange = true;
                        if (range && (value < min || value > max)) {
                            klass.push(disClass);
                            inRange = false;
                        }
                        var mod = j % 7;
                        if (mod === 6 || first && mod === 5 || !first && mod === 0) {
                            klass.push(weekendClass);
                        }
                        if (~className.indexOf(preClass)) {
                            klass.push(preClass);
                        } else if (~className.indexOf(nextClass)) {
                            klass.push(nextClass);
                        } else {
                            if (value === nowValue) {
                                klass.push(todayClass);
                            }
                            if (inRange && value === checkedValue) {
                                klass.push(checkedClass);
                            }
                        }
                        if (process) {
                            process.call(this, day, klass, value, inRange);
                        }
                        day.className = klass.join(' ');
                    }
                }
            },
            getYYYYMM: function (date) {
                return typeof date === 'string' ? date : this.format(this.from(date), 'yyyyMM');
            },
            build: function (date) {
                var options = this.options;
                var html = [];
                date = date || this.date;
                var year = date.getFullYear();
                var month = date.getMonth();
                var current;
                for (var i = 0, len = options.monthes; i < len; i++) {
                    current = new Date(year, month + i, 1);
                    html.push(privates.buildMonth.call(this, current));
                }
                var prefix = options.prefix;
                html.push('<a href="#" class="' + prefix + '-pre"></a>');
                html.push('<a href="#" class="' + prefix + '-next"></a>');
                var popup = this.popup;
                popup.content = html.join('');
                popup.render();
                privates.updateStatus.call(this);
                privates.updatePrevNextStatus.call(this, date);
            },
            buildMonth: function (date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var today = date.getDate();
                var day = date.getDay();
                var cached = cache[this.cacheKey];
                var cacheKey = year + pad(month);
                if (cached[cacheKey]) {
                    return cached[cacheKey];
                }
                var weeks = 7;
                var rows = 6;
                var separator = '-';
                var options = this.options;
                var prefix = options.prefix;
                var html = ['<div class="' + prefix + '-month">'];
                var json = {
                        year: year,
                        month: month,
                        prefix: prefix
                    };
                var title = options.lang.title.replace(/\{([^\}]+)\}/g, function ($, key) {
                        return json[key] || '';
                    });
                html.push('<h3>' + title + '</h3>');
                var i;
                var len;
                var klass;
                var firstDay = options.first;
                var days = this.days;
                html.push('<ul class="c-clearfix">');
                for (i = 0, len = days.length; i < len; i++) {
                    klass = i === weeks - 1 || firstDay && i === weeks - 2 || !firstDay && i === firstDay ? ' class="' + prefix + '-weekend"' : '';
                    html.push('<li' + klass + '>' + days[i] + '</li>');
                }
                html.push('</ul>');
                html.push('<p class="c-clearfix">');
                var y;
                var M;
                var d;
                var yM;
                var week = 0;
                var first = (weeks + day + 1 - today % weeks) % weeks;
                len = first - firstDay;
                if (len > 0) {
                    date.setDate(0);
                    y = date.getFullYear();
                    M = date.getMonth() + 1;
                    d = date.getDate();
                    yM = [
                        y,
                        pad(M),
                        ''
                    ].join(separator);
                    klass = prefix + '-pre-month';
                    for (i = d - len + 1; i <= d; i++) {
                        week = week % weeks;
                        html.push('' + '<a href="#" hidefocus' + ' class="' + klass + '"' + ' data-date="' + yM + pad(i) + '"' + ' data-week="' + week + '"' + '>' + i + '</a>');
                        week++;
                    }
                    date.setDate(d + 1);
                }
                date.setDate(1);
                date.setMonth(month);
                date.setDate(0);
                yM = [
                    year,
                    pad(month),
                    ''
                ].join(separator);
                for (i = 1, len = date.getDate(); i <= len; i++) {
                    week = week % weeks;
                    html.push('' + '<a href="#" hidefocus ' + ' data-date="' + yM + pad(i) + '"' + ' data-week="' + week + '"' + '>' + i + '</a>');
                    week++;
                }
                date.setDate(len + 1);
                y = date.getFullYear();
                M = date.getMonth() + 1;
                yM = [
                    y,
                    pad(M),
                    ''
                ].join(separator);
                klass = prefix + '-next-month';
                len = weeks * rows - (len + Math.max(0, first - firstDay));
                for (i = 1; i <= len; i++) {
                    week = week % weeks;
                    html.push('' + '<a href="#" hidefocus' + ' class="' + klass + '"' + ' data-date="' + yM + pad(i) + '"' + ' data-week="' + week + '"' + '>' + i + '</a>');
                    week++;
                }
                html.push('</p>');
                html.push('</div>');
                cached[cacheKey] = html.join('');
                return cached[cacheKey];
            },
            updatePrevNextStatus: function (date) {
                var options = this.options;
                var prefix = options.prefix;
                var range = this.range;
                var prev = $('.' + prefix + '-pre', this.main);
                var next = $('.' + prefix + '-next', this.main);
                date = date || this.date || this.from(this.value);
                prev[!range || !range.begin || privates.getYYYYMM.call(this, range.begin) < privates.getYYYYMM.call(this, date) ? 'show' : 'hide']();
                var last = new Date(date.getFullYear(), date.getMonth() + options.monthes - 1, 1);
                next[!range || !range.end || privates.getYYYYMM.call(this, range.end) > privates.getYYYYMM.call(this, last) ? 'show' : 'hide']();
            },
            pick: function (el) {
                var value = el.getAttribute('data-date');
                var week = el.getAttribute('data-week');
                var target = this.target;
                var date = this.from(value, DATE_FORMAT);
                value = this.format(date);
                this.lastDate = value;
                if (target) {
                    if (target.type) {
                        target.value = value;
                        target.focus();
                    } else {
                        target.innerHTML = value;
                    }
                }
                this.fire('pick', {
                    value: value,
                    week: this.options.lang.week + this.days[week],
                    date: date
                });
                this.hide();
            }
        };
    var Calendar = Control.extend({
            type: 'Calendar',
            options: {
                disabled: false,
                main: '',
                prefix: 'ecl-ui-cal',
                target: '',
                triggers: '',
                dateFormat: '',
                range: null,
                value: '',
                process: null,
                monthes: 2,
                first: 0,
                lang: {
                    week: '\u5468',
                    days: '\u65E5,\u4E00,\u4E8C,\u4E09,\u56DB,\u4E94,\u516D',
                    title: '{year}\u5E74{month}\u65E5'
                }
            },
            init: function (options) {
                this.bindEvents(privates);
                this._disabled = options.disabled;
                this.dateFormat = options.dateFormat || Calendar.DATE_FORMAT || DATE_FORMAT;
                this.days = options.lang.days.split(',');
                this.value = this.format(this.from(options.value));
                var key = this.cacheKey = options.first + '-' + options.lang.title;
                cache[key] = cache[key] || {};
                this.setRange(options.range || Calendar.RANGE);
            },
            from: function (value, format) {
                format = format || this.dateFormat;
                if (lib.isString(value)) {
                    if (!value) {
                        return new Date();
                    }
                    format = format.split(/[^yMdW]+/i);
                    value = value.split(/\D+/);
                    var map = {};
                    for (var i = 0, l = format.length; i < l; i++) {
                        if (format[i] && value[i] && (format[i].length > 1 && value[i].length === format[i].length || format[i].length === 1)) {
                            map[format[i].toLowerCase()] = value[i];
                        }
                    }
                    var year = map.yyyy || map.y || (map.yy < 50 ? '20' : '19') + map.yy;
                    var month = (map.m || map.mm) | 0;
                    var date = (map.d || map.dd) | 0;
                    return new Date(year | 0, month - 1, date);
                }
                return value;
            },
            format: function (date, format) {
                format = (format || this.dateFormat).toLowerCase();
                if (lib.isString(date)) {
                    date = this.from(date);
                }
                var options = this.options;
                var first = options.first;
                var y = date.getFullYear();
                var M = date.getMonth() + 1;
                var d = date.getDate();
                var week = date.getDay();
                if (first) {
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
                        ww: options.lang.week + week
                    };
                return format.replace(/y+|M+|d+|W+/gi, function ($0) {
                    return map[$0] || '';
                });
            },
            render: function () {
                var options = this.options;
                if (!this.rendered) {
                    this.rendered = true;
                    var popup = this.popup = new Popup(this.srcOptions);
                    this.addChild(popup);
                    var bound = this._bound;
                    popup.on('click', bound.onClick);
                    popup.on('hide', bound.onHide);
                    popup.on('beforeShow', bound.onBeforeShow);
                    this.main = popup.main;
                    $(this.main).addClass('c-clearfix');
                    if (options.target) {
                        this.setTarget(lib.g(options.target));
                    }
                }
                return this;
            },
            setTarget: function (target) {
                if (!target || target.nodeType !== 1) {
                    throw new Error('target \u4E3A null \u6216\u975E Element \u8282\u70B9');
                }
                this.target = target;
                if (this.popup) {
                    this.popup.target = target;
                }
            },
            show: function (target) {
                this.popup.show();
                this.fire('show', { target: target });
            },
            hide: function () {
                this.popup.hide();
            },
            checkValidity: function () {
                return this.validate();
            },
            getValue: function () {
                var date = this.date;
                var target = this.target;
                return this.format(date || target && target.value || this.value);
            },
            getValueAsDate: function () {
                return this.from(this.getValue());
            },
            setRange: function (range) {
                if (!range) {
                    return;
                }
                var begin = range.begin;
                var end = range.end;
                if (begin && lib.isString(begin)) {
                    range.begin = this.from(begin);
                }
                if (end && lib.isString(end)) {
                    range.end = this.from(end);
                }
                this.range = range;
                privates.updatePrevNextStatus.call(this);
            },
            setValue: function (value) {
                this.date = this.from(value);
                this.value = this.format(this.date);
                privates.build.call(this);
            },
            validate: function () {
                var value = this.target.value;
                if (value) {
                    var date = this.from(value);
                    if (this.format(date) === value) {
                        var range = this.range;
                        var min = '';
                        var max = '9999-12-31';
                        if (range) {
                            min = range.begin && this.format(range.begin, DATE_FORMAT) || min;
                            max = range.end && this.format(range.end, DATE_FORMAT) || max;
                            value = this.format(date, DATE_FORMAT);
                            return value >= min && value <= max;
                        }
                        return true;
                    }
                }
                return false;
            }
        });
    Calendar.DATE_FORMAT = DATE_FORMAT;
    Calendar.RANGE = null;
    return Calendar;
});