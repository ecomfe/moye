define('ui/SliderAnim', [
    'require',
    './lib'
], function (require) {
    var lib = require('./lib');
    var requestAnimationFrame = function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
                return setTimeout(callback, 1000 / 60);
            };
        }();
    var cancelAnimationFrame = function () {
            return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
                clearTimeout(id);
            };
        }();
    var setOpacity = function (isLowerIEVersion) {
            return isLowerIEVersion ? function (element, opacity) {
                if (opacity === 1) {
                    element.style.filter = '';
                } else {
                    element.style.filter = '' + 'alpha(opacity=' + 100 * opacity + ')';
                }
            } : function (element, opacity) {
                if (opacity === 1) {
                    element.style.opacity = '';
                } else {
                    element.style.opacity = opacity;
                }
            };
        }(lib.browser.ie < 9);
    var SliderAnim = lib.newClass({
            initialize: function (slider, options) {
                this.slider = slider;
                this.options = options;
            },
            switchTo: function () {
            },
            isBusy: function () {
            },
            enable: function () {
            },
            disable: function () {
            },
            refresh: function () {
            },
            dispose: function () {
                this.slider = null;
                this.options = null;
            }
        });
    SliderAnim.easing = {
        easing: function (p) {
            if ((p /= 0.5) < 1) {
                return 1 / 2 * p * p;
            }
            return -1 / 2 * (--p * (p - 2) - 1);
        },
        backIn: function (p) {
            var s = 1.70158;
            return p * p * ((s + 1) * p - s);
        },
        backOut: function (p) {
            var s = 1.70158;
            return (p = p - 1) * p * ((s + 1) * p + s) + 1;
        },
        backBoth: function (p) {
            var s = 1.70158;
            if ((p /= 0.5) < 1) {
                return 1 / 2 * (p * p * (((s *= 1.525) + 1) * p - s));
            }
            return 1 / 2 * ((p -= 2) * p * (((s *= 1.525) + 1) * p + s) + 2);
        },
        lineer: function (p) {
            return p;
        },
        bounce: function (p) {
            if (p < 1 / 2.75) {
                return 7.5625 * p * p;
            } else if (p < 2 / 2.75) {
                return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
            } else if (p < 2.5 / 2.75) {
                return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
            }
            return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
        }
    };
    SliderAnim.anims = {};
    SliderAnim.add = function (name, Class) {
        if (!this.anims[name]) {
            this.anims[name] = Class;
            return true;
        }
        return false;
    };
    var TimeLine = SliderAnim.extend({
            initialize: function (slider, options) {
                var me = this;
                me.slider = slider;
                me.interval = options.interval || 300;
                me.easingFn = SliderAnim.easing[options.easing || 'easing'];
                var _timeHandler = me.timeHandler;
                me.timeHandler = function () {
                    _timeHandler.apply(me);
                };
            },
            beforeSwitch: function (index, lastIndex) {
            },
            switchTo: function (index, lastIndex) {
                this.beforeSwitch(index, lastIndex);
                this.startTime = new Date();
                if (!this.timer) {
                    this.timer = requestAnimationFrame(this.timeHandler);
                }
            },
            timeHandler: function () {
                var timePast = new Date() - this.startTime;
                if (timePast >= this.interval) {
                    this.tick(1);
                    this.timer = 0;
                } else {
                    this.tick(timePast / this.interval);
                    this.timer = requestAnimationFrame(this.timeHandler);
                }
            },
            isBusy: function () {
                return this.timer !== 0;
            },
            disable: function () {
                cancelAnimationFrame(this.timer);
                this.timer = 0;
            },
            dispose: function () {
                this.disable();
                this.slider = null;
            },
            tick: function (percent) {
            }
        });
    SliderAnim.TimeLine = TimeLine;
    SliderAnim.add('no', SliderAnim.extend({
        switchTo: function (index) {
            this.slider.stage.scrollLeft = this.slider.stageWidth * index;
        }
    }));
    SliderAnim.add('slide', TimeLine.extend({
        initialize: function (slider, options) {
            this.parent('initialize', slider, options);
            this.yAxis = options.direction === 'vertical';
            this.rollCycle = options.rollCycle || false;
        },
        beforeSwitch: function (index, lastIndex) {
            var stageWidth = this.slider.stageWidth;
            var stageHeight = this.slider.stageHeight;
            var maxIndex = this.slider.count - 1;
            if (this.rollCycle) {
                if (!this.cycleNode) {
                    var cloned = this.slider.stage.firstChild.cloneNode();
                    this.slider.stage.appendChild(cloned);
                    this.cycleNode = true;
                }
            }
            if (this.yAxis) {
                if (this.isBusy()) {
                    this.curPos = this.slider.stage.scrollTop;
                } else {
                    this.curPos = stageHeight * lastIndex;
                }
                this.targetPos = stageHeight * index;
            } else {
                if (this.isBusy()) {
                    this.curPos = this.slider.stage.scrollLeft;
                } else {
                    this.curPos = stageWidth * lastIndex;
                }
                this.targetPos = stageWidth * index;
                if (this.rollCycle) {
                    if (index === 0 && lastIndex === maxIndex) {
                        this.targetPos = stageWidth * (maxIndex + 1);
                    } else if (index === maxIndex && lastIndex === 0 && !this.isBusy()) {
                        this.curPos = stageWidth * (maxIndex + 1);
                    }
                }
            }
        },
        tick: function (percent) {
            var move = (this.targetPos - this.curPos) * this.easingFn(percent);
            this.slider.stage[this.yAxis ? 'scrollTop' : 'scrollLeft'] = this.curPos + move;
        }
    }));
    SliderAnim.add('opacity', TimeLine.extend({
        setOpacity: setOpacity,
        beforeSwitch: function (index) {
            var childNodes = this.slider.getChildren(this.slider.stage);
            var l = childNodes.length;
            if (undefined === this.index) {
                this.index = l - 1;
            }
            if (undefined === this.lastIndex) {
                this.lastIndex = l - 1;
            }
            this.setOpacity(childNodes[this.index], 1);
            lib.removeClass(childNodes[this.index], this.slider.getClass('top'));
            lib.removeClass(childNodes[this.lastIndex], this.slider.getClass('cover'));
            lib.addClass(childNodes[this.index], this.slider.getClass('cover'));
            this.lastIndex = this.index;
            lib.addClass(childNodes[this.index = index], this.slider.getClass('top'));
            this.setOpacity(this.curElement = childNodes[index], 0);
        },
        tick: function (percent) {
            var move = this.easingFn(percent);
            this.setOpacity(this.curElement, move);
            if (percent === 1) {
                this.curElement = null;
            }
        },
        dispose: function () {
            this.curElement = null;
            this.parent('dispose');
        }
    }));
    return SliderAnim;
});