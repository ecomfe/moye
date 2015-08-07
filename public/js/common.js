/**
 * @file 公共文件
 * @author cxtom <cxtom2010@gmail.com>
 */

define(function (require) {
    // var $     = require('jquery');
    // var conf  = require('common/conf');

    require('highlight');

    return {
        enter: function () {
            window.hljs.initHighlighting();
        }
    };

});
