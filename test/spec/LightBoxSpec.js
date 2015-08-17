/**
 * @file MOYE - LightBox - 测试用例
 * @author cxtom(cxtom2008@gmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var LightBox = require('ui/LightBox');
    var lightbox;

    /* eslint-disable max-len */
    var images = [
        '<div data-role="lightbox-image" data-lightbox-url="http://www.baidu.com/img/bdlogo.png" data-lightbox-title="123"></div>',
        '<div data-role="lightbox-image" data-lightbox-url="http://www.baidu.com/img/bdlogo.png" data-lightbox-width="123"></div>',
        '<div data-role="lightbox-image" data-lightbox-url="http://www.baidu.com/img/bdlogo.png" data-lightbox-height="123"></div>',
        '<div data-role="lightbox-image" data-lightbox-url="http://www.baidu.com/img/bdlogo.png" data-lightbox-height="123" data-lightbox-width="123"></div>'
    ];
    /* eslint-enable max-len */

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', images.join('')
        );
        lightbox = new LightBox();
        lightbox.render();
    });


    afterEach(function () {
        lightbox.dispose();
        $('[data-role="lightbox-image"]').remove();
    });

    /* eslint-disable max-nested-callbacks */

    describe('LightBox 基本接口', function () {

        it('控件类型', function () {
            expect(lightbox.type).toBe('LightBox');
        });

        it('check close', function () {
            lightbox.onMainClicked.call(lightbox, {currentTarget: $('.ui-lightbox-close')[0]});
            expect(lightbox.currentStates.visiable).toBeFalsy();
        });

        it('check prev next', function () {
            expect(lightbox.total).toBe(4);
            lightbox.onMainClicked.call(lightbox, {currentTarget: $('.ui-lightbox-prev')[0]});
            lightbox.onMainClicked.call(lightbox, {currentTarget: $('.ui-lightbox-next')[0]});
            lightbox.onMainClicked.call(lightbox, {currentTarget: $('.ui-lightbox-next')[0]});
            lightbox.on('change', function (e) {
                expect(e.activeIndex).toBe(1);
            });
        });

        /* eslint-disable no-loop-func */
        for (var i = 1; i < 4; i++) {
            it('check select ' + i, function () {
                lightbox.select(i);
                lightbox.on('change', function (e) {
                    expect(e.activeIndex).toBe(i);
                });
            });
        }
        /* eslint-enable no-loop-func */


        it('check createIcons', function () {
            lightbox.createIcons('text1');
            expect(!!$('.ui-lightbox-text1')).toBeTruthy();

            lightbox.onMainClicked.call(lightbox, {currentTarget: $('.ui-lightbox-text1')[0]});
            lightbox.on('text1', function (e) {
                expect(!!e).toBeTruthy();
            });
        });

        it('check triggers', function () {
            $('[data-role="lightbox-image"]').eq(0).trigger('click');
            lightbox.elements[0].width = 800;
            lightbox.elements[0].height = 600;
            lightbox.current = 0;
            lightbox.on('show', function () {
                expect($('.ui-lightbox-image', lightbox.main).prop('outerHTML'))
                    .toContain('//www.baidu.com/img/bdlogo.png');
            });

        });

        it('check set', function () {
            lightbox.setWidth(100);
            lightbox.setHeight(200);
            lightbox.setTitle('123');

            expect($(lightbox.helper.getPart('content'), lightbox.main).width()).toBe(100);
            expect($(lightbox.helper.getPart('content'), lightbox.main).height()).toBe(200);
            expect($(lightbox.helper.getPart('title'), lightbox.main).text()).toBe('123');
        });

        it('event:dispose', function () {
            lightbox.on('dispose', function () {
                expect(!!lightbox.main).toBeFalsy();
            });
        });

    });

});
