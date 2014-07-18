define('ui/FloatTip', [
    'require',
    'jquery',
    './lib',
    './Control'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var privates = {
            getClass: function (name) {
                name = name ? '-' + name : '';
                return this.options.prefix + name;
            },
            getDom: function (name, scope) {
                return $('.' + privates.getClass.call(this, name), lib.g(scope))[0];
            },
            create: function () {
                var opt = this.options;
                var cls = {
                        content: opt.content,
                        iconClass: privates.getClass.call(this, 'icon'),
                        contentClass: privates.getClass.call(this, 'content')
                    };
                this.main = $('<div>').addClass(privates.getClass.call(this)).css({
                    width: opt.width,
                    left: opt.left,
                    top: opt.top,
                    position: opt.fixed ? 'fixed' : 'absolute',
                    zIndex: opt.level
                }).html(this.options.tpl.replace(/#\{([\w-.]+)\}/g, function ($0, $1) {
                    return cls[$1] || '';
                })).appendTo(document.body).get(0);
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
                var win = $(window);
                var main = $(this.main);
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
                        cssOpt.top = (win.height() - main.height()) * 0.4 + 'px';
                    }
                    $(this.main).css(cssOpt);
                } else {
                    if (left === '') {
                        left = (win.width() - main.width()) / 2;
                        left += win.scrollLeft();
                        left += 'px';
                    }
                    if (top === '') {
                        top = (win.height() - main.height()) * 0.4;
                        top += win.scrollTop();
                        top += 'px';
                    }
                    main.css({
                        position: 'absolute',
                        left: left,
                        top: top
                    });
                }
            },
            show: function () {
                $(this.main).show();
                this.adjustPos();
                return this;
            },
            hide: function () {
                $(this.main).hide();
                return this;
            }
        });
    return FloatTip;
});