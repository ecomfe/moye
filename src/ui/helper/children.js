/**
 * @file 子控件相关的小工具
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var main = require('../main');
    var lib = require('../lib');

    function traversalChildren(children, action) {
        children = lib.slice(children);
        for (var i = children.length - 1; i >= 0; i--) {
            children[i][action]();
        }
    }

    return {

        /**
         * 初始化子控件
         */
        initChildren: function () {
            var control  = this.control;
            var context  = control.context;
            var children = main.init(control.main, context.properties, context);

            lib.each(children, function (child, id) {
                control.addChild(child, child.childName || id);
            });

        },

        /**
         * 销毁子控件
         */
        disposeChildren: function () {
            var control = this.control;
            traversalChildren(control.children, 'dispose');
            // 这里只是清空掉对子控件的引用, 不能将这两个属性设为null
            // 主控件可能后续还会继续存在
            control.children = [];
            control.childrenIndex = {};
        },

        /**
         * 禁用子控件
         */
        disableChildren: function () {
            traversalChildren(this.control.children, 'disable');
        },

        /**
         * 启用子控件
         */
        enableChildren: function () {
            traversalChildren(this.control.children, 'enable');
        }

    };

});
