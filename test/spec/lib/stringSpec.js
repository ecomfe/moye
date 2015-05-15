/**
 * @file MOYE - lib/function - 测试用例
 * @author Leon(leon@outlook.com)
 */

define(function (require) {

    var lib = require('ui/lib');

    describe('lib/string', function () {

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

            expect(
                lib.format(template, data)
                ===
                '0,,,1,a,1,2,[object Object]'
            );

            expect(
                lib.format('!{a}, @{a}, #{a}, ${a}, %{a}', data)
                ===
                '0,,,,'
            );
        });

    });

});
