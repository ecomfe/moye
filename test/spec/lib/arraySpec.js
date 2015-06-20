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

            var iterator0 = function (num, i) {
                expect(num === i + 1);
            };

            lib.each([1, 2, 3], iterator0);

            // 遍历对象

            var iterator1 = function (value, name) {
                expect(value).toEqual(name + '1');
            };

            lib.each({a: 'a1', b: 'b1'}, iterator1);

            // 遍历array-like object

            var iterator2 = function (value, index) {
                expect(index + 1 === value);
            };

            lib.each({0: 1, 1: 2, length: 2}, iterator2);

            // 输入为空
            var a = null;
            var noop = function () {};
            expect(lib.each(a, noop)).toEqual(a);

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

        it('reduce', function () {

            var sum = lib.reduce(
                [1, 2, 3],
                function (memo, num) {
                    return memo + num;
                },
                0
            );

            expect(sum, 6, 'can sum up an array');

            var context = {
                multiplier: 3
            };

            sum = lib.reduce(
                [1, 2, 3],
                function (memo, num) {
                    return memo + num * this.multiplier;
                },
                0,
                context
            );

            expect(sum, 18, 'can reduce with a context object');


            sum = lib.reduce(
                [1, 2, 3],
                function (memo, num) {
                    return memo + num;
                }
            );
            expect(sum, 6, 'default initial value');

            var prod = lib.reduce(
                [1, 2, 3, 4],
                function (memo, num) {
                    return memo * num;
                }
            );
            expect(prod, 24, 'can reduce via multiplication');

            var noop = function () {};

            expect(lib.reduce(null, noop, 138)).toBe(138, 'handles a null (with initial value) properly');
            expect(lib.reduce([], noop, void 0), void 0, 'undefined can be passed as a special case');
            expect(lib.reduce([1], noop), 1, 'collection of length one with no initial value returns the first item');
            expect(lib.reduce([], noop), void 0, 'returns undefined when collection is empty and no initial value');

        });

        it('range', function () {

            expect(lib.range(0))
                .toEqual(
                    [],
                    'range with 0 as a first argument generates an empty array'
                );

            expect(lib.range(4))
                .toEqual(
                    [0, 1, 2, 3],
                    'range with a single positive argument generates an array of elements 0,1,2,...,n-1'
                );

            expect(lib.range(5, 8))
                .toEqual(
                    [5, 6, 7],
                    'range with two arguments a &amp; b, a&lt;b generates an array of elements a,a+1,a+2,...,b-2,b-1'
                );

            expect(lib.range(8, 5))
                .toEqual(
                    [],
                    'range with two arguments a &amp; b, b&lt;a generates an empty array'
                );

            expect(lib.range(3, 10, 3))
                .toEqual(
                    [3, 6, 9],
                    ''
                    + 'range with three arguments a &amp; b &amp; c, '
                    + 'c &lt; b-a, a &lt; b generates an array of elements a,'
                    + 'a+c,a+2c,...,b - (multiplier of a) &lt; c'
                );

            expect(lib.range(3, 10, 15))
                .toEqual(
                    [3],
                    ''
                        + 'range with three arguments a &amp; b &amp; c, '
                        + 'c &gt; b-a, a &lt; b generates an array with a single element, equal to a'
                );

            expect(lib.range(12, 7, -2))
                .toEqual(
                    [12, 10, 8],
                    ''
                        + 'range with three arguments a &amp; b &amp; c, '
                        + 'a &gt; b, c &lt; 0 generates an array of elements '
                        + 'a,a-c,a-2c and ends with the number not less than b'
                );

            expect(lib.range(0, -10, -1))
                .toEqual(
                    [0, -1, -2, -3, -4, -5, -6, -7, -8, -9],
                    'final example in the Python docs'
                );

        });

        it('keys', function () {

            expect(lib.keys({one: 1, two: 2})).toEqual(
                ['one', 'two'],
                'can extract the keys from an object'
            );

            // the test above is not safe because it relies on for-in enumeration order
            var a = []; a[1] = 0;

            expect(lib.keys(a)).toEqual(
                ['1'],
                'is not fooled by sparse arrays; see issue #95'
            );

            expect(lib.keys(null)).toEqual(
                []
            );

            expect(lib.keys(void 0)).toEqual(
                []
            );

            expect(lib.keys(1)).toEqual(
                []
            );

            expect(lib.keys('a')).toEqual(
                ['0']
            );

            expect(lib.keys(true)).toEqual(
                []
            );

            // keys that may be missed if the implementation isn't careful
            var trouble = {
                constructor: Object,
                valueOf: function () {},
                hasOwnProperty: null,
                toString: 5,
                toLocaleString: void 0,
                propertyIsEnumerable: /a/,
                isPrototypeOf: this,
                __defineGetter__: Boolean,
                __defineSetter__: {},
                __lookupSetter__: false,
                __lookupGetter__: []
            };
            var troubleKeys = [
                'constructor', 'valueOf', 'hasOwnProperty', 'toString',
                'toLocaleString', 'propertyIsEnumerable',
                'isPrototypeOf', '__defineGetter__', '__defineSetter__',
                '__lookupSetter__', '__lookupGetter__'
            ].sort();

            expect(lib.keys(trouble).sort()).toEqual(
                troubleKeys,
                'matches non-enumerable properties'
            );

        });

    });

});
