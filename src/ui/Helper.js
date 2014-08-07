define(function (require) {
    
    var $ = require('jquery');

    /**
     * 控件辅助类
     *
     * @constructor
     * @param {Control} control 关联的控件实例
     */
    function Helper(control) {
        this.control = control;
    }

    $.extend(
        Helper.prototype,
        require('./helper/dom'),
        require('./helper/life')
    );

    return Helper;

});


