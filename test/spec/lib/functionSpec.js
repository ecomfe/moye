/**
 * @file MOYE - lib/function - 测试用例
 * @author Leon(leon@outlook.com)
 */

define(function (require) {

    var lib = require('ui/lib');
    describe('lib/function', function () {

        it('binds', function () {

            function Test() {
                this.name = 'world';
            }

            Test.prototype.hello = function () {
                return 'hello' + this.name;
            };

            Test.prototype.hehe = function () {
                return 'hehe' + this.name;
            };

            var test = new Test();


            lib.binds(test, '');
            lib.binds(test, []);
            lib.binds(test, ['hello']);
            lib.binds(test, 'hello, hehe');

            expect(test.hello.call(null)).toBe('helloworld');
            expect(test.hehe.call(null)).toBe('heheworld');

        });

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

        it('curry', function () {

            var add = function (a, b) {
                return a + b;
            };

            var add5 = lib.curry(add, 5);

            expect(add5(1)).toBe(6);

        });

    });

});
