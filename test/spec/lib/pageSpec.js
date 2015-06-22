/**
 * @file dom spec
 * @author leon<lupengyu@baidu.com>
 */

define(function (require) {

    var lib = require('ui/lib');

    var forceScroll;

    beforeEach(function () {

        $(document.body).css({
            margin: 0,
            padding: 0
        });

        forceScroll = $('<div>')
            .css({
                width: 20000,
                height: 20000
            })
            .appendTo(document.body);
    });

    afterEach(function () {
        forceScroll.remove();
    });

    describe('lib.page', function () {

        it('lib.getScrollLeft', function () {

            window.scrollTo(1000, 1000);

            var scrollLeft = lib.getScrollLeft();

            expect(scrollLeft).toBe(1000);
        });

        it('lib.getScrollTop', function () {

            window.scrollTo(1000, 1000);

            var scrollTop = lib.getScrollTop();

            expect(scrollTop).toBe(1000);
        });

        it('lib.getViewHeight', function () {
            expect(lib.getViewHeight()).toBe($(window).height());
        });

        it('lib.getViewWidth', function () {
            expect(lib.getViewWidth()).toBe($(window).width());
        });

    });

});
