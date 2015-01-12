/**
 * @file 控件上下文
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var pool = {};
    var guid = 0x5472982f;

    function getGUID(id) {
        id = id || guid++;
        while (id in pool) {
            id = guid++;
        }
        return id;
    }

    /**
     * 控件上下文
     * @param {string} id 上下文id
     * @constructor
     */
    function Context(id) {
        // 保证id不与已存在的Context冲突
        this.id = getGUID(id);
        this.controls = {};
        this.properties = {};
    }

    /**
     * 获取指定id的控件实例
     * @param  {string} controlId 控件id
     * @return {Control}
     */
    Context.prototype.get = function (controlId) {
        return this.controls[controlId];
    };

    /**
     * 将控件添加到上下文中
     * @param {Control} control 控件
     * @return {Context}
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
     * @param  {Control} control 控件
     * @return {Context}
     */
    Context.prototype.remove = function (control) {
        delete this.controls[control.id];
        return this;
    };

    /**
     * 填充若干个控件的属性
     * @param {Object} properties 属性名和属性值
     * @return {Context}
     */
    Context.prototype.fill = function (properties) {
        $.extend(true, this.properties, properties || {});
        return this;
    };

    return {

        /**
         * 指定的对象是否为一个Context实例
         * @param  {*} context 待检测对象
         * @return {boolean}
         */
        isContext: function (context) {
            return context instanceof Context;
        },

        /**
         * 获取指定id的上下文
         * @param  {string} id 上下文id
         * @return {Context}
         */
        get: function (id) {
            return pool[id] || null;
        },

        /**
         * 生成一个上下文
         * @param  {string} id 上下文id
         * @return {Context}
         */
        create: function (id) {
            var context = new Context(id);
            pool[context.id] = context;
            return context;
        }

    };

});
