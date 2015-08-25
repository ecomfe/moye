/**
 * @file 全屏幕遮罩层
 * @author Leon(ludafa@outlook.com)
 */

define(function (require) {

    var $       = require('jquery');
    var Control = require('./Control');
    var lib     = require('./lib');

    var FIXED_POSTION = {
        right: 0,
        bottom: 0,
        left: 0,
        top: 0
    };

    /**
     * 当前已经生成的Mask个数
     *
     * @type {number}
     */
    var currentMaskCount = 0;

    /**
     * 遮罩层管理类，提供遮罩层的操作函数
     * @module Mask
     */
    var Mask = Control.extend({

        type: 'mask',

        options: {
            level: 10
        },

        init: function (options) {
            this.$parent(options);
            currentMaskCount++;
        },

        initStructure: function () {

            var level = this.level;

            if (lib.browser.ie6) {

                var html = this.helper.getPartHTML(
                    'ie6frame',
                    'iframe',
                    '',
                    {
                        src: 'about:blank',
                        frameborder: '0',
                        style: ''
                            + 'z-index:' + (level - 1) + ';'
                            + 'display:none;'
                            + 'filter:alpha(opacity=0);'
                    }
                );

                this.ie6frame = $(html).appendTo(document.body).get(0);

            }

            $(this.main)
                .appendTo(document.body)
                .css('zIndex', level);

        },

        initEvents: function () {
            this.delegate(this.main, 'click', this.onClick);
        },

        onClick: function (e) {
            this.fire(e);
        },

        /**
         * 重新绘制遮盖层的位置
         */
        repaint: require('./painter').createRepaint(
            Control.prototype.repaint,
            {
                name: ['visible'],
                paint: function (conf, visible) {

                    if (!visible) {
                        $(this.ie6frame).hide();
                        this.removeState('visible');
                        return;
                    }

                    var ie = lib.browser.ie;
                    var ie6frame;
                    var main = $(this.main);

                    if (ie === 6) {
                        ie6frame = $(this.ie6frame).show();
                        lib.fixed(ie6frame[0], FIXED_POSTION);
                        lib.fixed(main[0], FIXED_POSTION);
                    }

                    if (ie < 9) {
                        setTimeout(function () {
                            ie6frame && ie6frame.toggleClass('shit');
                            main.toggleClass('shit');
                        });
                    }

                    this.addState('visible');

                }

            }
        ),

        /**
         * 显示一个遮罩层
         *
         * @public
         * @return {module:Mask}
         */
        show: function () {
            this.set('visible', true);
            return this;
        },

        /**
         * 隐藏一个遮罩层
         *
         * @public
         * @return {module:Mask}
         */
        hide: function () {
            this.set('visible', false);
            return this;
        },

        /**
         * 注销一个遮罩层
         *
         * @public
         */
        dispose: function () {
            this.$parent();
            $(this.main).remove();
            if (this.ie6frame) {
                $(this.ie6frame).remove();
            }
            currentMaskCount--;
        }

    });


    /**
     * 创建一个遮罩层
     *
     * @param {Object} options 遮罩选项
     * @return {HTMLElement} 遮罩元素
     */
    Mask.create = function (options) {
        return new Mask(options);
    };

    return Mask;
});
