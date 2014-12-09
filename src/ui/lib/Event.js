/**
 * @file 事件对象
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var $ = require('jquery');

    function Event(options) {
        $.extend(this, options);
    }

    Event.prototype.preventDefault = function () {
        this.defaultPrevented = true;
    };

    Event.prototype.isDefaultPrevented = function () {
        return !!this.defaultPrevented;
    };

    return {
        Event: Event
    };

});
