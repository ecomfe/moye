/**
 * @file 生命周期辅助工具
 * @author leon <leonlu@outlook.com>
 */

define(function (require) {

    var main = require('../main');
    var Context = require('../Context');

    var LIFE_CYCLE = {
        NEW: 0,
        INITED: 1,
        RENDERED: 2,
        DISPOSED: 4
    };

    return {

        /**
         * 判断控件是否处于相应的生命周期阶段
         *
         * @param {string} stage 生命周期阶段
         * @private
         * @return {boolean}
         */
        isInStage: function (stage) {
            if (LIFE_CYCLE[stage] == null) {
                throw new Error('Invalid life cycle stage: ' + stage);
            }
            return this.stage === LIFE_CYCLE[stage];
        },

        /**
         * 改变控件的生命周期阶段
         *
         * @param {string} stage 生命周期阶段
         * @return {Control}
         */
        changeStage: function (stage) {
            if (LIFE_CYCLE[stage] === null) {
                throw new Error('Invalid life cycle stage: ' + stage);
            }
            this.stage = LIFE_CYCLE[stage];
            return this;
        },

        /**
         * 初始化上下文
         * @return {Control}
         */
        initContext: function () {
            var control = this.control;
            var context = control.context;

            // 如果参数中指定了一个context属性, 但它的值不是一个Context
            // 那么在这里尝试找到指定的那个Context, 默认会使用main中定义的默认上下文
            if (!(Context.isContext(context))) {
                context = Context.get(context) || main.getContext();
            }

            // 设定context
            control.context = null;
            control.setContext(context);
            return this;
        },

        /**
         * 销毁控件
         */
        dispose: function () {
            // TODO 会把Control.prototype.dispose中的实现移动到这里来
        }

    };

});

