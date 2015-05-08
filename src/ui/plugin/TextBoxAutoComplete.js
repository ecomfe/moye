/**
 * @file moye - TextBox - AutoComplete
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('../lib');
    var Plugin = require('./Plugin');

    var TextBoxAutoComplete = Plugin.extend({

        $class: 'TextBoxAutoComplete',

        initialize: function (options) {

            this.$parent(options);

            // 生成一个带有阀值的加载函数
            this.load = lib.delay.call(
                this,
                this.load,
                this.delay
            );
            this.current = null;
        },

        activate: function (textbox) {

            this.$parent(textbox);

            this.textbox = textbox;

            var id = textbox.id;

            $(textbox.input)
                // 这里是特殊控制事件的处理
                .on('keyup.' + id, $.proxy(this.onTextBoxKeyUp, this))
                .on('blur.' + id, $.proxy(this.onTextBoxBlur, this))
                .get(0)
                .autocomplete = 'off';

            textbox.getSuggestions = this.load;
            textbox.hideSuggestions = $.proxy(this.hide, this);

            // 输入框的输入事件处理
            textbox.on('change', $.proxy(this.onTextBoxChange, this));
        },

        /**
         * 数据加载阀值
         * 在此段时间内只会触发一次datasource加载
         * @type {Number}
         */
        delay: 200,

        /**
         * 数据源
         * @param {string} query 搜索词
         * @return {Promise|*}
         */
        datasource: function (query) {
            return null;
        },

        /**
         * 准备加载推荐数据
         * @param  {event} e 输入事件
         */
        onTextBoxChange: function (e) {
            var value = this.textbox.getValue();
            value ? this.load(value) : this.hide();
        },

        /**
         * 当输入框失去焦点时, 隐藏推荐
         */
        onTextBoxBlur: function () {
            lib.delay.call(this, this.hide, 300)();
        },

        /**
         * 按下事件处理
         * @param  {Event} e 按键事件
         */
        onTextBoxKeyUp: function (e) {

            if (e.isDefaultPrevented()) {
                return;
            }

            switch (e.keyCode) {
                case 40:
                    // 按`下`
                    this.next();
                    return;
                case 38:
                    // 按`上`
                    this.prev();
                    return;
                case 27: case 13:
                    // 按`esc`
                    this.hide();
                    return;
                default:
                    var value = this.textbox.getValue();
                    this.setCache(value);
            }
        },

        /**
         * 缓存输入值
         * @param {string} value 当前输入框的值
         */
        setCache: function (value) {
            this._cache = value;
        },

        /**
         * 取缓存的输入值
         * @return {string}
         */
        getCache: function () {
            return this._cache || '';
        },

        /**
         * 全局点击事件处理
         * @param  {Event} e 点击事件
         */
        onDocumentClick: function (e) {

            var target = e.target;

            // 如果点击的是在推荐DOM里, 那么这里要去选中
            if (this.main && $.contains(this.main, target)) {
                e.preventDefault();
                var textbox = this.textbox;
                var className = textbox.helper.getPartClasses('autocomplete-item')[0];
                target = $(e.target).closest('.' + className);
                this.select(target[0]);
                return;
            }

            // 如果点击目标在寄主内部, 那么这里啥也不干.
            if ($.contains(this.textbox.main, e.target)) {
                return;
            }

            // 否则要隐藏推荐项
            this.hide();
        },

        /**
         * 点击某个推荐项目
         * @param {Element} item 选中某个推荐项
         */
        select: function (item) {

            var suggestions = this.suggestions;

            if (!suggestions) {
                return;
            }

            var index      = +$(item).data('index');
            var textbox    = this.textbox;
            var suggestion = suggestions[index];

            var event = textbox.fire('autocomplete', {
                suggestion: suggestion,
                mode: 'pick'
            });

            if (event.isDefaultPrevented()) {
                return;
            }

            textbox.input.focus();
            textbox.set('value', this.adapter.toInput.call(this, suggestion));
            this.hide();

        },

        /**
         * 加载推荐数据
         * @param {string} value 输入值
         * @return {TextBox}
         */
        load: function (value) {
            var fetching = this.datasource(value);
            // 异步加载数据
            if (fetching && lib.isFunction(fetching.then)) {
                fetching.then($.proxy(this.onSuggestionLoaded, this));
            }
            // 同步返回数据
            else {
                this.onSuggestionLoaded(fetching);
            }
            return this.textbox;
        },

        onSuggestionLoaded: function (data) {
            if (!data || !data.length) {
                this.hide();
            }
            else {
                this.show(data);
            }
        },

        /**
         * 获取主元素
         * @return {Element}
         */
        getMain: function () {
            var main = this.main;
            if (!main) {
                var textbox = this.textbox;
                main = this.main = textbox.helper.createPart('autocomplete');
                textbox.main.appendChild(main);
            }
            return main;
        },

        /**
         * 显示推荐浮层
         * @param  {Array.Object} suggestions 推荐数据
         * @return {TextBox}
         */
        show: function (suggestions) {

            this.suggestions = suggestions || [];
            var count = this.count = suggestions.length;

            if (!count || this.state === 'show') {
                return this.textbox;
            }

            var textbox = this.textbox;
            var helper = textbox.helper;
            var main = $(this.getMain());

            // 重置当前的标识
            this.current = null;

            var html = [];

            var itemClassName = helper.getPartClassName('autocomplete-item');

            for (var i = 0; i < count; i++) {

                var suggestion = this.adapter.toList(suggestions[i]);

                var item = ''
                    + '<a class="' + itemClassName + '" '
                    +     'data-index="' + i + '" href="#">'
                    +     suggestion
                    + '</a>';

                html.push(item);
            }

            main.html(html.join('')).show();

            this.state = 'show';

            // 开始侦听全局的点击事件
            $(document.body).on(
                'click.' + textbox.id + '.autocomplete',
                $.proxy(this.onDocumentClick, this)
            );

            return this.textbox;
        },

        adapter: {
            /**
             * 解析推荐数据项目, 解析过的数据用于展现
             * @param  {Object} suggestion 推荐项目
             * @return {string}
             */
            toList: function (suggestion) {
                return suggestion.text || suggestion.name;
            },

            /**
             * 解析推荐数据项目, 解析过的数据用于赋值
             * @param  {Object} suggestion 推荐项目
             * @return {string}
             */
            toInput: function (suggestion) {
                return suggestion.value;
            }
        },

        /**
         * 隐藏推荐浮层
         */
        hide: function () {

            if (this.state === 'hide') {
                return;
            }

            var event = this.textbox.fire('autocompletebeforehide');

            if (event.isDefaultPrevented()) {
                return;
            }

            var main = this.main;

            if (main) {
                $(main).hide();
                // 停止侦听全局点击事件
                $(document.body).off('click.' + this.textbox.id + '.autocomplete');
            }

            this.state = 'hide';

            this.suggestions = null;
            this.current = null;
            this.count = null;
            this._cache = null;
        },

        /**
         * 选中下一个备选项
         */
        next: function () {
            this.move('down');
        },

        /**
         * 选中上一个备选项
         */
        prev: function () {
            this.move('up');
        },

        move: function (direction) {

            var count = this.count || 0;

            if (count === 0) {
                return;
            }

            var current = this.current;
            var next;

            if (direction === 'down') {
                next = current === null ? 0 : current + 1;
                next = next === count ? null : next;
            }
            else {
                next = current === null ? count - 1 : current - 1;
                next = next === -1 ? null : next;
            }

            var children = $(this.main).children();

            if (current !== null) {
                children.eq(current).removeClass('hover');
            }

            if (next !== null) {
                children.eq(next).addClass('hover');
            }


            var textbox = this.textbox;
            var suggestion = this.suggestions[next];

            var event = new $.Event('autocomplete', {
                suggestion: suggestion,
                mode: 'move'
            });

            textbox.fire(event);

            if (event.isDefaultPrevented()) {
                return;
            }

            this.current = next;

            if (next === null) {
                textbox.setValue(this.getCache());
            }
            else {
                textbox.setValue(this.adapter.toInput(suggestion));
            }
        },

        inactivate: function () {

            var textbox = this.textbox;
            var id = textbox.id;

            $(textbox.input)
                .off('keyup.' + id)
                .off('blur.' + id);

            $(document.body).off('click.' + id);

            this.textbox = null;
        }

    });

    return TextBoxAutoComplete;
});
