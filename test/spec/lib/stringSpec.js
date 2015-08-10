/**
 * @file MOYE - lib/function - 测试用例
 * @author Leon(leon@outlook.com)
 */

define(function (require) {

    var lib = require('ui/lib');

    describe('lib/string', function () {


        it('guid', function () {
            var a = lib.guid();
            var b = lib.guid();
            expect(a).not.toBe(b);
        });

        it('capitalize', function () {

            var a = 'capitalize capitalize';

            var b = lib.capitalize(a);

            expect(b).toBe('Capitalize Capitalize');

        });

        it('contains', function () {
            var a = 'a b c d e';
            expect(lib.contains(a, a)).toBe(true);
        });

        it('pad', function () {

            var a = 1234;
            var b = -1234;
            var width = 8;

            expect(lib.pad(a, width)).toBe('00001234');
            expect(lib.pad(b, width)).toBe('-00001234');

        });

        it('format', function () {
            var data = {
                a: 0,
                b: null,
                c: '',
                d: 1,
                e: 'a',
                f: ['1', '2'],
                g: {}
            };
            var template = '!{a},!{b},!{c},!{d},!{e},!{f},!{g}';

            expect(lib.format(template, data)).toBe('0,,,1,a,1,2,[object Object]');

            expect(lib.format('!{a},${a},%{a}', data)).toBe('0,0,%{a}');

            expect(lib.format('${a},${b},${d}', function (attrName) {
                return data[attrName];
            })).toBe('0,,1');
        });

    });

});
