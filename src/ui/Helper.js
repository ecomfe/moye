/**
 * @copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 控件小助手
 * @author Leon(ludafa@outlook.com)
 * @module Helper
 * @requires lib
 */

define(function (require) {

    var $ = require('jquery');

    /**
     * 控件辅助类
     *
     * @constructor
     * @param {module:Control} control 关联的控件实例
     */
    function Helper(control) {
        this.control = control;
    }

    $.extend(
        Helper.prototype,
        require('./helper/dom'),
        require('./helper/life'),
        require('./helper/children'),
        require('./helper/plugin'),
        require('./helper/event')
    );

    return Helper;

});
