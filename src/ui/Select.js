/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 下拉选择菜单
 * @author chris(wfsr@foxmail.com)
 */
 
define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');
    var Popup = require('./Popup');

    /**
     * 取字符字节长度
     * 
     * @param {string} str 目标字符
     * @return {number} 目标字符的字节长度
     * @inner
     */
    function bLength(str) {
        return str.replace(/[^\x00-\xff]/gi, '..').length;
    }

    /**
     * 文字溢出处理
     * 
     * @param {string} str 目标字符串
     * @param {number} max 截取的字节长度
     * @param {?string=} ellipsis 超长后的附加后缀
     * @return {string} 目标字符串被截取后加上后缀的字符串
     * @inner
     */
    function textOverflow(str, max, ellipsis) {

        if (max >= bLength(str)) {
            return str;
        }
        
        var i = 0;
        var l = 0;
        var rs = '';
        while (l < max) {
            rs += str.charAt(i);
            l += bLength(str.charAt(i));
            i ++;
        }
    
        if (l > max) {
            rs = rs.substr(0, rs.length - 1);
        }
        
        var ellipsisLen = ellipsis ? bLength(ellipsis) : 0;
        if (ellipsisLen) {
            max -= ellipsisLen;
            rs = textOverflow(rs, max) + ellipsis;
        }
        
        return rs;
    }


    /**
     * 私有函数或方法
     * 
     * @type {Object}
     * @namespace
     * @name module:Select~privates
     */
    var privates = /** @lends module:Select~privates */ {

        /**
         * 处理 disable 事件
         * 监听自身的 disable 事件，增加 disabled class 标记，使控件忽略交互响应
         * 
         * @private
         */
        onDisable: function () {
            this.popup.disable();
            lib.addClass(this.target, this.options.prefix + '-disabled');
        },


        /**
         * 处理 enable 事件
         * 监听自身的 enable 事件，移除 disabled class 标记，使控件可接受交互响应
         * 
         * @private
         */
        onEnable: function () {
            this.popup.enable();
            lib.removeClass(this.target, this.options.prefix + '-disabled');
        },


        /**
         * 处理选单点击事件
         * 
         * @param {Object} args 从 Popup 传来的事件对象
         * @private
         */
        onClick: function (args) {
            var e = args.event;

            if (!e || this._disabled) {
                return;
            }

            var el = lib.getTarget(e);
            var tag = el.tagName;

            switch (tag) {

                case 'A':
                    lib.preventDefault(e);

                    privates.pick.call(this, el);

                    break;

                default:

                    break;

            }

            this.fire('click', args);
        },

        /**
         * 转发Popup的onBeforeShow事件
         * 
         * @param {Object} arg 事件参数
         * @fires module:Select#beforeShow
         * @private
         */
        onBeforeShow: function (arg) {

            lib.preventDefault(arg.event);

            if (this._disabled) {
                return;
            }

            /**
             * @event module:Select#beforeShow
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            this.fire('beforeShow', arg);

            lib.addClass(this.target, this.options.prefix + '-hl');
        },

        /**
         * 隐藏浮层后的处理，主要是为了去掉高亮样式
         * 
         * @private
         */
        onHide: function () {
            lib.removeClass(this.target, this.options.prefix + '-hl');
        },

        /**
         * 选取选项
         * 
         * @param {HTMLElement} el 点击的当前事件源对象
         * @param {boolean} isSilent 静默模式，是否发送事件通知
         * @fires module:Select#pick
         * @fires module:Select#change
         * @private
         */
        pick: function (el, isSilent) {

            this.hide();

            var lastItem = this.lastItem;
            if (lastItem === el) {
                return;
            }

            var options = this.options;
            var target = this.target;
            var realTarget = this.realTarget;
            var lastValue = this.lastValue;
            var selectedClass = options.prefix + '-' + options.selectedClass;

            var value  = el.getAttribute('data-value');
            var text = value ? el.innerHTML : this.defaultValue;
            var shortText = text
                ? textOverflow(text, options.maxLength, options.ellipsis)
                : text;

            var typeValue = options.isNumber ? (value | 0) : value;

            if (lastItem) {
                lib.removeClass(lastItem, selectedClass);
            }

            if (value) {
                lib.addClass(el, selectedClass);
            }

            this.lastItem = el;

            if (!isSilent) {

                /**
                 * @event module:Select#pick
                 * @type {Object}
                 * @property {string} value 选中项的值
                 * @property {string} text 选中项的文字
                 * @property {Date} shortText 选中项的文字的切割值
                 */
                this.fire('pick', { 
                    value: typeValue,
                    text: text,
                    shortText: shortText
                });

            }

            if (value === lastValue) {              
                return;
            }

            this.lastValue = value;

            if (target) {

                if (target.type) {
                    target.value = shortText;
                    target.focus();
                }
                else {
                    (realTarget || target).innerHTML = shortText;
                }

                target.title = text;
            }

            var klass = options.prefix + '-checked';
            lib[value ? 'addClass' : 'removeClass'](target, klass);

            if (!isSilent) {

                /**
                 * @event module:Select#change
                 * @type {Object}
                 * @property {string} value 选中项的值
                 * @property {string} text 选中项的文字
                 * @property {Date} shortText 选中项的文字的切割值
                 */
                this.fire('change', { 
                    value: typeValue,
                    text: text,
                    shortText: shortText
                });           
            }

        }
    };

    /**
     * 下拉选择菜单
     * 
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Select
     * @example
     *  new Select({
     *     prefix: 'ecl-ui-sel',
     *     main: me.qq('ecl-ui-sel'),
     *     target: me.qq('ecl-ui-sel-holder'),
     *     offset: {
     *       y: -1
     *     },
     *     onChange: function (arg) {
     *       window.console && console.log(arg);
     *     }
     *   }).render();
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
         * @property {number} options.cols 选项显示的列数，默认为 1 列
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

            // 提示框的不可用状态，默认为false。处于不可用状态的提示框不会出现。
            disabled: false,

            // 控件渲染主容器
            main: '',

            // 显示选中值时的限度字节长度
            maxLength: 16,

            // maxLength 限制后的附加的后缀字符
            ellipsis: '...',

            // 计算选单显示时相对位置的目标对象
            target: '',

            // 显示列数
            cols: 1,

            // 选中项的 class
            selectedClass: 'cur',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-sel',

            // 控件值的类型是否为数字
            isNumber: true,

            // 数据源
            datasource: null,

            // datasource 项未指定 value 时
            valueUseIndex: false
        },

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:Select#options
         * @private
         */
        init: function (options) {

            if (!options.target) {
                throw new Error('invalid target');
            }

            this._disabled  = options.disabled;
            this.bindEvents(privates);
        },


        /**
         * 绘制控件
         * 
         * @return {module:Select} 当前实例
         * @override
         * @public
         */
        render: function () {
            var options = this.options;

            if (!this.rendered) {
                this.rendered = true;

                this.target = lib.g(options.target);
                this.realTarget = lib.dom.first(this.target) || this.target;
                this.defaultValue = this.realTarget.innerHTML
                    || this.realTarget.value
                    || '';

                this.srcOptions.triggers = [this.target];

                var popup = this.popup = new Popup(this.srcOptions);
                this.addChild(popup);

                if (options.datasource) {
                    options.isNumber = options.valueUseIndex;
                    this.fill(options.datasource);
                }

                var bound = this._bound;
                popup.on('click', bound.onClick);
                popup.on('beforeShow', bound.onBeforeShow);
                popup.on('hide', bound.onHide);

                popup.render();

                this.on('disable', bound.onDisable);
                this.on('enable', bound.onEnable);
                this.main = popup.main;

                if (options.cols > 1) {
                    lib.addClass(
                        this.main,
                        options.prefix + '-cols' + options.cols
                    );
                    //lib.addClass(this.main, 'c-clearfix');
                }
            }
            else {
                this.popup.render();
            }

            return this;
        },

        /**
         * 显示浮层
         * 
         * @param {?HTMLElement=} target 触发显示浮层的节点
         * @fires module:Select#show 显示事件
         * @public
         */
        show: function (target) {

            this.popup.show();

            /**
             * @event module:Select#show
             * @type {object}
             * @property {?HTMLElement=} target 触发显示浮层的节点
             */
            this.fire('show', {target: target});

        },

        /**
         * 隐藏浮层
         * 
         * @fires module:Select#hide 隐藏事件
         * @public
         */
        hide: function () {
            
            this.popup.hide();

            /**
             * @event module:Select#hide
             */
            this.fire('hide');
        },

        /**
         * 填充数据
         * 
         * @param {(Array | string)} datasource 要填充的数据源
         * 参考 options.datasource
         * @public
         */
        fill: function (datasource) {

            if (!datasource || !datasource.length) {
                return;
            }

            if (!lib.isArray(datasource)) {
                datasource = String(datasource).split(/\s*[,，]\s*/);
            }

            var html = [];
            var valueUseIndex = !!this.options.valueUseIndex;
            for (var i = 0; i < datasource.length; i++) {
                var item = datasource[i];

                if (!lib.isObject(item)) {
                    var data = item.split(/\s*[:：]\s*/);
                    item = {text: data[0]};
                    item.value = data.length > 1
                        ? data[1] 
                        : (valueUseIndex ? i : data[0]); 
                }

                html.push(''
                    + '<a href="#" data-value="' + item.value + '">'
                    +   item.text
                    + '</a>'
                );
            }
            
            this.popup.main.innerHTML = html.join('');

        },

        /**
         * 获取控件当前值
         * 
         * @param {bool} isNumber 是否需要返回数字类型的值
         * @return {(string | number)} 返回当前选中项的值
         * @public
         */
        getValue: function (isNumber) {
            var options = this.options;
            var klass = options.prefix + '-' + options.selectedClass;
            var selected = this.popup.query(klass)[0];
            var value = selected ? selected.getAttribute('data-value') : '';
            isNumber = lib.typeOf(isNumber) === 'boolean'
                ? isNumber
                : options.isNumber;

            return isNumber ? (value | 0) : value;
        },

        /**
         * 重置选项
         * 
         * 将选项恢复到初始值，依赖于第一个选项，其值为 0 或空
         * @public
         */
        reset: function () {
            privates.pick.call(this, lib.dom.first(this.main), true);
        }
    });

    return Select;
});
