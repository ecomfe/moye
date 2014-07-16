define('ui/Lunar', [
    'require',
    'jquery',
    './lib',
    './Control'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var lunarInfo = [
            19416,
            19168,
            42352,
            21717,
            53856,
            55632,
            21844,
            22191,
            39632,
            21970,
            19168,
            42422,
            42192,
            53840,
            53909,
            46415,
            54944,
            44450,
            38320,
            18807,
            18815,
            42160,
            46261,
            27216,
            27968,
            43860,
            11119,
            38256,
            21234,
            18800,
            25958,
            54432,
            59984,
            27285,
            23263,
            11104,
            34531,
            37615,
            51415,
            51551,
            54432,
            55462,
            46431,
            22176,
            42420,
            9695,
            37584,
            53938,
            43344,
            46423,
            27808,
            46416,
            21333,
            19887,
            42416,
            17779,
            21183,
            43432,
            59728,
            27296,
            44710,
            43856,
            19296,
            43748,
            42352,
            21088,
            62051,
            55632,
            23383,
            22176,
            38608,
            19925,
            19152,
            42192,
            54484,
            53840,
            54616,
            46400,
            46752,
            38310,
            38335,
            18864,
            43380,
            42160,
            45690,
            27216,
            27968,
            44870,
            43872,
            38256,
            19189,
            18800,
            25776,
            29859,
            59984,
            27480,
            23232,
            43872,
            38613,
            37600,
            51552,
            55636,
            54432,
            55888,
            30034,
            22176,
            43959,
            9680,
            37584,
            51893,
            43344,
            46240,
            47780,
            44368,
            21977,
            19360,
            42416,
            20854,
            21183,
            43312,
            31060,
            27296,
            44368,
            23378,
            19296,
            42726,
            42208,
            53856,
            60005,
            54576,
            23200,
            30371,
            38608,
            19195,
            19152,
            42192,
            53430,
            53855,
            54560,
            56645,
            46496,
            22224,
            21938,
            18864,
            42359,
            42160,
            43600,
            45653,
            27951,
            44448,
            19299,
            37759,
            18936,
            18800,
            25776,
            26790,
            59999,
            27424,
            42692,
            43759,
            37600,
            53987,
            51552,
            54615,
            54432,
            55888,
            23893,
            22176,
            42704,
            21972,
            21200,
            43448,
            43344,
            46240,
            46758,
            44368,
            21920,
            43940,
            42416,
            21168,
            45683,
            26928,
            29495,
            27296,
            44368,
            19285,
            19311,
            42352,
            21732,
            53856,
            59752,
            54560,
            55968,
            27302,
            22239,
            19168,
            43476,
            42192,
            53584,
            62034,
            54560
        ];
    function lYearDays(y) {
        var days = 348 + (lunarInfo[y - 1900] >> 4).toString(2).replace(/0/g, '').length;
        return days + leapDays(y);
    }
    function leapDays(y) {
        return leapMonth(y) ? (lunarInfo[y - 1899] & 15) === 15 ? 30 : 29 : 0;
    }
    function leapMonth(y) {
        var lm = lunarInfo[y - 1900] & 15;
        return lm === 15 ? 0 : lm;
    }
    function monthDays(y, m) {
        return lunarInfo[y - 1900] & 65536 >> m ? 30 : 29;
    }
    var solarTerm = [
            '\u5C0F\u5BD2',
            '\u5927\u5BD2',
            '\u7ACB\u6625',
            '\u96E8\u6C34',
            '\u60CA\u86F0',
            '\u6625\u5206',
            '\u6E05\u660E',
            '\u8C37\u96E8',
            '\u7ACB\u590F',
            '\u5C0F\u6EE1',
            '\u8292\u79CD',
            '\u590F\u81F3',
            '\u5C0F\u6691',
            '\u5927\u6691',
            '\u7ACB\u79CB',
            '\u5904\u6691',
            '\u767D\u9732',
            '\u79CB\u5206',
            '\u5BD2\u9732',
            '\u971C\u964D',
            '\u7ACB\u51AC',
            '\u5C0F\u96EA',
            '\u5927\u96EA',
            '\u51AC\u81F3'
        ];
    var sTermInfo = [
            0,
            21208,
            42467,
            63836,
            85337,
            107014,
            128867,
            150921,
            173149,
            195551,
            218072,
            240693,
            263343,
            285989,
            308563,
            331033,
            353350,
            375494,
            397447,
            419210,
            440795,
            462224,
            483532,
            504758
        ];
    var solarTermAdjust = {
            19762: 1,
            19802: 1,
            20092: 1,
            20129: -1,
            201222: 1,
            20132: 1,
            201313: -1,
            201323: 1,
            20144: 1,
            20150: 1,
            201622: 1,
            201713: -1,
            201723: -1,
            20183: 1,
            20185: 1,
            20192: -1,
            201911: -1,
            202012: -1,
            202015: -1,
            202022: 1
        };
    function sTerm(y, n) {
        var offDate = new Date(31556925974.7 * (y - 1900) + sTermInfo[n] * 60000 + Date.UTC(1900, 0, 6, 2, 5));
        return offDate.getUTCDate() + (solarTermAdjust[y + '' + n] || 0);
    }
    function getSolarTerm(date) {
        var y = date.getFullYear();
        var m = date.getMonth();
        var d = date.getDate();
        var text = d === sTerm(y, m * 2) ? solarTerm[m * 2] : d === sTerm(y, m * 2 + 1) ? solarTerm[m * 2 + 1] : '';
        return text ? {
            type: 'solar-term',
            text: text
        } : null;
    }
    var lFtv = {
            '0100': '\u9664\u5915',
            '0101': '\u6625\u8282',
            '0115': '\u5143\u5BB5\u8282',
            '0202': '\u9F99\u62AC\u5934',
            '0505': '\u7AEF\u5348\u8282',
            '0707': '\u4E03\u5915',
            '0715': '\u4E2D\u5143\u8282',
            '0815': '\u4E2D\u79CB\u8282',
            '0909': '\u91CD\u9633\u8282',
            '1208': '\u814A\u516B\u8282',
            '1223': '\u5C0F\u5E74'
        };
    function getLunarFestival(lunar) {
        if (lunar.month === 11 && lunar.day > 28) {
            var next = new Date(lunar.solar.getTime() + 1000 * 60 * 60 * 24);
            next = getLunarInfo(next);
            if (next.day === 1) {
                lunar.month = 0;
                lunar.day = 0;
            }
        }
        var text = lunar.leap ? '' : lFtv[pad(lunar.month + 1) + pad(lunar.day)] || '';
        return text ? {
            type: 'lunar-festival',
            text: text
        } : null;
    }
    var sFtv = {
            '0101': '\u5143\u65E6',
            '0214': '\u60C5\u4EBA\u8282',
            '0308': '\u5987\u5973\u8282',
            '0312': '\u690D\u6811\u8282',
            '0401': '\u611A\u4EBA\u8282',
            '0422': '\u5730\u7403\u65E5',
            '0501': '\u52B3\u52A8\u8282',
            '0504': '\u9752\u5E74\u8282',
            '0531': '\u65E0\u70DF\u65E5',
            '0601': '\u513F\u7AE5\u8282',
            '0606': '\u7231\u773C\u65E5',
            '0701': '\u5EFA\u515A\u65E5',
            '0707': '\u6297\u6218\u7EAA\u5FF5\u65E5',
            '0801': '\u5EFA\u519B\u8282',
            '0910': '\u6559\u5E08\u8282',
            '0918': '\u4E5D\xB7\u4E00\u516B\u7EAA\u5FF5\u65E5',
            '1001': '\u56FD\u5E86\u8282',
            '1031': '\u4E07\u5723\u8282',
            '1111': '\u5149\u68CD\u8282',
            '1201': '\u827E\u6ECB\u75C5\u65E5',
            '1213': '\u5357\u4EAC\u5927\u5C60\u6740\u7EAA\u5FF5\u65E5',
            '1224': '\u5E73\u5B89\u591C',
            '1225': '\u5723\u8BDE\u8282'
        };
    function getSolarFestival(date) {
        var text = sFtv[pad(date.getMonth() + 1) + pad(date.getDate())];
        return text ? {
            type: 'solar-festival',
            text: text
        } : null;
    }
    var wFtv = {
            '0150': '\u56FD\u9645\u9EBB\u98CE\u8282',
            '0520': '\u6BCD\u4EB2\u8282',
            '0630': '\u7236\u4EB2\u8282',
            '1144': '\u611F\u6069\u8282'
        };
    function getSolarWeakFestival(date) {
        var day = date.getDay();
        var keys = [
                pad(date.getMonth() + 1),
                day
            ];
        var today = date.getDate();
        var firstDay = (7 + day - (today - 1)) % 7;
        var lastDate = new Date(date.getFullYear(), keys[0], 0);
        var lastDay = lastDate.getDay();
        var days = lastDate.getDate();
        var seq = Math.ceil((today + firstDay - 1) / 7) + (day < firstDay ? 0 : 1);
        var qes = 4 + Math.floor((day + days - today) / 7) + (lastDay < day ? 0 : 1);
        var text = wFtv[keys.join(seq)] || wFtv[keys.join(qes)];
        return text ? {
            type: 'solar-weak-festival',
            text: text
        } : null;
    }
    function getFestival(date, lunar) {
        return getLunarFestival(lunar) || getSolarFestival(date) || getSolarWeakFestival(date) || getSolarTerm(date);
    }
    function getLunarInfo(date) {
        var i, leap = 0, temp = 0;
        var offset = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
        for (i = 1900; i < 2100 && offset > 0; i++) {
            temp = lYearDays(i);
            offset -= temp;
        }
        if (offset < 0) {
            offset += temp;
            i--;
        }
        var year = i;
        leap = leapMonth(i);
        var isLeap = false;
        for (i = 1; i < 13 && offset > 0; i++) {
            if (leap > 0 && i === leap + 1 && !isLeap) {
                --i;
                isLeap = true;
                temp = leapDays(year);
            } else {
                temp = monthDays(year, i);
            }
            if (isLeap && i === leap + 1) {
                isLeap = false;
            }
            offset -= temp;
        }
        if (offset === 0 && leap > 0 && i === leap + 1) {
            if (isLeap) {
                isLeap = false;
            } else {
                isLeap = true;
                --i;
            }
        }
        if (offset < 0) {
            offset += temp;
            --i;
        }
        return {
            year: year,
            month: i - 1,
            day: offset + 1,
            leap: isLeap,
            solar: date
        };
    }
    function getLunarDay(date, classPrefix) {
        var lunar = getLunarInfo(date);
        var month = lunar.month;
        var day = lunar.day;
        var decimals = [
                '\u521D',
                '\u5341',
                '\u5EFF',
                '\u5345',
                '\u534C'
            ];
        var units = [
                '\u65E5',
                '\u4E00',
                '\u4E8C',
                '\u4E09',
                '\u56DB',
                '\u4E94',
                '\u516D',
                '\u4E03',
                '\u516B',
                '\u4E5D',
                '\u5341'
            ];
        var months = [
                '\u6B63',
                '\u4E8C',
                '\u4E09',
                '\u56DB',
                '\u4E94',
                '\u516D',
                '\u4E03',
                '\u516B',
                '\u4E5D',
                '\u5341',
                '\u5341\u4E00',
                '\u814A'
            ];
        var result = getFestival(date, lunar);
        var text;
        if (!result) {
            if (day === 1) {
                text = (lunar.leap ? '\u95F0' : '') + months[month] + '\u6708';
            } else if (day % 10 > 0) {
                text = decimals[day / 10 | 0] + units[day % 10];
            } else {
                text = (day > 10 ? units[day / 10] : decimals[0]) + units[10];
            }
            result = {
                type: 'lunar',
                text: text
            };
        }
        return '' + '<span class="' + classPrefix + '-' + result.type + '">' + result.text + '</span>';
    }
    var DATE_FORMAT = 'yyyy-MM-dd';
    function pad(n) {
        return (n > 9 ? '' : '0') + n;
    }
    var cache = {};
    var privates = {
            getYYYYMM: function (date) {
                return lib.isString(date) ? date : this.format(this.from(date), 'yyyyMM');
            },
            build: function (date) {
                date = new Date((date || this.date).getTime());
                this.monthElement.innerHTML = privates.buildMonth.call(this, date);
                privates.updateStatus.call(this);
                privates.updatePrevNextStatus.call(this, date);
                this.fire('navigate', {
                    date: date,
                    yyyyMM: privates.getYYYYMM.call(this, date)
                });
            },
            updatePrevNextStatus: function (date) {
                var options = this.options;
                var prefix = options.prefix;
                var range = this.range;
                var prev = $(prefix + '-pre', this.main);
                var next = $(prefix + '-next', this.main);
                date = date || this.date || this.from(this.value);
                var dateYYYYMM = privates.getYYYYMM.call(this, date);
                prev[!range || !range.begin || privates.getYYYYMM.call(this, range.begin) < dateYYYYMM ? 'show' : 'hide']();
                next[!range || !range.end || privates.getYYYYMM.call(this, range.end) > dateYYYYMM ? 'show' : 'hide']();
            },
            buildMonth: function (date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var today = date.getDate();
                var day = date.getDay();
                var cacheKey = year + pad(month);
                if (cache[cacheKey]) {
                    return cache[cacheKey];
                }
                var weeks = 7;
                var separator = '-';
                var options = this.options;
                var prefix = options.prefix;
                var html = [];
                html.push('<h3>' + year + '\u5E74' + month + '\u6708</h3>');
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
                        date.setDate(i);
                        html.push('' + '<a href="#" hidefocus' + ' class="' + klass + '"' + ' data-date="' + yM + pad(i) + '"' + ' data-week="' + week + '"' + '>' + i + ' ' + getLunarDay(date, prefix) + '</a>');
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
                    date.setDate(i);
                    html.push('' + '<a href="#" hidefocus ' + ' data-date="' + yM + pad(i) + '"' + ' data-week="' + week + '"' + '>' + i + ' ' + getLunarDay(date, prefix) + '</a>');
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
                len = (len + Math.max(0, first - firstDay)) % 7;
                len = len > 0 ? 7 - len : 0;
                for (i = 1; i <= len; i++) {
                    week = week % weeks;
                    date.setDate(i);
                    html.push('' + '<a href="#" hidefocus' + ' class="' + klass + '"' + ' data-date="' + yM + pad(i) + '"' + ' data-week="' + week + '"' + '>' + i + ' ' + getLunarDay(date, prefix) + '</a>');
                    week++;
                }
                html.push('</p>');
                cache[cacheKey] = html.join('');
                return cache[cacheKey];
            },
            onClick: function (event) {
                var e = event;
                if (!e) {
                    return;
                }
                var el = event.target;
                var tag = el.tagName;
                while (tag !== 'A' && el !== this.main) {
                    el = el.parentNode;
                    tag = el.tagName;
                }
                var $el = $(el);
                switch (tag) {
                case 'A':
                    event.preventDefault();
                    var prefix = this.options.prefix;
                    var preClass = prefix + '-pre';
                    var nextClass = prefix + '-next';
                    var goTodayClass = prefix + '-go-today';
                    var addEventClass = prefix + '-add-event';
                    var disClass = prefix + '-disabled';
                    if ($el.hasClass(preClass)) {
                        privates.showPreMonth.call(this);
                        event.stopPropagation();
                    } else if ($el.hasClass(nextClass)) {
                        privates.showNextMonth.call(this);
                        event.stopPropagation();
                    } else if ($el.hasClass(goTodayClass)) {
                        var now = new Date();
                        if (privates.getYYYYMM.call(this, this.date) !== privates.getYYYYMM.call(this, now)) {
                            this.date = now;
                            privates.build.call(this);
                        }
                    } else if ($el.hasClass(addEventClass)) {
                        this.fire('add', this);
                    } else if (!$el.hasClass(disClass)) {
                        privates.pick.call(this, el, e);
                    }
                    break;
                default:
                    break;
                }
                this.fire('click', event);
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
                        }
                        if (process) {
                            process.call(this, day, klass, value, inRange);
                        }
                        day.className = klass.join(' ');
                    }
                }
            },
            pick: function (el, event) {
                var week = el.getAttribute('data-week');
                var date = this.from(el.getAttribute('data-date'), DATE_FORMAT);
                var value = this.format(date);
                this.fire('pick', {
                    value: value,
                    week: this.options.lang.week + this.days[week],
                    date: date,
                    event: event
                });
            }
        };
    var Lunar = Control.extend({
            type: 'Lunar',
            options: {
                main: '',
                prefix: 'ecl-ui-lunar',
                dateFormat: '',
                range: {
                    begin: '1900-01-01',
                    end: '2100-12-31'
                },
                value: '',
                process: null,
                first: 0,
                lang: {
                    week: '\u5468',
                    days: '\u65E5,\u4E00,\u4E8C,\u4E09,\u56DB,\u4E94,\u516D'
                }
            },
            init: function (options) {
                this.bindEvents(privates);
                this.dateFormat = options.dateFormat || Lunar.DATE_FORMAT || DATE_FORMAT;
                this.days = options.lang.days.split(',');
                this.date = this.from(options.value);
                this.value = this.format(this.date);
                this.setRange(options.range || Lunar.RANGE);
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
                    var main = this.main = lib.g(options.main);
                    var prefix = options.prefix;
                    var monthClass = prefix + '-month';
                    main.innerHTML = '' + '<div class="' + monthClass + '"></div>' + '<a href="#" class="' + prefix + '-pre"></a>' + '<a href="#" class="' + prefix + '-next"></a>' + '<a href="#" class="' + prefix + '-go-today">\u4ECA\u5929</a>' + '<a href="#" class="' + prefix + '-add-event">\u6DFB\u52A0\u4E8B\u4EF6</a>';
                    this.monthElement = $('.' + monthClass, main).get(0);
                    privates.build.call(this);
                    $(main).on('click', this._bound.onClick).addClass('c-clearfix');
                }
                return this;
            },
            getDayElements: function () {
                return this.monthElement.getElementsByTagName('a');
            },
            getDaysInfo: function () {
                var els = this.getDayElements();
                var data = {};
                $.each(els, function (i, el) {
                    var date = el.getAttribute('data-date');
                    data[date] = {
                        date: date,
                        element: el,
                        week: el.getAttribute('data-week') | 0,
                        index: i,
                        rows: i / 7 | 0,
                        cols: i % 7
                    };
                });
                return data;
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
                this.rendered && privates.updatePrevNextStatus.call(this);
            },
            setValue: function (value) {
                this.date = this.from(value);
                this.value = this.format(this.date);
                privates.build.call(this);
            }
        });
    Lunar.DATE_FORMAT = DATE_FORMAT;
    return Lunar;
});