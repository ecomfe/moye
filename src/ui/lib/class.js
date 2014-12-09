/**
 * @file 类/继续/接口相关的小工具
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var curry = require('./function').curry;
    var type = require('./type');
    var object = require('./object');

    var METHOD_CLASS_ATTR = '__class__';
    var METHOD_NAME_ATTR = '__name__';

    var classPool = {};

    /**
     * 注册类
     * @param  {Function} Class 类
     */
    function register(Class) {
        var proto = Class.prototype;
        // 如果proto中没有定义这个属性, 那么就把它当作匿名类, 忽略之
        if (!proto.hasOwnProperty('type') && !proto.hasOwnProperty('$class')) {
            return;
        }
        // 如果在原型中定义了$class属性, 那么把这个类记录到工厂类中
        var $class = proto.type || proto.$class;
        if (classPool[$class]) {
            throw new Error('Class "' + $class + '" is already defined');
        }
        classPool[$class] = Class;
    }

    /**
     * 扩展生成子类
     *
     * @inner
     * @param {Class}  ParentClass 父类
     * @param {Object} proto       扩展方法集合
     * @return {Class} 新的子类
     */
    function extend(ParentClass, proto) {
        // 构造连接prtotoype对象
        var SubClassProto = new Function();
        SubClassProto.prototype = ParentClass.prototype;
        var subClassProto = new SubClassProto();
        // 将子类的原型链方法合并到链接对象
        object.extend(subClassProto, proto);
        // 新建出一个子类, 其proto是上边构造的链接对象
        var SubClass = newClass(subClassProto);

        for (var name in subClassProto) {
            if (subClassProto.hasOwnProperty(name)
                && type.isFunction(subClassProto[name])
            ) {
                var method = subClassProto[name];
                method[METHOD_CLASS_ATTR] = SubClass;
                method[METHOD_NAME_ATTR] = name;
            }
        }

        // 附加父类属性
        SubClass.$parent = ParentClass;
        // 返回结果
        return SubClass;
    }

    /**
     * 扩展类方法
     *
     * @inner
     * @param {Class}  NewClass 要扩展的类
     * @param {Object} proto    扩展的方法集
     * @return {Class} 扩展后的类
     */
    function implement(NewClass, proto) {
        if (type.isFunction(proto)) {
            proto = proto.prototype;
        }
        object.extend(NewClass.prototype, proto);
        return NewClass;
    }

    /**
     * 执行祖先类原型链中的方法
     * @return {*} 祖先类接口的返回值
     */
    function parent() {
        var caller = this.$parent.caller;
        var name = caller[METHOD_NAME_ATTR];
        var ParentClass = caller[METHOD_CLASS_ATTR].$parent;
        while (ParentClass) {
            if (ParentClass.prototype.hasOwnProperty(name)) {
                var parentMethod = ParentClass.prototype[name];
                if (type.isFunction(parentMethod)) {
                    return ParentClass.prototype[name].apply(this, arguments);
                }
                throw new Error('parent method is not function');
            }
            else {
                ParentClass = ParentClass.$parent;
            }
        }
        throw new Error('no parent method');
    }

    /**
     * 创建新类
     *
     * @param  {Object}   proto 类的原型对象
     * @return {Function}       新类构造函数
     */
    function newClass(proto) {
        var Class = function () {
            return this.initialize
                ? this.initialize.apply(this, arguments)
                : this;
        };
        Class.extend = curry(extend, Class);
        Class.implement = curry(implement, Class);
        Class.prototype = proto || {};
        Class.prototype.constructor = Class;
        Class.prototype.$parent = parent;
        register(Class);
        return Class;
    }

    return {

        newClass: newClass,

        /**
         * 获取一个类
         * @param  {string} className 类名
         * @param  {string} spaceName 命名空间
         * @return {Function}
         */
        getClass: function (className) {
            return classPool[className];
        }

    };

});
