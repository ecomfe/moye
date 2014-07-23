/**
 * @file 浮层测试用例
 * @author chris <wfsr@foxmail.com>
 * @author ludafa <leonlu@outlook.com>
 */
define(function (require) {
    var $ = require('jquery');
    var FloatTip = require('ui/FloatTip');

    beforeEach(function () {

        document.body.insertAdjacentHTML(
            'beforeEnd',
            '<div id="FloatTipContainer"></div>'
        );

        floatTip = new FloatTip({
            content: '浮动提示'
        });
        floatTip.render();

    });


    afterEach(function () {
        floatTip.dispose();
        $('#FloatTipContainer').remove();
    });

    describe('基本接口', function () {

        it('show', function () {
            floatTip.show();
            expect($(floatTip.main).css('display')).not.toBe('none');
        });

        it('hide', function () {
            floatTip.hide();
            expect($(floatTip.main).css('display')).toBe('none');
        });


        it('setContent', function () {
            var contentElement = floatTip.query('ecl-ui-floattip-content')[0];

            expect(contentElement.innerHTML).toBe(floatTip.options.content);

            floatTip.setContent('XXXX');
            expect(contentElement.innerHTML).toBe('XXXX');

        });


        it('adjustPos', function () {

            var adjFloatTip = new FloatTip({
                content: '浮动提示1',
                left: '20px',
                top: '40px',
                fixed: 0
            });

            adjFloatTip.render();
            adjFloatTip.show();

            expect($(adjFloatTip.main).css('left')).toBe('20px');
            expect($(adjFloatTip.main).css('top')).toBe('40px');

            adjFloatTip.dispose();
        });

    });



});