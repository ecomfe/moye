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
        lightbox.hide();
        lightbox.destroy();
        $('[data-role="lightbox-image"]').remove();
    });

    /* eslint-disable max-nested-callbacks */

    describe('LightBox 基本接口', function () {

        it('控件类型', function () {
            expect(lightbox.type).toBe('LightBox');
        });

        it('check show事件', function () {

            var onShowSpy = jasmine.createSpy('onShowSpy');
            lightbox.on('show', onShowSpy);

            runs(function () {
                $('[data-role="lightbox-image"]').eq(0).click();
            });

            waitsFor(function () {
                return lightbox.hasState('visible');
            });

            runs(function () {
                expect(onShowSpy).toHaveBeenCalled();
                expect(lightbox.total).toBe(5);
            });

        });


        it('check hide事件', function () {

            var onHideSpy = jasmine.createSpy('onHideSpy');

            lightbox.on('show', function () {
                expect(lightbox.getCurrent()).toBe(1);
            });

            lightbox.on('hide', function () {
                onHideSpy();
                expect(lightbox.hasState('visiable')).toBeFalsy();
            });

            runs(function () {
                $('[data-role="lightbox-image"]').eq(1).click();
            });

            // 等待图片加载
            waitsFor(function () {
                return lightbox.hasState('visible');
            });

            runs(function () {
                $('[data-lightbox-action="close"]', lightbox.main).click();
            });

            waitsFor(function () {
                return !lightbox.hasState('visible');
            });

            runs(function () {
                expect(onHideSpy).toHaveBeenCalled();
            });

        });

        it('check change事件 next按钮', function () {

            var onChangeSpy = jasmine.createSpy('onChangeSpy');

            lightbox.on('show', function () {
                runs(function () {
                    $('[data-lightbox-action="next"]', lightbox.main).click();
                });

                waitsFor(function () {
                    return lightbox.helper.getPart('image').height > 0;
                });
            });

            lightbox.on('change', onChangeSpy);

            runs(function () {
                $('[data-role="lightbox-image"]').eq(2).click();
            });

            // 等待图片加载
            waitsFor(function () {
                return lightbox.hasState('visible');
            });

            runs(function () {
                expect(onChangeSpy).toHaveBeenCalled();
            });
        });


        it('check select 8', function () {

            runs(function () {
                lightbox.select(8);
            });
            // 等待图片加载
            waitsFor(function () {
                return lightbox.hasState('visible');
            });

            runs(function () {
                expect(lightbox.current).toBe(3);
            });
        });

        it('loaderror事件', function () {
            var onErrorSpy = jasmine.createSpy('onErrorSpy');
            lightbox.on('loaderror', onErrorSpy);

            runs(function () {
                $('[data-role="lightbox-image"]').eq(4).click();
            });

            waitsFor(function () {
                return lightbox.hasState('error');
            });

            runs(function () {
                expect(onErrorSpy).toHaveBeenCalled();
            });
        });

        it('check createIcons 自定义事件', function () {

            var onText1Spy = jasmine.createSpy('onText1Spy');
            lightbox.on('text1', onText1Spy);

            lightbox.createIcons('text1');
            expect($('.ui-lightbox-text1', lightbox.main).length).toBe(1);
            expect($(lightbox.helper.getPart('text1')).data('lightbox-action')).toBe('text1');

            runs(function () {
                $(lightbox.helper.getPart('text1')).click();
            });

            var start = Date.now();

            waitsFor(function () {
                return Date.now() - start > 100;
            }, '', 1000);

            runs(function () {
                expect(onText1Spy).toHaveBeenCalled();
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

    });


});
