/**
 * @file moye - TextBox - AutoComplete
 * @author Leon(lupengyu@baidu)
 *         liulangyu(liulangyu90316@gmail.com)
 * @date 2015-05-13
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('../lib');
    var Plugin = require('./Plugin');
    var Popup = require('../Popup');

    /**
     * 默认textbox change事件handler阀值
     *
     * @const
     * @type {number}
     */
    var DEFAULT_DELAY = 150;

    /**
     * keyCode值 枚举
     *
     * @type {Object}
     */
    var KeyCodes = {
        ENTER: 13,
        ESC: 27,
        UP: 38,
        DOWN: 40
    };

    /**
     * 默认的推荐项的部件名称
     *
     * @const
     * @type {string}
     */
    var AUTOCOMPLETE_PART_NAME = 'autocomplete-item';

    // keycode values
    var codeValues = lib.map(KeyCodes, function (v) {
        return v;
    });

    /**
     * 输入自动完成插件
     *
     * @extends module:Plugin
     * @exports TextBoxAutoComplete
     */
    var TextBoxAutoComplete = Plugin.extend({

        $class: 'TextBoxAutoComplete',

        /**
         * TextBoxAutoComplete 配置选项
         *
         * @type {Object} options 配置
         * @property {boolean} options.history 是否保留历史数据
         * @property {number} options.delay 数据加载阀值
         * @property {Function(string):(Promise | *)} options.datasource 数据源
         * @property {Function(Array.<Object>, number):(string | HTMLElement)} options.renderItem 结果选项渲染
         */
        options: {
            /**
             * 是否保留历史
             *
             * @type {boolean}
             */
            history: true,

            /**
             * 数据加载阀值
             * 在此段时间内只会触发一次datasource加载
             *
             * @type {number}
             */
            delay: DEFAULT_DELAY,

            /**
             * 数据源
             *
             * @param {string} query 输入值
             * @return {(Promise | *)}
             */
            datasource: function (query) {
                return null;
            },

            /**
             * 结果选项dom渲染(数据会经过验证)
             *
             * @param {Array.<Object>} suggestion 推荐数据项(原始数据)
             * @param {number} index 索引
             * @return {(string | HTMLElement)}
             */
            renderItem: function (suggestion, index) {
                return suggestion.text;
            }
        },

        /**
         * 初始化
         *
         * @override
         * @param {Object} options 配置项
         */
        initialize: function (options) {
            this.$parent(options);

            this.delay = this.delay || DEFAULT_DELAY;

            // key move with throttle
            this.move = lib.throttle.call(
                this,
                this.move,
                50
            );

            this.current = null;

            this._cacheData = {};
        },

        /**
         * 激活控件
         *
         * @override
         * @param {TextBox} textbox 输入框
         */
        activate: function (textbox) {
            this.$parent(textbox);

            this.textbox = textbox;

            var id = textbox.id;
            var input = this.input = textbox.input;

            $(input)
                // 这里是特殊控制事件的处理(keydown更符合用户体验)
                .on('keydown.' + id, $.proxy(this.onTextBoxKeyDown, this))
                .on('blur.' + id, $.proxy(this.onTextBoxBlur, this))
                .get(0)
                .autocomplete = 'off';

            // export to textbox
            textbox.getSuggestions = $.proxy(this.load, this);
            textbox.hideSuggestions = $.proxy(this.hide, this);
            textbox.showSuggestions = $.proxy(this.show, this);
            textbox.getPopup = $.proxy(this.getPopup, this);

            // 输入框的输入事件处理，加阀值
            var changeHandler = lib.debounce.call(
                this,
                $.proxy(this.onTextBoxChange, this),
                this.delay
            );

            textbox.on('change', changeHandler);

            // popup
            var helper = textbox.helper;
            var popup = this.popup = new Popup({
                main: helper.createPart('autocomplete'),
                target: input,
                triggers: input,
                mode: 'click',
                hideDelay: 0,
                showDelay: 0
            }).render();

            popup
                .on('click', $.proxy(this.onPopupClick, this))
                .on('beforeshow', $.proxy(this.onPopupBeforeShow, this))
                .on('show', $.proxy(this.onPopupShow, this))
                .on('hide', $.proxy(this.onPopupHide, this));

            textbox.addChild(popup);

            this.resizePopup();
        },

        /**
         * 输入变化，准备加载推荐数据
         *
         * @private
         * @param  {Event} e 输入事件
         */
        onTextBoxChange: function (e) {
            var value = this.textbox.getValue();
            // 缓存原始值
            this.setCacheKey(value);

            value = $.trim(value);
            if (value) {
                this.load(value);
            }
            else {
                this.hide();
                // reset data
                this.suggestions = null;
            }
        },

        /**
         * 当输入框失去焦点时, 隐藏推荐
         *
         * @private
         */
        onTextBoxBlur: function () {
            // 点击数据量也会触发blur，delay处理
            lib.delay.call(this, this.hide, 200)();
        },

        /**
         * 按下事件处理
         *
         * @private
         * @param  {Event} e 按键事件
         */
        onTextBoxKeyDown: function (e) {
            var code = e.keyCode;
            // `上` `下` `ESC` `ENTER` 需要阻止默认事件
            if (~$.inArray(code, codeValues)) {
                e.preventDefault();
            }

            switch (e.keyCode) {
                case KeyCodes.DOWN:
                    // 按`下`
                    this.next();
                    break;
                case KeyCodes.UP:
                    // 按`上`
                    this.prev();
                    break;
                case KeyCodes.ENTER:
                    // 按`enter`
                    this.confirm();
                    break;
                case KeyCodes.ESC:
                    // 按`esc`
                    this.hide();
                    break;
            }
        },

        /**
         * 浮层点击
         *
         * @private
         * @fires module:TextBox#autocompleteclick
         * @param {Event} e popup点击事件
         */
        onPopupClick: function (e) {
            var className = this.getPartClassName();
            var target = $(e.target).closest('.' + className);
            this.confirm(target[0]);

            /**
             * @event module:TextBox#autocompleteclick
             */
            this.textbox.fire('autocompleteclick');
        },

        /**
         * 浮层显示前的处理
         *
         * @private
         * @fires module:TextBox#autocompletebeforeshow
         * @param {Event} e popup show
         */
        onPopupBeforeShow: function (e) {
            if (this.textbox.isDisabled()) {
                e.preventDefault();
                return;
            }

            // 需要我们自己去处理下
            if (!this.suggestions || !this.getInputValue()) {
                e.preventDefault();
                return;
            }

            /**
             * @event module:TextBox#autocompletebeforeshow
             */
            this.textbox.fire('autocompletebeforeshow');
        },

        /**
         * 浮层显示
         *
         * @private
         * @fires module:TextBox#autocompleteshow
         * @param {Event} e popup show
         */
        onPopupShow: function (e) {
            if (this.textbox.isDisabled()) {
                e.preventDefault();
                return;
            }

            /**
             * @event module:TextBox#autocompleteshow
             */
            this.textbox.fire('autocompleteshow');
        },

        /**
         * 浮层隐藏
         *
         * @private
         * @fires module:TextBox#autocompletehide
         * @param {Event} e popup hide
         */
        onPopupHide: function (e) {
            if (this.textbox.isDisabled()) {
                e.preventDefault();
                return;
            }

            /**
             * @event module:TextBox#autocompletehide
             */
            this.textbox.fire('autocompletehide');
        },

        /**
         * 选中某个推荐项
         *
         * @private
         * @fires module:TextBox#autocompletepick
         * @param {HTMLElement} item 选中的dom项
         * @param {boolean} isSilent 静默模式，是否发送事件通知
         */
        pick: function (item, isSilent) {
            var index = $(item).index();

            if (!~index) {
                return;
            }

            this.current !== null && this.cancelHighlight(this.current);
            this.highlight(index);

            this.current = index;

            this.textbox.setValue(this.toInput(this.suggestions[index]));

            /**
             * @event module:TextBox#autocompletepick
             */
            !isSilent && this.textbox.fire('autocompletepick');
        },

        /**
         * 确认点击或者回车
         *
         * @private
         * @fires module:TextBox#autocomplete
         * @param {?HTMLElement} item 选中某个推荐项
         */
        confirm: function (item) {
            var suggestions = this.suggestions || [];

            if (!item && this.current !== null) {
                item = this.getActiveItem();
            }

            // item不存在的情况下，还是分发事件，不默认做处理了，方便用户在这种情况下做特定的处理
            var index = $(item).index();

            /**
             * @event module:TextBox#autocomplete
             * @type {Object}
             * @property {Object} suggestion 数据项
             */
            var event = this.textbox.fire('autocomplete', {
                suggestion: suggestions[index] || {}
            });

            if (event.isDefaultPrevented()) {
                return;
            }

            // 还是发送下pick事件吧~
            this.pick(item);
            this.hide();
        },

        /**
         * 加载推荐数据
         *
         * @private
         * @param {string} key 输入值
         * @return {TextBox}
         */
        load: function (key) {
            var cacheData = this.getCacheData(key);
            if (this.history && cacheData.length) {
                this.onSuggestionLoaded(key, cacheData);
                return this.textbox;
            }

            var fetching = this.datasource(key);
            // 异步加载数据
            if (lib.isPromise(fetching)) {
                fetching.then($.proxy(this.onSuggestionLoaded, this, key));
            }
            // 同步返回数据
            else {
                this.onSuggestionLoaded(key, fetching);
            }

            return this.textbox;
        },

        /**
         * 数据获取完毕
         *
         * @private
         * @param {string} key 输入值
         * @param {Array} data 数据
         */
        onSuggestionLoaded: function (key, data) {
            if (!data || !data.length) {
                this.hide();
            }
            else {
                this.fill(key, data);
            }
        },

        /**
         * 缓存输入值
         *
         * @private
         * @param {string} value 当前输入框的值
         */
        setCacheKey: function (value) {
            this._key = value;
        },

        /**
         * 取缓存的输入值
         *
         * @private
         * @return {string}
         */
        getCacheKey: function () {
            return this._key || '';
        },

        /**
         * 缓存推荐数据
         *
         * @private
         * @param {string} key 输入值
         * @param {Array.<Object>} data 推荐数据
         */
        setCacheData: function (key, data) {
            this._cacheData[key] = data;
        },

        /**
         * 获取缓存的推荐数据
         *
         * @private
         * @param {string} key 输入值
         * @return {Array.<Object>}
         */
        getCacheData: function (key) {
            return this._cacheData[key] || [];
        },

        /**
         * 对render后的datasource数格式据进行验证
         *
         * @private
         * @param {Array.<Object>} data 待验证数据
         * @return {boolean}
         */
        validateSource: function (data) {
            // TODO 数据为空时候的处理？
            if ($.isArray(data)
                && data.length
                && data[0].hasOwnProperty('text')
                && data[0].hasOwnProperty('value')
            ) {
                return true;
            }

            return false;
        },

        /**
         * 获取列表主元素
         *
         * @private
         * @return {HTMLElement}
         */
        getMain: function () {
            return this.popup.main;
        },

        /**
         * 获取列表子元素集合
         *
         * @private
         * @return {HTMLCollection}
         */
        getChildren: function () {
            return $('.' + this.getPartClassName(), this.getMain());
        },

        /**
         * 获取推荐项部件className
         *
         * @private
         * @return {string}
         */
        getPartClassName: function () {
            return this.textbox.helper.getPrimaryClassName(AUTOCOMPLETE_PART_NAME);
        },

        /**
         * 获取被选中的项
         *
         * @private
         * @return {?jQuery}
         */
        getActiveItem: function () {
            // eq(null) will get eq(0)
            return this.current !== null ? this.getChildren().eq(this.current) : null;
        },

        /**
         * 获取输入的值
         *
         * @private
         * @return {string}
         */
        getInputValue: function () {
            return $.trim(this.textbox.getValue());
        },

        /**
         * 填充数据，渲染dom
         *
         * @private
         * @param {string} key 关键字
         * @param {Array.<Object>} data 推荐原始数据
         * @return {TextBox}
         */
        fill: function (key, data) {
            var self = this;

            this.suggestions = data = data || [];
            var count = data.length;

            if (!key || !data || !count || !this.validateSource(data)) {
                return this.textbox;
            }

            // 数据ok才缓存
            if (this.history) {
                this.setCacheData(key, data);
            }

            // 重置当前的标识
            this.current = null;

            // build html
            var html = ['<ul>'];

            var itemClassName = this.getPartClassName();

            var text;
            var title;
            var item;
            lib.each(data, function (v, i) {
                // wrap it(默认string，加上title)
                text = self.renderItem(v, i);
                title = /<[^>]+>/g.test(text) ? '' : (' title="' + text + '"');

                item = ''
                    + '<li class="' + itemClassName + '" data-index="' + i + '"' + title + '>'
                    +     text
                    + '</li>';
                html.push(item);
            });

            html.push('</ul>');

            this.popup.setContent(html.join(''));

            this.show();

            return this.textbox;
        },

        /**
         * 显示推荐浮层
         *
         * @private
         * @return {TextBox}
         */
        show: function () {
            this.popup.show();

            return this.textbox;
        },

        /**
         * 隐藏推荐浮层
         *
         * @private
         * @return {TextBox}
         */
        hide: function () {
            this.popup.hide();

            return this.textbox;
        },

        /**
         * 解析推荐数据项目, 解析过的数据用于赋值
         *
         * @private
         * @param  {Object} suggestion 推荐项目
         * @return {string}
         */
        toInput: function (suggestion) {
            return suggestion.value;
        },

        /**
         * 选中下一个备选项
         *
         * @private
         */
        next: function () {
            this.move('down');
        },

        /**
         * 选中上一个备选项
         *
         * @private
         */
        prev: function () {
            this.move('up');
        },

        /**
         * 上下移动选中
         *
         * @private
         * @param {string} direction 方向 `up` `down`
         */
        move: function (direction) {
            var count = (this.suggestions || []).length;

            if (count === 0) {
                return;
            }

            // 上下移动，如果当前没有显示的话，显示
            if (this.getInputValue() && !this.popup.isVisible()) {
                this.show();
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


            if (next !== null) {
                this.pick(this.getChildren().eq(next));
            }
            else {
                current !== null && this.cancelHighlight(current);
                this.textbox.setValue(this.getCacheKey());

                this.current = next;
            }
        },

        /**
         * 高亮结果项
         *
         * @private
         * @param {number} index 索引
         */
        highlight: function (index) {
            this.getChildren().eq(index).addClass('hover');
        },

        /**
         * 取消高亮结果项
         *
         * @private
         * @param {number} index 索引
         */
        cancelHighlight: function (index) {
            this.getChildren().eq(index).removeClass('hover');
        },

        /**
         * 数据列表宽度设置
         *
         * @private
         */
        resizePopup: function () {
            $(this.getMain()).outerWidth($(this.input).outerWidth());
        },

        /**
         * 暴露此方法，方面外部调用进行定制
         *
         * @public
         * @return {Popup}
         */
        getPopup: function () {
            return this.popup;
        },

        /**
         * 禁用
         *
         * @override
         */
        inactivate: function () {
            var textbox = this.textbox;
            var id = textbox.id;

            $(textbox.input)
                .off('keydown.' + id)
                .off('blur.' + id);

            this.textbox = null;
        }

    });

    return TextBoxAutoComplete;
});
