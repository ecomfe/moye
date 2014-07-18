define('ui/ScrollBar', [
    'require',
    './lib',
    './Control'
], function (require) {
    var lib = require('./lib');
    var Control = require('./Control');
    var wheelEvent = lib.browser.firefox ? 'DOMMouseScroll' : 'mousewheel';
    var setTextNoSelect = function (supportCss) {
            var selectEvent;
            return supportCss ? function (enabled, noSelectClass) {
                lib[enabled ? 'addClass' : 'removeClass'](document.body, noSelectClass);
            } : function (enabled) {
                if (enabled) {
                    selectEvent = document.body.onselectstart;
                    document.body.onselectstart = new Function('event.returnValue = false');
                } else {
                    document.body.onselectstart = selectEvent;
                }
            };
        }(lib.browser.ie < 9 ? false : true);
    var privates = {
            onThumbdown: function (e) {
                if (this._disabled) {
                    return;
                }
                setTextNoSelect(true, privates.getClass.call(this, 'noselect'));
                this.mouseStart = this.xAxis ? e.pageX || e.clientX : e.pageY || e.clientY;
                this.thumbStart = parseInt(this.thumb.style[this.xAxis ? 'left' : 'top'], 10) || 0;
                lib.on(document, 'mousemove', this._bound.onMousemove);
                lib.on(document, 'mouseup', this._bound.onMouseup);
            },
            onMousemove: function (e) {
                if (this.scrollRatio < 1) {
                    var moveLength = (this.xAxis ? e.pageX || e.clientX : e.pageY || e.clientY) - this.mouseStart;
                    this.thumbPos = Math.min(this.trackSize, Math.max(0, this.thumbStart + moveLength));
                    privates.setScrollPercent.call(this, this.thumbPos / this.trackSize);
                }
            },
            onMouseup: function () {
                setTextNoSelect(false, privates.getClass.call(this, 'noselect'));
                lib.un(document, 'mousemove', this._bound.onMousemove);
                lib.un(document, 'mouseup', this._bound.onMouseup);
            },
            onTrackUp: function (e) {
                if (this._disabled || lib.getTarget(e) !== this.track) {
                    return;
                }
                var pos = Math.min(this.trackSize, this.xAxis ? e.offsetX : e.offsetY);
                privates.setScrollPercent.call(this, pos / this.trackSize);
            },
            onMouseWheel: function (e) {
                if (this._disabled) {
                    return;
                }
                var delta = e.wheelDelta ? e.wheelDelta / 120 : -e.detail / 3;
                var percent = delta * this.options.wheelspeed;
                if (percent * (1 - this.scrollRatio) > 2 * this.scrollRatio) {
                    percent = 2 * this.scrollRatio;
                }
                var percent = this.curPos - percent;
                privates.setScrollPercent.call(this, percent);
                if (this.options.preventWheelScroll || percent >= 0.005 && percent <= 0.995) {
                    lib.preventDefault(e);
                }
            },
            onMainEnter: function () {
                lib.addClass(this.main, privates.getClass.call(this, 'over'));
            },
            onMainLeave: function () {
                lib.removeClass(this.main, privates.getClass.call(this, 'over'));
            },
            setScrollPercent: function (pos) {
                if (pos < 0.005) {
                    pos = 0;
                } else if (1 - pos < 0.005) {
                    pos = 1;
                }
                var axis = this.xAxis ? 'left' : 'top';
                this.thumb.style[axis] = Math.round(pos * this.trackSize) + 'px';
                var top = Math.round(pos * this.panelSize * (1 - this.scrollRatio));
                if (this.posMode) {
                    this.panel.style[axis] = -top + 'px';
                } else {
                    this.panel[this.scrollDirection] = top;
                }
                this.curPos = pos;
                var event = { position: pos };
                this.fire('change', event);
            },
            getClass: function (name) {
                name = name ? '-' + name : '';
                return this.options.prefix + name;
            }
        };
    var ScrollBar = Control.extend({
            type: 'ScrollBar',
            options: {
                disabled: false,
                main: '',
                panel: '',
                thumb: '',
                wheelspeed: 0.05,
                direction: 'vertical',
                prefix: 'ecl-ui-scrollbar',
                mode: '',
                preventWheelScroll: false,
                autoThumbSize: true,
                minThumbSize: 30
            },
            init: function () {
                if (!this.options.main) {
                    throw new Error('invalid main');
                }
                var opt = this.options;
                this._disabled = !!opt.disabled;
                this.curPos = 0;
                this.bindEvents(privates);
                this.xAxis = opt.direction === 'horizontal';
                var sizeProp = this.xAxis ? 'Width' : 'Height';
                this.offsetProp = 'offset' + sizeProp;
                this.clientProp = 'client' + sizeProp;
                this.scrollProp = 'scroll' + sizeProp;
                this.scrollDirection = 'scroll' + (this.xAxis ? 'Left' : 'Top');
                this.posMode = opt.mode === 'position';
                this.main = lib.g(opt.main);
                if (!opt.panel) {
                    this.panel = lib.q(privates.getClass.call(this, 'panel'), this.main)[0];
                } else {
                    this.panel = lib.g(opt.panel);
                }
                if (!opt.thumb) {
                    this.thumb = lib.q(privates.getClass.call(this, 'thumb'), this.main)[0];
                } else {
                    this.thumb = lib.g(opt.thumb);
                }
                this.track = this.thumb.offsetParent;
                var bound = this._bound;
                lib.on(this.thumb, 'mousedown', bound.onThumbdown);
                lib.on(this.track, 'mouseup', bound.onTrackUp);
                lib.on(this.panel, wheelEvent, bound.onMouseWheel);
                lib.on(this.main, 'mouseenter', bound.onMainEnter);
                lib.on(this.main, 'mouseleave', bound.onMainLeave);
            },
            scrollTo: function (pos) {
                if (pos === 'begin') {
                    pos = 0;
                } else if (pos === 'end') {
                    pos = 1;
                } else if (pos > 1) {
                    pos = pos / (this.panelSize * (1 - this.scrollRatio));
                } else {
                    pos = pos * 1 || 0;
                }
                privates.setScrollPercent.call(this, pos);
            },
            refresh: function () {
                this.panelSize = this.panel[this.scrollProp];
                this.scrollRatio = this.main[this.clientProp] / this.panelSize;
                lib[this.scrollRatio >= 1 ? 'addClass' : 'removeClass'](this.main, privates.getClass.call(this, 'noscroll'));
                var trackLen = this.track[this.clientProp];
                if (this.options.autoThumbSize && this.scrollRatio < 1) {
                    var thumbSize = Math.max(this.options.minThumbSize, this.scrollRatio * trackLen);
                    this.thumb.style[this.xAxis ? 'width' : 'height'] = thumbSize + 'px';
                }
                this.trackSize = trackLen - this.thumb[this.offsetProp];
                this.scrollTo(this.curPos);
                this._disabled = this.scrollRatio >= 1;
                return this;
            },
            render: function () {
                if (!this.options.main) {
                    throw new Error('invalid main');
                }
                this.refresh();
                return this;
            },
            setEnabled: function (enabled) {
                var disabled = !enabled;
                lib[disabled ? 'addClass' : 'removeClass'](this.main, privates.getClass.call(this, 'disable'));
                this._disabled = disabled;
            },
            enable: function () {
                this.setEnabled(true);
            },
            disable: function () {
                this.setEnabled(false);
            },
            dispose: function () {
                var bound = this._bound;
                lib.removeClass(document.body, privates.getClass.call(this, 'noselect'));
                lib.un(this.thumb, 'mousedown', bound.onThumbdown);
                lib.un(this.track, 'mouseup', bound.onTrackUp);
                lib.un(this.panel, wheelEvent, bound.onMouseWheel);
                lib.un(document, 'mousemove', bound.onMousemove);
                lib.un(document, 'mouseup', bound.onMouseup);
                lib.un(this.main, 'mouseenter', bound.onMainEnter);
                lib.un(this.main, 'mouseleave', bound.onMainLeave);
                this.main = this.panel = this.thumb = this.track = null;
                this.parent('dispose');
            }
        });
    return ScrollBar;
});