define(function (require) {
    var lib = require('ui/lib');
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
        var n = lib.g('FloatTipContainer');
        n.parentNode.removeChild(n);
    });
  
    describe('基本接口', function () {

        it('show', function () {
            floatTip.show();
            expect(floatTip.main.style.display).not.toBe('none');
        });

        it('hide', function () {
            floatTip.hide();
            floatTip.offsetWidth;
            expect( 
                lib.getStyle(floatTip.main, 'display') 
            ).toBe('none');
        });


        it('setContent', function () {
            expect(
                floatTip.getDom('content').innerHTML
            ).toBe( floatTip.options.content );

            floatTip.setContent('XXXX');
            expect(
                floatTip.getDom('content').innerHTML
            ).toBe( 'XXXX' );

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

            expect( 
                lib.getStyle(adjFloatTip.main, 'left' )
            ).toBe( '20px' );
            expect(
                lib.getStyle(adjFloatTip.main, 'top' ) 
            ).toBe( '40px' );

            adjFloatTip.dispose();
        });

    });



});