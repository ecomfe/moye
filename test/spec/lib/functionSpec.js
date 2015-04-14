/**
 * @file MOYE - lib/function - 测试用例
 * @author Leon(leon@outlook.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('ui/lib');


    describe('lib/function', function () {

        it('delay', function () {
            var i = 0;
            var context = {
                test: function () {
                    ++i;
                    expect(this).toBe(context);
                }
            };
            var delayed = lib.delay.call(context, context.test, 100);
            delayed();
            jasmine.Clock.tick(50);
            expect(i).toBe(0);
            jasmine.Clock.tick(100);
            expect(i).toBe(1);
        });

        it('debounce', function () {

            var i = 0;
            var args = 'hehe';
            var context = {
                test: function (a) {
                    ++i;
                    expect(context).toBe(this);
                    expect(a).toBe(args);
                }
            };

            var debounced = lib.debounce.call(context, context.test, 100);

            debounced(args);
            jasmine.Clock.tick(50);
            expect(i).toBe(0);

            debounced(args);
            jasmine.Clock.tick(70);
            expect(i).toBe(0);

            jasmine.Clock.tick(150);
            expect(i).toBe(1);
        });

        it('throttle', function () {
            var args = 'hehe';
            var context = {};
            var i = 0;
            var spy = function (a) {
                ++i;
                expect(this).toBe(context);
                expect(a).toBe(args);
            };
            var throttled = lib.throttle.call(context, spy, 100);
            throttled(args);
            expect(i).toBe(1);
            jasmine.Clock.tick(50);
            throttled(args);
            expect(i).toBe(1);
            jasmine.Clock.tick(60);
            throttled(args);
            expect(i).toBe(2);
        });

    });

});
