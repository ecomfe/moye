define('ui/CalendarExtension', [
    'require',
    './lib',
    './Control',
    './Calendar'
], function (require) {
    var lib = require('./lib');
    var Control = require('./Control');
    var Calendar = require('./Calendar');
    var menuPrivites = {
            onShow: function (e) {
                this.show(this.target, true);
            },
            onHide: function (e) {
                this.hide();
            },
            onClick: function (e) {
                var target = lib.getTarget(e);
                if (target.tagName === 'A') {
                    lib.stopPropagation(e);
                    this.fire('click', { target: target });
                    if (this.check(target)) {
                        var value = target.innerHTML;
                        this.target.innerHTML = value;
                        this.select(value);
                        this.hide();
                        this.fire('pick', {
                            value: value,
                            target: this.target
                        });
                    }
                }
            }
        };
    var Menu = Control.extend({
            type: 'Calendar.Menu',
            options: {
                start: 1,
                end: 12,
                className: '',
                selectedClass: 'current'
            },
            init: function (options) {
                var main = this.main = document.createElement('div');
                lib.addClass(main, options.className);
                this.bindEvents(menuPrivites);
            },
            render: function () {
                var options = this.options;
                if (!this.rendered) {
                    this.rendered = true;
                    var main = this.main;
                    this.build(options.start, options.end);
                    this.elements = main.getElementsByTagName('a');
                    var bound = this._bound;
                    lib.on(main, 'mouseenter', bound.onShow);
                    lib.on(main, 'mouseleave', bound.onHide);
                    lib.on(main, 'click', bound.onClick);
                    if (options.target) {
                        this.setTarget(lib.g(options.target));
                    }
                }
                return this;
            },
            build: function (start, end) {
                if (lib.isArray(start)) {
                    end = start[1];
                    start = start[0];
                }
                this.start = start;
                this.end = end;
                var html = [];
                for (var i = start; i <= end; i++) {
                    html.push('<a href="#">' + i + '</a>');
                }
                this.fire('build', { html: html });
                this.main.innerHTML = html.join('');
            },
            setTarget: function (target) {
                if (target) {
                    this.target = target;
                }
            },
            select: function (value) {
                var options = this.options;
                var klass = options.selectedClass;
                var selected = this.query(klass)[0];
                var selectedValue = selected && selected.innerHTML;
                selected && lib.removeClass(selected, klass);
                if (selectedValue !== value) {
                    var el = this.elements[value - this.start];
                    el && lib.addClass(el, klass);
                }
            },
            show: function (target, noEvent) {
                !noEvent && this.fire('beforeShow', { target: target });
                var main = this.main;
                if (target !== this.target) {
                    this.setTarget(target);
                    target.parentNode.parentNode.appendChild(main);
                }
                this.select(target.innerHTML | 0);
                lib.show(main);
            },
            hide: function () {
                lib.hide(this.main);
            },
            check: function () {
                return true;
            }
        });
    Menu.month = function (options) {
        var menu = new Menu(options);
        return menu.render();
    };
    Menu.year = function (options) {
        var menu = new Menu(options);
        var size = 20;
        var getRange = function (value) {
            var remainder = value % size;
            var start = value - remainder + 1;
            var end = start + size - 1;
            return [
                start,
                end
            ];
        };
        menu.on('build', function (e) {
            var html = e.html;
            html.push('<a href="#" data-cmd="prev">&lt;</a>');
            html.push('<a href="#" data-cmd="back">\u8FD4\u56DE</a>');
            html.push('<a href="#" data-cmd="next">&gt;</a>');
        });
        menu.on('beforeShow', function (e) {
            var el = e.target;
            var value = el.innerHTML | 0;
            this.build(getRange(value));
        });
        menu.on('click', function (e) {
            var cmd = e.target.getAttribute('data-cmd');
            switch (cmd) {
            case 'prev':
                this.build(getRange(this.start - size));
                break;
            case 'next':
                this.build(getRange(this.start + size));
                break;
            case 'back':
                this.build(getRange(this.target.innerHTML | 0));
                break;
            default:
                break;
            }
        });
        menu.check = function (el) {
            return !el.getAttribute('data-cmd');
        };
        return menu.render();
    };
    var privates = {
            renderMenu: function (related, type) {
                var menu = this.menus[type];
                if (!menu) {
                    menu = this.menus[type] = Menu[type]({ className: 'menu-' + type + '-options' });
                    var calendar = this.calendar;
                    menu.on('pick', function (e) {
                        var head = e.target.parentNode;
                        var links = head.getElementsByTagName('a');
                        var year = links[0].innerHTML | 0;
                        var month = links[1].innerHTML | 0;
                        var monthElement = head.parentNode;
                        lib.each(lib.q(monthElement.className, monthElement.parentNode), function (el, i) {
                            if (el === monthElement) {
                                var date = new Date(year, month - 1, 1);
                                date.setMonth(month - i - 1);
                                calendar.setValue(date);
                            }
                        });
                    });
                }
                menu.show(related);
            },
            onOver: function (e) {
                var el = lib.getTarget(e);
                var type = el.getAttribute('data-menu-type');
                if (type) {
                    privates.renderMenu.call(this, el, type);
                    var main = this.main;
                    var bound = this._bound;
                    lib.un(main, 'mouseover', bound.onOver);
                    lib.on(main, 'mouseout', bound.onOut);
                }
            },
            onOut: function (e) {
                var el = lib.getTarget(e);
                var type = el.getAttribute('data-menu-type');
                if (type) {
                    var menu = this.menus[type];
                    menu && menu.hide();
                    var main = this.main;
                    var bound = this._bound;
                    lib.on(main, 'mouseover', bound.onOver);
                    lib.un(main, 'mouseout', bound.onOut);
                }
            },
            onClick: function (e) {
                privates.onHide.call(this, e);
            },
            onHide: function (e) {
                lib.forIn(this.menus, function (menu) {
                    menu.hide();
                });
            }
        };
    var CalendarExtension = lib.newClass({
            initialize: function (options) {
                options = options || {};
                options.lang = options.lang || {};
                options.lang.title = '' + '<a href="#" data-menu-type="year"' + ' class="{prefix}-menu-year-handler">{year}</a>\u5E74' + '<a href="#" data-menu-type="month"' + ' class="{prefix}-menu-month-handler">{month}</a>\u6708';
                this.calendar = new Calendar(options);
                this.menus = {};
                Control.prototype.bindEvents.call(this, privates);
            },
            render: function () {
                var calendar = this.calendar;
                var value = calendar.render.apply(calendar, arguments);
                var main = this.main = calendar.main;
                var bound = this._bound;
                lib.on(main, 'mouseover', bound.onOver);
                lib.on(main, 'mouseout', bound.onOut);
                lib.on(main, 'click', bound.onClick);
                calendar.on('hide', bound.onHide);
                return value;
            },
            dispose: function () {
                lib.forIn(this.menus, function (menu) {
                    menu.dispose();
                });
                var main = this.main;
                var bound = this._bound;
                lib.un(main, 'mouseover', bound.onOver);
                lib.un(main, 'mouseout', bound.onOut);
                lib.un(main, 'click', bound.onClick);
                this.calendar.un('hide', bound.onHide);
                this.calendar.dispose();
            }
        });
    return CalendarExtension;
});