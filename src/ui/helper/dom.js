/**
 * @file 辅助类 DOM相关
 * @author leonlu <leonlu@outlook.com>
 * @date 2014-07-24
 */
define(function (require) {

    var lib = require('../lib');

    /**
     * 将参数用`-`连接成字符串
     *
     * @param {string...} args 需要连接的串
     * @return {string}
     * @ignore
     */
    function joinByStrike() {
        return [].slice.call(arguments, 0).join('-');
    }

    /**
     * 控件库配置数据
     *
     * @type {Object}
     * @ignore
     */
    var config = {
        uiPrefix: 'data-ui',
        instanceAttr: 'data-ctrl-id',
        uiClassPrefix: 'ui',
        skinClassPrefix: 'skin',
        stateClassPrefix: 'state',
        domIDPrefix: ''
    };

    return {
        /**
         * 获取控件部件相关的class数组
         * 
         * esui简化版本
         *
         * 如果不传递`part`参数，则生成如下：
         *
         * - `ui-{type}`
         * - `skin-{type}`
         *
         * 如果有`part`参数，则生成如下：
         *
         * - `ui-{type}-{part}`
         * - `skin-{type}-{part}`
         *
         * @param {string?} part 部件名称
         * @return {string[]}
         */
        getPartClasses: function (part) {

            var control    = this.control;
            var type       = control.type.toLowerCase();
            var skin       = control.skin;
            var prefix     = config.uiClassPrefix;
            var skinPrefix = config.skinClassPrefix;
            var classes    = [];

            if (part) {
                classes.push(joinByStrike(prefix, type, part));
                if (skin) {
                    for (var i = 0, len = skin.length; i < len; i++) {
                        classes.push(joinByStrike(skinPrefix, skin[i], type, part));
                    }
                }
            }
            else {
                classes.push(joinByStrike(prefix, type));
                if (skin) {
                    for (var i = 0, len = skin.length; i < len; i++) {
                        classes.push(
                            joinByStrike(skinPrefix, skin[i]),
                            joinByStrike(skinPrefix, skin[i], type)
                        );
                    }
                }
            }

            return classes;
        },

        /**
         * 获取控件部件相关的class字符串，具体可参考{@link lib#getPartClasses}方法
         *
         * @param {string} [part] 部件名称
         * @return {string}
         */
        getPartClassName: function (part) {
            return this.getPartClasses(part).join(' ');
        },

        /**
         * 添加控件部件相关的class，具体可参考{@link lib#getPartClasses}方法
         *
         * @param {string} [part] 部件名称
         * @param {HTMLElement | string} [element] 部件元素或部件名称，默认为主元素
         */
        addPartClasses: function (part, element) {

            if (typeof element === 'string') {
                element = this.getPart(element);
            }

            element = element || this.control.main;

            if (!element) {
                return;
            }

            var classes = this.getPartClassName(part);

            $(element).addClass(classes);

        },

        /**
         * 移除控件部件相关的class，具体可参考{@link lib#getPartClasses}方法
         *
         * @param {string} [part] 部件名称
         * @param {HTMLElement | string} [element] 部件元素或部件名称，默认为主元素
         */
        removePartClasses: function (part, element) {

            if (typeof element === 'string') {
                element = this.getPart(element);
            }

            element = element || this.control.main;

            if (!element) {
                return;
            }

            var classes = this.getPartClassName(part);

            $(element).removeClass(classes);

        },


        /**
         * 获取控件状态相关的class数组
         *
         * 生成如下：
         *
         * - `ui-{type}-{state}`
         * - `state-{state}`
         * - `skin-{skin}-{state}`
         * - `skin-{skin}-{type}-{state}`
         *
         * @param {string} state 状态名称
         * @return {string[]}
         */
        getStateClasses: function (state) {
            var type = this.control.type.toLowerCase();
            var classes = [
                joinByStrike(config.uiClassPrefix, type, state),
                joinByStrike(config.stateClassPrefix, state)
            ];

            var skin = this.control.skin;
            if (skin) {
                var skinPrefix = config.skinClassPrefix;
                for (var i = 0, len = skin.length; i < len; i++) {
                    classes.push(
                        joinByStrike(skinPrefix, skin[i], state),
                        joinByStrike(skinPrefix, skin[i], type, state)
                    );
                }
                
            }
            return classes;
        },

        /**
         * 获取控件的状态样式字符串，具体可参考{@link lib#getStateClasses}方法
         *
         * @param {string} [part] 部件名称
         * @return {string}
         */
        getStateClassName: function (part) {
            return this.getStateClasses(part).join(' ');
        },

        /**
         * 添加控件状态相关的class，具体可参考{@link lib#getStateClasses}方法
         *
         * @param {string} state 状态名称
         */
        addStateClasses: function (state) {
            var element = this.control.main;
            if (!element) {
                return;
            }
            var classes = this.getStateClassName(state);
            $(element).addClass(classes);
        },

        /**
         * 移除控件状态相关的class，具体可参考{@link lib#getStateClasses}方法
         *
         * @param {string} state 状态名称
         */
        removeStateClasses: function (state) {
            var element = this.control.main;
            if (!element) {
                return;
            }

            var classes = this.getStateClassName(state);
            $(element).removeClass(classes);
        },

        /**
         * 获取指定部件的DOM元素
         *
         * @param {string} part 部件名称
         * @return {HTMLElement}
         */
        getPart: function (part) {
            return lib.g(this.getId(part));
        },

        /**
         * 获取用于控件DOM元素的id
         * 
         * 控件ID: ctrl-{type}-{id}
         * 控件部件ID: ctrl-{type}-{id}-{part}
         * @param {string} [part] 部件名称，如不提供则生成控件主元素的id
         * @return {string}
         */
        getPartId: function (part) {
            var control = this.control;

            return '' 
                + 'ctrl-' + control.type.toLowerCase() 
                + '-' + control.id 
                + (part ? '-' + part : '');
        },

        /**
         * 创建一个部件元素
         *
         * @param {string} part 部件名称
         * @param {string} [nodeName="div"] 使用的元素类型
         */
        createPart: function (part, nodeName) {
            var element = document.createElement(nodeName || 'div');
            element.id = this.getPartId(part);
            this.addPartClasses(part, element);
            return element;
        }
    };
});

