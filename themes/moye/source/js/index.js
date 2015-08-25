/**
 * @file 公共文件
 * @author cxtom <cxtom2010@gmail.com>
 */

define(function (require) {

    var $     = require('jquery');
    // var conf  = require('common/conf');
    var Tab   = require('moye/Tab');
    var Pager = require('moye/Pager');
    var lib   = require('moye/lib');
    var Select = require('moye/Select');

    require('highlight');
    window.hljs.initHighlighting();

    return {
        enter: function () {

            new Tab({
                main: $('#tab')
            }).render();

            new Select({
                main: document.getElementById('select'),
                datasource: [{
                    value: 0,
                    name: '不限'
                }, {
                    value: 1,
                    name: '中关村、上地'
                }, {
                    value: 2,
                    name: '公主坟商圈'
                }, {
                    value: 3,
                    name: '劲松潘家园'
                }, {
                    value: 4,
                    name: '亚运村'
                }, {
                    value: 5,
                    name: '北京南站商圈超长'
                }]
            }).render();

            lib.each(
                ['', 'qiche', 'jiaoyu', 'youxi'],
                function (skin, index) {
                    new Pager({
                        main: $('#pager' + (index + 1)),
                        skin: skin,
                        total: 10
                    }).render();
                }
            );
        }
    };
});
