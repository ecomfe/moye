define(function (require) {

    // 为了使jasmine的jasmine.Clock.useMock 能正常 work，这里强制重写
    window.requestAnimationFrame = function (callback) {
        return setTimeout(callback, 1);
    };
    window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };

    var lib = require('ui/lib');
    var Anim = require('ui/SliderAnim');

    var SliderMock = lib.newClass({
        initialize: function () {
            this.stage = {
                scrollTop: 0,
                scrollLeft: 0
            };
            this.capacity = 3;
            this.stageWidth = 200;
            this.stageHeight = 400;
        },
        options: {
            animOptions: {
                easing: 'easing',
                interval: 200
            }
        },
        helper: {
            addPartClasses: function () {

            }
        }
    });

    var slider;

    describe('基本接口', function () {
        beforeEach(function () {
            jasmine.Clock.useMock();
            slider = new SliderMock();
        });

        afterEach(function () {
            slider = null;
        });

        it('控件基本接口', function () {
            expect(Anim.anims.no).not.toBe(null);
            expect(Anim.anims.slide).not.toBe(null);
            expect(Anim.anims.opacity).not.toBe(null);
            expect(Anim.anims.easing).not.toBe(null);
            expect(Anim.TimeLine).not.toBe(null);
            expect(typeof Anim.add).toBe('function');
        });

        it('对象基本接口', function () {
            var anim = new Anim(slider, slider.options.animOptions);
            expect(typeof anim.switchTo).toBe('function');
            expect(typeof anim.isBusy).toBe('function');
            expect(typeof anim.enable).toBe('function');
            expect(typeof anim.disable).toBe('function');
            expect(typeof anim.refresh).toBe('function');
            expect(typeof anim.dispose).toBe('function');
        });

        it('TimeLine对象基本接口', function () {
            var anim = new Anim.TimeLine(slider, slider.options.animOptions);
            expect(typeof anim.tick).toBe('function');
            var beforeSwitch = jasmine.createSpy('beforeSwitch');
            anim.beforeSwitch = beforeSwitch;
            anim.tick = function (percent) {
                expect(percent >= 0).toBe(true);
                expect(percent <= 1).toBe(true);
            };
            anim.switchTo(1, 0);
            expect(anim.isBusy()).toBeTruthy();
            expect(beforeSwitch).toHaveBeenCalled();

            anim.disable();
            expect(anim.isBusy()).toBeFalsy();
        });

        it('默认动画测试:no', function () {
            var anim = new Anim.anims.no(slider, slider.options.animOptions);
            anim.switchTo(1, 0);
            expect(slider.stage.scrollLeft).toBe(200);
        });

        it('滑动门动画测试:slide - horizontal', function () {
            var anim = new Anim.anims.slide(slider, {
                easing: 'easing',
                interval: 1
            });
            expect(anim.yAxis).toBeFalsy();
            expect(anim.rollCycle).toBeFalsy();

            anim.switchTo(1, 0);
            jasmine.Clock.tick(300);
            expect(slider.stage.scrollLeft).toBe(200);
        });

        it('滑动门动画测试:slide - vertical', function (done) {
            var anim = new Anim.anims.slide(slider, {
                easing: 'easing',
                direction: 'vertical',
                interval: 1
            });
            expect(anim.yAxis).toBeTruthy();
            expect(anim.rollCycle).toBeFalsy();

            anim.switchTo(1, 0);
            jasmine.Clock.tick(300);
            expect(slider.stage.scrollTop).toBe(400);
        });

        it('测试动画算子:easing:backIn', function (done) {
            var backIn = Anim.easing.backIn;
            expect(Math.round(backIn(0))).toBe(0);
            expect(Math.round(backIn(1))).toBe(1);
        });

        it('测试动画算子:easing:backOut', function (done) {
            var backOut = Anim.easing.backOut;
            expect(Math.round(backOut(0))).toBe(0);
            expect(Math.round(backOut(1))).toBe(1);
        });

        it('测试动画算子:easing:backBoth', function (done) {
            var backBoth = Anim.easing.backBoth;
            expect(Math.round(backBoth(0))).toBe(0);
            expect(Math.round(backBoth(1))).toBe(1);
        });

        it('测试动画算子:easing:linear', function (done) {
            var linear = Anim.easing.linear;
            expect(Math.round(linear(0))).toBe(0);
            expect(Math.round(linear(1))).toBe(1);
        });

        it('测试动画算子:easing:bounce', function (done) {
            var bounce = Anim.easing.bounce;
            expect(Math.round(bounce(0))).toBe(0);
            expect(Math.round(bounce(1))).toBe(1);
        });


        it('opacity动画测试:opacity', function () {
            // 此处dom元素操作比较多，在Slider中测试
        });
    });

});
