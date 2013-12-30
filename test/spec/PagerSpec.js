define(function (require) {
    var lib = require('ui/lib');
    var Pager = require('ui/Pager');
    
    var pager;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="pagerContainer" class="result-op"'
                + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}"'
                + ' style="display:none">'
                +   '<div class="ecl-ui-pager c-clearfix"></div>'
                + '</div>'
        );

        pager = new Pager({
            prefix: 'ecl-ui-pager',
            main: lib.q('ecl-ui-pager')[0],
            page: 0,
            total: 18
          });
        pager.render();               
        
    });


    afterEach(function () {
        document.body.removeChild(lib.g('pagerContainer'));
        pager.dispose();
    });
  
    describe('基本接口', function () {


        it('控件类型', function () {

            expect(pager.type).toBe('Pager');

        });


        it('非法的 main', function () {
            var main = pager.main;
            pager.main = null;
            expect(main).not.toBe(null);
            expect(
                function () {
                    pager.render();
                }
            ).toThrow();
            pager.main = main;

        });

        it('showAlways = false', function () {

            pager.setTotal(1);
            var showAlways = pager.options.showAlways;
            pager.options.showAlways = false;
            pager.render();
            pager.options.showAlways = showAlways;
            expect(pager.main.offsetHeight).toBe(0);
        });

        it('改变页码', function () {
            pager.setTotal(10);
            pager.setPage(8);
            pager.render();
            expect(pager.page).toBe(8);
            expect(pager.main.getElementsByTagName('a')[2].innerHTML)
                .toBe('..');

            pager.setPage(4);
            pager.render();
            expect(pager.page).toBe(4);
            expect(pager.main.getElementsByTagName('a')[8].innerHTML)
                .toBe('..');

            var fireClick = false;
            var fireChange = false;
            var el = pager.main.getElementsByTagName('em')[1];
            var onClick = function () {
                fireClick = true;
            };
            var onChange = function (json) {
                fireChange = true;
                expect(json.page).toBe(
                    el.parentNode.getAttribute('data-page') | 0
                );
            };
            pager.on('click', onClick);
            pager.on('change', onChange);
            pager.onChange(null, el);
            pager.un('click', onClick);
            pager.un('change', onChange);

            expect(fireClick).toBeTruthy();
            expect(fireChange).toBeTruthy();
        });

        it('忽略直接点击容器', function () {
            var fireClick = false;
            var fireChange = false;
            var onClick = function () {
                fireClick = true;
            };
            var onChange = function () {
                fireChange = true;
            };
            var el = document.createElement('div');
            el.innerHTML = 'just for test';
            pager.main.appendChild(el);
            pager.on('click', onClick);
            pager.on('change', onChange);
            pager.onChange(null, pager.main);
            pager.onChange(null, el);
            pager.un('click', onClick);
            pager.un('change', onChange);
            pager.main.removeChild(el);
            el = null;

            expect(fireClick).toBeTruthy();
            expect(fireChange).toBeFalsy();
        });

        it('分页逻辑', function () {
            expect(pager.getPage()).toBe(0);

            pager.setPage(2);
            pager.render();
            expect(pager.getPage()).toBe(2);

            pager.setTotal(0);
            expect(pager.getTotal()).toBe(1);

            pager.setTotal('NaN');
            expect(pager.getTotal()).toBe(1);

            pager.setTotal(1);
            pager.render();
            expect(pager.getTotal()).toBe(1);
            expect(pager.getPage()).toBe(0);

            pager.setTotal(10);
            pager.setPage(5);
            pager.render();
            expect(pager.main.getElementsByTagName('a').length).toBe(11);
        });

    });

});