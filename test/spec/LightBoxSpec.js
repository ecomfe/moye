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
        '<div data-role="lightbox-image" data-lightbox-url="http://www.baidu.com/img/bdlogo.png" data-lightbox-height="123" data-lightbox-width="123"></div>',
        '<div data-role="lightbox-image" data-lightbox-url="http://www.baid2u.com/img/bdlogo22.png"></div>'
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

        it('check show', function () {

            $('[data-role="lightbox-image"]').eq(0).trigger('click');

            lightbox.on('show', function () {
                expect(lightbox.hasState('visiable')).toBeTruthy();
                expect($('.ui-lightbox-image', lightbox.main).prop('outerHTML'))
                    .toContain('//www.baidu.com/img/bdlogo.png');
            });

        });


        it('check hide', function () {

            $('[data-role="lightbox-image"]').eq(0).trigger('click');

            lightbox.on('show', function () {
                expect(lightbox.getCurrent()).toBe(0);
                $('[data-lightbox-action="close"]', lightbox.main).eq(0).trigger('click');
            });

            lightbox.on('hide', function () {
                $('[data-lightbox-action="close"]', lightbox.main).eq(0).trigger('click');
                expect(lightbox.hasState('visiable')).toBeFalsy();
            });

        });

        it('check prev next', function () {

            lightbox.on('show', function () {
                expect(lightbox.total).toBe(5);
                $('[data-lightbox-action="next"]', lightbox.main).eq(0).trigger('click');
            });

            lightbox.on('change', function (e) {
                expect(e.activeIndex).toBe(1);
            });

            $('[data-role="lightbox-image"]').eq(0).trigger('click');
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

        it('check select 6' + i, function () {
            lightbox.select(6);
            lightbox.on('change', function (e) {
                expect(e.activeIndex).toBe(0);
            });
        });

        it('check createIcons', function () {
            lightbox.createIcons('text1');
            expect(!!$('.ui-lightbox-text1')).toBeTruthy();

            lightbox.onMainClicked.call(lightbox, {currentTarget: $('.ui-lightbox-text1')[0]});
            lightbox.on('text1', function (e) {
                expect(!!e).toBeTruthy();
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
