/**
 * @file 辅助类 DOM相关
 * @author leonlu <leonlu@outlook.com>
 * @date 2014-07-24
 */

define(function (require) {

    var lib = require('../lib');
    var main = require('../main');

    /**
     * 将参数用`-`连接成字符串
     *
     * @param {string} args 需要连接的串
     * @return {string}
     * @ignore
     */
    function joinByStrike() {
        return [].slice.call(arguments, 0).join('-');
    }

    // 自闭合的标签列表
    var SELF_CLOSING_TAGS = {
        area: true, base: true, br: true, col: true,
        embed: true, hr: true, img: true, input: true,
        keygen: true, link: true, meta: true, param: true,
        source: true, track: true, wbr: true
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
         * - `skin-{skin}`
         * - `skin-{skin}-{type}`
         *
         * 如果有`part`参数，则生成如下：
         *
         * - `ui-{type}-{part}`
         * - `skin-{skin}-{type}-{part}`
         *
         * @param {string?} part 部件名称
         * @return {string[]}
         */
        getPartClasses: function (part) {

            var control    = this.control;
            var type       = control.type.toLowerCase();
            var skin       = control.skin;
            var prefix     = main.getConfig('uiClassPrefix');
            var skinPrefix = main.getConfig('skinClassPrefix');
            var classes    = [];

            if (part) {
                classes.push(joinByStrike(prefix, type, part));
                if (skin) {
                    for (var i = 0, len = skin.length; i < len; i++) {
                        skin[i] && classes.push(
                            joinByStrike(skinPrefix, skin[i], type, part)
                        );
                    }
                }
            }
            else {
                classes.push(joinByStrike(prefix, type));
                if (skin) {
                    for (i = 0, len = skin.length; i < len; i++) {
                        skin[i] && classes.push(
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
         * 获取控件部件相关的主class字符串
         *
         * 如果不传递`part`参数，则生成如下：
         *
         * - `ui-{styleType}`
         *
         * 如果有`part`参数，则生成如下：
         *
         * - `ui-{styleType}-{part}`
         *
         * @param {string} [part] 部件名称
         * @return {string}
         */
        getPrimaryClassName: function (part) {
            var type = this.control.type.toLowerCase();
            return part
                ? joinByStrike(main.getConfig('uiClassPrefix'), type, part)
                : joinByStrike(main.getConfig('uiClassPrefix'), type);
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
                joinByStrike(main.getConfig('uiClassPrefix'), type, state),
                joinByStrike(main.getConfig('stateClassPrefix'), state)
            ];

            var skin = this.control.skin;
            if (skin) {
                var skinPrefix = main.getConfig('skinClassPrefix');
                for (var i = 0, len = skin.length; i < len; i++) {
                    skin[i] && classes.push(
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
         * @param {string} part 部件名称
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
            return lib.g(this.getPartId(part));
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
         * 获取部件的起始标签
         *
         * @param {string} part 部件名称
         * @param {string} nodeName 部件使用的元素类型
         * @param {Object} attributes 属性值们
         * @return {string}
         */
        getPartBeginTag: function (part, nodeName, attributes) {

            attributes = attributes
                ? lib
                    .map(attributes, function (value, name) {
                        return name + '="' + value + '"';
                    })
                    .join(' ')
                : '';

            var html = ''
                + '<' + nodeName + ' '
                // 这个用于直接取部件
                +     'id="' + this.getPartId(part) + '" '
                // 这里用于做部件辨识
                +     'data-part="' + part + '"'
                // 这个当然就是做样式啦
                +     'class="' + this.getPartClassName(part) + '"'
                // 附加属性
                +     attributes
                // 如果是自闭合标签, 那么这里不添加开始标签结束符
                +  (SELF_CLOSING_TAGS.hasOwnProperty(nodeName) ? '' : '>');

            return html;
        },

        /**
         * 获取部件的结束标签
         *
         * @param {string} part 部件名称
         * @param {string} nodeName 部件使用的元素类型
         * @param {Object} attributes 属性值们
         * @return {string}
         */
        getPartEndTag: function (part, nodeName) {
            var html = SELF_CLOSING_TAGS.hasOwnProperty(nodeName)
                ? ' />'
                : '</' + nodeName + '>';
            return html;
        },

        /**
         * 获取部件的HTML模板
         *
         * @param {string} part 部件名称
         * @param {string} nodeName 部件使用的元素类型
         * @param {string} content innerHTML
         * @param {Object} attributes 属性值们
         * @return {string}
         */
        getPartHTML: function (part, nodeName, content, attributes) {
            nodeName = nodeName || 'div';
            return this.getPartBeginTag(part, nodeName, attributes)
                + (content || '')
                + this.getPartEndTag(part, nodeName);
        },

        /**
         * 创建一个部件元素
         *
         * @param {string} part 部件名称
         * @param {string} [nodeName="div"] 使用的元素类型
         * @param {string} content innerHTML
         * @param {Object} attributes 属性值们
         * @return {Element}
         */
        createPart: function (part, nodeName, content, attributes) {
            return $('<' + (nodeName || 'div') + '>')
                .attr(attributes || {})
                .attr('id', this.getPartId(part))
                .data('part', part)
                .addClass(this.getPartClassName(part))
                .html(content)
                .get(0);
        }

    };
});

