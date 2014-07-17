define('ui/Lazy', [
    'require',
    'jquery',
    './lib'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var fixSize = function (node, attr) {
        var size = 0;
        node = $(node);
        if (node.css('display') === 'none') {
            return size;
        }
        var prop = 'offset' + lib.capitalize(attr || 'Height');
        node.children().each(function (i, el) {
            var oh = el[prop];
            if (!oh) {
                oh = fixSize(el, attr);
            }
            size += oh;
        });
        return size;
    };
    var privates = {
            compute: function () {
                var scroll = {
                        x: lib.getScrollLeft(),
                        y: lib.getScrollTop()
                    };
                var lastScroll = this.lastScroll;
                var dir = {
                        left: scroll.x < lastScroll.x,
                        top: scroll.y < lastScroll.y
                    };
                this.lastScroll = scroll;
                var size = {
                        x: lib.getViewWidth(),
                        y: lib.getViewHeight()
                    };
                var els = this.els;
                for (var key in els) {
                    if (!els.hasOwnProperty(key)) {
                        continue;
                    }
                    var data = els[key];
                    var el = $(data[0]);
                    var cd = el.position();
                    var options = data[2] || {};
                    options.x = options.x || 10;
                    options.y = options.y || 10;
                    cd.width = el.width();
                    cd.height = el.height();
                    if (cd.width > 0 && cd.height === 0) {
                        cd.height = fixSize(data[0]);
                    } else if (cd.width === 0 && cd.height > 0) {
                        cd.width = fixSize(data[0], 'Width');
                    }
                    var visible = false;
                    var isOverRight = cd.left - options.x >= scroll.x + size.x;
                    var isOverBottom = cd.top - options.y >= scroll.y + size.y;
                    var isLessLeft = cd.left + cd.width + options.x <= scroll.x;
                    var isLessTop = cd.top + options.y + cd.height <= scroll.y;
                    if (!(isOverRight || isOverBottom) && !(isLessLeft || isLessTop)) {
                        if (!options.trigger) {
                            data[1](scroll, size, cd, dir, data[0]);
                        }
                        visible = true;
                    }
                    if (options.trigger) {
                        data[1](visible, scroll, size, cd, dir, data);
                    }
                }
            },
            onScroll: function () {
                clearTimeout(this._timer);
                this._timer = setTimeout(this._bound.compute, this.delay);
                this.scrolled = true;
            }
        };
    var Lazy = lib.newClass({
            type: 'Lazy',
            tag: 'data-lazy-id',
            initialize: function () {
                this.els = {};
                this.count = 0;
                this.delay = 100;
                this.lastScroll = {
                    x: lib.getScrollLeft(),
                    y: lib.getScrollTop()
                };
                this._bound = {
                    onScroll: $.proxy(privates.onScroll, this),
                    compute: $.proxy(privates.compute, this)
                };
            },
            add: function (el, callback, options) {
                var guid = el.getAttribute(this.tag) || lib.guid();
                if (!this.els[guid]) {
                    el.setAttribute(this.tag, guid);
                    this.els[guid] = [
                        el,
                        callback,
                        options
                    ];
                    if (!this.count) {
                        $(window).on('scroll', this._bound.onScroll);
                        $(window).on('resize', this._bound.onScroll);
                    }
                    this.count++;
                }
                if (!this.scrolled) {
                    this._bound.onScroll();
                }
                return this;
            },
            remove: function (el) {
                var guid = el.getAttribute(this.tag);
                if (guid in this.els) {
                    delete this.els[guid];
                    this.count--;
                    if (!this.count) {
                        $(window).off('scroll', this.onScroll);
                        $(window).off('resize', this.onScroll);
                    }
                }
                return this;
            }
        });
    (function (Lazy) {
        var lazy;
        var getInstance = function () {
            return lazy || (lazy = new Lazy());
        };
        Lazy.add = function () {
            return getInstance().add.apply(lazy, arguments);
        };
        Lazy.remove = function () {
            return getInstance().remove.apply(lazy, arguments);
        };
    }(Lazy));
    return Lazy;
});