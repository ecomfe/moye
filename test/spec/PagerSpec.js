/**
 * @file 分布组件测试用例
 * @author chris <wfsr@foxmail.com>
 * @author ludafa <leonlu@outlook.com>
 * @author wuqi03 <wuqi03@baidu.com>
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
        pager && pager.dispose();
    });

    describe('Pager 基本接口', function () {

        it('始终显示', function () {
            pager = new Pager({
                main: 'pagerContainer',
                page: 0,
                showAlways: true,
                first: first,
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
                first: first,
                total: 1
            });
            pager.render();
            expect(pager.main.offsetHeight).toBe(0);
        });

        it('改变页码', function () {
            pager = new Pager({
                main: 'pagerContainer',
                page: 0,
                showAlways: false,
                first: first,
                total: 1
            });
            pager.render();

            pager.setTotal(10);
            pager.setPage(8);
            pager.render();
            expect(pager.getPage()).toBe(8);
            expect(pager.main.getElementsByTagName('a')[2].innerHTML)
                .toBe('..');

            pager.setPage(4);
            pager.render();
            expect(pager.getPage()).toBe(4);
            expect(pager.main.getElementsByTagName('a')[8 - first].innerHTML)
                .toBe('..');

            pager.set('page', 5);
            pager.render();
            expect(pager.getPage()).toBe(5);

            // setTotal生效，page设置成初始值
            pager.setTotal(20);
            expect(pager.getTotal()).toBe(20);
            expect(pager.getPage()).toBe(first);

            var fireClick = false;
            var fireChange = false;
            var el = pager.main.getElementsByTagName('a')[2];
            var onClick = function () {
                fireClick = true;
            };
            var onChange = function (json) {
                fireChange = true;
                expect(json.page).toBe(first + 1);
            };

            $(pager.main).on('click', onClick);
            pager.on('change', onChange);
            $(el).trigger('click');
            $(pager.main).off('click', onClick);
            pager.un('change', onChange);

            expect(fireClick).toBeTruthy();
            expect(fireChange).toBeTruthy();

        });

        it('分页逻辑', function () {

            pager = new Pager({
                main: 'pagerContainer',
                page: 0,
                first: 0,
                padding: 3,
                showAlways: true,
                total: 10
            });

            pager.render();

            expect(pager.getPage()).toBe(0);

            pager.setPage(2);
            expect(pager.getPage()).toBe(2);

        });

        it('简版pager', function () {
            pager = new Pager({
                main: 'pagerContainer',
                page: 1,
                first: 1,
                padding: 3,
                showAlways: true,
                mode: 'simple',
                total: 10,
                getPageItemHTML: function (page) {
                    return '<span>' + page + '/' + this.total + '</span>';
                }
            });

            pager.render();
            pager.setPage(5);

            expect(pager.getPage()).toBe(5);

            expect(pager.main.getElementsByTagName('span')[0].innerHTML)
                .toBe('5/10');
        });

        it('链接分页', function () {
            pager = new Pager({
                main: 'pagerContainer',
                page: 1,
                first: 1,
                padding: 3,
                showAlways: true,
                anchor: 'http://www.baidu.com/',
                total: 10
            });

            pager.render();
            pager.setPage(5);

            expect(pager.main.getElementsByTagName('a')[0].href)
                .toBe('http://www.baidu.com/?page=4');

        });

        it('分页销毁', function () {
            var main = document.getElementById('pagerContainer');
            pager.dispose();
            expect(main.innerHTML).toBe('');

        });

    });
});
