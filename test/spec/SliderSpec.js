define(function (require) {
    var $ = require('jquery');
    var lib = require('ui/lib');
    var Slider = require('ui/Slider');

    var slider;

    function createSlider(options) {
        jasmine.Clock.useMock();

        document.body.insertAdjacentHTML(
            'beforeEnd', ''
            + '<div id="slider-container">'
            +   '<div id="ecl-ui-slider-1">'
            +     '<div data-role="stage">'
            +       '<img src="http://pic.hefei.cc/newcms'
            +         '/2012/03/14/13316929284f6005808aa20.jpg">'
            +       '<img src="http://pic.hefei.cc/newcms'
            +         '/2012/03/14/13316929274f60057f72733.jpg">'
            +       '<img src="http://pic.hefei.cc/newcms'
            +         '/2012/03/14/13316929284f60058013da9.jpg">'
            +       '<img src="http://pic.baike.soso.com/p/20131122/20131122124317-393756163.jpg">'
            +     '</div>'
            +   '</div>'
            + '</div>'
        );

        options = $.extend({
            main: lib.g('ecl-ui-slider-1')
        }, options || {});
        slider = new Slider(options);
        slider.render();
    }

    function disposeSlider() {
        slider.dispose();
        document.body.removeChild(lib.g('slider-container'));
    }

    describe('基本接口', function () {
        beforeEach(createSlider);
        afterEach(disposeSlider);

        it('控件类型', function () {
            expect(slider.type).toBe('Slider');
        });

        it('控件初始化', function () {
            expect(slider.prev).toBe('&lt;');
            expect(slider.next).toBe('&gt;');
            expect(slider.arrow).toBeTruthy();
            expect(slider.pager).not.toBeNull();
            expect($(slider.pager).children().length).toBe(4);
            expect(slider.auto).toBeTruthy();
            expect(slider.timer).toBeTruthy();
            expect(slider.circle).toBeTruthy();
            expect(slider.autoInterval).toBe(2000);
            expect(slider.switchDelay).toBe(50);
            expect(slider.anim).toBe('slide');
            expect(slider.capacity).toBe(4);
            expect(slider.curAnim).not.toBeNull();
            expect(slider.stage).not.toBeNull();
            expect(slider.prevArrow).not.toBeNull();
            expect(slider.nextArrow).not.toBeNull();
            expect(slider.index).toBe(0);

            var animOption = slider.animOptions;
            expect(animOption.easing).toBe('easing');
            expect(animOption.interval).toBe(200);
            expect(animOption.direction).toBe('horizontal');
            expect(animOption.rollCycle).not.toBeTruthy();
        });

        it('控件基本接口', function () {
            expect(Slider.Anim).not.toBe(null);
            expect(Slider.Anim.anims.no).not.toBe(null);
            expect(Slider.Anim.anims.slide).not.toBe(null);
            expect(Slider.Anim.anims.opacity).not.toBe(null);
            expect(Slider.Anim.anims.easing).not.toBe(null);
            expect(Slider.Anim.anims.TimeLine).not.toBe(null);
        });

        it('getNextPage', function () {
            var lastIdx = slider.capacity - 1;
            slider.index = 1;
            slider.circle = true;
            expect(slider.getNextPage('')).toBe(0);
            expect(slider.getNextPage('NaN')).toBe(0);
            expect(slider.getNextPage('start')).toBe(0);
            expect(slider.getNextPage('end')).toBe(lastIdx);
            expect(slider.getNextPage(1000)).toBe(0);
            expect(slider.getNextPage(-100)).toBe(lastIdx);
            expect(slider.getNextPage(1)).toBe(-1);

            slider.circle = false;
            expect(slider.getNextPage(2)).toBe(2);
            expect(slider.getNextPage(1000)).toBe(lastIdx);
            expect(slider.getNextPage(-100)).toBe(0);
        });

        it('play', function () {
            slider.play();
            expect(slider.timer).not.toBe(null);
        });

        it('goPrev', function () {
            slider.index = 0;
            slider.goPrev();
            expect(slider.index).toBe(slider.capacity - 1);
        });

        it('goNext', function () {
            slider.index = slider.capacity - 1;
            slider.goNext();
            expect(slider.index).toBe(0);
        });
        it('go', function () {
            slider.index = 1;
            slider.go(3);
            expect(slider.index).toBe(3);
            slider.go(3);
            expect(slider.index).toBe(3);
            slider.go(-1);
            expect(slider.index).toBe(3);
        });
    });

    describe('测试基本动画', function () {
        afterEach(disposeSlider);

        it('测试default动画', function () {
            createSlider({
                anim: 'no'
            });
            slider.go(-1);
            slider.go(1);
            slider.go(5);
        });

        it('测试opacity动画', function () {
            createSlider({
                anim: 'opacity'
            });
            slider.go(-1);
            slider.go(1);
            slider.go(5);
        });
    });

    describe('事件', function () {
        beforeEach(createSlider);
        afterEach(disposeSlider);

        it('onchange', function () {
            var fakeChange = jasmine.createSpy('change');

            slider.on('change', function (e) {
                fakeChange(e.index, e.lastIndex);
            });

            slider.go(3);
            expect(fakeChange).toHaveBeenCalledWith(3, 0);

            var fakeChange2 = jasmine.createSpy('change2');
            slider.on('change', function (e) {
                fakeChange2(e.index, e.lastIndex);
            });
            slider.go(0);
            expect(fakeChange2).toHaveBeenCalledWith(0, 3);

            slider.go(0);
            expect(fakeChange2.callCount).toEqual(1);
        });

    });

    describe('事件绑定', function () {
        afterEach(disposeSlider);

        it('arrow navigation button with auto circle', function () {
            createSlider();

            var fakeChange = jasmine.createSpy('change');

            slider.on('change', function (e) {
                fakeChange(e.index, e.lastIndex);
            });

            $(slider.prevArrow).click();
            jasmine.Clock.tick(100);
            expect(fakeChange).toHaveBeenCalledWith(3, 0);

            var fakeChange2 = jasmine.createSpy('change2');
            slider.on('change', function (e) {
                fakeChange2(e.index, e.lastIndex);
            });
            $(slider.nextArrow).click();
            jasmine.Clock.tick(100);
            expect(fakeChange2).toHaveBeenCalledWith(0, 3);
        });

        it('arrow navigation button with disabled circle', function () {
            createSlider({circle: false, auto: false});

            expect($(slider.prevArrow).hasClass(
                slider.helper.getPartClassName('prev-disable'))
            ).toBe(true);

            slider.go(3);
            expect($(slider.nextArrow).hasClass(
                    slider.helper.getPartClassName('next-disable'))
            ).toBe(true);

            slider.go(1);
            var fakeChange3 = jasmine.createSpy('change3');
            slider.on('change', function (e) {
                fakeChange3(e.index, e.lastIndex);
            });
            $(slider.nextArrow).click();
            jasmine.Clock.tick(100);
            expect(fakeChange3).toHaveBeenCalledWith(2, 1);

            var fakeChange4 = jasmine.createSpy('change4');
            slider.on('change', function (e) {
                fakeChange4(e.index, e.lastIndex);
            });
            $(slider.prevArrow).click();
            jasmine.Clock.tick(100);
            expect(fakeChange4).toHaveBeenCalledWith(1, 2);
        });

        it('pager navigation button', function () {
            createSlider({auto: false});

            var pager = $(slider.pager);
            var helper = slider.helper;
            slider.go(0);
            expect(
                pager.find(':eq(0)').hasClass(helper.getPartClassName('pager-selected'))
            ).toBe(true);

            var fakeChange = jasmine.createSpy('change');
            slider.on('change', function (e) {
                fakeChange(e.index, e.lastIndex);
            });

            pager.find(':eq(1)').click();
            jasmine.Clock.tick(100);
            expect(fakeChange).toHaveBeenCalledWith(1, 0);
        });

        it('auto play stop when mouse enter stage', function () {
            createSlider();

            var main = $(slider.main);
            expect(slider.isPlaying()).toBeTruthy();
            main.mouseenter();

            expect(slider.isPlaying()).toBeFalsy();

            main.mouseleave();
            expect(slider.isPlaying()).toBeTruthy();
        });
    });

});
