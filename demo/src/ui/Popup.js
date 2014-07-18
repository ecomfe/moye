define('ui/Popup', [
    'require',
    'jquery',
    './lib',
    './Control'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var privates = {
            onResize: function () {
                clearTimeout(this._resizeTimer);
                var me = this;
                this._resizeTimer = setTimeout(function () {
                    me.show();
                }, 100);
            },
            onShow: function (e) {
                if (this._disabled) {
                    return;
                }
                var trigger = e.target;
                var $trigger = $(e.target);
                var liveTriggers = this.liveTriggers;
                if (liveTriggers) {
                    var cls = this.options.triggers;
                    while (!$trigger.hasClass(cls)) {
                        if ($.inArray(trigger, this.liveTriggers) !== -1) {
                            break;
                        }
                        trigger = trigger.parent();
                    }
                    if (!$trigger.hasClass(cls)) {
                        return;
                    }
                }
                this.fire('beforeShow', { event: e });
                this.show();
                this.trigger = trigger;
                var bound = this._bound;
                this._timer = setTimeout(function () {
                    $(document).on('click', bound.onHide);
                    $(window).on('resize', bound.onResize);
                }, 0);
            },
            onHide: function (e) {
                var target = e.target;
                var main = this.main;
                if (!main || main === target || $.contains(main, target)) {
                    return;
                }
                this.hide();
                clearTimeout(this._resizeTimer);
            },
            computePosition: function () {
                var options = this.options;
                var target = $(this.target || this.triggers[0]);
                var main = $(this.main);
                var dir = options.dir;
                var position = target.position();
                var marginTop = parseInt(target.css('margin-top'), 10);
                var marginLeft = parseInt(target.css('margin-left'), 10);
                var top = position.top + marginTop;
                var left = position.left + marginLeft;
                var width = target.outerWidth();
                var height = target.outerHeight();
                var right = left + width;
                var bottom = top + height;
                var center = left + width / 2;
                var middle = top + height / 2;
                var mainWidth = main.width();
                var mainHeight = main.height();
                var win = $(window);
                var scrollTop = win.scrollTop();
                var scrollLeft = win.scrollLeft();
                var scrollRight = scrollLeft + win.width();
                var scrollBottom = scrollTop + win.height();
                var dirFromAttr = target.attr('data-popup');
                if (dirFromAttr) {
                    dir = /[trbl]{2}/.test(dirFromAttr) ? dirFromAttr : '1';
                }
                var second, first;
                if (dir === 'auto') {
                    var horiz = width > mainWidth || left - (mainWidth - width) / 2 > 0 && right + (mainWidth - width) / 2 <= scrollRight ? 'c' : left + mainWidth > scrollRight ? 'r' : 'l';
                    var vertical = height > mainHeight || top - (mainHeight - height) / 2 > 0 && bottom + (mainHeight - height) / 2 <= scrollBottom ? 'c' : top + mainHeight > scrollBottom ? 'b' : 't';
                    if (bottom + mainHeight <= scrollBottom) {
                        first = 'b';
                        second = horiz;
                    } else if (right + mainWidth <= scrollRight) {
                        first = 'r';
                        second = vertical;
                    } else if (top - mainHeight >= scrollTop) {
                        first = 't';
                        second = horiz;
                    } else if (left - mainWidth >= scrollLeft) {
                        first = 'l';
                        second = vertical;
                    }
                    dir = first + second;
                } else {
                    first = dir.charAt(0);
                    second = dir.charAt(1);
                }
                var offset = options.offset;
                if ({
                        t: 1,
                        b: 1
                    }[first]) {
                    left = {
                        l: left,
                        c: center - mainWidth / 2,
                        r: right - mainWidth
                    }[second];
                    top = {
                        t: top - mainHeight,
                        b: bottom
                    }[first];
                } else if ({
                        l: 1,
                        r: 1
                    }[first]) {
                    top = {
                        t: top,
                        c: middle - mainHeight / 2,
                        b: bottom - mainHeight
                    }[second];
                    left = {
                        l: left - mainWidth - offset.x,
                        r: right + offset.x
                    }[first];
                }
                $(main).css({
                    left: left + offset.x + 'px',
                    top: top + offset.y + 'px'
                });
            }
        };
    var Popup = Control.extend({
            type: 'Popup',
            options: {
                disabled: false,
                main: '',
                target: '',
                triggers: '',
                liveTriggers: '',
                content: '',
                dir: 'bl',
                prefix: 'ecl-hotel-ui-popup',
                offset: {
                    x: 0,
                    y: 0
                }
            },
            init: function (options) {
                this._disabled = options.disabled;
                this.content = options.content;
                this.bindEvents(privates);
                if (options.target) {
                    this.target = lib.g(options.target);
                }
                var prefix = options.prefix;
                var main = $(options.main || '<div>');
                main.addClass(prefix);
                if (!options.main) {
                    main.css('left', '-2000px');
                }
                var triggers = options.triggers;
                var liveTriggers = options.liveTriggers;
                var bound = this._bound;
                if (liveTriggers) {
                    liveTriggers = lib.isString(liveTriggers) ? $('.' + liveTriggers) : $(liveTriggers);
                    this.liveTriggers = liveTriggers.on('click', bound.onShow).toArray();
                } else {
                    triggers = lib.isString(triggers) ? $('.' + options.triggers) : $(options.triggers);
                    this.triggers = triggers.on('click', bound.onShow).toArray();
                }
                this.main = main.get(0);
            },
            render: function () {
                var main = $(this.main);
                if (this.content) {
                    main.html(this.content);
                }
                if (!this.rendered) {
                    var me = this;
                    me.rendered = true;
                    main.appendTo(document.body).on('click', function (e) {
                        me.fire('click', { event: e });
                    });
                }
                return this;
            },
            show: function () {
                privates.computePosition.call(this);
                this.fire('show');
            },
            hide: function () {
                this.main.style.left = '-2000px';
                this.fire('hide');
                var bound = this._bound;
                $(document).off('click', bound.onHide);
                $(window).off('resize', bound.onResize);
                clearTimeout(this._timer);
                clearTimeout(this._resizeTimer);
            }
        });
    return Popup;
});