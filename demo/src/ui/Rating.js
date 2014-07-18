define('ui/Rating', [
    'require',
    'jquery',
    './lib',
    './Control'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var privates = {
            drain: function () {
                var options = this.options;
                var prefix = options.prefix;
                $('.' + prefix + '-star-on').removeClass(prefix + '-star-on');
            },
            fill: function (value) {
                value = parseInt(value || 0, 10);
                var options = this.options;
                var prefix = options.prefix;
                var result = this.stars.slice(0, value);
                $(result).addClass(prefix + '-star-on');
                return result;
            },
            resetRating: function () {
                var options = this.options;
                var value = options.value;
                var prefix = options.prefix;
                var result = this.stars.slice(0, value);
                $(result).addClass(prefix + '-star-on');
                return result;
            },
            onClick: function (e) {
                var options = this.options;
                var prefix = options.prefix;
                var target = $(e.target);
                var value = options.value;
                if (!e || this.disabled) {
                    return false;
                }
                if (target.hasClass(prefix + '-star')) {
                    var newValue = parseInt(target.attr('data-value'), 10);
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
                var target = $(e.target);
                if (!e || this.disabled) {
                    return false;
                }
                if (target.hasClass(prefix + '-star')) {
                    privates.drain.call(this);
                    privates.fill.call(this, target.attr('data-value'));
                }
            },
            onMouseOut: function (e) {
                var options = this.options;
                var prefix = options.prefix;
                var target = $(e.target);
                if (!e || this.disabled) {
                    return false;
                }
                if (target.hasClass(prefix + '-star')) {
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
                    var prefix = options.prefix;
                    var html = ['<ul class="' + prefix + '-stars">'];
                    for (var i = 0; i < options.max; i++) {
                        html.push('<li ', 'class="' + prefix + '-star' + '" ', 'data-value="' + (i + 1) + '"', '>', options.skin ? '' : '\u2606', '</li>');
                    }
                    html.push('</ul>');
                    this.main.innerHTML = html.join('');
                    var bound = this._bound;
                    this.stars = $('.' + prefix + '-star').hover(bound.onMouseOver, bound.onMouseOut).on('click', bound.onClick).toArray();
                }
                privates.resetRating.call(this);
                this._disabled && this.disable();
                return this;
            },
            enable: function () {
                $(this.main).removeClass(this.options.prefix + '-disabled');
                this.parent('enable');
            },
            disable: function () {
                $(this.main).addClass(this.options.prefix + '-disabled');
                this.parent('disable');
            },
            dispose: function () {
                var bound = this._bound;
                $(this.stars).off('mouseover', bound.onMouseover).off('mouseout', bound.onMouseout).off('click', bound.onClick);
                delete this.stars;
                this.parent('dispose');
            }
        });
    return Rating;
});