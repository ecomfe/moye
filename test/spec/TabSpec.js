/**
 * @file 选项卡组件测试用例
 * @author chris <wfsr@foxmail.com>
 * @author ludafa <leonlu@outlook.com>
 */

define(function (require) {
    var $ = require('jquery');
    var lib = require('ui/lib');
    var Tab = require('ui/Tab');

    var tab;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd',
            ''
            +    '<div id="tab1" class="ui-tab">'
            +        '<ul class="ui-tab-wrapper">'
            +            '<li class="ui-tab-item ui-tab-item-first ui-tab-item-active" data-index="0" data-panel="#panel1">CSS控件</li>'
            +            '<li class="ui-tab-item" data-index="1" data-panel="#panel2">UI控件拆分</li>'
            +            '<li class="ui-tab-item" data-index="2" data-panel="#panel3">UI栅格化设计</li>'
            +            '<li class="ui-tab-item  ui-tab-item-last" data-index="3" data-panel="#panel4">新UI设计规范</li>'
            +        '</ul>'
            +    '</div>'
            +    '<div id="panel1" style="width: 100px;height: 100px; background-color: green; display: block"></div>'
            +    '<div id="panel2" style="width: 100px;height: 100px; background-color: blue; display: none"></div>'
            +    '<div id="panel3" style="width: 100px;height: 100px; background-color: red; display: none"></div>'
            +    '<div id="panel4" style="width: 100px;height: 100px; background-color: yellow; display: none"></div>'
        );

        tab = new Tab({
            main: $('#tab1')[0],
            activeIndex: 0
        }).render();

        jasmine.Clock.useMock();
    });


    afterEach(function () {
        tab.dispose();
        tab = null;
    });

    describe('Tab test', function () {

        it('select index', function () {
            tab.select(1);

            var items = $(tab.itemClass, tab.main);
            // 应该显示状态
            if ($(items.eq(1).data('panel')).css('display') !== 'none') {

            }
            expect(tab.activeIndex).toBe(1);
            expect($(items.eq(tab.activeIndex).data('panel')).css('display')).not.toBe('none');

            tab.next();
            expect(tab.activeIndex).toBe(2);

            // 恢复初始化
            tab.select(0);
        });

        it('event:onChange', function () {

            var items = $(tab.itemClass, tab.main);
            var count = 0;
            var onChange = function (e) {
                expect(e.activeIndex).toBe(1);
                count++;
            };
            tab.on('change', onChange);
            items.eq(1).trigger('click');
            items.eq(1).trigger('click');

            expect(count).toBe(1);

            // 恢复初始化
            tab.un('change', onChange);
            tab.select(0);
        });

        it('enable change', function () {

            var onChange = jasmine.createSpy('onChange');

            tab.on('change', onChange);
            var items = $(tab.itemClass, tab.main);
            items.eq(1).trigger('click');

            // jasmine.Clock.tick(100);
            expect(onChange).toHaveBeenCalled();

            // 恢复初始化
            tab.un('change', onChange);
            tab.select(0);
        });

        it('disabled change', function () {

            var onChange = function (e) {
                e.preventDefault();
                return false;
            };

            tab.on('change', onChange);
            var items = $(tab.itemClass, tab.main);

            items.eq(2).trigger('click');

            // jasmine.Clock.tick(100);
            expect(tab.activeIndex).not.toBe(2);

            // 恢复初始化
            tab.un('change', onChange);
            tab.select(0);
        });

        it('hover mode', function () {
            tab.dispose();
            tab = new Tab({
                main: $('#tab1')[0],
                activeIndex: 0,
                mode: 'hover'
            }).render();

            var items = $(tab.itemClass, tab.main);
            items.eq(2).trigger('mouseenter');

            // jasmine.Clock.tick(100);
            expect(tab.activeIndex).toBe(2);
        });

        it('auto mode', function () {
            tab.dispose();
            tab = new Tab({
                main: $('#tab1')[0],
                activeIndex: 0,
                mode: 'auto'
            }).render();

            var items = $(tab.itemClass, tab.main);
            items.eq(2).trigger('mouseenter');

            // jasmine.Clock.tick(100);
            expect(tab.autoSlideId).not.toBeUndefined();

            tab.stopAutoSlide();

            expect(tab.autoSlideId).toBeNull();

            tab.startAutoSlide();

            expect(tab.autoSlideId).not.toBeNull();


        });
    });
});
