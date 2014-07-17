define('ui/Dialog', [
    'require',
    'jquery',
    './lib',
    './Control'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    function format(source, opts) {
        source = String(source);
        var data = Array.prototype.slice.call(arguments, 1);
        var toString = Object.prototype.toString;
        if (data.length) {
            data = data.length === 1 ? opts !== null && /\[object (Array|Object)\]/.test(toString.call(opts)) ? opts : data : data;
            return source.replace(/#\{(.+?)\}/g, function (match, key) {
                var replacer = data[key];
                if ('[object Function]' === toString.call(replacer)) {
                    replacer = replacer(key);
                }
                return 'undefined' === typeof replacer ? '' : replacer;
            });
        }
        return source;
    }
    var Mask = lib.newClass({
            initialize: function (opts) {
                this.mask = $('<div>').addClass(opts.className).css(opts.styles).appendTo(document.body).get(0);
                Mask.curMasks++;
                if (6 === lib.browser.ie && !Mask.ie6frame) {
                    var frame = '' + '<iframe' + ' src="about:blank"' + ' frameborder="0"' + ' style="position:absolute;left:0;top:0;z-index:1;' + 'filter:alpha(opacity=0)"' + '></iframe>';
                    Mask.ie6frame = $(frame).appendTo(document.body).get(0);
                }
            },
            repaint: function () {
                var doc = $(document);
                var width = doc.width();
                var height = doc.height();
                $(this.mask).css({
                    width: width + 'px',
                    height: height + 'px'
                });
                if (Mask.ie6frame) {
                    $(Mask.ie6frame).css({
                        width: width + 'px',
                        height: height + 'px'
                    });
                }
            },
            show: function () {
                if (Mask.ie6frame) {
                    $(Mask.ie6frame).css('z-index', this.mask.style.zIndex - 1).show();
                }
                $(this.mask).show();
            },
            hide: function () {
                if (Mask.ie6frame) {
                    $(Mask.ie6frame).hide();
                }
                $(this.mask).hide();
            },
            dispose: function () {
                $(this.mask).remove();
                Mask.curMasks--;
                if (Mask.curMasks <= 0 && Mask.ie6frame) {
                    $(Mask.ie6frame).remove();
                    Mask.curMasks = 0;
                    Mask.ie6frame = null;
                }
            }
        });
    Mask.curMasks = 0;
    Mask.create = function (options) {
        return new Mask(options);
    };
    var privates = {
            getDom: function (name) {
                return $('.' + this.options.prefix + '-' + name, this.main)[0];
            },
            getClass: function (name) {
                name = name ? '-' + name : '';
                var skin = this.options.skin;
                return this.options.prefix + name + (skin ? ' ' + skin + name : '');
            },
            renderDOM: function () {
                var opt = this.options;
                var data = {
                        closeClass: privates.getClass.call(this, 'close'),
                        headerClass: privates.getClass.call(this, 'header'),
                        bodyClass: privates.getClass.call(this, 'body'),
                        footerClass: privates.getClass.call(this, 'footer'),
                        title: opt.title,
                        content: opt.content,
                        footer: opt.footer
                    };
                this.main = $('<div>').addClass(privates.getClass.call(this)).css({
                    width: opt.width,
                    top: opt.top,
                    position: opt.fixed ? 'fixed' : 'absolute',
                    zIndex: opt.level
                }).html(format(this.options.tpl, data)).appendTo(document.body).get(0);
                if (this.options.showMask) {
                    this.mask = Mask.create({
                        className: privates.getClass.call(this, 'mask'),
                        styles: { zIndex: this.options.level - 1 }
                    });
                }
            },
            bind: function () {
                var dom = privates.getDom.call(this, 'close');
                $(dom).on('click', this._bound.onClose);
            },
            getHeaderDom: function () {
                return privates.getDom.call(this, 'header');
            },
            getBodyDom: function () {
                return privates.getDom.call(this, 'body');
            },
            getFooterDom: function () {
                return privates.getDom.call(this, 'footer');
            },
            onClose: function (e) {
                privates.onHide.call(this, e);
            },
            onResize: function () {
                var me = this;
                clearTimeout(me._resizeTimer);
                me._resizeTimer = setTimeout(function () {
                    me.adjustPos();
                }, 100);
            },
            onShow: function (e) {
                var me = this;
                me.fire('beforeshow', { event: e });
                me.show();
            },
            onHide: function (e) {
                this.fire('beforehide', { event: e });
                this.hide();
            }
        };
    var Dialog = Control.extend({
            type: 'Dialog',
            options: {
                main: '',
                prefix: 'ecl-ui-dialog',
                title: '',
                content: '',
                footer: '',
                skin: '',
                width: '',
                top: '',
                left: '',
                fixed: 1,
                showMask: 1,
                level: 10,
                dragable: 1,
                tpl: '' + '<div class="#{closeClass}">\xD7</div>' + '<div class="#{headerClass}">#{title}</div>' + '<div class="#{bodyClass}">#{content}</div>' + '<div class="#{footerClass}">#{footer}</div>'
            },
            init: function (options) {
                this._disabled = options.disabled;
                this.bindEvents(privates);
            },
            setTitle: function (content) {
                privates.getHeaderDom.call(this).innerHTML = content;
            },
            setContent: function (content) {
                privates.getBodyDom.call(this).innerHTML = content;
            },
            setFooter: function (content) {
                privates.getFooterDom.call(this).innerHTML = content;
            },
            adjustPos: function () {
                var main = $(this.main);
                var win = $(window);
                var left = this.options.left;
                var top = this.options.top;
                if (this.options.fixed) {
                    var cssOpt = {
                            left: left,
                            top: top
                        };
                    if (!left) {
                        cssOpt.left = '50%';
                        cssOpt.marginLeft = -main.width() / 2 + 'px';
                    }
                    if (!top) {
                        cssOpt.top = 0.35 * (win.height() - main.height()) + 'px';
                    }
                    $(this.main).css(cssOpt);
                } else {
                    if (!left) {
                        left = win.scrollLeft() + (win.width() - main.width()) / 2 + 'px';
                    }
                    if (!top) {
                        top = win.scrollTop() + (win.height() - main.height()) * 0.35 + 'px';
                    }
                    main.css({
                        position: 'absolute',
                        left: left,
                        top: top
                    });
                }
                this.mask && this.mask.repaint();
            },
            show: function () {
                $(window).on('resize', this._bound.onResize);
                if (this.mask) {
                    this.mask.show();
                }
                $(this.main).removeClass(privates.getClass.call(this, 'hide'));
                this.adjustPos();
                this.fire('show');
                return this;
            },
            hide: function () {
                if (this.mask) {
                    this.mask.hide();
                }
                $(this.main).addClass(privates.getClass.call(this, 'hide'));
                this.fire('hide');
                $(window).off('resize', this._bound.onResize);
                clearTimeout(this._resizeTimer);
                return this;
            },
            render: function () {
                var options = this.options;
                if (!this.rendered) {
                    if (options.fixed && 6 === lib.browser.ie) {
                        options.fixed = 0;
                    }
                    privates.renderDOM.call(this);
                    if (options.main) {
                        var ctl = lib.g(options.main);
                        ctl && privates.getBodyDom.call(this).appendChild(ctl);
                    }
                    privates.bind.call(this);
                    this.rendered = true;
                }
                return this;
            },
            setWidth: function (width) {
                if (!this.rendered || width < 1) {
                    return this;
                }
                $(this.main).css({ width: width + 'px' });
                this.adjustPos();
                return this;
            },
            dispose: function () {
                this.fire('beforedispose');
                var bound = this._bound;
                $(privates.getDom.call(this, 'close')).off('click', bound.onClose);
                $(window).off('resize', bound.onResize);
                clearTimeout(this._resizeTimer);
                if (this.mask) {
                    this.mask.dispose();
                }
                this.parent('dispose');
            }
        });
    Dialog.Mask = Mask;
    return Dialog;
});