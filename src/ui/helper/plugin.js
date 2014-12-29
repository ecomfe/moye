/**
 * @file 插件相关的小工具
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {
    return {

        /**
         * 初始化插件
         */
        initPlugins: function () {
            var control = this.control;
            var plugins = control.plugins;
            if (!plugins || !plugins.length) {
                return;
            }
            for (var i = 0, len = plugins.length; i < len; i++) {
                plugins[i].activate(control);
            }
        },

        /**
         * 激活插件
         */
        activatePlugins: function () {
            var plugins = this.control.plugins;
            for (var i = plugins.length - 1; i >= 0; i--) {
                plugins[i].activate();
            };
        },

        /**
         * 禁用插件
         */
        inactivatePlugins: function () {
            var plugins = this.control.plugins;
            for (var i = plugins.length - 1; i >= 0; i--) {
                plugins[i].inactivate();
            };
        },

        /**
         * 销毁插件
         */
        disposePlugins: function () {
            var control = this.control;
            var plugins = control.plugins;
            for (var i = plugins.length - 1; i >= 0; i--) {
                plugins[i].dispose();
            };
            contorl.plugins = [];
        }

    };
});
