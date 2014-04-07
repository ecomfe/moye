/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 分页控件
 * @author  chris(wfsr@foxmail.com)
 */

define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * 私有函数或方法
     * 
     * @type {Object}
     * @namespace
     * @name module:Pager~privates
     */
    var privates = /** @lends module:Pager~privates */ {

        /**
         * 生成所有页码
         * 
         * @return {string} 分页的HTML代码
         * @private
         */
        build: function () {
            var options    = this.options;
            var lang       = options.lang;
            var prefix     = options.prefix + '-';
            var showAlways = options.showAlways;
            var showCount  = this.showCount;
            var total      = this.total;
            var page       = this.page + 1;
            var padding    = this.padding;
            var html       = [];
            var htmlLength = 0;

            if (total < 2) {
                if (showAlways) {
                    setSpecial(0, 'prev', true);
                    setSpecial(0, 'current');
                    setSpecial(0, 'next', true);                   
                }
                
                return html.join('');
            }

            var start = 1;
            var end = total;
            var wing = (showCount - showCount % 2) / 2;

            function setNum(i) {
                html[htmlLength ++] = ''
                    + '<a href="#" data-page="' + (i - 1) + '">'
                    +   i
                    + '</a>';
            }

            function setSpecial(i, name, disabled) {
                var klass = prefix + name;
                if (disabled) {
                    klass += ' ' + prefix + 'disabled';
                }
                html[htmlLength ++] = ''
                    + '<a href="#" data-page="'
                    +   i + '" class="' + klass + '">' 
                    +   (lang[name] || i + 1)
                    + '</a>';
            }

            showCount = wing * 2 + 1;

            if (showCount < total) {
                end = showCount;
                if (page > wing + 1) {
                    if (page + wing > total) {
                        start = total - wing * 2;
                        end   = total;
                    }
                    else {
                        start = page - wing;
                        end   = page + wing;
                    }
                }
            }

            // previous page
            if (page > 1 || showAlways) {
                setSpecial(page - 2, 'prev', page < 2);
            }

            // padding-left
            for (i = 0; i < padding; i ++) {
                if (i + 1 < start) {
                    setNum(i + 1);              
                }
            }

            // ..
            if (start > padding + 2) {
                setSpecial(page - 2, 'ellipsis');
            }

            if (start === padding + 2) {
                setNum(padding + 1);
            }
            
            // current page & wing
            var current = page;
            for (var i = start; i <= end; i++) {
                i === current ? setSpecial(i - 1, 'current') : setNum(i);
            }

            // ..
            var pos = total - padding;
            if (end < pos - 1) {
                setSpecial(page, 'ellipsis');
            }

            if (end === pos - 1) {
                setNum(pos);
            }

            // padding-right
            for (i = 0; i < padding; i++) {
                if (pos + i + 1 > end) {
                    setNum(pos + i + 1);            
                }
            }               

            // next page
            if (page < total || showAlways) {
                setSpecial(page, 'next', page >= total);
            }

            return html.join('');
        },

        /**
         * 页码改变时
         * 
         * @param {Event} e 事件对象
         * @fires module:Pager#click
         * @fires module:Pager#change
         * @private
         */
        onChange: function (e, target) {
            e && lib.preventDefault(e);
            target = target || lib.getTarget(e);

            /**
             * @event module:Pager#click
             */
            this.fire('click');

            var main = this.main;
            if (this.disabled || !target || target === main) {
                return;
            }

            if (target.tagName !== 'A') {
                target = lib.getAncestorBy(
                    target,
                    function (el) {

                        // 最高访问到控件根容器, 避免到文档根节点
                        return el.tagName === 'A' || el === main;
                        
                    }
                );
                
                if (target === main) {
                    return;
                }
            }

            var current = target.getAttribute('data-page');

            if (current !== null) {
                current |= 0;
            }

            var page = this.page;

            if ( 
                current !== null
                && 0 <= current
                && current < this.total
                && current !== page
            ) {
                var first = this.options.first & 1;

                /**
                 * @event module:Pager#change
                 * @type {Object}
                 * @property {number} page 新的页码
                 */
                this.fire('change', { page: current + first });
            }
        }
    };

    /**
     * 分页控件
     * 
     * 提供Ajax及本地数据分页功能
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Pager
     * @example
     * &lt;div class="pager-container"&gt;&lt;/div&gt;
     * new Pager({
     *     main: lib.q('pager-container')[0],
     *     total: 10,
     *     onChange: function (e) {
     *         // load new date
     *         this.setPage(e.page);
     *         this.render();
     *     }
     *  }).render();
     */
    var Pager = Control.extend(/** @lends module:Pager.prototype */{

        /**
         * 控件类型标识
         * 
         * @type {string}
         * @private
         */
        type: 'Pager',

        /**
         * 控件配置项
         * 
         * @name module:Pager#optioins
         * @type {Object}
         * @property {boolean} options.disabled 控件的不可用状态
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @property {number} options.page 当前页，第一页从0开始
         * @property {number} options.first 起始页码，通常值为 0 或 1，默认 0
         * @property {number} options.padding 当页数较多时，首尾显示页码的个数
         * @property {boolean} options.showAlways 是否一直显示分页控件
         * @property {number} options.showCount 当页数较多时，中间显示页码的个数
         * @property {number} options.total 总页数
         * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
         * @property {string} options.disabledClass 分页项不用可时的class定义
         * @property {Object.<string, string>} options.lang 用于显示上下页的文字
         * @property {string} options.lang.prev 上一页显示文字(支持HTML)
         * @property {string} options.lang.next 下一页显示文字(支持HTML)
         * @property {string} options.lang.ellipsis 省略处显示文字(支持HTML)
         * @private
         */
        options: {

            // 控件的不可用状态
            disabled: false,

            // 控件渲染主容器
            main: '',

            // 当前页，第一页从0开始
            page: 0,

            // 起始页码
            first: 0,

            // 首尾显示的页码个数
            padding: 1,

            // 是否一直显示分页控件
            showAlways: true,

            // 当页数较多时，中间显示页码的个数
            showCount: 0,

            // 总页数
            total: 0,

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-pager',

            // 分页项不用可时的class定义
            disabledClass: 'disabled',

            // 上下页显示文字
            lang: {

                // 上一页显示文字
                prev: '<em></em>上一页',

                // 下一页显示文字
                next: '下一页<em></em>',

                // 省略号
                ellipsis: '..'
            }
        },

        /**
         * 需要绑定 this 的方法名，多个方法以半角逗号分开
         * 
         * @type {string}
         * @private
         */
        binds: 'onChange',

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:Pager#options
         * @private
         */
        init: function (options) {

            this.bindEvents(privates);

            this.disabled  = options.disabled;
            this.showCount = (options.showCount || Pager.SHOW_COUNT) | 0;
            this.total     = options.total | 0;
            this.padding   = options.padding | 0;
            this.page      = 0;
            options.first  &= 1;

            this.setPage(options.page | 0);

            var lang = options.lang;
            lang.prev.replace(/\{prefix\}/gi, options.prefix);
            lang.next.replace(/\{prefix\}/gi, options.prefix);

            if (options.main) {
                this.main = lib.g(options.main);
                lib.addClass(this.main, options.prefix);
                lib.on(this.main, 'click', this._bound.onChange);
            }
        },

        /**
         * 设置页码
         * 
         * @param {number} page 新页码
         * @public
         */
        setPage: function (page) {
            page -= this.options.first;
            page = Math.max(0, Math.min(page | 0, this.total - 1));

            if (page !== this.page) {
                this.page = page;
            }
        },

        /**
         * 获取当前页码
         * 
         * @return {number} 控件当前页码
         * @public
         */
        getPage: function () {
            return this.page + this.options.first;
        },

        /**
         * 设置总页数
         * 
         * @param {number} total 要设置的总页数
         * @public
         */
        setTotal: function (total) {
            this.total = (total | 0) || 1;
            this.setPage(0);
        },

        /**
         * 获取总页数
         * 
         * @return {number} 控件总页数
         * @public
         */
        getTotal: function () {
            return this.total;
        },


        /**
         * 绘制控件
         * 页数小于2页时可配置控件隐藏
         * 
         * @return {module:Pager} 当前实例
         * @override
         * @public
         */
        render: function () {
            if (!this.main) {
                throw new Error('invalid main');
            }

            var main = this.main;

            if (this.total > 1 || this.options.showAlways) {
                main.innerHTML = privates.build.call(this);
                lib.show(main);
            }
            else {
                lib.hide(main);
            }

            return this;
        },
    });

    /**
     * 当页数较多时，中间显示页码的个数
     * 
     * @const
     * @type {number}
     */
    Pager.SHOW_COUNT = 5;

    return Pager;
});
