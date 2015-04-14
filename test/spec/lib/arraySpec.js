/**
 * @file MOYE - lib/array - 测试用例
 * @author Leon(leon@outlook.com)
 */

define(function (require) {

    var lib = require('ui/lib');

    describe('lib/array', function () {

        it('slice', function () {

            function test() {
                return lib.slice(arguments);
            }

            expect(test() instanceof Array).toBe(true);

            expect(test(1, 2, 3, 4).length).toBe(4);

            var a = lib.slice([1, 2, 3, 4, 5], 3);

            expect(a.length).toBe(2);
            expect(a[0]).toBe(4);


        });

        it('each', function () {

            // 遍历数组
            lib.each([1, 2, 3], function (num, i) {
                expect(num === i + 1);
            });

            // 遍历对象
            lib.each({a: 'a1', b: 'b1'}, function (value, name) {
                expect(value).toEqual(name + '1');
            });

            // 遍历array-like object
            lib.each({0: 1, 1: 2, length: 2}, function (value, index) {
                expect(index + 1 === value);
            });

            // 输入为空
            var a = null;
            expect(lib.each(a, function () {})).toEqual(a);

            // 执行上下文
            var context = {};
            lib.each([1], function () {
                expect(this === context);
            }, context);

        });

        it('map', function () {

            // 有定义
            expect(lib.map).toBeDefined();

            // 普通使用
            var input = [1, 2, 3];
            var iterator = function (n) {
                return n * 2;
            };

            var output = lib.map(input, iterator);
            expect(output).toEqual([2, 4, 6]);

            input = [1, 2, 3, undefined, 5];
            output = lib.map(input, iterator);

            // output[3] = undefined * 2 是 NaN
            expect(isNaN(output[3])).toBeTruthy();


            // object
            var ids = lib.map({a: 1, b: 2}, function (value, key) {
                return key + ':' + value;
            });

            expect(ids).toEqual(['a:1', 'b:2']);

            // array-like object
            ids = lib.map({length: 2, 0: {id: '1'}, 1: {id: '2'}}, function (n) {
                return n.id;
            });

            // 输入为空
            expect(ids).toEqual(['1', '2']);
            expect(lib.map(null, function () {})).toEqual([]);

            // 执行上下文
            var context = {};
            lib.map([1], function () {
                expect(this === context);
            }, context);

        });

    });

});
