define('ui/LazyImg', [
    'require',
    './lib',
    './Lazy'
], function (require) {
    var lib = require('./lib');
    var Lazy = require('./Lazy');
    var privates = {
            load: function (scroll, size) {
                var _src = this.options.src;
                var imgs = [];
                var offset = this.options.offset;
                lib.each(this.imgs, function (img) {
                    var el = img.parentNode.parentNode;
                    var src = img.getAttribute(_src);
                    if (el.offsetHeight && src) {
                        var cd = lib.getPosition(img);
                        cd.right = cd.left + img.offsetWidth;
                        cd.bottom = cd.top + img.offsetHeight;
                        var isOverRight = cd.left - offset.x >= scroll.x + size.x;
                        var isOverBottom = cd.top - offset.y >= scroll.y + size.y;
                        var isLessLeft = cd.right + offset.x <= scroll.x;
                        var isLessTop = cd.bottom + offset.y <= scroll.y;
                        if (!(isOverRight || isOverBottom) && !(isLessLeft || isLessTop)) {
                            img.src = src;
                            img.removeAttribute(_src);
                        } else {
                            imgs.push(img);
                        }
                    }
                });
                this.imgs = imgs;
                if (!imgs.length) {
                    Lazy.remove(this.main);
                }
            }
        };
    LazyImg = lib.newClass({
        type: 'LazyImg',
        options: {
            main: '',
            src: '_src',
            imgs: null,
            offset: { y: 32 }
        },
        initialize: function (options, main) {
            options = this.setOptions(options);
            main = this.main = lib.g(options.main) || lib.q(options.main)[0];
            this.imgs = options.imgs || lib.toArray(main.getElementsByTagName('img'));
            Lazy.add(main, lib.bind(privates.load, this), options.offset);
        }
    }).implement(lib.configurable);
    LazyImg.load = function (className, options) {
        if (lib.isObject(className)) {
            options = className;
            className = null;
        }
        lib.each(lib.q(className || 'lazy-img'), function (el) {
            new LazyImg(lib.extend(options || {}, { main: el }));
        });
    };
    return LazyImg;
});