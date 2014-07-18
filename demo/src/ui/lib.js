define('ui/lib', [
    'require',
    'jquery'
], function (require) {
    var $ = require('jquery');
    var lib = {};
    function generic(method) {
        return function () {
            return Function.call.apply(method, arguments);
        };
    }
    function fallback(condition, implement, feature) {
        return condition ? generic(feature || condition) : implement;
    }
    var typeOf = lib.typeOf = function (obj) {
            return obj && typeof obj === 'object' && 'nodeType' in obj ? 'dom' : $.type(obj);
        };
    lib.isDate = function (obj) {
        return $.type(obj) === 'date';
    };
    lib.isString = function (obj) {
        return $.type(obj) === 'string';
    };
    lib.isObject = function (obj) {
        return $.type(obj) === 'object';
    };
    lib.array = {};
    var slice = lib.slice = lib.array.slice = generic(Array.prototype.slice);
    lib.object = {};
    lib.stringify = lib.object.stringify = window.JSON && JSON.stringify || function () {
        var special = {
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };
        var escape = function (chr) {
            return special[chr] || '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4);
        };
        return function stringify(obj) {
            if (obj && obj.toJSON) {
                obj = obj.toJSON();
            }
            switch (typeOf(obj)) {
            case 'string':
                return '"' + obj.replace(/[\x00-\x1f\\"]/g, escape) + '"';
            case 'array':
                return '[' + $.map(obj, stringify) + ']';
            case 'object':
                var string = [];
                $.each(obj, function (key, value) {
                    var json = stringify(value);
                    if (json) {
                        string.push(stringify(key) + ':' + json);
                    }
                });
                return '{' + string + '}';
            case 'number':
            case 'boolean':
                return '' + obj;
            case 'null':
                return 'null';
            }
            return null;
        };
    }();
    var clone = lib.clone = lib.object.clone = function (source) {
            var target = $.type(source) === 'array' ? [] : {};
            return $.extend(true, target, source);
        };
    var toQueryString = function (object, base) {
        var queryString = [];
        $.each(object, function (key, value) {
            if (base) {
                key = base + '[' + key + ']';
            }
            var result;
            switch (typeOf(value)) {
            case 'object':
                result = toQueryString(value, key);
                break;
            case 'array':
                var qs = {};
                var i = value.length;
                while (i--) {
                    qs[i] = value[i];
                }
                result = toQueryString(qs, key);
                break;
            default:
                result = key + '=' + encodeURIComponent(value);
                break;
            }
            if (value != null) {
                queryString.push(result);
            }
        });
        return queryString.join('&');
    };
    lib.string = {};
    lib.capitalize = lib.string.capitalize = function (source) {
        return String(source).replace(/\b[a-z]/g, function (match) {
            return match.toUpperCase();
        });
    };
    lib.contains = lib.string.contains = function (source, target, seperator) {
        seperator = seperator || ' ';
        source = seperator + source + seperator;
        target = seperator + $.trim(target) + seperator;
        return source.indexOf(target) > -1;
    };
    lib.g = function (id) {
        return typeOf(id) === 'string' ? document.getElementById(id) : id;
    };
    lib.fn = {};
    lib.binds = lib.fn.binds = function (me, methods) {
        if (typeof methods === 'string') {
            methods = ~methods.indexOf(',') ? methods.split(/\s*,\s*/) : slice(arguments, 1);
        }
        if (!methods || !methods.length) {
            return;
        }
        var name;
        var fn;
        while (name = methods.pop()) {
            fn = name && me[name];
            if (fn) {
                me[name] = $.bind(fn, me);
            }
        }
    };
    var curry = lib.curry = lib.fn.curry = function (fn) {
            var args = slice(arguments, 1);
            return function () {
                return fn.apply(this, args.concat(slice(arguments)));
            };
        };
    (function () {
        lib.newClass = function (originConstructor, prototype) {
            if (lib.isObject(originConstructor)) {
                prototype = originConstructor;
            }
            var Class = function () {
                var result = this.initialize ? this.initialize.apply(this, arguments) : this;
                if ($.isFunction(originConstructor)) {
                    result = originConstructor.apply(this, arguments);
                }
                return result;
            };
            Class.extend = curry(extend, Class);
            Class.implement = curry(implement, Class);
            prototype = prototype || {};
            if (prototype.$wrapped) {
                delete prototype.$wrapped;
                Class.prototype = prototype;
                Class.prototype.constructor = Class;
            } else {
                Class.implement(prototype);
            }
            return Class;
        };
        function extend(superClass, params) {
            var F = function () {
            };
            F.prototype = superClass.prototype;
            var f = new F();
            f.$wrapped = true;
            var subClass = lib.newClass(f);
            subClass.parent = superClass;
            subClass.implement(params);
            return subClass;
        }
        function implement(newClass, params) {
            if ($.isFunction(params)) {
                params = params.prototype;
            }
            var prototype = newClass.prototype;
            $.each(params, function (key, value) {
                if (lib.isObject(prototype[key]) && lib.isObject(value)) {
                    prototype[key] = $.extend(true, {}, prototype[key], value);
                } else {
                    prototype[key] = wrap(newClass, key, value);
                }
            });
            return newClass;
        }
        var commentRule = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm;
        var parentRule = /(?:this|me|self)\.parent\(/;
        var privateRule = /(?:this|me|self)\._[a-z\d_\$]+\(/i;
        function wrap(newClass, name, method) {
            if (!$.isFunction(method) || method.$wrapped) {
                return method;
            }
            var code = String(method).replace(commentRule, '');
            var hasParentCall = parentRule.test(code);
            var hasPrivateCall = privateRule.test(code);
            var isPrivate = name.charAt(0) === '_';
            if (!(hasParentCall || isPrivate || hasPrivateCall)) {
                return method;
            }
            if (hasParentCall) {
                var parentMethod;
                var parentClass = newClass.parent;
                while (parentClass) {
                    parentMethod = parentClass.prototype[name];
                    if (parentMethod) {
                        break;
                    } else {
                        parentClass = parentClass.parent;
                    }
                }
            }
            var wrapper = function () {
                if (hasParentCall && !parentMethod) {
                    throw new Error('parent Class has no method named ' + name);
                }
                if (isPrivate && !this.$caller) {
                    throw new Error('can not call private method:' + name);
                }
                var parent = this.parent;
                var caller = this.$caller;
                this.parent = parentMethod;
                this.$caller = wrapper;
                var result = method.apply(this, arguments);
                this.parent = parent;
                this.$caller = caller;
                return result;
            };
            wrapper.$wrapped = true;
            return wrapper;
        }
    }());
    lib.observable = {
        on: function (type, listener) {
            if ($.isFunction(type)) {
                listener = type;
                type = '*';
            }
            this._listeners = this._listeners || {};
            var listeners = this._listeners[type] || [];
            if ($.inArray(listener, listeners) < 0) {
                listener.$type = type;
                listeners.push(listener);
            }
            this._listeners[type] = listeners;
            return this;
        },
        un: function (type, listener) {
            if ($.isFunction(type)) {
                listener = type;
                type = '*';
            }
            this._listeners = this._listeners || {};
            var listeners = this._listeners[type];
            if (listeners) {
                if (listener) {
                    var index = $.inArray(listener, listeners);
                    if (~index) {
                        listeners.splice(index, 1);
                    }
                } else {
                    listeners.length = 0;
                    delete this._listeners[type];
                }
            }
            return this;
        },
        once: function (type, listener) {
            if ($.isFunction(type)) {
                listener = type;
                type = '*';
            }
            var me = this;
            var realListener = function () {
                listener.apply(me, arguments);
                me.un(type, realListener);
            };
            this.on.call(me, type, realListener);
        },
        fire: function (type, args) {
            var me = this;
            me._listeners = me._listeners || {};
            var listeners = me._listeners[type];
            if (listeners) {
                $.each(listeners, function (index, listener) {
                    args = args || {};
                    args.type = type;
                    listener.call(me, args);
                });
            }
            if (type !== '*') {
                me.fire('*', args);
            }
            return me;
        }
    };
    lib.configurable = {
        setOptions: function (options) {
            if (!options) {
                return clone(this.options);
            }
            var thisOptions = this.options = clone(this.options);
            var eventNameReg = /^on[A-Z]/;
            var me = this;
            this.srcOptions = options;
            var val;
            for (var name in options) {
                if (!Object.prototype.hasOwnProperty.call(options, name)) {
                    continue;
                }
                val = options[name];
                if (eventNameReg.test(name) && $.isFunction(val)) {
                    var type = name.charAt(2).toLowerCase() + name.slice(3);
                    me.on(type, val);
                    delete options[name];
                } else if (name in thisOptions) {
                    thisOptions[name] = typeOf(val) === 'object' ? $.extend(thisOptions[name] || {}, val) : val;
                }
            }
            return thisOptions;
        }
    };
    var guidPrefix = 'moye';
    var guid = 0;
    lib.guid = function () {
        return guidPrefix + '-' + guid++;
    };
    var win = $(window);
    var doc = $(document);
    lib.getScrollLeft = function () {
        return doc.scrollLeft();
    };
    lib.getScrollTop = function () {
        return doc.scrollTop();
    };
    lib.getScrollHeight = function () {
        return doc.height();
    };
    lib.getScrollWidth = function () {
        return doc.width();
    };
    lib.getViewWidth = function () {
        return win.width();
    };
    lib.getViewHeight = function () {
        return win.height();
    };
    (function () {
        var reg = /(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/;
        var UA = navigator.userAgent.toLowerCase().match(reg) || [
                null,
                'unknown',
                0
            ];
        var mode = UA[1] === 'ie' && document.documentMode;
        var browser = lib.browser = {
                name: UA[1] === 'version' ? UA[3] : UA[1],
                version: mode || parseFloat(UA[1] === 'opera' && UA[4] ? UA[4] : UA[2])
            };
        browser[browser.name] = browser.version | 0;
        browser[browser.name + (browser.version | 0)] = true;
    }());
    return lib;
});