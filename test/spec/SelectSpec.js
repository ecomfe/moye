define(function (require) {

    var $ = require('jquery');
    var lib = require('ui/lib');
    var Select = require('ui/Select');

    var select;
    var onPick;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="selectContainer">'
                +   '<a href="#" class="ecl-ui-sel-target">'
                +       '<b>商圈</b><i></i>'
                +   '</a>'
                +   '<p class="ecl-ui-sel">'
                +       '<a href="#" data-value="0">不限</a>'
                +       '<a href="#" data-value="1">中关村、上地</a>'
                +       '<a href="#" data-value="2">亚运村</a>'
                +       '<a href="#" data-value="3">公主坟商圈</a>'
                +       '<a href="#" data-value="4">劲松潘家园</a>'
                +       '<a href="#" data-value="5">北京南站商圈超长</a>'
                +     '</p>'
                + '</div>'
        );

        select = new Select({
            prefix: 'ecl-ui-sel',
            main: $('.ecl-ui-sel')[0],
            target: $('.ecl-ui-sel-target')[0],
            maxLength: 8,
            cols: 2,
            offset: {
                y: -1
            }
        });
        select.render();

        onPick = jasmine.createSpy('onPick');

        jasmine.clock().install();
    });


    afterEach(function () {
        document.body.removeChild(lib.g('selectContainer'));
        select.dispose();
        onPick = null;
        jasmine.clock().uninstall();
    });

    describe('基本接口', function () {

        it('控件类型', function () {

            expect(select.type).toBe('Select');

        });

        it('显示/隐藏', function () {
            var onShow = jasmine.createSpy('onShow');
            select.popup.once('show', onShow);
            $(select.target).trigger('click');


            var onHide = jasmine.createSpy('onHide');
            select.popup.once('hide', onHide);


            jasmine.clock().tick(101);

            expect(onShow).toHaveBeenCalled();
            $(document).trigger('click');
            $(window).trigger('resize');
            expect(onHide).toHaveBeenCalled();

        });

        it('beforeShow', function () {
            var onBeforeShow = jasmine.createSpy('onBeforeShow');
            select.once('beforeShow', onBeforeShow);
            // lib.fire(select.target, 'click');
            $(select.target).trigger('click');
            expect(onBeforeShow).toHaveBeenCalled();
        });

        it('选择：有事件', function () {
            var target = select.main.getElementsByTagName('a')[1];
            select.once('pick', onPick);
            // lib.fire(target, 'click');
            $(target).trigger('click');

            expect(onPick).toHaveBeenCalledWith({
                value: target.getAttribute('data-value') | 0,
                text: target.innerHTML,
                shortText: '中关...',
                type: 'pick'
            });
        });

        it('模拟点击', function () {
            var target = select.main.getElementsByTagName('a')[2];
            select.once('pick', onPick);

            // lib.fire(target, 'click');
            $(target).trigger('click');
            expect(onPick).toHaveBeenCalledWith({
                value: target.getAttribute('data-value') | 0,
                text: target.innerHTML,
                shortText: target.innerHTML,
                type: 'pick'
            });
        });

        it('disable && enable', function () {
            var target = select.main.getElementsByTagName('a')[2];

            select.disable();
            expect(select.isDisabled()).toBeTruthy();

            select.once('pick', onPick);
            // lib.fire(target, 'click');
            // lib.fire(target, 'click');
            $(target).trigger('click');
            $(target).trigger('click');
            expect(onPick).not.toHaveBeenCalled();

            select.enable();
            expect(select.isDisabled()).toBeFalsy();

            // lib.fire(target, 'click');
            $(target).trigger('click');
            expect(onPick).toHaveBeenCalled();
            select.un('pick', onPick);
        });


        it('模拟重复点击', function () {
            var target = select.main.getElementsByTagName('a')[2];
            select.on('pick', onPick);

            // lib.fire(target, 'click');
            $(target).trigger('click');
            expect(onPick.calls.count()).toBe(1);
            // lib.fire(target, 'click');
            $(target).trigger('click');
            expect(onPick.calls.count()).toBe(1);
            // lib.fire(target, 'click');
            $(target).trigger('click');
            expect(onPick.calls.count()).toBe(1);
            select.un('pick', onPick);
        });

        it('模拟点击不触发onChange', function () {
            var options = select.main.getElementsByTagName('a');

            var onChange = jasmine.createSpy('onChange');

            select.on('pick', onPick);
            select.on('change', onChange);
            // lib.fire(options[2], 'click');
            $(options[2]).trigger('click');
            expect(onPick.calls.count()).toBe(1);
            expect(onChange.calls.count()).toBe(1);
            options[3].setAttribute(
                'data-value',
                options[2].getAttribute('data-value')
            );
            // lib.fire(options[3], 'click');
            $(options[3]).trigger('click');
            expect(onPick.calls.count()).toBe(2);
            expect(onChange.calls.count()).toBe(1);
            select.un('pick', onPick);
            select.un('change', onChange);
        });

        it('reset', function () {
            var onChange = jasmine.createSpy('onChange');
            select.on('pick', onPick);
            select.on('change', onChange);

            // lib.fire(select.main.getElementsByTagName('a')[2], 'click');
            $(select.main.getElementsByTagName('a')[2]).trigger('click');
            expect(onPick).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalled();

            expect(select.getValue()).toBe(2);
            expect(select.getValue(false)).toBe('2');

            select.reset();
            expect(select.getValue()).toBe(0);
            expect(select.getValue(false)).toBe('');
        });

        it('datasource', function () {
            select.dispose();
            var container = lib.g('selectContainer');
            container.innerHTML = ''
                + '<input class="ecl-ui-sel-target" value="直辖市">';

            var cities = '直辖市, 北京, 上海, 天津, 重庆'.split(/\s*,\s*/);

            select = new Select({
                prefix: 'ecl-ui-sel',
                target: $('.ecl-ui-sel-target')[0],
                datasource: cities,
                valueUseIndex: false,
                maxLength: 8
            }).render();

            var options = select.main.getElementsByTagName('a');

            expect(options.length).toBe(5);

            for (var i = 0, len = options.length; i < len; i++) {
                expect(
                    options[i].getAttribute('data-value')
                ).toBe(cities[i]);
            }

            select.once('pick', onPick);
            // lib.fire(options[1], 'click');
            $(options[1]).trigger('click');

            expect(onPick).toHaveBeenCalledWith({
                value: cities[1],
                text: cities[1],
                shortText: cities[1],
                type: 'pick'
            });

        });

    });
});
