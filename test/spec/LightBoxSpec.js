/**
 * @file MOYE - LightBox - 测试用例
 * @author cxtom(cxtom2008@gmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var LightBox = require('ui/LightBox');
    var lightbox;

    var images = [
        '<a class="lightbox" href="http://www.baidu.com/img/bdlogo.png" data-title="123"></a>',
        '<a class="lightbox" href="http://www.baidu.com/img/bdlogo.png" data-width="123"></a>',
        '<div class="lightbox" data-url="http://www.baidu.com/img/bdlogo.png"></div>',
        '<a class="lightbox" href="#"></a>',
        '<div class="lightbox"></div>'
    ];

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', images.join('')
        );
        lightbox = new LightBox();
        lightbox.render();
    });


    afterEach(function () {
        lightbox.dispose();
        $('.lightbox').remove();
    });

    /* eslint-disable max-nested-callbacks */

    describe('LightBox 基本接口', function () {

        it('控件类型', function () {
            expect(lightbox.type).toBe('LightBox');
        });

        it('event:show', function () {
            lightbox.on('show', function () {
                expect(lightbox.main).toBeTruthy();
                expect($(lightbox.main).hasClass('ui-lightbox-visible')).toBeTruthy();
            });
            lightbox.show();
        });

        it('event:hide', function () {
            lightbox.on('hide', function () {
                expect($(lightbox.main).hasClass('ui-lightbox-visible')).toBeFalsy();
            });
            lightbox.hide();
        });

        it('check close', function () {
            lightbox.onMainClicked.call(lightbox, {currentTarget: $('.ui-lightbox-close')[0]});
        });

        it('check prev next', function () {
            lightbox.onMainClicked.call(lightbox, {currentTarget: $('.ui-lightbox-prev')[0]});
            lightbox.onMainClicked.call(lightbox, {currentTarget: $('.ui-lightbox-next')[0]});
            lightbox.onMainClicked.call(lightbox, {currentTarget: $('.ui-lightbox-next')[0]});
            lightbox.on('change', function (e) {
                expect(e.activeIndex).toBe(1);
                expect(lightbox.getCurrent()).toBe(1);
            });
        });

        it('check select', function () {
            lightbox.select(2);
            lightbox.on('change', function (e) {
                expect(e.activeIndex).toBe(2);
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

        it('check triggers', function () {
            $('.lightbox').eq(0).trigger('click');
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

            expect($(lightbox.getChild('content').main, lightbox.main).width()).toBe(100);
            expect($(lightbox.getChild('content').main, lightbox.main).height()).toBe(200);
            expect($(lightbox.getChild('title').main, lightbox.main).text()).toBe('123');
        });

        it('event:dispose', function () {
            lightbox.on('dispose', function () {
                expect(!!lightbox.main).toBeFalsy();
            });
        });

    });

});
