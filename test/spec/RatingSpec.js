/**
 * @file 农历组件测试用例
 * @author chris <wfsr@foxmail.com>
 * @author chenzhian <chenzhian@baidu.com>
 */

define(function (require) {
    var $ = require('jquery');
    var Rating = require('ui/Rating');
    var rating;
    var $stars;
    var fns = null;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd',
            '<div id="rating"></div>'
        );

        rating = new Rating({
            main: document.getElementById('rating'),
            value: 1,
            max: 3
        }).render();

        $stars = $('.ui-rating-star', rating.main);

    });

    afterEach(function () {
        rating.dispose();
        rating = null;
        $('#rating').remove();
        $stars = null;
    });

    describe('评分组件', function () {
        // 点亮第一颗星，其他都不亮
        it('init rating with a value', function () {
            var result = $('.ui-rating-star-on', rating.main);

            expect(result.length).toBe(1);

            expect($stars[0].className).toContain('ui-rating-star-on');

            expect($stars[1].className).not.toContain('ui-rating-star-on');

            expect($stars[2].className).not.toContain('ui-rating-star-on');
        });

        // 鼠标移进星星，预览星级
        it('event: mouseover', function () {
            var rndIndex = 1;

            var onHoverSpy = jasmine.createSpy('onHoverSpy');

            rating.on('hover', onHoverSpy);

            $($stars[rndIndex]).trigger('mouseover');

            expect(onHoverSpy).toHaveBeenCalled();

            var result = $('.ui-rating-star-on', rating.main);
            expect(result.length).toBe(rndIndex + 1);

        });

        // 鼠标移出星星，重置星级为value所指定的星级
        it('event: mouseout', function () {
            var rndIndex = 1;
            var onHoverSpy = jasmine.createSpy('onHoverSpy');

            rating.on('hover', onHoverSpy);

            $($stars[rndIndex]).trigger('mouseout');

            expect(onHoverSpy).toHaveBeenCalled();

            var result = $('.ui-rating-star-on', rating.main);
            expect(result.length).toBe(rating.value);

        });

        // 单击星星
        it('event: change', function () {
            var rndIndex = 1;

            var onChange = function (e) {
                expect(e.value).toBe(rndIndex + 1);
            };

            rating.on('change', onChange);

            $($stars[rndIndex]).click();

            rating.un('change');
        });

        // 设置点亮星星值
        it('method: setValue', function () {
            var value = 2;

            rating.setValue(value);

            expect(rating.value).toBe(value);
            var $starsIsOn = $('.ui-rating-star-on', rating.main);
            expect($starsIsOn.length).toBe(value);
        });

        // 设置点亮星星值
        it('method: setValue with fireChange parameter', function () {
            var value = 2;
            var onChangeSpy = jasmine.createSpy('onChangeSpy');

            rating.on('change', onChangeSpy);

            rating.setValue(value, true);

            expect(onChangeSpy).toHaveBeenCalled();

            expect(rating.value).toBe(value);

            var $starsIsOn = $('.ui-rating-star-on', rating.main);
            expect($starsIsOn.length).toBe(value);
            rating.un('change');
        });

        // getValue方法
        it('method: getValue', function () {
            expect(rating.getValue()).toBe(1);
        });

        // disable和enable方法
        it('method: enable && disable', function () {
            var rndIndex = 1;
            var onChangeSpy = jasmine.createSpy('onChangeSpy');
            rating.on('change', onChangeSpy);
            rating.disable();
            $($stars[rndIndex]).click();
            expect(onChangeSpy).not.toHaveBeenCalled();
            rating.enable();
            $($stars[rndIndex]).click();
            expect(onChangeSpy).toHaveBeenCalled();
            rating.un('change');
        });
    });
});
