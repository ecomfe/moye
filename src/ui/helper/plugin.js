/**
 * @file 插件相关的小工具
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var lib = require('../lib');
    var Plugin = require('../plugin/Plugin');

    return {

        /**
         * 创建一个插件实例
         *
         * 天的这边海的那边有一群蓝精灵...各种重载...
         *
         * @param  {string|Function|Object} conf 配置
         * @return {Plugin}
         */
        createPluginInstance: function (conf) {

            var PluginClass;
            var type;
            var options = {};

            // 如果conf是一个对象, 并且有activate的主接口
            // 那么我们认为它是一个Plugin实例, 那么就直接返回了...
            if (conf instanceof Plugin) {
                return conf;
            }

            // 如果是一个函数, 那么我们把它成构造函数来耍
            else if (lib.isFunction(conf)) {
                PluginClass = conf;
            }
            // 如果是一个字符串, 那么我们去尝试找一下这个类型
            else if (lib.isString(conf)) {
                type = conf;
                PluginClass = lib.getClass(conf);
            }
            // 如果是一个对象, 那么我们按这个格式来解析
            // {type: 'PluginClassName', options: { ... }}
            else if (lib.isObject(conf)) {
                type = conf.type;
                PluginClass = lib.getClass(conf.type);
                options = conf.options || options;
            }

            if (!PluginClass) {
                throw new Error('Moye Plugin [' + conf + '] cannot found');
            }

            return new PluginClass(options);
        },

        /**
         * 初始化插件
         */
        initPlugins: function () {

            var control = this.control;
            var plugins = control.plugins;

            if (!plugins || !plugins.length) {
                return;
            }

            control.plugins = lib.map(
                plugins,
                function (conf) {
                    var plugin = this.createPluginInstance(conf);
                    plugin.activate(control);
                    return plugin;
                },
                this
            );

        },

        /**
         * 激活插件
         */
        activatePlugins: function () {
            var plugins = this.control.plugins;
            for (var i = plugins.length - 1; i >= 0; i--) {
                plugins[i].activate();
            }
        },

        /**
         * 禁用插件
         */
        inactivatePlugins: function () {
            var plugins = this.control.plugins;
            for (var i = plugins.length - 1; i >= 0; i--) {
                plugins[i].inactivate();
            }
        },

        /**
         * 销毁插件
         */
        disposePlugins: function () {
            var control = this.control;
            var plugins = control.plugins || [];
            for (var i = plugins.length - 1; i >= 0; i--) {
                plugins[i].inactivate();
                plugins[i].dispose();
            }
            control.plugins = [];
        }

    };

});
