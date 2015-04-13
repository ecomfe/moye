define(function (require) {

    var $ = require('jquery');
    var lib = require('ui/lib');
    var Select = require('ui/Select');

    var select;
    var onPick;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd',
            '<div id="cycle" class="ui-select"></div></div>'
        );

        select = new Select({
            main: lib.g('cycle'),
            datasource: [{
                value: 1,
                name: 1
            }, {
                value: 2,
                name: 2
            }]
        }).render();

        onPick = jasmine.createSpy('onPick');
    });


    afterEach(function () {
        document.body.removeChild(lib.g('cycle'));
        select.dispose();
        onPick = null;
    });

    describe('基本接口', function () {

        it('控件类型', function () {
            expect(select.type).toBe('Select');
        });

        it('Popup', function () {
            expect(!!select.popup).toBeTruthy();
        });

        it('显示 / `show` 事件', function () {
            var spy = jasmine.createSpy();
            select.on('show', spy);
            $('#cycle').trigger('click');
            jasmine.Clock.tick(100);
            expect(spy).toHaveBeenCalled();
        });

        it('显示 / expanded状态', function () {
            var spy = jasmine.createSpy();
            select.on('show', spy);
            $('#cycle').trigger('click');
            jasmine.Clock.tick(100);
            expect(select.hasState('expanded')).toBeTruthy();
        });

        it('隐藏 / `hide` 事件', function () {
            var spy = jasmine.createSpy();
            select.on('show', spy);
            $('#cycle').trigger('click');
            jasmine.Clock.tick(100);
            $('body').trigger('click');
            jasmine.Clock.tick(100);
            expect(spy).toHaveBeenCalled();
        });

        it('隐藏 / expanded 状态', function () {
            var spy = jasmine.createSpy();
            select.on('show', spy);
            $('#cycle').trigger('click');
            jasmine.Clock.tick(100);
            $('body').trigger('click');
            jasmine.Clock.tick(100);
            expect(select.hasState('expanded')).toBeFalsy();
        });

        it('模拟点击', function () {
            var spy = jasmine.createSpy();
            var target = $('.ui-select-option:eq(1)', select.popup.main);
            select.on('change', spy);
            target.trigger('click');
            jasmine.Clock.tick(100);
            expect(spy).toHaveBeenCalled();
        });

        it('模拟点击不触发onChange', function () {
            var options = $('.ui-select-option', select.popup.main);
            var spy = jasmine.createSpy('onChange');
            select.on('change', spy);
            select.setValue(1);
            $(options[0]).trigger('click');
            jasmine.Clock.tick(100);
            expect(spy).not.toHaveBeenCalled();
        });

        it('datasource', function () {

            var datasource = [{
                value: 3,
                name: 'a3'
            }, {
                value: 4,
                name: 'a4'
            }, {
                value: 5,
                name: 'a5'
            }];

            select.set('datasource', datasource);

            var options = $('.ui-select-option', select.popup.main);

            expect(options.length).toBe(3);

            options.each(function (i) {
                expect($(this).data('value')).toBe(datasource[i].value);
            });

            var spy = jasmine.createSpy();

            select.once('change', spy);

            options.trigger('click');
            jasmine.Clock.tick(100);
            expect(spy).toHaveBeenCalled();

        });

    });
});
