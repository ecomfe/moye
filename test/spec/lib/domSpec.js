/**
 * @file dom spec
 * @author leon<lupengyu@baidu.com>
 */

define(function (require) {

    var lib = require('ui/lib');

    describe('lib.dom', function () {

        it('lib.g', function () {
            var id = 'ui_' + (+new Date()).toString(36);
            var el = document.createElement('div');
            el.id = id;
            document.body.appendChild(el);

            var found = lib.g(id);
            expect(found).toBe(el);
            expect(found).toBe(lib.g(found));
            expect(found).toBe(lib.g(el));

            document.body.removeChild(el);
            el = null;
            found = null;
        });

    });


});
