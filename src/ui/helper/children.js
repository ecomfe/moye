/**
 * @copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 子控件相关的小工具
 * @author Leon(ludafa@outlook.com)
 */

define(function (require) {

    var main = require('../main');
    var lib = require('../lib');


    return {

        /**
         * 初始化子控件
         *
         * @method module:Helper#initChildren
         * @return {module:Helper}
         */
        initChildren: function () {

            var control  = this.control;
            var context  = control.context;
            var children = main.init(control.main, context.properties, context);

            lib.each(children, function (child, id) {
                control.addChild(child, child.childName || id);
            });

            return this;

        },

        /**
         * 遍历子控件，对每次子控件做一个处理
         *
         * @method module:Helper#traversalChildren
         * @param  {Function} handler 处理函数
         * @return {module:Helper}
         */
        traversalChildren: function (handler) {

            var children = lib.slice(this.control.children);

            for (var i = 0, len = children.length; i < len; ++i) {
                handler.call(this, children[i], i);
            }

            return this;

        },

        /**
         * 销毁子控件
         *
         * @method module:Helper#disposeChildren
         * @return {module:Helper}
         */
        disposeChildren: function () {

            var control = this.control;

            this.traversalChildren(function (child) {
                child.dispose();
            });

            // 这里只是清空掉对子控件的引用, 不能将这两个属性设为null
            // 主控件可能后续还会继续存在
            control.children = [];
            control.childrenIndex = {};

            return this;

        },

        /**
         * 禁用子控件
         *
         * @method module:Helper#disableChildren
         * @return {module:Helper}
         */
        disableChildren: function () {

            return this.traversalChildren(function (child) {
                child.disable();
            });

        },

        /**
         * 启用子控件
         *
         * @method module:Helper#enableChildren
         * @return {module:Helper}
         */
        enableChildren: function () {

            return this.traversalChildren(function (child) {
                child.enable();
            });

        }

    };

});
