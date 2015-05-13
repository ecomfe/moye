/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 分页控件
 * @author  chris(wfsr@foxmail.com)
 *          wuqi03(wuqi03@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var Control = require('./Control');
    var painter = require('./painter');
    var lib = require('./lib');

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
         * @property {number} options.showCount 当页数较多时，中间显示页码的个数
         * @property {number} options.total 总页数
         * @property {boolean} options.showAlways 是否一直显示分页控件
         * @property {string} options.anchor 分页锚点跳转url
         * @property {Object.<string, string>} options.lang 用于显示上下页的文字
         * @property {string} options.lang.prev 上一页显示文字(支持HTML)
         * @property {string} options.lang.next 下一页显示文字(支持HTML)
         * @property {string} options.lang.ellipsis 省略处显示文字(支持HTML)
         * @private
         */
        options: {

            // 当前页，第一页从0开始
            page: 0,

            // 起始页码
            first: 0,

            // 首尾显示的页码个数
            padding: 1,

            // 是否一直显示分页控件
            showAlways: true,

            // 当页数较多时，中间显示页码的个数
            showCount: 5,

            // 总页数
            total: 0,

            // 分页项不用可时的class定义
            disabledClass: 'disabled',

            // 是否是url锚点
            anchor: '',

            /**
             * 显示模式
             * 可选值: normal | simple
             *
             * normal: 显示方式是  <  1 2 3 .. 12  > ，每个分页是一个item;
             * simple: 显示方式是  <  2/10  > ，除了上一页和下一页外被视为是一个item;
             *
             * @type {string}
             */
            mode: 'normal',

            // 上下页显示文字
            lang: {

                // 上一页显示文字
                prev: '上一页',

                // 下一页显示文字
                next: '下一页',

                // 省略号
                ellipsis: '..'
            }
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Pager#options
         * @private
         */
        init: function (options) {
            var main = $(this.main);

            this.$parent(options);
            this.showCount = +this.showCount;
            this.total     = +this.total || +main.data('total') || 0;
            this.padding   = +this.padding || 1;
            this.first     = +this.first || +main.data('first') || 0;
            this.page      = +this.page || +main.data('page') || +this.first;

        },

        /**
         * 事件绑定
         *
         * @private
         */
        initEvents: function () {
            this.delegate(this.main, 'click', 'a', this.onMainClicked);
        },

        /**
         * 重绘
         *
         * @override
         */
        repaint: painter.createRepaint(
            Control.prototype.repaint,
            {
                name: ['page', 'total'],
                paint: function (painter, page, total) {
                    var main = $(this.main);

                    // smarty进行初次渲染，不走build
                    if (this.helper.isInStage('INITED') && main.data('click')) {
                        return;
                    }

                    // page的可选区间在[first, total - 1 + first); 所以我们做这个规范化处理
                    this.page = Math.max(Math.min(page, this.total - 1 + this.first), this.first);

                    // total的取值间是[1, total], 如果total为0或1,
                    // 那么我们认为没有必要显示pager;
                    if (total < 2 && !this.showAlways) {
                        main.hide();
                    }
                    else {
                        main.html(this.build()).show();
                    }

                }
            }
        ),

        /**
         * 设置页码
         *
         * @param {number} page 新页码
         * @public
         */
        setPage: function (page) {
            this.page = null;
            this.set('page', page);
        },

        /**
         * 获取当前页码
         *
         * @return {number} 控件当前页码
         * @public
         */
        getPage: function () {
            return this.page;
        },

        /**
         * 设置总页数
         *
         * @param {number} total 要设置的总页数
         * @public
         */
        setTotal: function (total) {
            this.set({
                page: this.first,
                total: +total
            });
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
         * 默认分页item
         * @param {number} index 当前渲染item的index
         * @param {string} part 当前渲染item的状态
         * @return {string} item的html字符串
         */
        getItemHTML: function (index, part) {
            var className = this.getItemClassName(lib.slice(arguments, 1).concat('item'));
            var page = index;
            var anchor = this.getItemAnchor(page);

            if (!this.lang[part]) {
                if (this.getPageItemHTML) {
                    return this.getPageItemHTML(page, part);
                }
                // 走精简版分支
                else if (this.mode === 'simple') {
                    return ''
                        + '<span class="' + className + '">'
                        + this.getItemText(index + 1 - this.first, 'item')
                        + '/' + this.total
                        + '</span>'
                }
            }

            return ''
                + '<a href="' + anchor + '" '
                + 'data-page="' + page + '" '
                + 'class="' + className + '">'
                + this.getItemText(index + 1 - this.first, part || 'item')
                + '</a>';
        },

        /**
         * 默认分页item
         * @param {number} index 当前渲染item的index
         * @param {string} part 当前渲染item的状态
         * @return {string} item的html字符串
         */
        getPageItemHTML: null,

        /**
         * 获取当前节点显示的文案
         * @param {number} index 分页节点
         * @param {string} part role
         * @return {string|number}
         */
        getItemText: function (index, part) {
            return this.lang[part] || index;
        },

        /**
         * 获取当前元素的class
         * @param {Array} states 所有状态的集合
         * @return {string}
         */
        getItemClassName: function (states) {
            var helper = this.helper;
            return lib.map(states, function (state) {
                return state
                    ? helper.getPartClassName(state)
                    : '';
            }).join(' ');
        },

        /**
         * 当前锚点链接
         * @param {number} page 当前节点的页码
         * @return {string}
         */
        getItemAnchor: function (page) {

            if (!this.anchor) {
                return '#';
            }

            if (~this.anchor.indexOf('?')) {
                return this.anchor + '&page=' + page;
            }

            return this.anchor + '?page=' + page;
        },

        /**
         * 生成所有页码
         *
         * @return {string} 分页的HTML代码
         * @private
         */
        build: function () {

            // page的计算从0开始
            var page = this.page - this.first;
            var total = this.total;
            var padding = this.padding;
            var showCount = this.showCount;

            showCount = showCount > total ? total : showCount;

            var wing = Math.floor(showCount / 2);

            var paddingLeft = padding;
            var wingLeft = wing;
            var paddingRight = padding;
            var wingRight = wing;

            var reduceLeftToRight = page - wing;

            // 如果wingLeft小于0, 那么把小于0的部分移动到wingRight
            if (reduceLeftToRight < 0) {
                wingLeft += reduceLeftToRight;
                wingRight -= reduceLeftToRight;
            }

            var reduceRightToLeft = page + wing + 1 - total;

            // 如果wingRight大于total, 那么把超长的部分移动到wingLeft
            if (reduceRightToLeft > 0) {
                wingLeft += reduceRightToLeft;
                wingRight -= reduceRightToLeft;
            }

            var html;

            if (this.mode === 'normal') {
                // 生成左半端页码
                var left = this.range(0, page, paddingLeft, wingLeft);
                // 生成右半端页码
                var right = this.range(page + 1, total, wingRight, paddingRight);

                html = lib.map(
                    left.concat(page).concat(right),
                    function (index) {
                        return index < 0
                            // 哈哈, 这是ellipsis
                            ? this.getItemHTML(-index + this.first, 'ellipsis')
                            // 这此进正常的孩子们
                            : this.getItemHTML(index + this.first, index === page ? 'current' : '');
                    },
                    this
                );
            }
            else if (this.mode === 'simple') {
                html = [this.getItemHTML(this.page, 'item')];
            }

            return ''
                + this.getItemHTML(
                    Math.max(page - 1, 0) + this.first,
                    'prev',
                    page > 0 ? '' : 'disabled'
                )
                + html.join('')
                + this.getItemHTML(
                    Math.min(page + 1, total - 1) + this.first,
                    'next',
                    page < total - 1 ? '' : 'disabled'
                );
        },

        /**
         * 生成一个页码数组, 如果需要ellipsis, 那么ellpsis用负数表示它;
         * 即ellipsis在5号位置, 那么他就是-5
         * 输入: start 0, stop 10, paddingLeft 3 paddingRight 3
         * 输出: 0, 1, 2, -3, 8, 9, 10
         * @param  {number} start        起始页码
         * @param  {number} stop         结束页面(不包含)
         * @param  {number} paddingLeft  起始页码之后, 应展开的页码个数
         * @param  {number} paddingRight 结束页面之前, 应展开的页码个数
         * @return {Array.number}        [start, paddingLeft, .., paddingRight, stop]
         */
        range: function (start, stop, paddingLeft, paddingRight) {
            return start + paddingLeft < stop - paddingRight
                ? lib
                    .range(start, start + paddingLeft)
                    .concat(-start - paddingLeft)
                    .concat(lib.range(stop - paddingRight, stop))
                : lib.range(start, stop);
        },

        /**
         * 页码改变时
         *
         * @param {Event} e 事件对象
         * @return {*}
         * @protected
         */
        onMainClicked: function (e) {
            var target = $(e.currentTarget);
            var helper = this.helper;

            if (!target.length
                || target.hasClass(helper.getPrimaryClassName('current'))
                || target.hasClass(helper.getPrimaryClassName('disabled'))) {
                // 阻止默认行为和冒泡
                return false;
            }

            var page = target.data('page');

            /**
             * @event module:Pager#change
             * @type {Object}
             * @property {number} page 新的页码
             */
            var event = this.fire('change', {
                page: page
            });

            // 刷新页面
            if (this.anchor) {
                return;
            }

            if (event.isDefaultPrevented()) {
                return;
            }

            e.preventDefault();
            this.set('page', page);
        },

        /**
         * 控件销毁
         */
        dispose: function () {
            this.undelegate(this.main, 'click', 'a', this.onMainClicked);
            this.$parent();
            $(this.main).html('');
        }
    });

    return Pager;
});
