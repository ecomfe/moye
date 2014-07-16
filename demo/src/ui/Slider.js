define('ui/Slider', [
    'require',
    './lib',
    './Control',
    './SliderAnim'
], function (require) {
    var lib = require('./lib');
    var Control = require('./Control');
    var Anim = require('./SliderAnim');
    function getChildren(element) {
        if (element.children) {
            return element.children;
        }
        for (var children = [], curElement = element.firstChild; curElement; curElement = curElement.nextSibling) {
            if (curElement.nodeType === 1) {
                children.push(curElement);
            }
        }
        return children;
    }
    var privates = {
            clearSwitchTimer: function () {
                clearTimeout(this._switchTimer);
                this._switchTimer = 0;
            },
            onEnter: function () {
                if (this.options.auto) {
                    privates.clearSwitchTimer.call(this);
                }
            },
            onLeave: function () {
                if (this.options.auto) {
                    this.play();
                }
            },
            onSwitch: function () {
                this.next();
                this.play();
            },
            onPrevClick: function () {
                var me = this;
                if (!me._switchDelayTimer) {
                    me._switchDelayTimer = setTimeout(function () {
                        privates.clearSwitchDelayTimer.call(me);
                        me.prev();
                    }, me.options.switchDelay);
                }
            },
            onNextClick: function () {
                var me = this;
                if (!me._switchDelayTimer) {
                    me._switchDelayTimer = setTimeout(function () {
                        privates.clearSwitchDelayTimer.call(me);
                        me.next();
                    }, me.options.switchDelay);
                }
            },
            onIndexClick: function (e) {
                var me = this;
                var target = lib.getTarget(e);
                if (target['data-index'] !== '' && !me._switchDelayTimer) {
                    var index = target.getAttribute('data-index');
                    me._switchDelayTimer = setTimeout(function () {
                        privates.clearSwitchDelayTimer.call(me);
                        me.go(+index);
                    }, me.options.switchDelay);
                }
            },
            clearSwitchDelayTimer: function () {
                clearTimeout(this._switchDelayTimer);
                this._switchDelayTimer = 0;
            },
            setCurrent: function () {
                var opt = this.options;
                if (opt.prevElement) {
                    lib[this.index === 0 && !opt.circle ? 'addClass' : 'removeClass'](opt.prevElement, this.getClass('prev-disable'));
                }
                if (opt.nextElement) {
                    lib[this.index === this.count - 1 && !opt.circle ? 'addClass' : 'removeClass'](opt.nextElement, this.getClass('next-disable'));
                }
                if (opt.indexElment) {
                    var elements = getChildren(opt.indexElment);
                    elements[this.lastIndex] && lib.removeClass(elements[this.lastIndex], this.getClass('index-selected'));
                    elements[this.index] && lib.addClass(elements[this.index], this.getClass('index-selected'));
                }
            }
        };
    var Slider = Control.extend({
            getChildren: getChildren,
            type: 'Slider',
            options: {
                main: '',
                stage: '',
                prevElement: '',
                nextElement: '',
                indexElment: '',
                auto: true,
                circle: true,
                autoInterval: 2000,
                switchDelay: 50,
                onChange: null,
                prefix: 'ecl-ui-slider',
                anim: 'slide',
                animOptions: {
                    easing: '',
                    interval: 200,
                    direction: '',
                    rollCycle: ''
                }
            },
            init: function (options) {
                this._disabled = options.disabled;
                this.bindEvents(privates);
                var bound = this._bound;
                if (options.main) {
                    this.main = lib.g(options.main);
                    lib.addClass(this.main, options.prefix);
                    lib.on(this.main, 'mouseenter', bound.onEnter);
                    lib.on(this.main, 'mouseleave', bound.onLeave);
                    options.stage = lib.g(options.stage) || lib.q(this.getClass('stage'), this.main)[0];
                    options.prevElement = lib.g(options.prevElement) || this.query(this.getClass('prev'))[0];
                    options.nextElement = lib.g(options.nextElement) || this.query(this.getClass('next'))[0];
                    options.indexElment = lib.g(options.indexElment) || this.query(this.getClass('index'))[0];
                    if (options.prevElement) {
                        lib.on(options.prevElement, 'click', bound.onPrevClick);
                    }
                    if (options.nextElement) {
                        lib.on(options.nextElement, 'click', bound.onNextClick);
                    }
                    if (options.indexElment) {
                        lib.on(options.indexElment, 'click', bound.onIndexClick);
                    }
                    var AnimClass = typeof options.anim === 'string' ? Anim.anims[options.anim] : options.anim;
                    this.curAnim = new AnimClass(this, options.animOptions);
                }
            },
            getClass: function (name) {
                name = name ? '-' + name : '';
                return this.options.prefix + name;
            },
            getIndex: function (index) {
                var goTo = this.index;
                if (index === 'start') {
                    goTo = 0;
                } else if (index === 'end') {
                    goTo = this.count - 1;
                } else {
                    goTo = +index || 0;
                }
                if (goTo === this.index) {
                    return -1;
                }
                if (goTo >= this.count) {
                    goTo = this.options.circle ? 0 : this.count - 1;
                } else if (goTo < 0) {
                    goTo = this.options.circle ? this.count - 1 : 0;
                }
                return goTo;
            },
            play: function () {
                if (this.options.auto) {
                    privates.clearSwitchTimer.call(this);
                    this._switchTimer = setTimeout(this._bound.onSwitch, this.options.autoInterval);
                }
            },
            refresh: function () {
                var me = this;
                var opt = this.options;
                var childNodes = getChildren(opt.stage);
                lib.each(childNodes, function (item) {
                    lib.addClass(item, me.getClass('item'));
                });
                if (opt.indexElment) {
                    lib.each(getChildren(opt.indexElment), function (item, index) {
                        item.setAttribute('data-index', index);
                    });
                }
                me.stage = opt.stage;
                me.index = 0;
                me.count = childNodes.length;
                me.stageWidth = opt.stage.clientWidth;
                me.stageHeight = opt.stage.clientHeight;
                privates.setCurrent.call(this);
                me.curAnim.refresh();
            },
            render: function () {
                this.refresh();
                this.play();
                return this;
            },
            prev: function () {
                this.go(this.index - 1);
                return this;
            },
            next: function () {
                this.go(this.index + 1);
                return this;
            },
            go: function (index) {
                var goTo = this.getIndex(index);
                if (goTo === -1) {
                    return;
                }
                if (false !== this.curAnim.switchTo(goTo, this.index)) {
                    this.lastIndex = this.index;
                    this.index = goTo;
                    privates.setCurrent.call(this);
                    var event = {
                            index: goTo,
                            lastIndex: this.lastIndex
                        };
                    this.fire('change', event);
                }
            },
            dispose: function () {
                privates.clearSwitchDelayTimer.call(this);
                privates.clearSwitchTimer.call(this);
                this.curAnim.dispose();
                this.curAnim = null;
                var bound = this._bound;
                var options = this.options;
                if (options.prevElement) {
                    lib.un(options.prevElement, 'click', bound.onPrevClick);
                }
                if (options.nextElement) {
                    lib.un(options.nextElement, 'click', bound.onNextClick);
                }
                if (options.indexElment) {
                    lib.un(options.indexElment, 'click', bound.onIndexClick);
                }
                lib.un(this.main, 'mouseenter', bound.onEnter);
                lib.un(this.main, 'mouseleave', bound.onLeave);
                this.main = this.stage = this.options = null;
                this.parent('dispose');
            }
        });
    Slider.Anim = Anim;
    return Slider;
});