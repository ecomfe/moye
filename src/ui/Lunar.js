/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 支持农历的控件
 * @author chris(wfsr@foxmail.com)
 */

define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');


    /** jshint: -W013 */
    /**
     * 农历数据表
     * 从 1900 - 2100，16 进制前 12 表示对应年份 12 个月的大小，大月为 1，小月为 0
     * 最后4位表示是否闰年闰哪个月，或下一年闰的月是大月还是小月，仅当为 0xf 时表示大月
     * 
     * @type {Array}
     */
    var lunarInfo = [
        0x4bd8, 0x4ae0, 0xa570, 0x54d5, 0xd260, 0xd950, 0x5554, 0x56af, 0x9ad0,
        0x55d2, 0x4ae0, 0xa5b6, 0xa4d0, 0xd250, 0xd295, 0xb54f, 0xd6a0, 0xada2,
        0x95b0, 0x4977, 0x497f, 0xa4b0, 0xb4b5, 0x6a50, 0x6d40, 0xab54, 0x2b6f,
        0x9570, 0x52f2, 0x4970, 0x6566, 0xd4a0, 0xea50, 0x6a95, 0x5adf, 0x2b60,
        0x86e3, 0x92ef, 0xc8d7, 0xc95f, 0xd4a0, 0xd8a6, 0xb55f, 0x56a0, 0xa5b4,
        0x25df, 0x92d0, 0xd2b2, 0xa950, 0xb557, 0x6ca0, 0xb550, 0x5355, 0x4daf,
        0xa5b0, 0x4573, 0x52bf, 0xa9a8, 0xe950, 0x6aa0, 0xaea6, 0xab50, 0x4b60,
        0xaae4, 0xa570, 0x5260, 0xf263, 0xd950, 0x5b57, 0x56a0, 0x96d0, 0x4dd5,
        0x4ad0, 0xa4d0, 0xd4d4, 0xd250, 0xd558, 0xb540, 0xb6a0, 0x95a6, 0x95bf,
        0x49b0, 0xa974, 0xa4b0, 0xb27a, 0x6a50, 0x6d40, 0xaf46, 0xab60, 0x9570, 
        0x4af5, 0x4970, 0x64b0, 0x74a3, 0xea50, 0x6b58, 0x5ac0, 0xab60, 0x96d5,
        0x92e0, 0xc960, 0xd954, 0xd4a0, 0xda50, 0x7552, 0x56a0, 0xabb7, 0x25d0,
        0x92d0, 0xcab5, 0xa950, 0xb4a0, 0xbaa4, 0xad50, 0x55d9, 0x4ba0, 0xa5b0,
        0x5176, 0x52bf, 0xa930, 0x7954, 0x6aa0, 0xad50, 0x5b52, 0x4b60, 0xa6e6,
        0xa4e0, 0xd260, 0xea65, 0xd530, 0x5aa0, 0x76a3, 0x96d0, 0x4afb, 0x4ad0,
        0xa4d0, 0xd0b6, 0xd25f, 0xd520, 0xdd45, 0xb5a0, 0x56d0, 0x55b2, 0x49b0,
        0xa577, 0xa4b0, 0xaa50, 0xb255, 0x6d2f, 0xada0, 0x4b63, 0x937f, 0x49f8,
        0x4970, 0x64b0, 0x68a6, 0xea5f, 0x6b20, 0xa6c4, 0xaaef, 0x92e0, 0xd2e3,
        0xc960, 0xd557, 0xd4a0, 0xda50, 0x5d55, 0x56a0, 0xa6d0, 0x55d4, 0x52d0,
        0xa9b8, 0xa950, 0xb4a0, 0xb6a6, 0xad50, 0x55a0, 0xaba4, 0xa5b0, 0x52b0, 
        0xb273, 0x6930, 0x7337, 0x6aa0, 0xad50, 0x4b55, 0x4b6f, 0xa570, 0x54e4,
        0xd260, 0xe968, 0xd520, 0xdaa0, 0x6aa6, 0x56df, 0x4ae0, 0xa9d4, 0xa4d0,
        0xd150, 0xf252, 0xd520
    ];

    /**
     * 返回农历 y 年的总天数
     * 
     * @param {number} y 年份
     * @return {number} y 年的总天数
     * @inner
     */
    function lYearDays(y) {
        var days = 348
            + (lunarInfo[y - 1900] >> 4).toString(2).replace(/0/g, '').length;

        return days + leapDays(y);
    }

    /**
     * 返回农历 y 年闰月的天数
     * 
     * @param {number} y 年份
     * @return {number} 闰月的天数（大月30，小月29，无闰月0）
     * @inner
     */
    function leapDays(y) {
        return leapMonth(y)
            ? (lunarInfo[y - 1899] & 0xf) === 0xf ? 30 : 29
            : 0;
    }

    /**
     * 返回农历 y 年闰哪个月 1-12 , 没闰返回 0
     * 
     * @param {number} y 年份
     * @return {number} 闰月月份，0为不闰
     * @inner
     */
    function leapMonth(y) {
        var lm = lunarInfo[y - 1900] & 0xf;
        return lm === 0xf ? 0 : lm;
    }

    /**
     * 返回农历 y 年 m 月的总天数
     * 
     * @param {number} y 年份
     * @param {number} m 月份
     * @return {number} 农历 y 年 m 月的天数（大月30，小月29）
     * @inner
     */
    function monthDays(y, m) {
        return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
    }

    // 节气顺序
    var solarTerm = [
        '小寒', '大寒',
        '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
        '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
        '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
        '立冬', '小雪', '大雪', '冬至'
    ];

    /* jshint -W015 */
    // 节气数据表
    var sTermInfo = [
             0,  21208, 
         42467,  63836,  85337, 107014, 128867, 150921, 
        173149, 195551, 218072, 240693, 263343, 285989, 
        308563, 331033, 353350, 375494, 397447, 419210, 
        440795, 462224, 483532, 504758
    ];

    // 节气例外调整
    var solarTermAdjust = {
         19762:  1,  19802: 1,   20092:  1,  20129: -1, 201222: 1,
         20132:  1, 201313: -1, 201323:  1,  20144:  1,  20150: 1, 
        201622:  1, 201713: -1, 201723: -1,  20183:  1,  20185: 1,
         20192: -1, 201911: -1, 202012: -1, 202015: -1, 202022: 1 
    };

    /**
     * 某年的第 n 个节气为几日（从 0 小寒起算）
     * 
     * @param {number} y 年份数字
     * @param {number} n 节气序号
     * @return {number} 节气对应的日期（天）
     * @inner
     */
    function sTerm(y, n) {
        var offDate = new Date(
            31556925974.7 * (y - 1900)
            + sTermInfo[n] * 60000  
            + Date.UTC(1900, 0, 6, 2, 5)
        );

        return offDate.getUTCDate() + (solarTermAdjust[y + '' + n] || 0);
    }

    /**
     * 获取节气
     * 
     * @param {Date} date 阳历日期对象
     * @return {?Object} 节气
     * @inner
     */
    function getSolarTerm(date) {
        var y = date.getFullYear();
        var m = date.getMonth();
        var d = date.getDate();

        var text = d === sTerm(y, m * 2)
            ? solarTerm[m * 2]
            : (d === sTerm(y, m * 2 + 1)
                ? solarTerm[m * 2 + 1]
                : '');

        return text ? { type: 'solar-term', text: text } : null;
    }

    // 农历节日
    var lFtv = {
        '0100': '除夕',
        '0101': '春节',
        '0115': '元宵节',
        '0202': '龙抬头',
        '0505': '端午节',
        '0707': '七夕',
        '0715': '中元节',
        '0815': '中秋节',
        '0909': '重阳节',
        '1208': '腊八节',
        '1223': '小年'
    };

    /**
     * 获取农历节日
     * 
     * @param {Object} lunar 农历日期信息
     * @return {?Object} 农历节日
     * @inner
     */
    function getLunarFestival(lunar) {
        // 处理除夕
        if (lunar.month === 11 && lunar.day > 28) {
            var next =  new Date(lunar.solar.getTime() + 1000 * 60 * 60 * 24);
            next = getLunarInfo(next);
            if (next.day === 1) {
                lunar.month = 0;
                lunar.day = 0;
            }
        }
        var text = lunar.leap 
            ? ''
            : lFtv[pad(lunar.month + 1) + pad(lunar.day)] || '';

        return text ? { type: 'lunar-festival', text: text } : null;       
    }


    // 阳历节日
    var sFtv = {
        '0101': '元旦',
        '0214': '情人节',
        '0308': '妇女节',
        '0312': '植树节',
        '0401': '愚人节',
        '0422': '地球日',
        '0501': '劳动节',
        '0504': '青年节',
        '0531': '无烟日',
        '0601': '儿童节',
        '0606': '爱眼日',
        '0701': '建党日',
        '0707': '抗战纪念日',
        '0801': '建军节',
        '0910': '教师节',
        '0918': '九·一八纪念日',
        '1001': '国庆节',
        '1031': '万圣节',
        '1111': '光棍节',
        '1201': '艾滋病日',
        '1213': '南京大屠杀纪念日',
        '1224': '平安夜',
        '1225': '圣诞节'
    };

    /**
     * 获取阳历节日
     * 
     * @param {Date} date 阳历日期对象
     * @return {?Object} 阳历节日
     * @inner
     */
    function getSolarFestival(date) {
        var text = sFtv[pad(date.getMonth() + 1) + pad(date.getDate())];
        return text ? { type: 'solar-festival', text: text } : null;       
    }


    // 某月的第几个星期几。 5,6,7,8 表示到数第 1,2,3,4 个星期几
    var wFtv = {
        // 一月的最后一个星期日（月倒数第一个星期日）
        '0150': '国际麻风节',
        '0520': '母亲节',
        '0630': '父亲节',
        '1144': '感恩节'
    };

    /**
     * 获取阳历和周相关的节日
     * 
     * @param {Date} date 阳历日期对象
     * @return {string} 阳历的周节日
     * @inner
     */
    function getSolarWeakFestival(date) {
        var day = date.getDay();
        var keys = [pad(date.getMonth() + 1), day];
        var today = date.getDate();
        var firstDay = (7 + day - (today - 1)) % 7;
        var lastDate = new Date(date.getFullYear(), keys[0], 0);
        var lastDay = lastDate.getDay();
        var days = lastDate.getDate();

        var seq = Math.ceil((today + firstDay - 1) / 7)
            + (day < firstDay ? 0 : 1);

        var qes = 4 + Math.floor((day + days - today) / 7)
            + (lastDay < day ? 0 : 1);

        var text = wFtv[keys.join(seq)] || wFtv[keys.join(qes)];        

        return text ? { type: 'solar-weak-festival', text: text } : null;       
    }

    /**
     * 获取节日或节气信息
     * 
     * @param {Date} date 阳历日期对象
     * @param {Object} lunar 农历日期信息
     * @return {string} 节日或节气信息
     * @inner
     */
    function getFestival(date, lunar) {
        return getLunarFestival(lunar)
            || getSolarFestival(date) 
            || getSolarWeakFestival(date)
            || getSolarTerm(date);
    }

    /**
     * 获取阳历对应的农历信息
     * 
     * @param {Date} date 阳历日期对象
     * @return {Object} 农历信息
     * @inner
     */
    function getLunarInfo(date) {
        var i, leap = 0, temp = 0;
        var offset = (
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            - Date.UTC(1900, 0, 31)
        ) / 86400000;
 
        for (i = 1900; i < 2100 && offset > 0; i++) {
            temp = lYearDays(i);
            offset -= temp;
        }
 
        if (offset < 0) {
            offset += temp;
            i--;
        }

        var year = i;
 
        leap = leapMonth(i); //闰哪个月
        var isLeap = false;
 
        for (i = 1; i < 13 && offset > 0; i++) {
           //闰月
            if (leap > 0 && i === leap + 1 && !isLeap) {
                --i;
                isLeap = true;
                temp = leapDays(year);
            }
            else { 
                temp = monthDays(year, i);
            }
 
           //解除闰月
            if (isLeap && i === leap + 1) {
                isLeap = false;
            }
 
            offset -= temp;
        }
 
        if (offset === 0 && leap > 0 && i === leap + 1) {
            if (isLeap) {
                isLeap = false;
            }
            else {
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

    /**
     * 返回农历的描述（日子、节日、节气等）
     * 
     * @param {Date} date 阳历日期对象
     * @param {string} classPrefix 节日或农历日期的 className 前缀
     * @return {string} 农历或节日节气描述
     * @inner
     */
    function getLunarDay(date, classPrefix) {
        var lunar = getLunarInfo(date);
        var month = lunar.month;
        var day = lunar.day;

        var decimals = ['初', '十', '廿', '卅', '卌'];
        var units = [
            '日', '一', '二', '三', '四',
            '五', '六', '七', '八', '九', '十'
        ];
        var months = [
            '正', '二', '三', '四', '五', '六',
            '七', '八', '九', '十', '十一', '腊'
        ];

        var result = getFestival(date, lunar);
        var text;
        if (!result) {
            if (day === 1) {
                text = (lunar.leap ? '闰' : '') + months[month] + '月';
            }
            else if (day % 10 > 0) {
                text = decimals[day / 10 | 0] +  units[day % 10];      
            }
            else {
                text = (day > 10 ? units[day / 10] : decimals[0]) + units[10];
            }

            result = { type: 'lunar', text: text };
        }

        return ''
            + '<span class="' + classPrefix + '-' + result.type + '">'
            +   result.text
            + '</span>';
       
    }

    /**
     * 标准日期格式
     * 
     * @const
     * @type {string}
     */
    var DATE_FORMAT = 'yyyy-MM-dd';

    /**
     * 补齐数字位数
     * 
     * @param {(number | string)} n 需要补齐的数字
     * @return {string} 补齐两位后的字符
     */
    function pad(n) {
        return (n > 9 ? '' : '0') + n;
    }


    /**
     * 每个月的HTML缓存
     * 
     * @type {Object}
     */
    var cache = {};

    /**
     * 私有函数或方法
     * 
     * @type {Object}
     * @namespace
     * @name module:Lunar~privates
     */
    var privates = /** @lends module:Lunar~privates */ {

        /**
         * 取得指定日期的 yyyyMM 格式化后字符串值
         * 
         * @param {?Date=} date 待格式化的日期
         * @return {string} 按 yyyyMM格式化后的日期字符串
         * @private
         */
        getYYYYMM: function (date) {
            return (
                lib.isString(date)
                ? date
                : this.format(this.from(date), 'yyyyMM')
            );
        },
        /**
         * 构建HTML
         * 
         * @fires module:Lunar#navigate
         * @private
         */
        build: function (date) {

            date = new Date((date || this.date).getTime());

            this.monthElement.innerHTML = privates.buildMonth.call(this, date);

            privates.updateStatus.call(this);
            privates.updatePrevNextStatus.call(this, date);

            /**
             * @event module:Lunar#navigate
             * @type {Object}
             * @property {Date} date 选中的日期对象
             * @property {string} yyyyMM 选中日期的格式化星期
             */
            this.fire('navigate', {date: date, yyyyMM: privates.getYYYYMM.call(this, date)});
        },

        /**
         * 更新上下月按钮状态
         * 
         * @param {?Date=} date 当前日期
         * @private
         */
        updatePrevNextStatus: function (date) {
            var options = this.options;
            var prefix = options.prefix;
            var range  = this.range;
            var prev = lib.q(prefix + '-pre', this.main)[0];
            var next = lib.q(prefix + '-next', this.main)[0];

            date = date || this.date || this.from(this.value);

            var dateYYYYMM = privates.getYYYYMM.call(this, date);

            if (prev) {
                lib[!range 
                    || !range.begin
                    || privates.getYYYYMM.call(this, range.begin) < dateYYYYMM
                        ? 'show' : 'hide'
                ](prev);

            }

            if (next) {
                lib[!range
                    || !range.end
                    || privates.getYYYYMM.call(this, range.end) > dateYYYYMM
                        ? 'show' : 'hide'
                ](next);
            }
        },

        /**
        * 构建指定日期所在月的HTML
        * 
        * @private
        */
        buildMonth: function (date) {
            var year  = date.getFullYear();
            var month = date.getMonth() + 1;
            var today = date.getDate();
            var day   = date.getDay();
            var cacheKey    = year + pad(month);

            if (cache[cacheKey]) {
                return cache[cacheKey];
            }

            var weeks     = 7;
            var separator = '-';

            var options = this.options;
            var prefix  = options.prefix;
            var html    = [];

            html.push('<h3>' + year + '年' + month + '月</h3>');

            var i;
            var len;
            var klass;
            var firstDay = options.first;
            var days = this.days;
            html.push('<ul class="c-clearfix">');

            for (i = 0, len = days.length; i < len; i++) {
                klass = i === weeks - 1 
                    || firstDay && i === weeks - 2
                    || !firstDay && i === firstDay
                    ? ' class="' + prefix + '-weekend"'
                    : '';

                html.push('<li' + klass + '>' + days[i] + '</li>');
            }
            html.push('</ul>');
            html.push('<p class="c-clearfix">');

            var y;
            var M;
            var d;
            var yM;

            // 星期标识
            var week = 0;

           // 计算1号星期几
            var first = (weeks + day + 1 - today % weeks) % weeks;

            // 处理上月
            len = first - firstDay;
            if (len > 0) {
                date.setDate(0);
                y = date.getFullYear();
                M = date.getMonth() + 1;
                d = date.getDate();
                yM = [y, pad(M), ''].join(separator);
                klass = prefix + '-pre-month';

                for (i = d - len + 1; i <= d; i++) {
                    week = week % weeks;
                    date.setDate(i);
                    html.push(''
                        + '<a href="#" hidefocus'
                        +   ' class="' + klass + '"'
                        +   ' data-date="' + yM + pad(i) + '"'
                        +   ' data-week="' + week + '"'
                        + '>'
                        +   i + ' '
                        +   getLunarDay(date, prefix)
                        + '</a>'
                    );
                    week++; 
                }

                date.setDate(d + 1);
            }

            // 恢复到当前月;
            date.setDate(1);
            date.setMonth(month);
            date.setDate(0);

            yM = [year, pad(month), ''].join(separator);

            // 处理当前月
            for (i = 1, len = date.getDate(); i <= len; i++) {
                week = week % weeks;
                date.setDate(i);
                html.push(''
                    + '<a href="#" hidefocus '
                    +   ' data-date="' + yM + pad(i) + '"'
                    +   ' data-week="' + week + '"'
                    + '>'
                    +   i + ' '
                    +   getLunarDay(date, prefix)
                    + '</a>'
                );
                week++;
            }

            // 处理下月;
            date.setDate(len + 1);
            y = date.getFullYear();
            M = date.getMonth() + 1;
            yM = [y, pad(M), ''].join(separator);
            klass = prefix + '-next-month';

            len = (len + Math.max(0, first - firstDay)) % 7;

            len = len > 0 ? 7 - len : 0;

            for (i = 1; i <= len; i++) {
                week = week % weeks;
                date.setDate(i);
                html.push(''
                    + '<a href="#" hidefocus'
                    +   ' class="' + klass + '"'
                    +   ' data-date="' + yM + pad(i) + '"'
                    +   ' data-week="' + week + '"'
                    + '>'
                    +   i + ' '
                    +   getLunarDay(date, prefix)
                    + '</a>'
                );
                week++;
            }

            html.push('</p>');

            cache[cacheKey] = html.join('');
            return cache[cacheKey];
        },

        /**
         * 处理选单点击事件
         * 
         * @param {Event} event DOM 事件对象
         * @fires module:Lunar#click
         * @private
         */
        onClick: function (event) {
            var e = event;

            if (!e) {
                return;
            }

            var el     = lib.getTarget(e);
            var tag    = el.tagName;

            while (tag !== 'A' &&　el !== this.main) {
                el = el.parentNode;
                tag = el.tagName;
            }

            switch (tag) {

                case 'A':
                    lib.preventDefault(e);

                    var prefix    = this.options.prefix;
                    var preClass  = prefix + '-pre';
                    var nextClass = prefix + '-next';
                    var goTodayClass  = prefix + '-go-today';
                    var addEventClass = prefix + '-add-event';
                    var disClass  = prefix + '-disabled';
                    var hasClass  = lib.hasClass;

                    var stopPropagation = lib.stopPropagation;

                    // 上月操作
                    if (hasClass(el, preClass)) {
                        privates.showPreMonth.call(this);
                        stopPropagation(e);
                    }
                    // 下月操作
                    else if (hasClass(el, nextClass)) {
                        privates.showNextMonth.call(this);
                        stopPropagation(e);
                    }
                    // 回到今天
                    else if (hasClass(el, goTodayClass)) {
                        var now = new Date();
                        if (privates.getYYYYMM.call(this, this.date) !== privates.getYYYYMM.call(this, now)) {
                            this.date = now;
                            privates.build.call(this);                          
                        }
                    }
                    // 添加事件
                    else if (hasClass(el, addEventClass)) {
                        this.fire('add', this);
                    }
                    // 选取日期
                    else if (!hasClass(el, disClass)) {
                        privates.pick.call(this, el, e);
                    }

                    break;

                default:
                    break;

            }

            /**
             * @event module:Lunar#click
             * @type {Event}
             */
            this.fire('click', event);
        },

        /**
         * 切换到上个月
         * 
         * @private
         */
        showPreMonth: function () {
            var date = this.date;
            date.setDate(0);
            privates.build.call(this, date);
        },

        /**
         * 切换到下个月
         * 
         * @private
         */
        showNextMonth: function () {
            var date = this.date;

            date.setDate(1);
            date.setMonth(date.getMonth() + 1);

            privates.build.call(this, date);
        },

        /* jshint boss: true */
        /**
         * 根据选择的日期和当前日期更新每个日期的状态
         * 
         * @private
         */
        updateStatus: function () {
            var options = this.options;
            var prefix  = options.prefix;
            var process = options.process;
            var first   = options.first;
            var now     = new Date();

            // var checkedValue = this.format(this.date, DATE_FORMAT);

            var nowValue = this.format(now, DATE_FORMAT);
            var range    = this.range;
            var min      = '';
            var max      = '9999-12-31';

            if (range) {
                min = range.begin
                    && this.format(range.begin, DATE_FORMAT)
                    || min;
                max = range.end
                    && this.format(range.end, DATE_FORMAT)
                    || max;
            }

            var preClass     = prefix + '-pre-month';
            var nextClass    = prefix + '-next-month';
            var disClass     = prefix + '-disabled';
            var todayClass   = prefix + '-today';
            var weekendClass = prefix + '-weekend';

            var monthes = this.main.getElementsByTagName('p');
            var i, len, j, day, days, klass, value, className, inRange;
            for (i = 0, len = monthes.length; i < len; i++) {
                days  = monthes[i].getElementsByTagName('a');

                for (j = 0; day = days[j]; j++) {
                    klass     = [];
                    value     = day.getAttribute('data-date');
                    className = day.className;
                    inRange   = true;

                    if (range && (value < min || value > max)) {
                        klass.push(disClass);
                        inRange = false;
                    }

                    var mod = j % 7;
                    if (
                        mod === 6
                        ||  first && mod === 5 
                        || !first && mod === 0
                    ) {
                        klass.push(weekendClass);
                    }

                    if (~className.indexOf(preClass)) {
                        klass.push(preClass);
                    }
                    else if (~className.indexOf(nextClass)) {
                        klass.push(nextClass);
                    }
                    else {

                        if (value === nowValue) {
                            klass.push(todayClass);
                        }

                        // if (inRange && value === checkedValue) {
                        //     klass.push(checkedClass);
                        // }
                        
                    }

                    if (process) {
                        process.call(this, day, klass, value, inRange);
                    }

                    day.className = klass.join(' ');
                }
            }
        },

        /**
         * 选择日期
         * 
         * @param {HTMLElement} el 点击的当前事件源对象
         * @param {Event} event DOM 事件对象
         * @fires module:Lunar#pick
         * @private
         */
        pick: function (el, event) {
            var week  = el.getAttribute('data-week');
            var date  = this.from(el.getAttribute('data-date'), DATE_FORMAT);
            var value = this.format(date);

            /**
             * @event module:Lunar#pick
             * @type {Object}
             * @property {string} value 选中日期的格式化
             * @property {string} week 选中日期的格式化星期
             * @property {Date} date 选中的日期对象
             * @property {Event} event 事件对象
             */
            this.fire('pick', { 
                value: value,
                week: this.options.lang.week + this.days[week],
                date: date,
                event: event
            });
        }        
    };

    /**
     * 1900 - 2100 年间农历控件
     * 
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Lunar
     * @example
     * &lt;div id="lunar"&gt;&lt;/div&gt;
     * new Lunar({
     *     main: lib.g('lunar')
     *  }).render();
     */
    var Lunar = Control.extend(/** @lends module:Lunar.prototype */{

        /**
         * 控件类型标识
         * 
         * @type {string}
         * @private
         */
        type: 'Lunar',

        /**
         * 控件配置项
         * 
         * @name module:Lunar#options
         * @see module:Popup#options
         * @type {Object}
         * @property {(string | HTMLElement)} main 控件渲染容器
         * @property {string} prefix 控件class前缀，同时将作为main的class之一
         * @property {string} dateFormat 日期显示的格式化方式
         * @property {?Object} range 可选中的日期区间
         * @property {?string} value 当前选中的日期
         * @property {Function} process 处理当前显示日历中的每一天，多用于节日样式
         * process(el, classList, dateString)
         * 执行时 this 指向当前实例，el 为当前日的dom节点(A标签)，
         * classList 为 el 即将要应用的class数组引用，dateString 为
         * yyyy-MM-dd格式的当前日期字符串
         * @property {number} first 一周的起始日，0为周日，1为周一
         * @property {Object} lang 预设模板
         * @property {string} lang.week 对于 '周' 的称呼
         * @property {string} lang.days 一周对应的显示
         * @private
         */
        options: {

            // 控件渲染主容器
            main: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-lunar',

            // 日期显示的格式化方式
            dateFormat: '',

            // 可选中的日期区间
            range: {
                begin: '1900-01-01',
                end: '2100-12-31'
            },

            // 当前选中的日期
            value: '',

            // 处理每一天的样式
            process: null,

            // 一周的起始日 0为周日，需要对应lang.days的顺序
            first: 0,

            // 一些模板
            lang: {

                // 对于 '周' 的称呼
                week: '周',

                // 星期对应的顺序表示
                days: '日,一,二,三,四,五,六'

            }
        },

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:Lunar#options
         * @private
         */
        init: function (options) {
            this.bindEvents(privates);

            this.dateFormat = options.dateFormat || Lunar.DATE_FORMAT || DATE_FORMAT;

            this.days  = options.lang.days.split(',');
            this.date  = this.from(options.value);
            this.value = this.format(this.date);
            
            this.setRange(options.range || Lunar.RANGE);
        },

        /**
         * 解释日期类型
         * 
         * @param {(string | Date)} value 源日期字符串或对象
         * @param {string} format 日期格式
         * @return {Date} 解释到的日期对象
         * @public
         */
        from: function (value, format) {
            format = format || this.dateFormat;
            if (lib.isString(value)) {

                if (!value) {
                    return new Date();
                }

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
            }

            return value;
        },

        /**
         * 格式化日期
         * 
         * @param {Date} date 源日期对象
         * @param {string=} format 日期格式，默认为当前实例的 dateFormat
         * @return {string} 格式化后的日期字符串
         * @public
         */
        format: function (date, format) {
            // 控件不包含时间，所以不存在大小写区别
            format = (format || this.dateFormat).toLowerCase();

            if (lib.isString(date)) {
                date = this.from(date);
            }

            var options = this.options;
            var first   = options.first;
            var y       = date.getFullYear();
            var M       = date.getMonth() + 1;
            var d       = date.getDate();
            var week    = date.getDay();

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

            return format.replace(
                /y+|M+|d+|W+/gi,
                function ($0) {
                    return map[$0] || '';
                }
            );
        },


        /**
         * 绘制控件
         * 
         * @return {module:Lunar} 当前实例
         * @override
         * @public
         */
        render: function () {
            var options = this.options;

            if (!this.rendered) {
                this.rendered = true;

                var main = this.main = lib.g(options.main);
                var prefix = options.prefix;
                var monthClass = prefix + '-month';

                main.innerHTML = ''
                    + '<div class="' + monthClass + '"></div>'
                    + '<a href="#" class="' + prefix + '-pre"></a>'
                    + '<a href="#" class="' + prefix + '-next"></a>'
                    + '<a href="#" class="' + prefix + '-go-today">今天</a>'
                    + '<a href="#" class="' + prefix + '-add-event">添加事件</a>';

                this.monthElement = lib.q(monthClass, main)[0];

                privates.build.call(this);
                
                lib.on(main, 'click', this._bound.onClick);
                
                lib.addClass(main, 'c-clearfix');
            }

            return this;
        },

        /**
         * 获取所有日期的 DOM 节点
         * 
         * @return {HTMLCollection} DOM 节点集合
         * @public
         */
        getDayElements: function () {
            return this.monthElement.getElementsByTagName('a');
        },

        /**
         * 获取每天对应的日期和行列信息
         * 
         * @return {Object} 以日期为 key，包含日期、DOM、星期、顺序索引和行列信息的数据对象
         * @public
         */
        getDaysInfo: function () {
            var els = this.getDayElements();
            var data = {};

            lib.each(els, function (el, i) {
                var date = el.getAttribute('data-date');

                data[date] = {
                    // 当天日期（yyyy-MM-dd格式）
                    date: date,
                    // 当前 DOM 节点
                    element: el,
                    // 星期几
                    week: el.getAttribute('data-week') | 0,
                    // 顺序索引
                    index: i,
                    // 行信息
                    rows: i / 7 | 0,
                    // 列信息
                    cols: i % 7
                };
            });

            return data;
        },

        /**
         * 设置允许选中的日期区间
         * 
         * @param {Object} range 允许选择的日期区间
         * @public
         */
        setRange: function (range) {
            if (!range) {
                return;
            }

            var begin = range.begin;
            var end   = range.end;

            if (begin && lib.isString(begin)) {
                range.begin = this.from(begin);
            }

            if (end && lib.isString(end)) {
                range.end = this.from(end);
            }
            this.range = range;
            this.rendered &&　privates.updatePrevNextStatus.call(this);
        },

        /**
         * 设置当前选中的日期
         * 
         * @param {string} value 要设置的日期
         * @public
         */
        setValue: function (value) {
            this.date = this.from(value);
            this.value = this.format(this.date);
            privates.build.call(this);
        }


    });

    /**
     * 全局日期格式
     * 
     * @const
     * @type {string}
     */
    Lunar.DATE_FORMAT = DATE_FORMAT;


    return Lunar;
});
