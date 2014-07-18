define('ui/Slider', [
    'require',
    'jquery',
    './lib',
    './Control',
    './SliderAnim'
], function (require) {
    var $ = require('jquery');
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
                var target = e.target;
                var index = target.getAttribute('data-index');
                if (index && !me._switchDelayTimer) {
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
                var options = this.options;
                var prevAct = this.index === 0 && !options.circle ? 'addClass' : 'removeClass';
                this.prevElement && $(this.prevElement)[prevAct](this.getClass('prev-disable'));
                var nextAct = this.index === this.count - 1 && !options.circle ? 'addClass' : 'removeClass';
                this.nextElement && $(this.nextElement)[nextAct](this.getClass('next-disable'));
                if (this.indexElement) {
                    var elements = $(this.indexElement).children();
                    elements.eq(this.lastIndex).removeClass(this.getClass('index-selected'));
                    elements.eq(this.index).addClass(this.getClass('index-selected'));
                }
            }
        };
    var Slider = Control.extend({
            getChildren: getChildren,
            type: 'Slider',
            options: {
                index: 0,
                main: '',
                stage: '',
                prevElement: '',
                nextElement: '',
                indexElement: '',
                auto: true,
                circle: true,
                autoInterval: 2000,
                switchDelay: 50,
                onChange: null,
                prefix: 'ecl-ui-slider',
                anim: 'slide',
                animOptions: {
                    easing: 'easing',
                    interval: 200,
                    direction: 'horizontal',
                    rollCycle: ''
                }
            },
            init: function (options) {
                this._disabled = options.disabled;
                this.bindEvents(privates);
                var bound = this._bound;
                if (options.main) {
                    this.main = $(this.main).addClass(options.prefix).on('mouseenter', bound.onEnter).on('mouseleave', bound.onLeave).get(0);
                    this.index = options.index;
                    this.stage = lib.g(options.stage) || this.query(this.getClass('stage'))[0];
                    this.prevElement = lib.g(options.prevElement) || this.query(this.getClass('prev'))[0];
                    this.nextElement = lib.g(options.nextElement) || this.query(this.getClass('next'))[0];
                    this.indexElement = lib.g(options.indexElement) || this.query(this.getClass('index'))[0];
                    if (this.prevElement) {
                        $(this.prevElement).on('click', bound.onPrevClick);
                    }
                    if (this.nextElement) {
                        $(this.nextElement).on('click', bound.onNextClick);
                    }
                    if (this.indexElement) {
                        $(this.indexElement).on('click', bound.onIndexClick);
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
                var stage = $(this.stage);
                var children = stage.children();
                children.each(function (i, item) {
                    $(item).addClass(me.getClass('item'));
                });
                this.indexElement && $(this.indexElement).children().each(function (index, item) {
                    item.setAttribute('data-index', index);
                });
                me.index = 0;
                me.count = children.length;
                me.stageWidth = stage.width();
                me.stageHeight = stage.height();
                me.stage = stage.get(0);
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
                    $(options.prevElement).off('click', bound.onPrevClick);
                }
                if (options.nextElement) {
                    $(options.nextElement).off('click', bound.onNextClick);
                }
                if (options.indexElement) {
                    $(options.indexElement).off('click', bound.onIndexClick);
                }
                $(this.main).off('mouseenter', bound.onEnter).off('mouseleave', bound.onLeave);
                this.main = this.stage = this.options = null;
                this.parent('dispose');
            }
        });
    Slider.Anim = Anim;
    return Slider;
});