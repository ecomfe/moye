define('ui/Pager', [
    'require',
    'jquery',
    './lib',
    './Control'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var privates = {
            build: function () {
                var options = this.options;
                var lang = options.lang;
                var prefix = options.prefix + '-';
                var showAlways = options.showAlways;
                var showCount = this.showCount;
                var total = this.total;
                var page = this.page + 1;
                var padding = this.padding;
                var html = [];
                var htmlLength = 0;
                if (total < 2) {
                    if (showAlways) {
                        setSpecial(0, 'prev', true);
                        setSpecial(0, 'current');
                        setSpecial(0, 'next', true);
                    }
                    return html.join('');
                }
                var start = 1;
                var end = total;
                var wing = (showCount - showCount % 2) / 2;
                function setNum(i) {
                    html[htmlLength++] = '' + '<a href="#" data-page="' + (i - 1) + '">' + i + '</a>';
                }
                function setSpecial(i, name, disabled) {
                    var klass = prefix + name;
                    if (disabled) {
                        klass += ' ' + prefix + 'disabled';
                    }
                    html[htmlLength++] = '' + '<a href="#" data-page="' + i + '" class="' + klass + '">' + (lang[name] || i + 1) + '</a>';
                }
                showCount = wing * 2 + 1;
                if (showCount < total) {
                    end = showCount;
                    if (page > wing + 1) {
                        if (page + wing > total) {
                            start = total - wing * 2;
                            end = total;
                        } else {
                            start = page - wing;
                            end = page + wing;
                        }
                    }
                }
                if (page > 1 || showAlways) {
                    setSpecial(page - 2, 'prev', page < 2);
                }
                for (i = 0; i < padding; i++) {
                    if (i + 1 < start) {
                        setNum(i + 1);
                    }
                }
                if (start > padding + 2) {
                    setSpecial(page - 2, 'ellipsis');
                }
                if (start === padding + 2) {
                    setNum(padding + 1);
                }
                var current = page;
                for (var i = start; i <= end; i++) {
                    i === current ? setSpecial(i - 1, 'current') : setNum(i);
                }
                var pos = total - padding;
                if (end < pos - 1) {
                    setSpecial(page, 'ellipsis');
                }
                if (end === pos - 1) {
                    setNum(pos);
                }
                for (i = 0; i < padding; i++) {
                    if (pos + i + 1 > end) {
                        setNum(pos + i + 1);
                    }
                }
                if (page < total || showAlways) {
                    setSpecial(page, 'next', page >= total);
                }
                return html.join('');
            },
            onChange: function (e, target) {
                e.preventDefault();
                target = target || e.target;
                this.fire('click');
                var main = this.main;
                if (this.disabled || !target || target === main) {
                    return;
                }
                if (target.tagName !== 'A') {
                    target = $(target).closest('A', main)[0];
                    if (target === undefined || target === main) {
                        return;
                    }
                }
                var current = target.getAttribute('data-page');
                if (current !== null) {
                    current |= 0;
                }
                var page = this.page;
                if (current !== null && 0 <= current && current < this.total && current !== page) {
                    var first = this.options.first & 1;
                    this.fire('change', { page: current + first });
                }
            }
        };
    var Pager = Control.extend({
            type: 'Pager',
            options: {
                disabled: false,
                main: '',
                page: 0,
                first: 0,
                padding: 1,
                showAlways: true,
                showCount: 0,
                total: 0,
                prefix: 'ecl-ui-pager',
                disabledClass: 'disabled',
                lang: {
                    prev: '<em></em>\u4E0A\u4E00\u9875',
                    next: '\u4E0B\u4E00\u9875<em></em>',
                    ellipsis: '..'
                }
            },
            binds: 'onChange',
            init: function (options) {
                this.bindEvents(privates);
                this.disabled = options.disabled;
                this.showCount = (options.showCount || Pager.SHOW_COUNT) | 0;
                this.total = options.total | 0;
                this.padding = options.padding | 0;
                this.page = 0;
                options.first &= 1;
                this.setPage(options.page | 0);
                var lang = options.lang;
                lang.prev.replace(/\{prefix\}/gi, options.prefix);
                lang.next.replace(/\{prefix\}/gi, options.prefix);
                if (options.main) {
                    this.main = lib.g(options.main);
                    $(this.main).addClass(options.prefix).on('click', this._bound.onChange);
                }
            },
            setPage: function (page) {
                page -= this.options.first;
                page = Math.max(0, Math.min(page | 0, this.total - 1));
                if (page !== this.page) {
                    this.page = page;
                }
            },
            getPage: function () {
                return this.page + this.options.first;
            },
            setTotal: function (total) {
                this.total = total | 0 || 1;
                this.setPage(0);
            },
            getTotal: function () {
                return this.total;
            },
            render: function () {
                if (!this.main) {
                    throw new Error('invalid main');
                }
                var main = this.main;
                if (this.total > 1 || this.options.showAlways) {
                    main.innerHTML = privates.build.call(this);
                    $(main).show();
                } else {
                    $(main).hide();
                }
                return this;
            }
        });
    Pager.SHOW_COUNT = 5;
    return Pager;
});