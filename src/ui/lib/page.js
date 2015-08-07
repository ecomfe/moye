/**
 * @copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 窗口相关的小工具
 * @author Leon(ludafa@outlook.com)
 */

define(function (require) {

    /**
     * 获取文档的兼容根节点
     *
     * @inner
     * @param  {?Element=} el 节点引用，跨 frame 时需要
     * @return {Element}      兼容的有效根节点
     */
    function getCompatElement(el) {
        var doc = el && el.ownerDocument || document;
        var compatMode = doc.compatMode;

        return !compatMode || compatMode === 'CSS1Compat'
            ? doc.documentElement
            : doc.body;
    }

    return {

        /**
         * 获取横向滚动量
         *
         * @public
         * @method module:lib.getScrollLeft
         * @return {number} 横向滚动偏移量
         */
        getScrollLeft: function () {
            return window.pageXOffset || getCompatElement().scrollLeft;
        },

        /**
         * 获取纵向滚动量
         *
         * @public
         * @method module:lib.getScrollLeft
         * @return {number} 纵向滚动偏移量
         */
        getScrollTop: function () {
            return window.pageYOffset || getCompatElement().scrollTop;
        },

        /**
         * 获取页面视觉区域宽度
         *
         * @public
         * @method module:lib.getViewWidth
         * @return {number} 页面视觉区域宽度
         */
        getViewWidth: function () {
            return getCompatElement().clientWidth;
        },

        /**
         * 获取页面视觉区域高度
         *
         * @public
         * @method module:lib.getViewHeight
         * @return {number} 页面视觉区域高度
         */
        getViewHeight: function () {
            return getCompatElement().clientHeight;
        }

    };
});
