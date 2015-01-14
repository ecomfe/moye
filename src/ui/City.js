/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 国内城市选择提示层
 * @author chris(wfsr@foxmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var Popup = require('./Popup');

    var CITIES = [
        '热门|'
        + '上海,北京,广州,昆明,西安,成都,深圳,厦门,乌鲁木齐,南京,'
        + '重庆,杭州,大连,长沙,海口,哈尔滨,青岛,沈阳,三亚,济南,'
        + '武汉,郑州,贵阳,南宁,福州,天津,长春,石家庄,太原,兰州',
        'A-G|'
        + '安庆,阿勒泰,安康,鞍山,安顺,安阳,阿克苏,包头,蚌埠,北海,'
        + '北京,百色,保山,博乐,长治,长春,长海,常州,昌都,朝阳,潮州,'
        + '常德,长白山,成都,重庆,长沙,赤峰,大同,大连,达县,大足,东营,'
        + '大庆,丹东,大理,敦煌,鄂尔多斯,恩施,二连浩特,佛山,福州,'
        + '阜阳,富蕴,贵阳,桂林,广州,广元,赣州,格尔木,广汉,固原',
        'H-L|'
        + '呼和浩特,哈密,黑河,海拉尔,哈尔滨,海口,衡阳,黄山,杭州,'
        + '邯郸,合肥,黄龙,汉中,和田,惠州,吉安,吉林,酒泉,鸡西,晋江,'
        + '锦州,景德镇,嘉峪关,井冈山,济宁,九江,佳木斯,济南,喀什,'
        + '昆明,康定,克拉玛依,库尔勒,喀纳斯,库车,兰州,洛阳,丽江,梁平,'
        + '荔波,庐山,林芝,柳州,泸州,连云港,黎平,连城,拉萨,临沧,临沂',
        'M-T|'
        + '牡丹江,芒市,满洲里,绵阳,梅县,漠河,南京,南充,南宁,南阳,南通,'
        + '那拉提,南昌,宁波,攀枝花,衢州,秦皇岛,庆阳,且末,齐齐哈尔,青岛,'
        + '汕头,深圳,石家庄,三亚,沈阳,上海,思茅,鄯善,韶关,沙市,苏州,'
        + '唐山,铜仁,通化,塔城,腾冲,台州,天水,天津,通辽,太原,吐鲁番',
        'W-Z|'
        + '威海,武汉,梧州,文山,无锡,潍坊,武夷山,乌兰浩特,温州,乌鲁木齐,'
        + '芜湖,万州,乌海,兴义,西昌,厦门,香格里拉,西安,襄阳,西宁,'
        + '锡林浩特,西双版纳,徐州,兴城,兴宁,邢台,义乌,永州,榆林,'
        + '延安,运城,烟台,银川,宜昌,宜宾,盐城,延吉,玉树,伊宁,伊春,'
        + '珠海,昭通,张家界,舟山,郑州,中卫,芷江,湛江,中甸,遵义'
    ];

    /**
     * 国内城市选择控件
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @requires Popup
     * @exports City
     * @example
     * &lt;input type="text" class="input triggers" /&gt;
     * &lt;input type="button" value="click" class="triggers" /&gt;
     * new City({
     *     triggers: '.triggers',
     *     target: '.input'
     *  }).render();
     */
    var City = Control.extend(/** @lends module:City.prototype */{


        /**
         * 控件类型标识
         *
         * @type {string}
         * @protected
         */
        type: 'City',

        /**
         * 控件配置项
         *
         * @name module:City#options
         * @see module:Popup#options
         * @type {Object}
         * @property {boolean} disabled 控件的不可用状态
         * @property {(string | HTMLElement)} main 控件渲染容器
         * @property {(string | HTMLElement)} target 计算弹出层相对位置的目标对象
         * @property {string} prefix 控件class前缀，同时将作为main的class之一
         * @property {number} index 默认激活的标签索引
         * @property {string} activeClass 激活标签、内容的class
         * @property {boolean} autoFill 是否自动填充默认城市数据(机票可用城市数据)
         * @property {?string} hideCities 需要隐藏的城市
         * @protected
         */
        options: {

            // 默认激活的标签索引
            index: 0,

            // 激活标签、内容的class
            activeClass: 'active',

            // 是否自动填充默认城市数据(机票可用城市数据)
            autoFill: true,

            // 需要隐藏的城市
            hideCities: null
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:City#options
         * @protected
         */
        init: function (options) {

            this.$parent(options);

            var main = this.main;

            // 如果主元素是一个input, 那么我们在它的外层做一次包裹
            if (main && main.tagName === 'INPUT') {
                var wrap = document.createElement('div');
                var parent = main.parentNode;
                if (parent) {
                    parent.insertBefore(wrap, main);
                }
                wrap.appendChild(main);
                this.input = main;
                this.main = wrap;
            }

            this.tabs = this.autoFill
                ? CITIES.slice()
                : [];

        },

        initStructure: function () {

            var main = $(this.main);
            var input = this.input;

            if (!input) {
                input = this.input = $('<input type="text">')
                    .appendTo(main)
                    .get(0);
            }

            input.setAttribute('autocomplete', 'off');

            if (this.name) {
                input.name = this.name;
            }

            var popup = this.popup = new Popup({
                target: input,
                triggers: [input]
            }).render();

            this.helper.addPartClasses('popup', popup.main);
        },

        initEvents: function () {
            this.popup
                .on('click', $.proxy(this._onPopupClick, this))
                .on('show', $.proxy(this._onPopupShow, this));
        },

        setReadOnly: function (isReadOnly) {
            this.$parent(isReadOnly);
            this.input.readOnly = !!isReadOnly;
        },

        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: 'value',
                paint: function (conf, value) {
                    this.setValue(value);
                }
            }
        ),

        /**
         * 填充城市标签数据
         *
         * @param {(Array | string)} tabsOrItem 城市数组，
         * 每项格式为 "标签|城市A,城市B,城市C" 当参数为字符类型时仅作为一个城市标签项
         * @return {module:City} 当前 City 实例
         * @public
         */
        fill: function (tabsOrItem) {
            var tabs = this.tabs;

            if (lib.isString(tabsOrItem)) {
                tabs.push(tabsOrItem);
            }
            else {
                this.tabs = tabsOrItem;
            }

            return this;
        },

        /**
         * 选择城市
         *
         * @param {HTMLElement} el 点击的当前事件源对象
         * @fires module:City#pick
         * @protected
         */
        _pick: function (el) {
            var value = el.innerHTML;

            var event = new $.Event('pick', {
                target: this,
                value: value
            });

            /**
             * @event module:City#pick
             * @type {Object}
             * @property {string} value 选中的城市
             */
            this.fire(event);

            if (event.isDefaultPrevented()) {
                return;
            }

            var input = this.input;
            input.value = value;
            input.focus();
            this.hide();

            // 释放一个`change`事件
            this.fire('change');
        },

        /**
         * 切换标签
         *
         * @param {number} i 要切换到的目标标签索引
         * @public
         */
        _changeTab: function (i) {
            var labels      = this.labels;
            var panels      = this.panels;
            var index       = this.index;
            var activeClass = this.helper.getPartClassName(this.activeClass);

            if (i !== index) {

                $(labels[index]).removeClass(activeClass);
                $(panels[index]).removeClass(activeClass);

                index = this.index = i;

                $(labels[index]).addClass(activeClass);
                $(panels[index]).addClass(activeClass);

            }
        },

        /**
         * 显示浮层
         *
         * @param {?HTMLElement=} target 触发显示浮层的节点
         * @fires module:City#show 显示事件
         * @public
         */
        show: function (target) {
            this.popup.show();
        },

        /**
         * 隐藏浮层
         *
         * @fires module:City#hide 隐藏事件
         * @public
         */
        hide: function () {
            this.popup.hide();
        },

        /**
         * 设定值
         * @param {string} value 值
         * @return {City}
         */
        setValue: function (value) {
            this.input.value = value || '';
            return this;
        },

        /**
         * 获取值
         * @return {string}
         */
        getValue: function () {
            return this.input.value;
        },

        /**
         * 处理选单点击事件
         *
         * @param {Object} e Popup的`click`事件对象
         * @fires module:City#click 点击事件
         * @protected
         */
        _onPopupClick: function (e) {

            var target = $(e.target);
            var tag    = target.prop('tagName');
            var index  = target.data('idx');

            var activeClassName = this.helper.getPartClassName(this.activeClass);

            switch (tag) {
                case 'A':
                    e.preventDefault();
                    target.hasClass(activeClassName)
                        ? this.hide()
                        : this._pick(e.target);
                    break;
                case 'LI':
                    if (index !== this.index) {
                        this._changeTab(index);
                    }
                    break;
            }

        },

        /**
         * 转发Popup的onPopupShow事件
         *
         * @param {Object} e `Popup`的`show`事件
         * @fires module:City#show
         * @protected
         */
        _onPopupShow: function (e) {

            if (this.isDisabled()) {
                return;
            }

            var event = new $.Event('show');

            /**
             * @event module:City#beforeShow
             * @type {Object}
             * @property {Event} event 事件源对象
             */
            this.fire(event);

            if (event.isDefaultPrevented()) {
                e.preventDefault();
                return;
            }

            if (!this.labels) {
                var popup = this.popup;
                popup.set('content', this._build(this.tabs));
                var list = popup.main.getElementsByTagName('ul');
                this.labels = list[0].getElementsByTagName('li');
                this.panels = list[1].getElementsByTagName('li');
            }
        },

        /**
         * 构建选单HTML
         *
         * @protected
         * @param {Array.Object} tabs 标签配置
         * @return {string}
         */
        _build: function (tabs) {
            var helper  = this.helper;
            var index   = this.index;
            var labels  = [];
            var panels  = [];

            labels.push('<ul class="' + helper.getPartClassName('labels') + '">');
            panels.push('<ul class="' + helper.getPartClassName('panels') + '">');

            var comma = ',';
            var hideCities = this.hideCities;
            if (hideCities) {
                hideCities = comma + hideCities.replace(/\s+/g, '') + comma;
            }

            var makeLinks = function (cities) {
                return lib
                    .map(cities.split(comma), function (city) {
                        return !hideCities || !~hideCities.indexOf(comma + city + comma)
                            ? '<a href="#" title="' + city + '">' + city + '</a>'
                            : '';
                    })
                    .join('');
            };

            var activeClassName = helper.getPartClassName(this.activeClass);

            lib.each(this.tabs, function (tab, i) {
                var start = '<li data-idx="' + i + '" class="' + (i === index ? activeClassName : '') + '"';
                tab = tab.split('|');
                labels.push(start + '>' + tab[0] + '</li>');
                panels.push(start + '>' + makeLinks(tab[1]) + '</li>');
            });

            labels.push('</ul>');
            panels.push('</ul>');

            return labels.join('') + panels.join('');
        }

    });

    return City;
});
