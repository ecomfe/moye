define('ui/Cookie', [
    'require',
    'jquery',
    './lib'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var escapeRegExp = function (str) {
        return String(str).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
    };
    var Cookie = lib.newClass({
            options: {
                path: '/',
                domain: '',
                duration: 0,
                secure: false
            },
            initialize: function (key, options) {
                options = this.setOptions(options);
                this.key = key;
                this.value = [
                    options.domain ? 'domain=' + options.domain : '',
                    options.path ? 'path=' + options.path : '',
                    options.secure ? 'secure' : ''
                ].join('; ');
            },
            get: function (key) {
                var value = document.cookie.match('(?:^|;)\\s*' + escapeRegExp(key || this.key) + '=([^;]*)');
                return value ? decodeURIComponent(value[1]) : '';
            },
            set: function (key, value) {
                if (arguments.length < 2) {
                    value = key;
                    key = this.key;
                }
                var options = this.options;
                value = encodeURIComponent(value) + this.value;
                if (options.duration) {
                    value += '' + '; expires=' + new Date(options.duration * 86400000 + +new Date()).toGMTString();
                }
                document.cookie = key + '=' + value;
                return this;
            },
            remove: function (key) {
                var options = this.options;
                var duration = options.duration;
                options.duration = -1;
                this.set(key || this.key);
                options.duration = duration;
                return this;
            }
        });
    Cookie.implement(lib.configurable);
    $.extend(Cookie, {
        get: function (key) {
            return new Cookie(key).get();
        },
        set: function (key, value, options) {
            return new Cookie(key, options).set(value);
        },
        remove: function (key, options) {
            return new Cookie(key, options).remove();
        }
    });
    return Cookie;
});