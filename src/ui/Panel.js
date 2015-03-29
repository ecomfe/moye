/**
 * @file Panel控件
 * @author Leon(lupengyu@baidu)
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var Control = require('./Control');
    var painter = require('./painter');

    /**
     * 面板控件
     *
     * @extends module:Control
     * @exports Panel
     */
    var Panel = Control.extend(/** @lends module:Panel.prototype */{

        /**
         * 控件类型
         *
         * @readonly
         * @type {string}
         */
        type: 'Panel',

        /**
         * 重渲染
         *
         * @method
         * @protected
         * @override
         */
        repaint: painter.createRepaint(
            Control.prototype.repaint,
            {
                /**
                 * @property {string} content
                 *
                 * 面板的内容，为一个HTML片段
                 *
                 * 此属性中可包含 Moye 相关的属性，在设置内容后，
                 * 会使用{@link module:Helper#initChildren}进行内部控件的初始化
                 */
                name: 'content',
                paint: function (conf, content) {
                    // 第一次刷新的时候是可能没有`content`的，
                    // 这时在`innerHTML`上就地创建控件，不要刷掉内容，
                    // 后续有要求`content`是字符串，所以不管非字符串的后果
                    var helper = this.helper;
                    if (content != null) {
                        helper.disposeChildren();
                        this.main.innerHTML = content;
                    }
                    helper.initChildren();
                }
            }
        ),

        /**
         * 启用面板
         *
         * @public
         */
        enable: function () {
            this.$parent();
            this.helper.enableChildren();
        },

        /**
         * 禁用面板
         *
         * @public
         */
        disable: function () {
            this.$parent();
            this.helper.disableChildren();
        },

        /**
         * 设置面板内容
         *
         * @public
         * @param {string} html 内容HTML，具体参考{@link module:Panel#content}属性的说明
         */
        setContent: function (html) {
            this.set('content', html);
        }

    });

    return Panel;
});
