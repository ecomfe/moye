define('ui/Rating', [
    'require',
    './lib',
    './Control'
], function (require) {
    var lib = require('./lib');
    var Control = require('./Control');
    var privates = {
            drain: function () {
                var options = this.options;
                var prefix = options.prefix;
                var ons = this.query(prefix + '-star-on');
                lib.each(ons, function (star) {
                    lib.removeClass(star, prefix + '-star-on');
                });
            },
            fill: function (value) {
                value = parseInt(value || 0, 10);
                var options = this.options;
                var prefix = options.prefix;
                var result = this.stars.slice(0, value);
                lib.each(result, function (star) {
                    lib.addClass(star, prefix + '-star-on');
                });
                return result;
            },
            resetRating: function () {
                var options = this.options;
                var value = options.value;
                var prefix = options.prefix;
                var result = this.stars.slice(0, value);
                lib.each(result, function (star) {
                    lib.addClass(star, prefix + '-star-on');
                });
                return result;
            },
            onClick: function (e) {
                var options = this.options;
                var prefix = options.prefix;
                var target = lib.getTarget(e);
                var value = options.value;
                if (!e || this.disabled) {
                    return false;
                }
                if (lib.hasClass(target, prefix + '-star')) {
                    var newValue = parseInt(target.getAttribute('data-value'), 10);
                    if (newValue === value) {
                        return false;
                    }
                    options.value = newValue;
                    privates.drain.call(this);
                    privates.resetRating.call(this);
                    this.fire('rated', { value: options.value });
                }
            },
            onMouseOver: function (e) {
                var options = this.options;
                var prefix = options.prefix;
                var target = lib.getTarget(e);
                if (!e || this.disabled) {
                    return false;
                }
                if (lib.hasClass(target, prefix + '-star')) {
                    privates.drain.call(this);
                    privates.fill.call(this, target.getAttribute('data-value'));
                }
            },
            onMouseOut: function (e) {
                var options = this.options;
                var prefix = options.prefix;
                var target = lib.getTarget(e);
                if (!e || this.disabled) {
                    return false;
                }
                if (lib.hasClass(target, prefix + '-star')) {
                    privates.drain.call(this);
                    privates.resetRating.call(this);
                }
            }
        };
    var Rating = Control.extend({
            options: {
                disabled: false,
                main: '',
                prefix: 'ecl-ui-rating',
                max: 5,
                value: 0,
                skin: 0
            },
            type: 'Rating',
            init: function (options) {
                this.main = lib.g(options.main);
                this._disabled = options.disabled;
                this.bindEvents(privates);
            },
            render: function () {
                var options = this.options;
                if (!this.rendered) {
                    this.rendered = true;
                    var html = [];
                    var prefix = options.prefix;
                    html.push('<ul class="' + prefix + '-stars">');
                    for (var i = 0; i < options.max; i++) {
                        html.push('<li ', 'class="' + prefix + '-star' + '" ', 'data-value="' + (i + 1) + '"', '>', options.skin ? '' : '\u2606', '</li>');
                    }
                    html.push('</ul>');
                    this.main.innerHTML = html.join('');
                    this.stars = this.query(prefix + '-star');
                    var bound = this._bound;
                    lib.each(this.stars, function (star) {
                        lib.on(star, 'mouseover', bound.onMouseOver);
                        lib.on(star, 'mouseout', bound.onMouseOut);
                        lib.on(star, 'click', bound.onClick);
                    });
                }
                privates.resetRating.call(this);
                this._disabled && this.disable();
                return this;
            },
            enable: function () {
                lib.removeClass(this.main, this.options.prefix + '-disabled');
                this.parent('enable');
            },
            disable: function () {
                lib.addClass(this.main, this.options.prefix + '-disabled');
                this.parent('disable');
            },
            dispose: function () {
                var bound = this._bound;
                lib.each(this.stars, function (star) {
                    lib.un(star, 'click', bound.onClick);
                    lib.un(star, 'mouseover', bound.onMouseOver);
                    lib.un(star, 'mouseout', bound.onMouseOut);
                });
                delete this.stars;
                this.parent('dispose');
            }
        });
    return Rating;
});