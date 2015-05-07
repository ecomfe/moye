/**
 * @file 分布组件测试用例
 * @author chris <wfsr@foxmail.com>
 * @author ludafa <leonlu@outlook.com>
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('ui/lib');
    var Pager = require('ui/Pager');

    var pager;
    var first = Math.random() > 0.5 ? 1 : 0;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd',
            '<div id="pagerContainer"></div>'
        );
    });


    afterEach(function () {
        pager.destroy();
    });

    describe('基本接口', function () {

        it('始终显示', function () {
            pager = new Pager({
                main: 'pagerContainer',
                page: 0,
                showAlways: true,
                total: 1
            });
            pager.render();
            expect(pager.main.offsetHeight).not.toBe(0);
        });

        it('当总页面码数小于2时隐藏', function () {
            pager = new Pager({
                main: 'pagerContainer',
                page: 0,
                showAlways: false,
                total: 1
            });
            pager.render();
            expect(pager.main.offsetHeight).toBe(0);
        });

        // it('改变页码', function () {
        //     pager.setTotal(10);
        //     pager.setPage(8);
        //     pager.render();
        //     expect(pager.getPage()).toBe(8);
        //     expect(pager.main.getElementsByTagName('a')[2].innerHTML)
        //         .toBe('..');

        //     pager.setPage(4);
        //     pager.render();
        //     expect(pager.getPage()).toBe(4);
        //     expect(pager.main.getElementsByTagName('a')[8 - first].innerHTML)
        //         .toBe('..');

        //     var fireClick = false;
        //     var fireChange = false;
        //     var el = pager.main.getElementsByTagName('em')[1];
        //     var onClick = function () {
        //         fireClick = true;
        //     };
        //     var onChange = function (json) {
        //         fireChange = true;
        //         expect(json.page - first).toBe(
        //             el.parentNode.getAttribute('data-page') | 0
        //         );
        //     };
        //     pager.on('click', onClick);
        //     pager.on('change', onChange);
        //     $(el).trigger('click');
        //     pager.un('click', onClick);
        //     pager.un('change', onChange);

        //     expect(fireClick).toBeTruthy();
        //     expect(fireChange).toBeTruthy();
        // });

        // it('忽略直接点击容器', function () {
        //     var fireClick = false;
        //     var fireChange = false;
        //     var onClick = function () {
        //         fireClick = true;
        //     };
        //     var onChange = function () {
        //         fireChange = true;
        //     };
        //     var el = document.createElement('div');
        //     el.innerHTML = 'just for test';
        //     pager.main.appendChild(el);
        //     pager.on('click', onClick);
        //     pager.on('change', onChange);
        //     $(pager.main).trigger('click');
        //     $(el).trigger('click');
        //     pager.un('click', onClick);
        //     pager.un('change', onChange);
        //     pager.main.removeChild(el);
        //     el = null;

        //     expect(fireClick).toBeTruthy();
        //     expect(fireChange).toBeFalsy();
        // });

        it('分页逻辑', function () {

            pager = new Pager({
                main: 'pagerContainer',
                page: 0,
                padding: 3,
                showAlways: true,
                total: 10
            });

            pager.render();

            expect(pager.getPage()).toBe(0);

            pager.setPage(2);
            expect(pager.getPage()).toBe(2);

        });

    });
});
