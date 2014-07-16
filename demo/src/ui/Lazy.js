define('ui/Lazy', [
    'require',
    './lib'
], function (require) {
    var lib = require('./lib');
    var fixSize = function (node, attr) {
        var size = 0;
        if (lib.getStyle(node, 'display') !== 'none') {
            var prop = 'offset' + lib.capitalize(attr || 'Height');
            lib.each(node.childNodes, function (el) {
                var oh = el[prop];
                if (!oh) {
                    oh = fixSize(el, attr);
                }
                size += oh;
            });
        }
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
                    if (els.hasOwnProperty(key)) {
                        var data = els[key];
                        var cd = lib.getPosition(data[0]);
                        var options = data[2] || {};
                        options.x = options.x || 10;
                        options.y = options.y || 10;
                        cd.width = data[0].offsetWidth;
                        cd.height = data[0].offsetHeight;
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
            initialize: function () {
                this.els = {};
                this.count = 0;
                this.delay = 100;
                this.lastScroll = {
                    x: lib.getScrollLeft(),
                    y: lib.getScrollTop
                };
                this._bound = {
                    onScroll: lib.bind(privates.onScroll, this),
                    compute: lib.bind(privates.compute, this)
                };
            },
            add: function (el, callback, options) {
                this.els[lib.guid(el)] = [
                    el,
                    callback,
                    options
                ];
                var onScroll = this._bound.onScroll;
                if (!this.count) {
                    lib.on(window, 'scroll', onScroll);
                    lib.on(window, 'resize', onScroll);
                }
                this.count++;
                if (!this.scrolled) {
                    onScroll();
                }
                return this;
            },
            remove: function (el) {
                var guid = lib.guid(el);
                if (guid in this.els) {
                    delete this.els[guid];
                    this.count--;
                    if (!this.count) {
                        lib.un(window, 'scroll', this.onScroll);
                        lib.un(window, 'resize', this.onScroll);
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