/**
 * @file Panel控件
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {

    var Control = require('./Control');
    var painter = require('./painter');

    var Panel = Control.extend({
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
                 * 此属性中可包含ESUI相关的属性，在设置内容后，
                 * 会使用{@link Helper#initChildren}进行内部控件的初始化
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

        enable: function () {
            this.$parent();
            this.helper.enableChildren();
        },

        disable: function () {
            this.$parent();
            this.helper.disableChildren();
        }

    });

    return Panel;
});
