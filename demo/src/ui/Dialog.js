define('ui/Dialog', [
    'require',
    './lib',
    './Control'
], function (require) {
    var lib = require('./lib');
    var Control = require('./Control');
    function remove(domElement) {
        domElement && domElement.parentNode.removeChild(domElement);
    }
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
                var div = document.createElement('div');
                div.className = opts.className;
                lib.setStyles(div, opts.styles);
                document.body.appendChild(div);
                this.mask = div;
                Mask.curMasks++;
                if (6 === lib.browser.ie && !Mask.ie6frame) {
                    Mask.ie6frame = document.createElement('' + '<iframe' + ' src="about:blank"' + ' frameborder="0"' + ' style="position:absolute;left:0;top:0;z-index:1;' + 'filter:alpha(opacity=0)"' + '></iframe>');
                    document.body.appendChild(Mask.ie6frame);
                }
            },
            repaint: function () {
                var width = Math.max(document.documentElement.clientWidth, Math.max(document.body.scrollWidth, document.documentElement.scrollWidth));
                var height = Math.max(document.documentElement.clientHeight, Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
                this.mask.style.width = width + 'px';
                this.mask.style.height = height + 'px';
                if (Mask.ie6frame) {
                    Mask.ie6frame.style.width = width + 'px';
                    Mask.ie6frame.style.height = height + 'px';
                }
            },
            show: function () {
                if (Mask.ie6frame) {
                    Mask.ie6frame.style.zIndex = this.mask.style.zIndex - 1;
                    lib.show(Mask.ie6frame);
                }
                lib.show(this.mask);
            },
            hide: function () {
                if (Mask.ie6frame) {
                    lib.hide(Mask.ie6frame);
                }
                lib.hide(this.mask);
            },
            dispose: function () {
                remove(this.mask);
                Mask.curMasks--;
                if (Mask.curMasks <= 0 && Mask.ie6frame) {
                    remove(Mask.ie6frame);
                    Mask.curMasks = 0;
                    Mask.ie6frame = null;
                }
            }
        });
    Mask.curMasks = 0;
    Mask.create = function (opts) {
        return new Mask(opts);
    };
    var privates = {
            getDom: function (name) {
                return lib.q(this.options.prefix + '-' + name, this.main)[0];
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
                var main = this.createElement('div', { 'className': privates.getClass.call(this) });
                lib.setStyles(main, {
                    width: opt.width,
                    top: opt.top,
                    position: opt.fixed ? 'fixed' : 'absolute',
                    zIndex: opt.level
                });
                main.innerHTML = format(this.options.tpl, data);
                document.body.appendChild(main);
                this.main = main;
                if (this.options.showMask) {
                    this.mask = Mask.create({
                        className: privates.getClass.call(this, 'mask'),
                        styles: { zIndex: this.options.level - 1 }
                    });
                }
            },
            bind: function () {
                lib.on(privates.getDom.call(this, 'close'), 'click', this._bound.onClose);
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
                var left = this.options.left;
                var top = this.options.top;
                if (this.options.fixed) {
                    var cssOpt = {
                            left: left,
                            top: top
                        };
                    if (!left) {
                        cssOpt.left = '50%';
                        cssOpt.marginLeft = -this.main.offsetWidth / 2 + 'px';
                    }
                    if (!top) {
                        cssOpt.top = (lib.getViewHeight() - this.main.offsetHeight) * 0.35 + 'px';
                    }
                    lib.setStyles(this.main, cssOpt);
                } else {
                    if (!left) {
                        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
                        left = scrollLeft + (lib.getViewWidth() - this.main.offsetWidth) / 2 + 'px';
                    }
                    if (!top) {
                        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                        top = scrollTop + (lib.getViewHeight() - this.main.offsetHeight) * 0.35 + 'px';
                    }
                    lib.setStyles(this.main, {
                        position: 'absolute',
                        left: left,
                        top: top
                    });
                }
                this.mask && this.mask.repaint();
            },
            show: function () {
                var me = this;
                lib.on(window, 'resize', this._bound.onResize);
                me.mask && me.mask.show();
                lib.each(privates.getClass.call(this, 'hide').split(' '), function (className) {
                    lib.removeClass(me.main, className);
                });
                me.adjustPos();
                me.fire('show');
                return me;
            },
            hide: function () {
                var me = this;
                me.mask && me.mask.hide();
                lib.each(privates.getClass.call(this, 'hide').split(' '), function (className) {
                    lib.addClass(me.main, className);
                });
                me.fire('hide');
                lib.un(window, 'resize', this._bound.onResize);
                clearTimeout(me._resizeTimer);
                return me;
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
                var me = this;
                if (!me.rendered || width < 1) {
                    return me;
                }
                lib.setStyles(me.main, { width: width + 'px' });
                me.adjustPos();
                return me;
            },
            dispose: function () {
                this.fire('beforedispose');
                var bound = this._bound;
                lib.un(privates.getDom.call(this, 'close'), 'click', bound.onClose);
                lib.un(window, 'resize', bound.onResize);
                clearTimeout(this._resizeTimer);
                this.mask && this.mask.dispose();
                this.parent('dispose');
            }
        });
    Dialog.Mask = Mask;
    return Dialog;
});