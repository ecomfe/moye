define('ui/Filter', [
    'require',
    'jquery',
    './lib',
    './Control'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var privates = {
            onClick: function (e) {
                var me = this;
                me.fire('click', { event: e });
                var $target = $(e.target);
                var $input = $target;
                var tagName = $target.prop('tagName');
                var type = $target.prop('type');
                if (tagName !== 'LABEL' && tagName !== 'INPUT') {
                    return;
                }
                if (tagName === 'INPUT') {
                    if (type === 'radio') {
                        $target.prop('checked', false);
                    }
                    $target = $target.parent();
                } else {
                    e.preventDefault();
                    $input = $target.find('input');
                }
                var options = me.options;
                var checkedClass = options.checkedClass;
                var disabledClass = options.disabledClass;
                var isRadio = $input.attr('type') === 'radio';
                if ($target.prop('tagName') !== 'LABEL' || $target.hasClass(disabledClass) || isRadio && $input.prop('checked')) {
                    return;
                }
                var isChecked = isRadio ? true : !$target.hasClass(checkedClass);
                var $group = $(me.groups[$input.attr('name')]);
                var $checkedItems = $group.find('.' + checkedClass);
                if (isRadio) {
                    $checkedItems.removeClass(checkedClass);
                } else {
                    var tag = me.options.allTag;
                    if ($target.attr(tag)) {
                        if ($target.hasClass('checked')) {
                            $input.prop('checked', true);
                            return;
                        }
                        $checkedItems.removeClass(checkedClass).find('input').prop('checked', false);
                    } else {
                        $group.find('label[data-all]').removeClass(checkedClass).find('input').prop('checked', false);
                    }
                }
                $input.prop('checked', isChecked);
                $target.toggleClass(checkedClass);
                var name = $input.attr('name');
                var checkedData = isRadio ? {
                        key: name,
                        value: [$input.attr('value')]
                    } : me.getData(name);
                var newValue = checkedData.value.join(',');
                var propertyName = 'data-value';
                if ($group.attr(propertyName) === newValue) {
                    return;
                }
                $group.attr(propertyName, newValue);
                me.fire('change', checkedData);
            }
        };
    var Filter = Control.extend({
            type: 'Filter',
            options: {
                disabled: false,
                main: '',
                prefix: 'ecl-ui-filter',
                allTag: 'data-all',
                groups: 'p',
                checkedClass: 'checked',
                disabledClass: 'disabled'
            },
            init: function (options) {
                var me = this;
                me.disabled = options.disabled;
                me.main = typeof options.main === 'string' ? $('#' + options.main) : $(options.main);
                me.main = me.main[0];
                me.bindEvents(privates);
            },
            render: function (wrapper) {
                var me = this;
                var $main = typeof wrapper === 'string' ? $('#' + wrapper) : $(wrapper || me.main);
                var options = me.options;
                if (!$main.length) {
                    throw new Error('main not found!');
                }
                if (!me.rendered) {
                    me.rendered = true;
                    var groups = me.groups = {};
                    $(options.groups).each(function (index, group) {
                        groups[$('input', group).attr('name')] = group;
                    });
                    $main.on('click', me._bound.onClick);
                }
                return me;
            },
            getData: function (key) {
                var me = this;
                var group = me.groups[key];
                var data = { key: key };
                var value = data.value = [];
                if (!group) {
                    return data;
                }
                var checkedClass = me.options.checkedClass;
                var all = [];
                var isAllSelected = false;
                $('label', group).each(function (i, label) {
                    var $label = $(label);
                    var $input = $label.find('input');
                    var v = $input.val();
                    v && all.push(v);
                    if (!$label.hasClass(checkedClass)) {
                        return;
                    }
                    if ($label.attr('data-all')) {
                        isAllSelected = true;
                    } else {
                        value.push(v);
                    }
                });
                if (isAllSelected) {
                    data.value = all;
                }
                return data;
            },
            disableItems: function (key, values) {
                var options = this.options;
                var checkedClass = options.checkedClass;
                var disabledClass = options.disabledClass;
                var group = this.groups[key];
                var comma = ',';
                if (!group) {
                    return;
                }
                values = values.join(comma);
                $('input', group).each(function (i, input) {
                    var $input = $(input);
                    var $label = $input.parent();
                    if (lib.contains(values, $input.attr('value'), comma)) {
                        $input.prop('checked', false);
                        $label.removeClass(checkedClass).addClass(disabledClass);
                    } else {
                        $label.removeClass(disabledClass);
                    }
                });
            },
            enableItems: function (key) {
                var disabledClass = this.options.disabledClass;
                var group = this.groups[key];
                if (!group) {
                    return;
                }
                $('.' + disabledClass, group).removeClass(disabledClass);
            }
        });
    return Filter;
});