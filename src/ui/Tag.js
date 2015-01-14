/**
 * @file 标签组件
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {

    var $       = require('jquery');
    var Control = require('./Control');
    var lib     = require('./lib');

    var Tag = Control.extend({

        type: 'Tag',

        options: {
            /**
             * 适配器
             *
             * 一般来讲, 一个tag的值(value)应该就是它的文本(name)
             * 如果有需要适应复杂数据, 这里提供两个方法来做适配
             * Tag控件必须有两个值一个是name, 一个是value
             * @type {Object}
             */
            adapter: {
                toName: function (tag) {
                    return tag;
                },
                toValue: function (tag) {
                    return tag;
                }
            },
            value: []
        },

        init: function (options) {
            this.$parent(options);
            this.value = this.value && this.value.length
                ? this.value
                : $(this.main).data('value') || [];
        },

        initEvents: function () {
            this.delegate(this.main, 'click', this._onMainClick);
        },

        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: ['value'],
                paint: function (conf, value) {
                    var helper = this.helper;

                    this.value = value;

                    if (helper.isInStage('INITED') && value) {
                        return;
                    }
                    var html = [];
                    var itemClass = helper.getPartClassName('item');
                    for (var i = 0, len = value.length; i < len; i++) {
                        var item = value[i];
                        var itemName = this.adapter.toName(item);
                        var itemValue = this.adapter.toValue(item);
                        html[i] = ''
                            + '<a href="#" class="' + itemClass +'" '
                            +     'data-index="' + i + '" data-value="' + itemValue + '" '
                            +     'title="' + itemName + '">'
                            +      helper.getPartHTML('content', 'span', itemName)
                            +      helper.getPartHTML('remove', 'i', 'x')
                            + '</a>';
                    }
                    this.main.innerHTML = html.join('');
                }
            }
        ),

        /**
         * 点击主元素事件的处理
         * @private
         * @param  {Event} e 点击事件
         */
        _onMainClick: function (e) {
            var target = $(e.target);
            var removeClass = this.helper.getPrimaryClassName('remove');
            e.preventDefault();
            if (target.hasClass(removeClass)) {
                var value = this.value;
                var item = target.parent();
                var index = +item.data('index');

                // 来做一个新数组, 否则repaint不能触发了~
                this.setValue(value.slice(0, index).concat(value.slice(index + 1)));
                this.fire('change');
            }
        },

        /**
         * 获取值
         * @return {Array.*}
         */
        getValue: function () {
            return this.value;
        },

        /**
         * 设定值
         * @param {Array.*} value
         * @return {Tag}
         */
        setValue: function (value) {
            this.value = null;
            this.set('value', value);
            return this;
        },

        /**
         * 添加一个tag
         * @param {*} tag 一个可以被适配器解析的tag数据
         * @return {Tag}
         */
        add: function (tag) {
            this.setValue(this.value.concat(tag));
        },

        /**
         * 移除一个Tag
         * @param  {string} tag 标签值
         * @return {Tag}
         */
        remove: function (tag) {

            var value = this.value;

            for (var i = this.value.length - 1; i >= 0; i--) {
                var item = value[i];
                if (this.adapter.toValue(item) === tag) {
                    this.setValue(value.slice(0, i).concat(value.slice(i + 1)));
                    break;
                }
            }
            return this;
        },

        getCount: function () {
            return this.value.length;
        }

    });

    return Tag;

});
