/**
 * @file 懒加载测试用例
 * @author chris <wfsr@foxmail.com>
 * @author ludafa <leonlu@outlook.com>
 */

define(function (require) {
    var $ = require('jquery');
    var lib = require('ui/lib');
    var Lazy = require('ui/Lazy');
    var main;
    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd',
            ''
                + '<div id="lazyContainer">'
                + new Array(21).join('<div style="height: 100px"></div>')
                + '</div>'
        );

        main = lib.g('lazyContainer');

        Lazy.add(main, function (scroll, size, cd) {
            var remain = [];
            $(main).find('div').each(function (el) {

                // DIV块坐标数据
                cd.top = cd.top + el.offsetTop;
                cd.right = cd.left + el.offsetWidth;
                cd.bottom = cd.top + el.offsetHeight;

                var isOverRight = cd.left >= scroll.x + size.x;
                var isOverBottom = cd.top >= scroll.y + size.y;
                var isLessLeft = cd.right <= scroll.x;
                var isLessTop = cd.bottom <= scroll.y;

                // 如果在可视区域之内
                if (!(isOverRight || isOverBottom) 
                     && !(isLessLeft || isLessTop)
                ) {
                    el.innerHTML = '1';
                }
                // 保留在可视区域之外的图片
                else {
                    remain.push(el);
                }

            });
 
            // 剔除已处理的 DIV
            var els = remain;

            // 如果图片全部加载过，可从监听集合中移除
            if (!els.length) {
                Lazy.remove(main);
            }

        });

        jasmine.Clock.useMock();

    });


    afterEach(function () {
        Lazy.remove(main);
        main.parentNode.removeChild(main);
        main = null;
    });
  
    describe('基本接口', function () {

        it('单例模式', function () {
            var callback = jasmine.createSpy('onView');
            var lazy = Lazy.add(document.body, callback);
            var lazy1 = Lazy.add(document.body, callback);

            expect(lazy).toBe(lazy1);

            Lazy.remove(document.body);

        });

        it('滚动可见', function () {

            var callback = jasmine.createSpy('onView');

            Lazy.add(main, callback);

            main.scrollIntoView();
            $(window).trigger('scroll');

            jasmine.Clock.tick(1000);
            expect(callback).toHaveBeenCalled();
        });

    });

});
