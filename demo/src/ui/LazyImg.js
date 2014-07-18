define('ui/LazyImg', [
    'require',
    'jquery',
    './lib',
    './Lazy'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Lazy = require('./Lazy');
    var privates = {
            load: function (scroll, size) {
                var _src = this.options.src;
                var offset = this.options.offset;
                this.imgs = $.grep(this.imgs, function (img) {
                    img = $(img);
                    var el = img.parent().parent();
                    var src = img.attr(_src);
                    if (!el.height() || !src) {
                        return false;
                    }
                    var cd = img.position();
                    cd.right = cd.left + img.width();
                    cd.bottom = cd.top + img.height();
                    var isOverRight = cd.left - offset.x >= scroll.x + size.x;
                    var isOverBottom = cd.top - offset.y >= scroll.y + size.y;
                    var isLessLeft = cd.right + offset.x <= scroll.x;
                    var isLessTop = cd.bottom + offset.y <= scroll.y;
                    if (!(isOverRight || isOverBottom) && !(isLessLeft || isLessTop)) {
                        img.attr('src', src);
                        img.removeAttr(_src);
                        return false;
                    }
                    return true;
                });
                if (!this.imgs.length) {
                    Lazy.remove(this.main);
                }
            }
        };
    var LazyImg = lib.newClass({
            type: 'LazyImg',
            options: {
                main: '',
                src: '_src',
                imgs: null,
                offset: { y: 32 }
            },
            initialize: function (options, main) {
                options = this.setOptions(options);
                main = this.main = lib.g(options.main) || $('.' + options.main)[0];
                this.imgs = options.imgs || $('img', main).toArray();
                Lazy.add(main, $.proxy(privates.load, this), options.offset);
            }
        }).implement(lib.configurable);
    LazyImg.load = function (className, options) {
        if (lib.isObject(className)) {
            options = className;
            className = null;
        }
        options = options || {};
        className = className || 'lazy-img';
        $('.' + className).each(function (i, el) {
            new LazyImg($.extend(options, { main: el }));
        });
    };
    return LazyImg;
});