/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file  UI基础库
 * @author  chris(wfsr@foxmail.com)
 */

/* jshint boss: true, unused: false */
define(function () {
    /**
     * 基类库
     * 
     * 提供常用工具函数的封装
     * @exports lib
     */
    var lib = {};

    var toString = Object.prototype.toString;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

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
        var type = toString.call(obj).slice(8, -1).toLowerCase();
        return obj && typeof obj === 'object' && ('nodeType' in obj)
            ? 'dom'
            : (obj == null ? null : type);
    };

    /* ========================== lib.array ========================== */

    /**
     * 遍历数组方法
     * 
     * 现代浏览器中数组 forEach 方法静态化别名
     * @method module:lib.each
     * @param {Array} obj 待遍历的数组或类数组
     * @param {Function} iterator 迭代方法
     * @param {Object=} bind 迭代方法中绑定的 this
     */
    var each = lib.each = fallback(
        Array.prototype.forEach,
        function (obj, iterator, bind) {
            for (var i = 0, l = (obj.length >>> 0); i < l; i++) {
                if (i in obj) {
                    iterator.call(bind, obj[i], i, obj);
                }
            }
        }
    );

    // 生成 lib 命名空间下的 isString、isArray、isFunctoin、isDate 和 isObject 方法
    each(['String', 'Array', 'Function', 'Date', 'Object'], function (type) {

        /**
         * @namespace module:lib.string
         */
        /**
         * @namespace module:lib.array
         */
        /**
         * @namespace module:lib.fn
         */
        /**
         * @namespace module:lib.date
         */
        /**
         * @namespace module:lib.object
         */
        var lowerType = type.toLowerCase();
        lib[lowerType === 'function' ? 'fn' : lowerType] = {};

        /**
         * 判断是否字符串
         * 
         * @method module:lib.isString
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否数组
         * 
         * @method module:lib.isArray
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否函数
         * 
         * @method module:lib.isFunction
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否日期对象
         * 
         * @method module:lib.isDate
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否对象
         * 
         * @method module:lib.isObject
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        lib['is' + type] = function (obj) {
            return obj != null && toString.call(obj).slice(8, -1) === type;
        };
    });

    /**
     * 遍历数组方法
     * 
     * 现代浏览器中数组 forEach 方法静态化别名
     * @method module:lib.array.each
     * @param {Array} obj 待遍历的数组或类数组
     * @param {Function} iterator 迭代方法
     * @param {Object=} bind 迭代方法中绑定的 this
     */
    lib.array.each = each;

    /**
     * 数组的 map 方法
     * 
     * 现代浏览器中数组 map 方法静态化
     * @method module:lib.map
     * @param {Array} obj 待处理的数组或类数组
     * @param {Function} iterator 迭代方法
     * @param {Object=} bind 迭代方法中绑定的 this
     * @return {Array} map 处理后的原数组
     */
    /**
     * 数组的 map 方法
     * 
     * 现代浏览器中数组 map 方法静态化
     * @method module:lib.array.map
     * @param {Array} obj 待处理的数组或类数组
     * @param {Function} iterator 迭代方法
     * @param {Object=} bind 迭代方法中绑定的 this
     * @return {Array} map 处理后的原数组
     */
    var map = lib.map = lib.array.map = fallback(
        Array.prototype.map,
        function (obj, iterator, bind) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (i in obj) {
                    obj[i] = iterator.call(bind, obj[i], i, obj);
                }
            }
            return obj;
        }
    );


    /**
     * 查询数组中指定元素的索引位置
     * 
     * @method module:lib.indexOf
     * @param {Array} source 需要查询的数组
     * @param {*} match 查询项
     * @return {number} 指定元素的索引位置，查询不到时返回-1
     */
    /**
     * 查询数组中指定元素的索引位置
     * 
     * @method module:lib.array.indexOf
     * @param {Array} source 需要查询的数组
     * @param {*} item 查询项
     * @param {number} from 初始的查询位置
     * @return {number} 指定元素的索引位置，查询不到时返回-1
     */
    var indexOf = lib.indexOf = lib.array.indexOf = fallback(
        Array.prototype.indexOf,
        function (source, item, from) {
            var length = source.length >>> 0;
            var i = (from < 0) ? Math.max(0, length + from) : from || 0;
            for (; i < length; i++) {
                if (source[i] === item) {
                    return i;
                }
            }
            return -1;
        }
    );


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

    /**
     * 将对象转换为数组
     *
     * @method module:lib.toArray
     * @param {*} source 任意对象
     * 
     * @return {Array}
     */   
    /**
     * 将对象转换为数组
     *
     * @method module:lib.array.toArray
     * @param {*} source 任意对象
     * 
     * @return {Array}
     */   
    lib.toArray = lib.array.toArray = function (source) {
        if (source == null) {
            return [];
        }

        if (lib.isArray(source)) {
            return source;
        }

        var l = source.length;
        if (typeof l === 'number' && typeOf(source) !== 'string') {
            var array = [];
            while (l --) {
                array[l] = source[l];
            }

            return array;
        }
        return [source];
    };

    /* ========================== lib.object ========================== */

    /**
     * 无法枚举到的对象属性
     * 
     * ie sucks!
     * @type {?Array.<string>}
     */
    var enumerables = {valueOf: 1}.propertyIsEnumerable('valueOf')
        ? null
        : [
            'hasOwnProperty', 
            'valueOf', 
            'isPrototypeOf', 
            'propertyIsEnumerable', 
            'toLocaleString', 
            'toString', 
            'constructor'
        ];


    /**
     * 枚举对象属性
     * 
     * @method module:lib.forIn
     * @param {Object} object 要枚举的目标对象
     * @param {Function} iterator 迭代器方法
     */
    /**
     * 枚举对象属性
     * 
     * @method module:lib.object.each
     * @param {Object} object 要枚举的目标对象
     * @param {Function} iterator 迭代器方法
     */
    var forIn = lib.forIn = lib.object.each = function (object, iterator) {
        for (var key in object) {
            if (hasOwnProperty.call(object, key)) {
                iterator(object[key], key);
            }
        }
        if (enumerables) {
            for (var i = enumerables.length - 1, key; key = enumerables[i--];) {
                if (hasOwnProperty.call(object, key)) {
                    iterator(object[key], key);
                }
            }
        }        
    };

    /**
     * 扩展对象
     * 
     * @method module:lib.extend
     * @param {Object} target 被扩展的目标对象
     * @param {Object} source 扩展的源对象
     * 
     * @return {Object} 被扩展后的 `target` 对象
     */
    /**
     * 扩展对象
     * 
     * @method module:lib.object.extend
     * @param {Object} target 被扩展的目标对象
     * @param {Object} source 扩展的源对象
     * 
     * @return {Object} 被扩展后的 `target` 对象
     */
    var extend = lib.extend = lib.object.extend = function (target, source) {
        forIn(source, function (value, key) {
            if (lib.isObject(target[key])) {
                extend(target[key], value);
            }
            else {
                target[key] = value;
            }
        });
        return target;
    };

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
    var clone = lib.clone = lib.object.clone = function (source) {
        if (!source || typeof source !== 'object') {
            return source;
        }

        var cloned = source;

        if (lib.isArray(source)) {
            cloned = map(slice(source), clone);
        }
        else if (lib.isObject(source) && 'isPrototypeOf' in source) {
            cloned = {};
            forIn(source, function (value, key) {
                cloned[key] = clone(value);
            });
        }

        return cloned;
    };

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
                    forIn(obj, function (value, key) {
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
     * 将字符串解析成 JSON 对象。
     * 
     * @method module:lib.parse
     * @param {string} source 需要解析的字符串
     * 
     * @return {JSON} 解析结果 JSON 对象
     */
    /**
     * 将字符串解析成 JSON 对象。
     * 
     * @method module:lib.object.parse
     * @param {string} source 需要解析的字符串
     * 
     * @return {JSON} 解析结果 JSON 对象
     */
    lib.parse = lib.object.parse = window.JSON
        && JSON.parse
        || function (string) {
        return !string || typeOf(string) !== 'string'
            ? null
            : eval('(' + string + ')');
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

        forIn(object, function (value, key) {
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
     * 删除目标字符串两端的空白字符
     * 
     * @method module:lib.trim
     * @param {string} str 目标字符串
     * @param {(string | RegExp)} triment 待删除的字符或规则
     * 
     * @return {string} 删除两端空白字符后的字符串
     */
    /**
     * 删除目标字符串两端的空白字符
     * 
     * @method module:lib.string.trim
     * @param {string} str 目标字符串
     * @param {(string | RegExp)} triment 待删除的字符或规则
     * 
     * @return {string} 删除两端空白字符后的字符串
     */
    lib.trim = lib.string.trim = (function () {
        var whitespace = /^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g;

        return function (str, triment) {
            return str && String(str).replace(triment || whitespace, '') || '';
        };
    }());

    /**
     * 将字符串转换成camel格式
     * 
     * @method module:lib.camelCase
     * @param {string} source 源字符串
     * 
     * @return {string}
     */
    /**
     * 将字符串转换成camel格式
     * 
     * @method module:lib.string.camelCase
     * @param {string} source 源字符串
     * 
     * @return {string}
     */
    lib.camelCase = lib.string.camelCase = function (source) {
        return String(source).replace( 
            /-\D/g, 
            function (match) {
                return match.charAt(1).toUpperCase();
            }
        );
    };


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
        target = seperator + lib.trim(target) + seperator;
        return source.indexOf(target) > -1;
    };
    
    /**
     * 对目标数字进行 0 补齐处理
     * 
     * @method module:lib.pad
     * @param {(number | string)} source 需要补齐的数字或字符串
     * @param {number} width 补齐后的固定宽度（必须小于32）
     */
    /**
     * 对目标数字进行 0 补齐处理
     * 
     * @method module:lib.string.pad
     * @param {(number | string)} source 需要补齐的数字或字符串
     * @param {number} width 补齐后的固定宽度（必须小于32）
     */
    lib.pad = lib.string.pad = function (source, width) {
        var str = String(Math.abs(source | 0));

        return (source < 0 ? '-' : '')
            + (
                str.length >= width
                    ? str
                    : (
                        ((1 << (width - str.length)).toString(2) + str)
                        .slice(-width)
                    )
            );
    };
    
    /**
     * 使用对象数据替换字符串相应的占位字符
     * 
     * @method module:lib.substitute
     * @param {string} tpl 字符串模板
     * @param {Object} data 字符串模板
     * @param {RegExp} regexp 占位符规则，默认是匹配大括号
     * 
     * @return {string} 用`data`数据替换`tpl`中占位字符后的字符串
     */
    /**
     * 使用对象数据替换字符串相应的占位字符
     * 
     * @param {string} tpl 字符串模板
     * @param {Object} data 字符串模板
     * @param {RegExp} regexp 占位符规则
     * 
     * @return {string} 用`data`数据替换`tpl`中占位字符后的字符串
     */
    lib.substitute = lib.string.substitute = function (tpl, data, regexp) {
        return String(tpl).replace(
            regexp || (/\\?\{([^{}]+)\}/g),
            function (match, name) {
                var value = data[name];
                return match.charAt(0) === '\\'
                    ? match.slice(1)
                    : (value !== null && typeof value !== 'undefined'
                        ? value
                        : ''
                    );
            }
        );
    };

    /* ========================== lib.fn ========================== */

    /** 
     * 为对象绑定方法和作用域
     * 
     * @method module:lib.bind
     * @param {Function} fn 要绑定的函数
     * @param {Object} scope 执行运行时this，如果不传入则运行时this为函数本身
     * @param {...args=} args 函数执行时附加到执行时函数前面的参数
     *
     * @return {Function} 封装后的函数
     */
    /** 
     * 为对象绑定方法和作用域
     * 
     * @method module:lib.fn.bind
     * @param {Function} fn 要绑定的函数
     * @param {Object} scope 执行运行时this，如果不传入则运行时this为函数本身
     * @param {...args=} args 函数执行时附加到执行时函数前面的参数
     *
     * @return {Function} 封装后的函数
     */
    lib.bind = lib.fn.bind = fallback(
        Function.bind,
        function (fn, scope) {
            var args = arguments.length > 2 ? slice(arguments, 2) : null,
                F = function () {};

            var bound = function () {
                var context = scope, length = arguments.length;

                // 处理构造函数的 bind
                if (this instanceof bound) {
                    F.prototype = fn.prototype;
                    context = new F();
                }
                var result = (!args && !length)
                    ? fn.call(context)
                    : fn.apply(
                        context, 
                        args && length
                            ? args.concat(slice(arguments))
                            : args || arguments
                    );
                return context === scope ? result : context;
            };
            return bound;
        }
    );

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
                me[name] = lib.bind(fn, me);
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

                if (lib.isFunction(originConstructor)) {
                    result = originConstructor.apply(this, arguments);
                }

                return result;
            };

            Class.prototype = prototype || {};
            Class.prototype.constructor = Class;

            Class.extend = curry(extend, Class);
            Class.implement = curry(implement, Class);

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

            var subClass = lib.newClass(new F());
            subClass.prototype.parent = curry(parent, superClass);

            subClass.implement(params);

            return subClass;
        }

        /**
         * 调用父类方法
         * 
         * @inner
         * @param {Class} superClass 父类
         * @param {string} name 父类方法名
         */
        function parent(superClass, name) {
            var method = superClass.prototype[name];
            if (method) {
                return method.apply(this, slice(arguments, 2));
            }
            throw new Error('parent Class has no method named ' + name);
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
            
            if (lib.isFunction(params)) {
                params = params.prototype;
            }

            var prototype = newClass.prototype;
            forIn(params, function (value, key) {
                if (lib.isObject(prototype[key])
                    && lib.isObject(value)
                ) {
                    prototype[key] = lib.extend(
                        lib.clone(prototype[key]),
                        value
                    );
                }
                else {
                    prototype[key] = value;
                }
            });

            return newClass;
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
            if (lib.isFunction(type)) {
                listener = type;
                type = '*';
            }

            this._listeners = this._listeners || {};
            var listeners = this._listeners[type] || [];

            if (indexOf(listeners, listener) < 0) {
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
            if (lib.isFunction(type)) {
                listener = type;
                type = '*';
            }

            this._listeners = this._listeners || {};
            var listeners = this._listeners[type];

            if (listeners) {
                if (listener) {
                    var index = indexOf(listeners, listener);

                    if (~index) {
                        delete listeners[index];
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
            if (lib.isFunction(type)) {
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
            this._listeners = this._listeners || {};
            var listeners = this._listeners[type];

            if (listeners) {
                each(
                    listeners,
                    function (listener) {

                        args = args || {};
                        args.type = type;

                        listener.call(this, args);

                    },
                    this
                );
            }

            if (type !== '*') {
                this.fire('*', args);
            }

            return this;
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
                if (!hasOwnProperty.call(options, name)) {
                    continue;
                }

                val = options[name];

                // 处理配置项中的事件
                if (eventNameReg.test(name) && lib.isFunction(val)) {

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




    /* ========================== Event ========================== */

    var eventFix = {
        list: [],
        custom: {}
    };

    /**
     * DOM 事件相关操作
     * 
     * @namespace
     */
    lib.event = {};

    /**
     * 为目标元素添加事件监听器
     * 
     * @method module:lib.on
     * @param {(HTMLElement | window)} element 目标元素
     * @param {string} type 事件类型
     * @param {Function} listener 需要添加的监听器

     * @return {(HTMLElement | window)} 目标元素
     */
    /**
     * 为目标元素添加事件监听器
     * 
     * @method module:lib.event.on
     * @param {(HTMLElement | window)} element 目标元素
     * @param {string} type 事件类型
     * @param {Function} listener 需要添加的监听器

     * @return {(HTMLElement | window)} 目标元素
     */
    lib.on = lib.event.on = document.addEventListener
        ? function (element, type, listener) {
            var condition = listener;
            var custom = eventFix.custom[type];
            var realType = type;
            if (custom) {
                realType = custom.base;
                condition = function (event) {
                    if (custom.condition.call(element, event, type)) {
                        event._type = type;
                        listener.call(element, event);
                    }
                };
                listener.index = eventFix.list.length;
                eventFix.list[listener.index] = condition;
            }
            return element.addEventListener(
                realType, 
                condition, 
                !!arguments[3]
            );
        }
        : function (element, type, listener) {
            return element.attachEvent('on' + type, listener);
        };

    /**
     * 为目标元素移除事件监听器
     * 
     * @method module:lib.un
     * @param {(HTMLElement | window)} element 目标元素
     * @param {string} type 事件类型
     * @param {Function} listener 需要移除的监听器
     *             
     * @return {(HTMLElement | window)} 目标元素
     */
    /**
     * 为目标元素移除事件监听器
     * 
     * @method module:lib.event.un
     * @param {(HTMLElement | window)} element 目标元素
     * @param {string} type 事件类型
     * @param {Function} listener 需要移除的监听器
     *             
     * @return {(HTMLElement | window)} 目标元素
     */
    lib.un = lib.event.un = document.removeEventListener
        ? function (element, type, listener) {
            var condition = listener;
            var custom = eventFix.custom[type];
            var realType = type;
            if (custom) {
                realType = custom.base;
                condition = eventFix.list[listener.index];
                delete eventFix.list[listener.index];
                delete listener.index;
            }
            element.removeEventListener(
                realType, 
                condition, 
                !!arguments[3]
            );
            return element;
        }
        : function (element, type, listener) {
            element.detachEvent('on' + type, listener);
            return element;
        };

    /**
     * 触发目标元素指定事件
     * 
     * @method module:lib.fire
     * @param {(HTMLElement | window)} element 目标元素
     * @param {string} type 事件类型
     *             
     * @return {(HTMLElement | window)} 目标元素
     */
    /**
     * 触发目标元素指定事件
     * 
     * @method module:lib.event.fire
     * @param {(HTMLElement | window)} element 目标元素
     * @param {string} type 事件类型
     *             
     * @return {(HTMLElement | window)} 目标元素
     */
    lib.fire = lib.event.fire = document.createEvent
        ? function (element, type) {

            var custom = eventFix.custom[type];
            var realType = type;
            if (custom) {
                realType = custom.base;
            }

            var event = document.createEvent('HTMLEvents');
            event.initEvent(realType, true, true);
            element.dispatchEvent(event);

            return element;
        }
        : function (element, type) {
            var event = document.createEventObject();
            element.fireEvent('on' + type, event);
            return element;
        };


    /**
     * 获取事件源对象 
     * 
     * @method module:lib.getTarget
     * @param e DOM 事件对象
     * 
     * @return {HTMLElement} 获取事件目标对象
     */
    /**
     * 获取事件源对象 
     * 
     * @method module:lib.event.getTarget
     * @param e DOM 事件对象
     * 
     * @return {HTMLElement} 获取事件目标对象
     */
    lib.getTarget = lib.event.getTarget = function (e) {
        e = e || window.event;
        return e.target || e.srcElement;
    };

    /**
     * 阻止事件默认行为
     * 
     * @method module:lib.preventDefault
     * @param event 事件对象
     */
    /**
     * 阻止事件默认行为
     * 
     * @method module:lib.event.preventDefault
     * @param event 事件对象
     */
    lib.preventDefault = lib.event.preventDefault = fallback(
        window.Event && Event.prototype.preventDefault,
        function () {
            event.returnValue = false;
        }
    );

    /**
     * 阻止事件冒泡
     * 
     * @method module:lib.stopPropagation
     * @param event 事件对象
     */
    /**
     * 阻止事件冒泡
     * 
     * @method module:lib.event.stopPropagation
     * @param event 事件对象
     */
    lib.stopPropagation = lib.event.stopPropagation = fallback(
        window.Event && Event.prototype.stopPropagation,
        function () {
            event.cancelBubble = true;
        }
    );

    if (!('onmouseenter' in document)) {

        var check = function (event) {
            var related = event.relatedTarget;
            if (related == null) {
                return true;
            }

            if (!related) {
                return false;
            }

            return (related !== this 
                && related.prefix !== 'xul' 
                && this.nodeType !== 9 
                && !lib.contains(this, related)
            );
        };

        eventFix.custom.mouseenter = {
            base: 'mouseover',
            condition: check
        };

        eventFix.custom.mouseleave = {
            base: 'mouseout',
            condition: check
        };
    }

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

    /* ========================== PAGE ========================== */

    /**
     * 获取文档的兼容根节点
     * 
     * @inner
     * @param {?HTMLElement=} el 节点引用，跨 frame 时需要
     * @return {HTMLElement} 兼容的有效根节点
     */
    function getCompatElement(el) {
        var doc = el && el.ownerDocument || document;
        var compatMode = doc.compatMode;
        return !compatMode || compatMode === 'CSS1Compat'
            ? doc.documentElement
            : doc.body;
    }

    /**
     * PAGE 相关工具函数
     * 
     * @namespace module:lib.page
     */
    lib.page = {};

    /**
     * 获取横向滚动量
     * 
     * @method module:lib.getScrollLeft
     * 
     * @return {number} 横向滚动偏移量
     */
    /**
     * 获取横向滚动量
     * 
     * @method module:lib.page.getScrollLeft
     * 
     * @return {number} 横向滚动偏移量
     */
    lib.getScrollLeft = lib.page.getScrollLeft = function () {
        return window.pageXOffset || getCompatElement().scrollLeft;
    };

    /**
     * 获取纵向滚动量
     * 
     * @method module:lib.getScrollLeft
     * 
     * @return {number} 纵向滚动偏移量
     */
    /**
     * 获取纵向滚动量
     * 
     * @method module:lib.page.getScrollLeft
     * 
     * @return {number} 纵向滚动偏移量
     */
    lib.getScrollTop = lib.page.getScrollTop = function () {
        return window.pageYOffset || getCompatElement().scrollTop;
    };

    /**
     * 获取页面视觉区域宽度
     *
     * @method module:lib.getViewWidth
     * 
     * @return {number} 页面视觉区域宽度
     */
    /**
     * 获取页面视觉区域宽度
     *
     * @method module:lib.page.getViewWidth
     * 
     * @return {number} 页面视觉区域宽度
     */
    lib.getViewWidth = lib.page.getViewWidth = function () {
        return getCompatElement().clientWidth;
    };

    /**
     * 获取页面视觉区域高度
     *
     * @method module:lib.getViewHeight
     * 
     * @return {number} 页面视觉区域高度
     */
    /**
     * 获取页面视觉区域高度
     *
     * @method module:lib.page.getViewHeight
     * 
     * @return {number} 页面视觉区域高度
     */
    lib.getViewHeight = lib.page.getViewHeight = function () {
        return getCompatElement().clientHeight;
    };

    /* ========================== DOM ========================== */

    /**
     * DOM 相关工具函数
     * 
     * @namespace module:lib.dom
     */
    lib.dom = {};

    /**
     * 从文档中获取指定的DOM元素
     * 
     * @method module:lib.g
     * @param {string|HTMLElement} id 元素或元素 id
     * 
     * @return {?HTMLElement} 获取的元素，查找不到时返回null，如果参数不合法，直接返回参数
     */
    /**
     * 从文档中获取指定的DOM元素
     * 
     * @method module:lib.dom.g
     * @param {string|HTMLElement} id 元素或元素 id
     * 
     * @return {?HTMLElement} 获取的元素，查找不到时返回null，如果参数不合法，直接返回参数
     */
    lib.g = lib.dom.g = function (id) {
        return typeOf(id) === 'string' ? document.getElementById(id) : id;
    };

    /**
     * 根据 className 查找元素集合
     * 
     * @method module:lib.q
     * @param {string} className 要查找的 className
     * @param {HTMLElement=} scope 指定查找的范围
     * 
     * @return {Array.<HTMLElement>} 符合条件的元素数组
     */
    /**
     * 根据 className 查找元素集合
     * 
     * @method module:lib.dom.q
     * @param {string} className 要查找的 className
     * @param {HTMLElement=} scope 指定查找的范围
     * 
     * @return {Array.<HTMLElement>} 符合条件的元素数组
     */
    lib.q = lib.dom.q = document.getElementsByClassName
        ? function (className, scope) {
            return slice((scope || document).getElementsByClassName(className));
        }
        : function (className, scope) {
            scope = scope || document;
            var nodes = scope.getElementsByTagName('*');
            var matches = [];

            for (var i = 0, l = nodes.length; i < l; i++) {
                if (lib.contains(nodes[i].className, className)) {
                    matches.push(nodes[i]);
                }
            }
            return matches;
        };

    /**
     * 获取目标元素符合条件的最近的祖先元素
     * 
     * @method module:lib.getAncestorBy
     * @param {(HTMLElement | string)} element 目标元素
     * @param {Function} condition 判断祖先元素条件的函数，function (element)
     *             
     * @return {?HTMLElement} 符合条件的最近的祖先元素，查找不到时返回 null
     */
    /**
     * 获取目标元素符合条件的最近的祖先元素
     * 
     * @method module:lib.dom.getAncestorBy
     * @param {(HTMLElement | string)} element 目标元素
     * @param {Function} condition 判断祖先元素条件的函数，function (element)
     *             
     * @return {?HTMLElement} 符合条件的最近的祖先元素，查找不到时返回 null
     */
    lib.getAncestorBy
        = lib.dom.getAncestorBy 
        = function (element, condition, arg) {

            while ((element = element.parentNode) && element.nodeType === 1) {
                if (condition(element, arg)) {
                    return element;
                }
            }

            return null;
        };

    /**
     * 获取目标元素指定元素className最近的祖先元素
     * 
     * @method module:lib.getAncestorByClass
     * @param {(HTMLElement | string)} element 目标元素或目标元素的id
     * @param {string} className 祖先元素的class，只支持单个class
     *             
     * @return {?HTMLElement} 指定元素className最近的祖先元素，
     * 查找不到时返回null
     */
    /**
     * 获取目标元素指定元素className最近的祖先元素
     * 
     * @method module:lib.dom.getAncestorByClass
     * @param {(HTMLElement | string)} element 目标元素或目标元素的id
     * @param {string} className 祖先元素的class，只支持单个class
     *             
     * @return {?HTMLElement} 指定元素className最近的祖先元素，
     * 查找不到时返回null
     */
    lib.getAncestorByClass
        = lib.dom.getAncestorByClass
        = function (element, className) {

            return lib.getAncestorBy(
                element,
                lib.hasClass,
                className
            );
        };

    var hasClassList = 'classList' in document.documentElement;

    /**
     * 判断元素是否包含指定的 className
     * 
     * @method module:lib.hasClass
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要判断的 className
     * 
     * @return {boolean} 是否拥有指定的className
     */
    /**
     * 判断元素是否包含指定的 className
     * 
     * @method module:lib.dom.hasClass
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要判断的 className
     * 
     * @return {boolean} 是否拥有指定的className
     */
    lib.hasClass = lib.dom.hasClass = hasClassList
        ? function (element, className) {
            return element.classList.contains(className);
        }
        : function (element, className) {
            return lib.contains(element.className, className);
        };

    /**
     * 为目标元素添加 className
     * 
     * @method module:lib.addClass
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要添加的className
     * 
     * @return {HTMLElement} 目标元素 `element`
     */
    /**
     * 为目标元素添加 className
     * 
     * @method module:lib.dom.addClass
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要添加的className
     * 
     * @return {HTMLElement} 目标元素 `element`
     */
    lib.addClass = lib.dom.addClass = hasClassList
        ? function (element, className) {
            element.classList.add(className);
            return element;
        }
        : function (element, className) {
            if (!lib.hasClass(element, className)) {
                element.className += ' ' + className;
            }
            return element;
        };

    /**
     * 移除目标元素的 className
     * 
     * @method module:lib.removeClass
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要移除的 className
     * 
     * @return {HTMLElement} 目标元素
     */
    /**
     * 移除目标元素的 className
     * 
     * @method module:lib.dom.removeClass
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要移除的 className
     * 
     * @return {HTMLElement} 目标元素
     */
    lib.removeClass = lib.dom.removeClass = hasClassList
        ? function (element, className) {
            element.classList.remove(className);
            return element;
        }
        : function (element, className) {
            element.className = element.className.replace(
                new RegExp('(^|\\s)' + className + '(?:\\s|$)'),
                '$1'
            );
            return element;
        };


    /**
     * 切换目标元素的 className
     * 
     * @method module:lib.toggleClass
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要切换的 className
     * 
     * @return {HTMLElement} 目标元素
     */
    /**
     * 切换目标元素的 className
     * 
     * @method module:lib.dom.toggleClass
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要切换的 className
     * 
     * @return {HTMLElement} 目标元素
     */
    lib.toggleClass = lib.dom.toggleClass = hasClassList
        ? function (element, className) {
            element.classList.toggle(className);
            return element;
        }
        : function (element, className) {
            var originClass = element.className;
            var contains = originClass && lib.contains(element, className);
            element.className = contains
                ? originClass.replace(
                    new RegExp('(^|\\s)' + className + '(?:\\s|$)'),
                    '$1'
                )
                : (originClass + ' ' + className);
            return element;
        };

    /**
     * 显示目标元素
     * 
     * @method module:lib.show
     * @param {HTMLElement} element 目标元素
     * @param {?string=} value 指定 display 的值，默认为 'block'
     * @returns {HTMLElement} 目标元素
     */
    /**
     * 显示目标元素
     * 
     * @method module:lib.dom.show
     * @param {HTMLElement} element 目标元素
     * @param {?string=} value 指定 display 的值，默认为 'block'
     * @returns {HTMLElement} 目标元素
     */
    lib.show = lib.dom.show = function (element, value) {
        element.style.display = value || '';
        return element;
    };

    /**
     * 隐藏目标元素
     * 
     * @method module:lib.hide
     * @param {HTMLElement} element 目标元素
     * @returns {HTMLElement} 目标元素
     */
    /**
     * 隐藏目标元素
     * 
     * @method module:lib.dom.hide
     * @param {HTMLElement} element 目标元素
     * @returns {HTMLElement} 目标元素
     */
    lib.hide = lib.dom.hide = function (element) {
        element.style.display = 'none';
        return element;
    };

    /**
     * 获取计算样式值
     *
     * @method module:lib.getStyle
     * @param {HTMLElement} element 目标元素
     * @param {string} key 样式名称
     * 
     * @return {string} 样式的计算值
     */
    /**
     * 获取计算样式值
     *
     * @method module:lib.dom.getStyle
     * @param {HTMLElement} element 目标元素
     * @param {string} key 样式名称
     * 
     * @return {string} 样式的计算值
     */
    lib.getStyle = lib.dom.getStyle = function (element, key) {
        if (!element) {
            return '';
        }

        key = lib.camelCase(key);

        var doc = element.nodeType === 9 
            ? element 
            : element.ownerDocument || element.document;

        if (doc.defaultView && doc.defaultView.getComputedStyle) {
            var styles = doc.defaultView.getComputedStyle(element, null);
            if (styles) {
                return styles[key] || styles.getPropertyValue(key);
            }
        }
        else if (element && element.currentStyle) {
            return element.currentStyle[key];
        }
        return ''; 
    };


    /**
     * 获取元素的绝对坐标
     * 
     * @method module:lib.getPosition
     * 
     * @param {HTMLElement} element 目标元素
     * @return {Object} 包含 left 和 top 坐标值的对象
     */
    /**
     * 获取元素的绝对坐标
     * 
     * @method module:lib.dom.getPosition
     * 
     * @param {HTMLElement} element 目标元素
     * @return {Object} 包含 left 和 top 坐标值的对象
     */
    lib.getPosition = lib.dom.getPosition = function (element) {
        var bound = element.getBoundingClientRect();
        var root = document.documentElement;
        var body = document.body;

        var clientTop = root.clientTop || body.clientTop || 0;
        var clientLeft = root.clientLeft || body.clientLeft || 0;
        var scrollTop = window.pageYOffset || root.scrollTop;
        var scrollLeft = window.pageXOffset || root.scrollLeft;

        return {
            left: parseFloat(bound.left) + scrollLeft - clientLeft,
            top: parseFloat(bound.top) + scrollTop - clientTop
        };
    };

    /**
     * 设置元素样式
     * 
     * @method module:lib.setStyles
     * 
     * @param {HTMLElement} element 目标元素
     * @param {Object} properties 要设置的 CSS 属性
     */
    /**
     * 设置元素样式
     * 
     * @method module:lib.dom.setStyles
     * 
     * @param {HTMLElement} element 目标元素
     * @param {Object} properties 要设置的 CSS 属性
     */
    lib.setStyles = lib.dom.setStyles = function (element, properties) {
        for (var name in properties) {
            if (hasOwnProperty.call(properties, name)) {
                element.style[lib.camelCase(name)] = properties[name];
            }
        }
    };

    var guidCounter = 0x0917;

    /**
     * 得到 HTMLElement 的唯一标识
     * 
     * @method module:lib.guid
     * 
     * @param {HTMLElement} element 目标元素
     * @return {number} 唯一标识值
     */
    /**
     * 得到 HTMLElement 的唯一标识
     * 
     * @method module:lib.dom.guid
     * 
     * @param {HTMLElement} element 目标元素
     * @return {number} 唯一标识值
     */
    lib.guid = lib.dom.guid = function (element) {
        var guid = element.getAttribute('data-guid') | 0;

        // guid 不会等于 0
        if (!guid) {
            guid = guidCounter++;
            element.setAttribute('data-guid', guid);
        }
        return guid;
    };

    /**
     * DOM 步进遍历
     * 
     * @inner
     * @param {HTMLElement} element 当前元素
     * @param {string} walk 步进方式，如 previousSibling
     * @param {?string} start 开始元素节点选择
     * @param {?Function} match 对元素匹配的回调函数
     * @param {boolean} all 是否查找所有符合的元素
     * 
     * @return {(HTMLElement | Array.<HTMLElement> | null)} 匹配结果
     */
    var walk = function (element, walk, start, match, all) {
        var el = lib.g(element)[start || walk];
        var elements = [];
        while (el) {
            if (el.nodeType === 1 && (!match || match(el))) {
                if (!all) {
                    return el;
                }
                elements.push(el);
            }
            el = el[walk];
        }
        return (all) ? elements : null;
    };

    lib.extend(
        lib.dom,
        /** @lends lib.dom */
        {

            /**
             * 获取目标元素的上一个兄弟元素节点
             * 
             * @param {(HTMLElement | string)} element 目标元素或目标元素的 id
             * @param {?Function} match 对元素匹配的回调函数
             * 
             * @return {?HTMLElement} 目标元素的上一个兄弟元素节点，查找不到时返回 null
             */
            previous: function (element, match) {
                return walk(element, 'previousSibling', null, match);
            },


            /**
             * 获取目标元素的下一个兄弟元素节点
             * 
             * @method module:lib.dom.next
             * @param {(HTMLElement | string)} element 目标元素或目标元素的 id
             * @param {?Function} match 对元素匹配的回调函数
             * 
             * @return {?HTMLElement} 目标元素的下一个兄弟元素节点，查找不到时返回 null
             */
            next: function (element, match) {
                return walk(element, 'nextSibling', null, match);
            },

            /**
             * 获取目标元素的第一个元素节点
             * 
             * @method module:lib.dom.first
             * @grammar lib.dom.first(element)
             * @param {(HTMLElement | string)} element 目标元素或目标元素的 id
             * @param {?Function} match 对元素匹配的回调函数
             * @meta standard
             * 
             * @return {?HTMLElement} 目标元素的第一个元素节点，查找不到时返回 null
             */
            first: function (element, match) {
                return walk(element, 'nextSibling', 'firstChild', match);
            },

            /**
             * 获取目标元素的最后一个元素节点
             * 
             * @method module:lib.dom.last
             * @param {(HTMLElement | string)} element 目标元素或目标元素的 id
             * @param {?Function} match 对元素匹配的回调函数
             * 
             * @return {?HTMLElement} 目标元素的最后一个元素节点，查找不到时返回 null
             */
            last: function (element, match) {
                return walk(element, 'previousSibling', 'lastChild', match);
            },


            /**
             * 获取目标元素的所有子节点
             * 
             * @method module:lib.dom.children
             * @param {(HTMLElement | string)} element 目标元素或目标元素的 id
             * @param {?Function} match 对元素匹配的回调函数
             * 
             * @return {?Array} 目标元素的所有子节点，查找不到时返回 null
             */
            children: function (element, match) {
                return walk(element, 'nextSibling', 'firstChild', match, true);
            },

            /**
             * 判断一个元素是否包含另一个元素
             * 
             * @method  module:lib.dom.contains
             * @param {(HTMLElement | string)} container 包含元素或元素的 id
             * @param {(HTMLElement | string)} contained 被包含元素或元素的 id
             *             
             * @return {boolean} contained 是否被包含于 container 的 DOM 节点上
             */
            contains: function (container, contained) {
                var g = lib.g;
                container = g(container);
                contained = g(contained);

                //fixme: 无法处理文本节点的情况(IE)
                return container.contains
                    ? container !== contained && container.contains(contained)
                    : !!(contained.compareDocumentPosition(container) & 8);
            }
        }
    );

    return lib;
});
