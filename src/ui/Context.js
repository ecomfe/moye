/**
 * @copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 控件上下文
 * @author Leon(ludafa@outlook.com)
 *
 * @module Context
 */

define(function (require) {

    var lib = require('./lib');
    var pool = {};
    var guid = 0x5472982f;

    /**
     * 如果指定的id不与现有的id冲突，那么使用它；否则生成一个新的随机id
     *
     * @inner
     * @param  {string} id 指定的id
     * @return {string}
     */
    function getGUID(id) {
        id = id || guid++;
        while (id in pool) {
            id = guid++;
        }
        return id;
    }

    /**
     * 控件上下文
     *
     * @param {string} id 上下文id
     * @constructor
     */
    function Context(id) {

        /**
         * @member {string} id 标识
         */
        this.id = getGUID(id);


        /**
         * @member {Object} controls 标识
         */
        this.controls = {};

        /**
         * @member {Object} properties
         */
        this.properties = {};

    }

    /**
     * 获取指定id的控件实例
     *
     * @public
     * @param  {string}  controlId 控件id
     * @return {module:Control}
     */
    Context.prototype.get = function (controlId) {
        return this.controls[controlId];
    };

    /**
     * 将控件添加到上下文中
     *
     * @public
     * @param {module:Control} control 控件
     * @return {module:Context}
     */
    Context.prototype.add = function (control) {
        var id = control.id;
        this.controls[id] = control;

        // 一旦控件加入了一个上下文,
        // 那么上下文中缓存的配置已经被控件使用, 清除掉上下文中的属性配置
        delete this.properties[id];
        return this;
    };

    /**
     * 将一个控件从上下文中移除
     *
     * @public
     * @param  {module:Control} control 控件
     * @return {module:Context}
     */
    Context.prototype.remove = function (control) {
        delete this.controls[control.id];
        return this;
    };

    /**
     * 填充若干个控件的属性
     *
     * @public
     * @param {Object} properties 属性名和属性值
     * @return {module:Context}
     */
    Context.prototype.fill = function (properties) {
        lib.extend(this.properties, properties || {});
        return this;
    };

    return {

        /**
         * 指定的对象是否为一个Context实例
         *
         * @public
         * @method module:Context.isContext
         * @param  {*}      context 待检测对象
         * @return {boolean}
         */
        isContext: function (context) {
            return context instanceof Context;
        },

        /**
         * 获取指定id的上下文
         *
         * @public
         * @method module:Context.get
         * @param  {string}  id 上下文id
         * @return {module:Context}
         */
        get: function (id) {
            return pool[id];
        },

        /**
         * 生成一个上下文
         *
         * @public
         * @method module:Context.create
         * @param  {string}  id 上下文id
         * @return {module:Context}
         */
        create: function (id) {
            var context = new Context(id);
            pool[context.id] = context;
            return context;
        }

    };

});
