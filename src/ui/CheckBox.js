/**
 * @file 复选框
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');

    var CheckBox = Control.extend({

        type: 'CheckBox',

        options: {
            item: 'label',
            activeClass: 'checked',
            datasource: null,
            value: null
        },

        init: function (options) {
            this.$parent(options);
            this.datasource = this.datasource || $(this.main).data('datasource');
            this.value = this.value || $(this.main).data('value');
        },

        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: 'datasource',
                paint: function (conf, datasource) {
                    var main = $(this.main);
                    if (this.helper.isInStage('INITED') && main.data('dom-inited')) {
                        return;
                    }
                    datasource = this.datasource = datasource || [];
                    var html = [];
                    for (var i = 0, len = datasource.length; i < len; i++) {
                        var item = datasource[i];
                        html[i] = ''
                            + '<label data-value="' + item.value + '">'
                            +     '<input type="checkbox" name="' + this.name + '" value="' + item.value + '">'
                            +     item.name
                            + '</label>';
                    }
                    main.html(html.join(''));
                    return this;
                }
            },
            {
                name: 'value',
                paint: function (conf, value) {
                    var main = $(this.main);
                    if (this.helper.isInStage('INITED') && main.data('dom-inited')) {
                        return;
                    }
                    value = this.value = value || [];
                    var sep = '-';
                    var matchValue = value ? value.join(sep) : '';
                    var datasource = this.datasource;
                    $(this.item, main).each(function () {
                        var me = $(this);
                        var value = me.data('value');
                        var act = lib.contains(matchValue, value, sep) ? 'addClass' : 'removeClass';
                        me[act]().find('input').attr('checked', true);
                    });
                }
            }
        ),

        setDataSource: function (datasource) {
            this.set('datasoruce', datasource);
        },

        initEvents: function () {
            // 点击一个包含有input:checkbox的label,会触发两次click事件哟~
            // target分别是label和input.
            // 我们在这两个事件中只处理其中的一个, 因此此处做一个debounce
            this.delegate(this.main, 'click', lib.throttle.call(this, this._onClick, 5));
        },

        /**
         * 主元素被点击时的处理函数
         * @private
         * @param  {Event} e 点击事件
         */
        _onClick: function (e) {
            var item = this.item;
            var target = $(e.target).closest(item, this.main);
            var checkedClass = this.activeClass;
            var checked = target.hasClass(checkedClass);

            target
                .toggleClass(checkedClass)
                .find('input:checkbox')
                .attr('checked', checked);

            this.fire('change', {
                target: this
            });
        },

        /**
         * 判断一个DOM是否为当前所选中的荐
         * @param  {Element} item 某个DOM元素
         * @return {Boolean}
         */
        isActiveItem: function (item) {
            item = $(item);
            return item.is(this.item) && item.hasClass(this.activeClass);
        },

        /**
         * 获得值
         *
         * 如果item上有value值，对应的是item为input:CheckBox情况，那么使用value
         * 如果item上没有value值，对应的是item为label/li等情况，那么使用data-value
         *
         * @return {Array.string}
         */
        getValue: function () {
            var value = [];
            $(this.main).find('.' + this.activeClass).each(function () {
                value.push($(this).data('value'));
            });
            return value;
        },

        /**
         * 从item元素上获取值
         * @private
         * @param  {Element} dom item元素
         * @return {string}
         */
        _getValueFromDom: function (dom) {
            dom = $(dom);
            return dom.attr('value') || dom.attr('data-value');
        },

        /**
         * 设定值
         * @param {Array.string} value 值
         * @return {CheckBox}
         */
        setValue: function (value) {
            this.value = null;
            return this.set('value', value);
        },

        dispose: function () {
            this.undelegate(this.main, 'click', this._onClick);
            Control.prototype.dispose.apply(this, arguments);
        }

    });


    return CheckBox;
});
