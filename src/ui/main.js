/**
 * @file MOYE主入口
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var lib = require('./lib');
    var Context = require('./Context');

    /**
     * 控件库配置数据
     *
     * @type {Object}
     * @ignore
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
         * 依照配置, 初始化指定元素中的所有MOYE组件
         * @param  {Element} container  容器元素
         * @param  {Object}  properties 配置
         * @param  {Context} context    上下文
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
                    return;
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

                // 如果没有成功创建实例, 跳过
                if (!control) {
                    return;
                }

                // 渲染控件
                try {
                    control.render();
                    controls[id] = control;
                }
                // 捕捉渲染异常, 处理后抛出
                catch (ex) {
                    var error = new Error(
                        'Render control '
                            + '"' + (control.id || 'anonymous') + '" '
                            + 'of type ' + control.type + ' '
                            + 'failed because: '
                            + ex.message
                    );
                    error.actualError = ex;
                    throw error;
                }

            });

            return controls;
        },

        /**
         * 新建一个控件实例
         * @param  {string} type    控件类型
         * @param  {Object} options 控件参数
         * @return {Control}
         */
        create: function (type, options) {
            var Class = lib.getClass(type);
            if (!Class) {
                return null;
            }
            delete options.type;
            return new Class(options);
        },

        /**
         * 获取指定Id的控件
         * @param  {string} instanceId 控件id
         * @return {[type]}            [description]
         */
        get: function (instanceId) {
            return defaultContext.get(instanceId);
        },

        /**
         * 通过一个DOM元素(通常是控件的主元素)来获取控件实例
         * @param {Element} dom 控件主元素
         * @return {Control}
         */
        getControlByDOM: function (dom) {
            dom = $(dom);
            var instanceId = dom.attr(config.instanceAttr);

            if (!instanceId) {
                return null;
            }

            var contextId = dom.attr(config.contextAttr);

            if (!contextId) {
                return null;
            }

            var context = exports.getContext(contextId);
            return context ? context.get(instanceId) : null;
        },

        /**
         * 获取上下文环境
         *
         * 如果未指定上下文环境id, 则返回默认上下文
         *
         * @param  {string} contextId 上下文ID
         * @return {Context}
         */
        getContext: function (contextId) {
            return contextId ? Context.get(contextId) : defaultContext;
        },

        /**
         * 取配置
         * @param  {string} name 配置属性名
         * @return {*}
         */
        getConfig: function (name) {
            return config[name];
        },

        /**
         * 设定配置
         * @param {string} name  配置属性名
         * @param {*}      value 配置属性值
         * @return {Control}
         */
        setConfig: function (name, value) {
            config[name] = value;
            return this;
        }

    };

    return exports;
});
