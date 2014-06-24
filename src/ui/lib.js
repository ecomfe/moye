/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file  UI基础库
 * @author  chris(wfsr@foxmail.com)
 */

/* jshint boss: true, unused: false */
define(function (require) {

    var $ = require('jquery');

    /**
     * 基类库
     * 
     * 提供常用工具函数的封装
     * @exports lib
     */
    var lib = {};

    /**
     * 方法静态化
     * 
     * 反绑定、延迟绑定
     * @inner
     * @param {Function} method 待静态化的方法
     * 
     * @return {Function} 静态化包装后方法
     */
    function generic(method) {
        return function () {
            return Function.call.apply(method, arguments);
        };
    }

    /**
     * 功能降级处理
     * 
     * @inner
     * @param {boolean} conditioin feature 可用的测试条件
     * @param {Function} implement feature 不可用时的降级实现
     * @param {Function} feature 可用的特性方法
     * 
     * @return {Function} 静态化后的 feature 或 对应的降级实现函数
     */
    function fallback(condition, implement, feature) {
        return condition ? generic(feature || condition) : implement;
    }


    /**
     * 类型判断
     * 
     * @param {*} obj 待判断类型的输入
     * 
     * @return {string} 类型判断结果
     */
    var typeOf = lib.typeOf = function (obj) {
        return obj && typeof obj === 'object' && ('nodeType' in obj)
            ? 'dom'
            : $.type(obj);
    };

    /**
     * 判断是否日期对象
     * 
     * @method module:lib.isDate
     * @param {*} obj 待判断的输入
     * @return {boolean} 类型判断结果
     */
    lib.isDate = function (obj) {
        return $.type(obj) === 'date';
    };

    /**
     * 判断是否字符串
     * 
     * @method module:lib.isString
     * @param {*} obj 待判断的输入
     * @return {boolean} 类型判断结果
     */
    lib.isString = function (obj) {
        return $.type(obj) === 'string';
    };

    /**
     * 判断是否对象
     * 
     * @method module:lib.isObject
     * @param {*} obj 待判断的输入
     * @return {boolean} 类型判断结果
     */
    lib.isObject = function (obj) {
        return $.type(obj) === 'object';
    };

    /* ========================== lib.array ========================== */


    lib.array = {};

    /**
     * 数组切片方法
     * 
     * @method module:lib.slice
     * @param {Array} array 输入数组或类数组
     * @param {number} startIndex 切片的开始索引
     * @param {number} endIndex 切片的结束索引
     * 
     * @return {Array} 新的数组
     */
    /**
     * 数组切片方法
     * 
     * @method module:lib.array.slice
     * @param {Array} array 输入数组或类数组
     * @param {number} startIndex 切片的开始索引
     * @param {number} endIndex 切片的结束索引
     * 
     * @return {Array} 新的数组
     */
    var slice = lib.slice = lib.array.slice = generic(Array.prototype.slice);

    /* ========================== lib.object ========================== */

    /**
     * @namespace module:lib.object
     */
    lib.object = {};

    /**
     * 序列化 JSON 对象
     * 
     * @method module:lib.stringify
     * @param {JSON} value 需要序列化的json对象
     * 
     * @return {string} 序列化后的字符串
     */
    /**
     * 序列化 JSON 对象
     * 
     * @method module:lib.object.stringify
     * @param {JSON} value 需要序列化的json对象
     * 
     * @return {string} 序列化后的字符串
     */
    lib.stringify = lib.object.stringify = window.JSON
        && JSON.stringify
        || (function () {

        var special = {
            '\b': '\\b', 
            '\t': '\\t', 
            '\n': '\\n', 
            '\f': '\\f', 
            '\r': '\\r',
            '"' : '\\"', 
            '\\': '\\\\'
        };

        var escape = function (chr) {
            return special[chr]
                || '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4);
        };
        
        return function stringify(obj) {
            if (obj && obj.toJSON) {
                obj = obj.toJSON();
            }

            switch (typeOf(obj)) {
                case 'string':
                    return '"' + obj.replace(/[\x00-\x1f\\"]/g, escape) + '"';
                case 'array':
                    return '[' + map(obj, stringify) + ']';
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
    })();

    /**
     * 深层复制
     * 
     * @method module:lib.clone
     * @param {*} source 被复制的源
     * 
     * @return {*} 复制后的新对象
     */
    /**
     * 深层复制
     * 
     * @method module:lib.object.clone
     * @param {*} source 被复制的源
     * 
     * @return {*} 复制后的新对象
     */
    var clone = lib.clone = lib.object.clone = function (target) {
        return $.extend.call(null, true, {}, target);
    };


    /**
     * 将对象解析成 query 字符串
     * 
     * @method module:lib.toQueryString
     * @param {Object} json 需要解析的 JSON 对象
     *             
     * @return {string} 解析结果字符串，其中值将被URI编码
     */
    /**
     * 将对象解析成 query 字符串
     * 
     * @method module:lib.object.toQueryString
     * @param {Object} json 需要解析的 JSON 对象
     *             
     * @return {string} 解析结果字符串，其中值将被URI编码
     */
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
                    while (i --) {
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
    lib.toQueryString = lib.object.toQueryString = toQueryString;

    /* ========================== lib.string ========================== */
   
    /**
     * @namespace module:lib.string
     */
    lib.string = {};

    /**
     * 将字符串转换成单词首字母大写
     * 
     * @method module:lib.capitalize
     * @param {string} source 源字符串
     * 
     * @return {string}
     */
    /**
     * 将字符串转换成单词首字母大写
     * 
     * @method module:lib.string.capitalize
     * @param {string} source 源字符串
     * 
     * @return {string}
     */
    lib.capitalize = lib.string.capitalize = function (source) {
        return String(source).replace(
            /\b[a-z]/g,
            function (match) {
                return match.toUpperCase();
            }
        );
    };


    /**
     * 测试是否包含指定字符
     * 
     * @method module:lib.contains
     * @param {string} source 源字符串
     * @param {string} target 包含的字符串
     * @param {string} seperator 分隔字符
     * 
     * @return {boolean} 是否包含的结果
     */
    /**
     * 测试是否包含指定字符
     * 
     * @method module:lib.string.contains
     * @param {string} source 源字符串
     * @param {string} target 包含的字符串
     * @param {string} seperator 分隔字符
     * 
     * @return {boolean} 是否包含的结果
     */
    lib.contains = lib.string.contains = function (source, target, seperator) {
        seperator = seperator || ' ';
        source = seperator + source + seperator;
        target = seperator + $.trim(target) + seperator;
        return source.indexOf(target) > -1;
    };

    /* ========================== lib.fn ========================== */

    /**
     * @namespace module:lib.fn
     */
    lib.fn = {};

    /** 
     * 为对象绑定方法和作用域
     * 
     * @method module:lib.binds
     * @param {Object} me 要绑定的 this
     * @param {(Array.<string> | ...string)} 要绑定的方法名列表
     */
    /** 
     * 为对象绑定方法和作用域
     * 
     * @method module:lib.fn.binds
     * @param {Object} me 要绑定的 this
     * @param {(Array.<string> | ...string)} 要绑定的方法名列表
     */
    lib.binds = lib.fn.binds = function (me, methods) {
        if (typeof methods === 'string') {
            methods = ~methods.indexOf(',')
                ? methods.split(/\s*,\s*/)
                : slice(arguments, 1);
        }

        if (!methods || !methods.length) {
            return;
        }

        var name;
        var fn;
        while ((name = methods.pop())) {
            fn = name && me[name];
            if (fn) {
                me[name] = $.bind(fn, me);
            }
        }
    };

    /** 
     * 为函数提前绑定参数（柯里化）
     * 
     * @see http://en.wikipedia.org/wiki/Currying
     * @method module:lib.curry
     * @param {Function} fn 要绑定的函数
     * @param {...args=} args 函数执行时附加到执行时函数前面的参数
     *
     * @return {function} 封装后的函数
     */
    /** 
     * 为函数提前绑定参数（柯里化）
     * 
     * @see http://en.wikipedia.org/wiki/Currying
     * @method module:lib.fn.curry
     * @param {Function} fn 要绑定的函数
     * @param {...args=} args 函数执行时附加到执行时函数前面的参数
     *
     * @return {Function} 封装后的函数
     */
    var curry = lib.curry = lib.fn.curry = function (fn) {
        var args = slice(arguments, 1);
        return function () {
            return fn.apply(this, args.concat(slice(arguments)));
        };
    };
    /* ========================== 类模拟 ========================== */

    (function () {
    
        /**
         * 创建新类
         * 
         * @param {Function=} originConstructor 私有的构造函数
         * @param {Object} prototype 类的原型对象
         * 
         * @return {Function} 新类构造函数
         */
        lib.newClass = function (originConstructor, prototype) {
            if (lib.isObject(originConstructor)) {
                prototype = originConstructor;
            }

            var Class = function () {
                var result = this.initialize
                    ? this.initialize.apply(this, arguments)
                    : this;

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
            }
            else {
                Class.implement(prototype);
            }

            return Class;
        };

        /**
         * 扩展生成子类
         * 
         * @inner
         * @param {Class} superClass 父类
         * @param {Object} params 扩展方法集合
         * 
         * @return {Class} 新的子类
         */
        function extend(superClass, params) {
            var F = function () {};
            F.prototype = superClass.prototype;
            var f = new F();
            f.$wrapped = true;

            var subClass = lib.newClass(f);
            subClass.parent = superClass;

            subClass.implement(params);

            return subClass;
        }

        /* jshint -W055 */
        /**
         * 扩展类方法
         * 
         * @inner
         * @param {Class} newClass 要扩展的类
         * @param {Object} params 扩展的方法集
         * 
         * @return {Class} 扩展后的类
         */
        function implement(newClass, params) {
            
            if ($.isFunction(params)) {
                params = params.prototype;
            }

            var prototype = newClass.prototype;

            $.each(params, function (key, value) {
                if (lib.isObject(prototype[key])
                    && lib.isObject(value)
                ) {
                    prototype[key] = $.extend(
                        true,
                        {},
                        prototype[key],
                        value
                    );
                }
                else {
                    prototype[key] = wrap(newClass, key, value);
                }
            });

            return newClass;
        }

        var commentRule = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
        var parentRule = /(?:this|me|self)\.parent\(/;
        var privateRule = /(?:this|me|self)\._[a-z\d_\$]+\(/i;
        /**
         * 方法包装器
         * 
         * @inner
         * @param {Class} newClass 被包装的方法所属类
         * @param {string} name 方法名
         * @param {*} method 方法函数
         * @return {*} 非函数类型直接返回，否则检测是否包含
         */
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
                    }
                    else {
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

                this.parent = parentMethod;
                this.$caller = wrapper;
                var result = method.apply(this, arguments);
                this.parent = null;
                this.$caller = null;

                return result;
            };
            wrapper.$wrapped = true;

            return wrapper;
        }
    })();

    /**
     * 事件功能
     * 
     * @namespace
     */
    lib.observable = {

        /**
         * 添加事件绑定
         * 
         * @public
         * @param {string=} type 事件类型
         * @param {Function} listener 要添加绑定的监听器
         */
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


        /**
         * 解除事件绑定
         * 
         * @public
         * @param {string=} type 事件类型
         * @param {Function=} listener 要解除绑定的监听器
         */
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
                }
                else {
                    listeners.length = 0;
                    delete this._listeners[type];
                }
            }

            return this;
        },

        /**
         * 添加单次事件绑定
         * 
         * @public
         * @param {string=} type 事件类型
         * @param {Function} listener 要添加绑定的监听器
         */
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

        /**
         * 触发指定事件
         * 
         * @public
         * @param {string} type 事件类型
         * @param {Object} args 透传的事件数据对象
         */
        fire: function (type, args) {
            var me = this;
            me._listeners = me._listeners || {};
            var listeners = me._listeners[type];

            if (listeners) {

                $.each(
                    listeners,
                    function (index, listener) {
                        args = args || {};
                        args.type = type;
                        listener.call(me, args);
                    }
                );
            }

            if (type !== '*') {
                me.fire('*', args);
            }

            return me;
        }
    };

    /**
     * 参数配置
     * 
     * @namespace
     */
    lib.configurable = {

        /**
         * 设置可配置项
         * 
         * @protected
         * @param {Object} options 配置项
         * 
         * @return {Object} 合并更新后的配置项
         */
        setOptions: function (options) {
            if (!options) {
                return clone(this.options);
            }

            var thisOptions  = this.options = clone(this.options);
            var eventNameReg = /^on[A-Z]/;
            var me           = this;

            this.srcOptions = options;

            var val;
            for (var name in options) {
                if (!Object.prototype.hasOwnProperty.call(options, name)) {
                    continue;
                }

                val = options[name];

                // 处理配置项中的事件
                if (eventNameReg.test(name) && $.isFunction(val)) {

                    // 移除on前缀，并转换第3个字符为小写，得到事件类型
                    var type = name.charAt(2).toLowerCase() + name.slice(3);
                    me.on(type, val);

                    delete options[name];
                }
                else if (name in thisOptions) {

                    thisOptions[name] = typeOf(val) === 'object'
                        ? extend(thisOptions[name] || {}, val)
                        : val;
                }
            }

            return thisOptions;
        }
    };

    /* ========================== BROWSER ========================== */

    /* jshint -W101 */
    (function () {
        var reg = /(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/;
        var UA = navigator.userAgent.toLowerCase().match(reg)
            || [null, 'unknown', 0];
        var mode = UA[1] === 'ie' && document.documentMode;

        /**
         * 浏览器信息
         * 
         * @namespace module:lib.browser
         * @property {string} name 浏览器名称，
         * 如 ( opera | ie | firefox | chrome | safari )
         * @property {number} version 浏览器版本
         * @property {number} (browser.name) 是否指定浏览器，
         * 如 ie 6 时为 lib.browser.ie = 6
         * @property {boolean} (browser.name+browser.version) 是否指定浏览器及版本，
         * 如 ie 6 时为 lib.browser.ie6 = true
         */
        var browser = lib.browser = {

            name: (UA[1] === 'version') ? UA[3] : UA[1],

            version: mode
                || parseFloat((UA[1] === 'opera' && UA[4]) ? UA[4] : UA[2])

        };


        browser[browser.name] = browser.version | 0;

        browser[browser.name + (browser.version |0)] = true;

    })();

    return lib;
});
