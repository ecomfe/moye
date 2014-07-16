define('ui/Select', [
    'require',
    './lib',
    './Control',
    './Popup'
], function (require) {
    var lib = require('./lib');
    var Control = require('./Control');
    var Popup = require('./Popup');
    function bLength(str) {
        return str.replace(/[^\x00-\xff]/gi, '..').length;
    }
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
            i++;
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
    var privates = {
            onDisable: function () {
                this.popup.disable();
                lib.addClass(this.target, this.options.prefix + '-disabled');
            },
            onEnable: function () {
                this.popup.enable();
                lib.removeClass(this.target, this.options.prefix + '-disabled');
            },
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
            onBeforeShow: function (arg) {
                lib.preventDefault(arg.event);
                if (this._disabled) {
                    return;
                }
                this.fire('beforeShow', arg);
                lib.addClass(this.target, this.options.prefix + '-hl');
            },
            onHide: function () {
                lib.removeClass(this.target, this.options.prefix + '-hl');
            },
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
                var value = el.getAttribute('data-value');
                var text = value ? el.innerHTML : this.defaultValue;
                var shortText = text ? textOverflow(text, options.maxLength, options.ellipsis) : text;
                var typeValue = options.isNumber ? value | 0 : value;
                if (lastItem) {
                    lib.removeClass(lastItem, selectedClass);
                }
                if (value) {
                    lib.addClass(el, selectedClass);
                }
                this.lastItem = el;
                if (!isSilent) {
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
                    } else {
                        (realTarget || target).innerHTML = shortText;
                    }
                    target.title = text;
                }
                var klass = options.prefix + '-checked';
                lib[value ? 'addClass' : 'removeClass'](target, klass);
                if (!isSilent) {
                    this.fire('change', {
                        value: typeValue,
                        text: text,
                        shortText: shortText
                    });
                }
            }
        };
    var Select = Control.extend({
            type: 'Select',
            options: {
                disabled: false,
                main: '',
                maxLength: 16,
                ellipsis: '...',
                target: '',
                cols: 1,
                selectedClass: 'cur',
                prefix: 'ecl-ui-sel',
                isNumber: true,
                datasource: null,
                valueUseIndex: false
            },
            init: function (options) {
                if (!options.target) {
                    throw new Error('invalid target');
                }
                this._disabled = options.disabled;
                this.bindEvents(privates);
            },
            render: function () {
                var options = this.options;
                if (!this.rendered) {
                    this.rendered = true;
                    this.target = lib.g(options.target);
                    this.realTarget = lib.dom.first(this.target) || this.target;
                    this.defaultValue = this.realTarget.innerHTML || this.realTarget.value || '';
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
                        lib.addClass(this.main, options.prefix + '-cols' + options.cols);
                    }
                } else {
                    this.popup.render();
                }
                return this;
            },
            show: function (target) {
                this.popup.show();
                this.fire('show', { target: target });
            },
            hide: function () {
                this.popup.hide();
                this.fire('hide');
            },
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
                        item = { text: data[0] };
                        item.value = data.length > 1 ? data[1] : valueUseIndex ? i : data[0];
                    }
                    html.push('' + '<a href="#" data-value="' + item.value + '">' + item.text + '</a>');
                }
                this.popup.main.innerHTML = html.join('');
            },
            getValue: function (isNumber) {
                var options = this.options;
                var klass = options.prefix + '-' + options.selectedClass;
                var selected = this.popup.query(klass)[0];
                var value = selected ? selected.getAttribute('data-value') : '';
                isNumber = lib.typeOf(isNumber) === 'boolean' ? isNumber : options.isNumber;
                return isNumber ? value | 0 : value;
            },
            reset: function () {
                privates.pick.call(this, lib.dom.first(this.main), true);
            }
        });
    return Select;
});