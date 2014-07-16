define('ui/FloatTip', [
    'require',
    './lib',
    './Control'
], function (require) {
    var lib = require('./lib');
    var Control = require('./Control');
    var privates = {
            getClass: function (name) {
                name = name ? '-' + name : '';
                return this.options.prefix + name;
            },
            getDom: function (name, scope) {
                return lib.q(privates.getClass.call(this, name), lib.g(scope))[0];
            },
            create: function () {
                var opt = this.options;
                var cls = {
                        content: opt.content,
                        iconClass: privates.getClass.call(this, 'icon'),
                        contentClass: privates.getClass.call(this, 'content')
                    };
                var main = this.createElement('div', { 'className': privates.getClass.call(this) });
                lib.setStyles(main, {
                    width: opt.width,
                    left: opt.left,
                    top: opt.top,
                    position: opt.fixed ? 'fixed' : 'absolute',
                    zIndex: opt.level
                });
                main.innerHTML = this.options.tpl.replace(/#\{([\w-.]+)\}/g, function ($0, $1) {
                    return cls[$1] || '';
                });
                document.body.appendChild(main);
                this.main = main;
            }
        };
    var FloatTip = Control.extend({
            type: 'FloatTip',
            options: {
                prefix: 'ecl-ui-floattip',
                content: '',
                width: '',
                top: '',
                left: '',
                fixed: 1,
                level: '',
                tpl: '' + '<i class="#{iconClass}"></i>' + '<div class="#{contentClass}">#{content}</div>'
            },
            setContent: function (content) {
                privates.getDom.call(this, 'content').innerHTML = content;
            },
            render: function () {
                if (!this.rendered) {
                    var options = this.options;
                    if (options.fixed && 6 === lib.browser.ie) {
                        options.fixed = 0;
                    }
                    privates.create.call(this);
                    this.rendered = true;
                }
                return this;
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
                        cssOpt.top = (lib.getViewHeight() - this.main.offsetHeight) * 0.4 + 'px';
                    }
                    lib.setStyles(this.main, cssOpt);
                } else {
                    if (left === '') {
                        left = (lib.getViewWidth() - this.main.offsetWidth) / 2;
                        left += lib.getScrollLeft();
                        left += 'px';
                    }
                    if (top === '') {
                        top = (lib.getViewHeight() - this.main.offsetHeight) * 0.4;
                        top += lib.getScrollTop();
                        top += 'px';
                    }
                    lib.setStyles(this.main, {
                        position: 'absolute',
                        left: left,
                        top: top
                    });
                }
            },
            show: function () {
                lib.removeClass(this.main, privates.getClass.call(this, 'hide'));
                this.adjustPos();
                return this;
            },
            hide: function () {
                lib.addClass(this.main, privates.getClass.call(this, 'hide'));
                return this;
            }
        });
    return FloatTip;
});