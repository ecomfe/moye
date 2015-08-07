/**
 * @copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 插件相关的小工具
 * @author Leon(ludafa@outlook.com)
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
         * @method module:Helper#createPluginInstance
         * @param  {(string | Function | Object)} conf 配置
         * @return {module:Plugin}
         */
        createPluginInstance: function (conf) {

            var PluginClass;
            var options = {};

            // 如果conf是一个Plugin的实例，那么就直接返回了...
            if (conf instanceof Plugin) {
                return conf;
            }

            var type = lib.typeOf(conf);

            // 如果是一个函数, 那么我们把它成构造函数来耍
            if (type === 'function') {
                PluginClass = conf;
            }
            // 如果是一个字符串, 那么我们去尝试找一下这个类型
            else if (type === 'string') {
                PluginClass = lib.getClass(conf);
            }
            // 如果是一个对象, 那么我们按这个格式来解析
            // {type: 'PluginClassName', options: { ... }}
            else if (type === 'object') {
                PluginClass = lib.getClass(conf.type);
                options = conf.options || options;
            }

            if (!PluginClass) {
                throw new Error('moye Plugin [' + conf + '] cannot found');
            }

            return new PluginClass(options);
        },

        /**
         * 初始化插件
         *
         * @method module:Helper#initPlugins
         * @return {module:Helper}
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

            return this;

        },

        /**
         * 遍历插件，对其执行一定的操作
         *
         * @method module:Helper#traversalPlugins
         * @param  {Function} handler 处理函数
         * @return {module:Helper}
         */
        traversalPlugins: function (handler) {
            var plugins = this.control.plugins;

            if (plugins) {
                for (var i = plugins.length - 1; i >= 0; i--) {
                    handler.call(this, plugins[i]);
                }
            }

            return this;
        },

        /**
         * 激活插件
         *
         * @method module:Helper#activatePlugins
         * @return {module:Helper}
         */
        activatePlugins: function () {
            return this.traversalPlugins(function (plugin) {
                plugin.activate();
            });
        },

        /**
         * 禁用插件
         *
         * @method module:Helper#inactivatePlugins
         * @return {module:Helper}
         */
        inactivatePlugins: function () {
            return this.traversalPlugins(function (plugin) {
                plugin.inactivate();
            });
        },

        /**
         * 销毁插件
         *
         * @method module:Helper#disposePlugins
         * @return {module:Helper}
         */
        disposePlugins: function () {

            this.traversalPlugins(function (plugin) {
                plugin.inactivate();
                plugin.dispose();
            });

            this.control.plugins = [];

            return this;
        }

    };

});
