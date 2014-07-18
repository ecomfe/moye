define('ui/Tip', [
    'require',
    './lib',
    './Control'
], function (require) {
    var lib = require('./lib');
    var DOM = lib.dom;
    var PAGE = lib.page;
    var Control = require('./Control');
    var getTarget = function (e, className) {
        var target = lib.getTarget(e);
        if (!lib.hasClass(target, className)) {
            target = lib.getAncestorByClass(target, className);
            if (!target) {
                return null;
            }
        }
        return target;
    };
    var privates = {
            clear: function () {
                clearTimeout(this._showTimer);
                clearTimeout(this._hideTimer);
                clearTimeout(this._resizeTimer);
            },
            onClick: function (e) {
                this.fire('click', { event: e });
            },
            onResize: function () {
                clearTimeout(this._resizeTimer);
                var me = this;
                this._resizeTimer = setTimeout(function () {
                    me.show(me.current);
                }, 100);
            },
            onDocClick: function (e) {
                var main = this.main;
                var target = getTarget(e, this.options.flag);
                if (main === target || ~lib.array.indexOf(this.triggers, target) || DOM.contains(main, target)) {
                    return;
                }
                privates.onHide.call(this);
            },
            onShow: function (e) {
                var target = getTarget(e, this.options.flag);
                privates.clear.call(this);
                if (!target || this.current === target) {
                    return;
                }
                var events = this.events;
                var bound = this._bound;
                if (events) {
                    lib.on(target, events.un, bound.onHide);
                    lib.un(target, events.on, bound.onShow);
                    if (this.current) {
                        lib.on(this.current, events.on, bound.onShow);
                        lib.un(this.current, events.un, bound.onHide);
                    }
                    if (this.options.mode === 'click') {
                        lib.on(document, 'click', bound.onDocClick);
                    }
                }
                this.current = target;
                this.fire('beforeShow', {
                    target: target,
                    event: e
                });
                var delay = this.options.showDelay;
                if (delay) {
                    var me = this;
                    this._showTimer = setTimeout(function () {
                        me.show(target);
                    }, delay);
                } else {
                    this.show(target);
                }
            },
            onHide: function () {
                var me = this;
                var options = this.options;
                privates.clear.call(me);
                if (options.hideDelay) {
                    var me = this;
                    this._hideTimer = setTimeout(function () {
                        me.hide();
                    }, options.hideDelay);
                } else {
                    this.hide();
                }
            },
            onMouseEnter: function () {
                privates.clear.call(this);
            },
            onMouseLeave: function () {
                var me = this;
                var options = me.options;
                privates.clear.call(me);
                if (options.hideDelay) {
                    me._hideTimer = setTimeout(function () {
                        me.hide();
                    }, options.hideDelay);
                } else {
                    me.hide();
                }
            },
            computePosition: function () {
                var options = this.options;
                var target = this.current;
                var main = this.main;
                var arrow = this.elements.arrow;
                var dir = options.arrow;
                var position = DOM.getPosition(target);
                var prefix = options.prefix + '-arrow';
                var top = position.top;
                var left = position.left;
                var width = target.offsetWidth;
                var height = target.offsetHeight;
                var right = left + width;
                var bottom = top + height;
                var center = left + width / 2;
                var middle = top + height / 2;
                var mainWidth = main.offsetWidth;
                var mainHeight = main.offsetHeight;
                var arrowWidth = arrow.firstChild.offsetWidth;
                var arrowHeight = arrow.firstChild.offsetHeight;
                var scrollTop = PAGE.getScrollTop();
                var scrollLeft = PAGE.getScrollLeft();
                var scrollRight = scrollLeft + PAGE.getViewWidth();
                var scrollBottom = scrollTop + PAGE.getViewHeight();
                var dirFromAttr = target.getAttribute('data-tooltips');
                if (dirFromAttr) {
                    dir = /[trblc]{2}/.test(dirFromAttr) ? dirFromAttr : '1';
                }
                var second, first;
                if (!dir || dir === '1') {
                    var horiz = width > mainWidth || left - (mainWidth - width) / 2 > 0 && right + (mainWidth - width) / 2 <= scrollRight ? 'c' : left + mainWidth > scrollRight ? 'r' : 'l';
                    var vertical = height > mainHeight || top - (mainHeight - height) / 2 > 0 && bottom + (mainHeight - height) / 2 <= scrollBottom ? 'c' : top + mainHeight > scrollBottom ? 'b' : 't';
                    if (bottom + arrowHeight + mainHeight <= scrollBottom) {
                        first = 'b';
                        second = horiz;
                    } else if (right + mainWidth + arrowWidth <= scrollRight) {
                        first = 'r';
                        second = vertical;
                    } else if (top - mainHeight - arrowHeight >= scrollTop) {
                        first = 't';
                        second = horiz;
                    } else if (left - mainWidth - arrowWidth >= scrollLeft) {
                        first = 'l';
                        second = vertical;
                    }
                    dir = first + second;
                } else {
                    first = dir.charAt(0);
                    second = dir.charAt(1);
                }
                var lrtb = {
                        l: 'left',
                        r: 'right',
                        t: 'top',
                        b: 'bottom'
                    };
                var offset = options.offset;
                arrow.className = prefix + ' ' + prefix + '-' + lrtb[first];
                arrowWidth = arrow.firstChild.offsetWidth;
                arrowHeight = arrow.firstChild.offsetHeight;
                if ({
                        t: 1,
                        b: 1
                    }[first]) {
                    left = {
                        l: left + offset.x,
                        c: center - mainWidth / 2,
                        r: right - mainWidth - offset.x
                    }[second];
                    top = {
                        t: top - arrowHeight - mainHeight - offset.y,
                        b: bottom + arrowHeight + offset.y
                    }[first];
                    var middleX = (width - arrowWidth) / 2;
                    arrow.style.left = {
                        c: (mainWidth - arrowWidth) / 2,
                        l: middleX - offset.x,
                        r: mainWidth - Math.max(arrowWidth, middleX) + offset.x
                    }[width > mainWidth ? 'c' : second] + 'px';
                    arrow.style.top = '';
                } else if ({
                        l: 1,
                        r: 1
                    }[first]) {
                    top = {
                        t: top + offset.y,
                        c: middle - mainHeight / 2,
                        b: bottom - mainHeight - offset.y
                    }[second];
                    left = {
                        l: left - arrowWidth - mainWidth - offset.x,
                        r: right + arrowWidth + offset.x
                    }[first];
                    var middleY = (height - arrowHeight) / 2;
                    arrow.style.top = {
                        c: (mainHeight - arrowHeight) / 2,
                        t: middleY - offset.y,
                        b: mainHeight - Math.max(arrowHeight, middleY) + offset.y
                    }[height > mainHeight ? 'c' : second] + 'px';
                    arrow.style.left = '';
                }
                DOM.setStyles(main, {
                    left: left + 'px',
                    top: top + 'px'
                });
            }
        };
    var Tip = Control.extend({
            type: 'Tip',
            options: {
                disabled: false,
                main: '',
                arrow: false,
                showDelay: 100,
                hideDelay: 300,
                mode: 'over',
                title: null,
                content: '',
                prefix: 'ecl-ui-tip',
                triggers: 'tooltips',
                flag: '_ecui_tips',
                offset: {
                    x: 0,
                    y: 0
                },
                tpl: '' + '<div class="{prefix}-arrow {prefix}-arrow-top">' + '<em></em>' + '<ins></ins>' + '</div>' + '<div class="{prefix}-title"></div>' + '<div class="{prefix}-body"></div>'
            },
            init: function (options) {
                options.hideDelay = options.hideDelay < 0 ? Tip.HIDE_DELAY : options.hideDelay;
                this._disabled = options.disabled;
                this.title = options.title;
                this.content = options.content;
                var prefix = options.prefix;
                var main = this.main = document.createElement('div');
                main.className = prefix;
                main.innerHTML = options.tpl.replace(/{prefix}/g, prefix);
                main.style.left = '-2000px';
                this.events = {
                    over: {
                        on: 'mouseenter',
                        un: 'mouseleave'
                    },
                    click: {
                        on: 'click',
                        un: 'click'
                    }
                }[options.mode];
                this.bindEvents(privates);
            },
            render: function () {
                var me = this;
                var main = this.main;
                var options = this.options;
                var events = this.events;
                if (!this.rendered) {
                    this.rendered = true;
                    document.body.appendChild(main);
                    var bound = this._bound;
                    lib.on(main, 'click', bound.onClick);
                    if (this.options.mode === 'over') {
                        lib.on(main, 'mouseenter', bound.onMouseEnter);
                        lib.on(main, 'mouseleave', bound.onMouseLeave);
                    }
                    var elements = this.elements = {};
                    var prefix = options.prefix + '-';
                    lib.each('arrow,title,body'.split(','), function (name) {
                        elements[name] = lib.q(prefix + name, main)[0];
                    });
                    this.addTriggers(options.triggers);
                }
                if (!events && this.triggers) {
                    if (options.showDelay) {
                        this._showTimer = setTimeout(function () {
                            me.show(me.triggers[0]);
                        });
                    } else {
                        this.show(this.triggers[0]);
                    }
                }
                return this;
            },
            addTriggers: function (triggers) {
                var options = this.options;
                var events = this.events;
                var flag = options.flag;
                this.triggers = typeof triggers === 'string' ? lib.q(options.triggers) : triggers.length ? triggers : [triggers];
                var onShow = this._bound.onShow;
                if (events) {
                    lib.each(this.triggers, function (trigger) {
                        if (!lib.hasClass(trigger, flag)) {
                            lib.addClass(trigger, flag);
                            lib.on(trigger, events.on, onShow);
                        }
                    });
                }
            },
            refresh: function (triggers, parentNode) {
                var events = this.events;
                triggers = typeof triggers === 'string' ? lib.q(triggers, parentNode) : triggers.length ? triggers : [triggers];
                var bound = this._bound;
                if (events) {
                    if (this.triggers) {
                        lib.each(triggers, function (trigger) {
                            if (!triggers.parentElement) {
                                lib.un(trigger, events.on, bound.onShow);
                                lib.un(trigger, events.un, bound.onHide);
                            }
                        });
                    }
                    this.addTriggers(triggers);
                }
            },
            show: function (target) {
                var options = this.options;
                var elements = this.elements;
                privates.clear.call(this);
                this.current = target;
                lib.on(window, 'resize', this._bound.onResize);
                elements.title.innerHTML = this.title || '';
                elements.body.innerHTML = this.content;
                lib[this.title ? 'show' : 'hide'](elements.title);
                if (!options.arrow) {
                    lib.hide(elements.arrow);
                }
                privates.computePosition.call(this);
                this._visible = true;
                this.fire('show', { target: target });
            },
            hide: function () {
                var main = this.main;
                var events = this.events;
                var target = this.current;
                var bound = this._bound;
                if (events && target) {
                    lib.on(target, events.on, bound.onShow);
                    lib.un(target, events.un, bound.onHide);
                    if (this.options.mode === 'click') {
                        lib.un(document, 'click', bound.onDocClick);
                    }
                }
                privates.clear.call(this);
                var arrow = this.elements.arrow;
                main.style.left = -main.offsetWidth - arrow.offsetWidth + 'px';
                this._visible = false;
                this.current = null;
                lib.un(window, 'resize', bound.onResize);
                this.fire('hide');
            },
            isVisible: function () {
                return !!this._visible;
            },
            setTitle: function (html) {
                this.title = html || '';
                var elements = this.elements;
                elements.title.innerHTML = this.title;
                lib[this.title ? 'show' : 'hide'](elements.title);
            },
            setContent: function (html) {
                this.content = html || '';
                this.elements.body.innerHTML = this.content;
            },
            dispose: function () {
                var options = this.options;
                var events = this.events;
                var bound = this._bound;
                if (events) {
                    var flag = options.flag;
                    lib.each(this.triggers || [], function (trigger) {
                        if (lib.hasClass(trigger, flag)) {
                            lib.removeClass(trigger, flag);
                            lib.un(trigger, events.on, bound.onShow);
                        }
                    });
                }
                var main = this.main;
                if (options.mode === 'over') {
                    lib.un(main, 'mouseenter', bound.onMouseEnter);
                    lib.un(main, 'mouseleave', bound.onMouseLeave);
                } else {
                    lib.un(document, 'click', bound.onDocClick);
                }
                this.current = null;
                this.parent('dispose');
            }
        });
    return Tip;
});