/**
 * @copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file moye主入口
 * @author Leon(ludafa@outlook.com)
 * @module main
 */

define(function (require) {

    var lib = require('./lib');
    var Context = require('./Context');

    /**
     * 控件库配置数据
     *
     * @type {Object}
     * @inner
     */
    var config = {

        // 配置属性前缀
        uiPrefix: 'data-ui',

        // 在渲染后, 我们会给main元素添加此属性, 其值为设定的id值
        instanceAttr: 'data-ctrl-id',

        // 主样式前缀
        uiClassPrefix: 'ui',

        // 皮肤样式前缀
        skinClassPrefix: 'skin',

        // 状态样式前缀
        stateClassPrefix: 'state',

        // 上下文属性名
        contextAttr: 'data-ctrl-context'
    };

    var defaultContext = Context.create('default');


    var exports = {

        /**
         * 依照配置, 初始化指定元素中的所有moye组件
         *
         * @public
         * @param  {Element} container  容器元素
         * @param  {Object}  properties 配置
         * @param  {module:Context} context    上下文
         * @return {Object}  容器内所有被初始化的组件实例
         */
        init: function (container, properties, context) {

            var confAttr = config.uiPrefix + '-id';
            var controls = {};

            // 先将参数放到上下文中存储起来
            context = context || defaultContext;
            context.fill(properties);


            $('[' + confAttr + ']', container).each(function (i, element) {

                var id         = element.getAttribute(confAttr);
                var instanceId = element.getAttribute(config.instanceAttr);

                // 元素上没有id标识, 或者已经有了实例ID标识, 跳过
                if (!id || instanceId) {
                    return;
                }

                var conf = properties[id];

                // 如果没有配置项, 跳过
                if (!conf) {
                    return;
                }

                var type = conf.type;

                // 如果配置项中没有指定`type`, 跳过
                if (!type) {
                    throw new Error('you should specify a type to `' + id + '`');
                }

                // 生成参数
                var options = $.extend(
                    // 整体配置的context优先级低于具体控件的配置
                    {
                        context: context
                    },
                    // 每个控件的配置
                    conf,
                    // 由于这两个属性是由DOM来决定的, 优先级最高
                    {
                        id: id,
                        main: element
                    }
                );

                // 生成控件实例
                var control = exports.create(type, options);

                // 渲染控件
                control.render();
                controls[id] = control;

            });

            return controls;
        },

        /**
         * 新建一个控件实例
         *
         * @public
         * @param  {string} type    控件类型
         * @param  {Object} options 控件参数
         * @return {module:Control}
         */
        create: function (type, options) {
            var Class = lib.getClass(type);
            if (!Class) {
                throw new Error('Class ' + type + ' not found');
            }
            delete options.type;
            return new Class(options);
        },

        /**
         * 获取指定Id的控件
         *
         * @public
         * @param  {string} instanceId 控件id
         * @return {module:Control}
         */
        get: function (instanceId) {
            return defaultContext.get(instanceId);
        },

        /**
         * 通过一个DOM元素(通常是控件的主元素)来获取控件实例
         *
         * @public
         * @param {Element} dom 控件主元素
         * @return {module:Control}
         */
        getControlByDOM: function (dom) {
            dom = $(dom);
            var instanceId = dom.attr(config.instanceAttr);

            if (!instanceId) {
                return;
            }

            var contextId = dom.attr(config.contextAttr);

            if (!contextId) {
                return;
            }

            var context = exports.getContext(contextId);

            if (!context) {
                return;
            }

            return context.get(instanceId);
        },

        /**
         * 获取上下文环境
         *
         * 如果未指定上下文环境id, 则返回默认上下文
         *
         * @public
         * @param  {string} contextId 上下文ID
         * @return {module:Context}
         */
        getContext: function (contextId) {
            return contextId ? Context.get(contextId) : defaultContext;
        },

        /**
         * 取配置
         *
         * @public
         * @param  {string} name 配置属性名
         * @return {*}
         */
        getConfig: function (name) {
            return config[name];
        },

        /**
         * 设定配置
         *
         * @public
         * @param {string} name  配置属性名
         * @param {*}      value 配置属性值
         * @return {module:Control}
         */
        setConfig: function (name, value) {
            config[name] = value;
            return this;
        }

    };

    return exports;
});
