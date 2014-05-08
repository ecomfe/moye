define(function (require) {
    var config = require('ui/config');

    var lib = require('ui/lib');        
    var Select = require('ui/Select');
    
    var select;
    var onPick;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="selectContainer">'
                +   '<a href="#" class="' + config.prefix + '-sel-target">'
                +       '<b>商圈</b><i></i>'
                +   '</a>'
                +   '<p class="' + config.prefix + '-sel">'
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
            prefix: config.prefix + '-sel',
            main: lib.q(config.prefix + '-sel')[0],
            target: lib.q(config.prefix + '-sel-target')[0],
            maxLength: 8,
            cols: 2,
            offset: {
                y: -1
            }
        });
        select.render();

        onPick = jasmine.createSpy('onPick');
        
    });


    afterEach(function () {
        document.body.removeChild(lib.g('selectContainer'));
        select.dispose();
        onPick = null;
    });
  
    describe('基本接口', function () {

        it('控件类型', function () {

            expect(select.type).toBe('Select');

        });

        it('显示/隐藏', function () {
            var onShow = jasmine.createSpy('onShow');
            select.once('show', onShow);
            select.show();

            expect(onShow).toHaveBeenCalled();

            var onHide = jasmine.createSpy('onHide');
            select.once('hide', onHide);
            select.hide();

            expect(onHide).toHaveBeenCalled();
        });

        it('选择：无事件', function () {
            select.once('pick', onPick);
            select.pick(select.main.getElementsByTagName('a')[1], true);
            expect(onPick).not.toHaveBeenCalled();
        });

        it('beforeShow', function () {
            var onBeforeShow = jasmine.createSpy('onBeforeShow');
            select.once('beforeShow', onBeforeShow);
            lib.fire(select.target, 'click');
            expect(onBeforeShow).toHaveBeenCalled();
        });

        it('选择：有事件', function () {
            var target = select.main.getElementsByTagName('a')[1];
            select.once('pick', onPick);
            select.pick(target);

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
            select.onClick({});
            expect(onPick).not.toHaveBeenCalled();

            lib.fire(target, 'click');
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
            lib.fire(target, 'click');
            lib.fire(target, 'click');
            expect(onPick).not.toHaveBeenCalled();

            select.enable();
            expect(select.isDisabled()).toBeFalsy();

            lib.fire(target, 'click');
            expect(onPick).toHaveBeenCalled();
            select.un('pick', onPick);
        });


        it('模拟重复点击', function () {
            var target = select.main.getElementsByTagName('a')[2];
            select.on('pick', onPick);

            lib.fire(target, 'click');
            expect(onPick.calls.length).toBe(1);
            lib.fire(target, 'click');
            expect(onPick.calls.length).toBe(1);
            lib.fire(target, 'click');
            expect(onPick.calls.length).toBe(1);
            select.un('pick', onPick);
        });

        it('模拟点击不触发onChange', function () {
            var options = select.main.getElementsByTagName('a');

            var onChange = jasmine.createSpy('onChange');

            select.on('pick', onPick);
            select.on('change', onChange);
            lib.fire(options[2], 'click');
            expect(onPick.calls.length).toBe(1);
            expect(onChange.calls.length).toBe(1);
            options[3].setAttribute(
                'data-value',
                options[2].getAttribute('data-value')
            );
            lib.fire(options[3], 'click');
            expect(onPick.calls.length).toBe(2);
            expect(onChange.calls.length).toBe(1);
            select.un('pick', onPick);
            select.un('change', onChange);
        });

        it('reset', function () {
            var onChange = jasmine.createSpy('onChange');
            select.on('pick', onPick);
            select.on('change', onChange);

            lib.fire(select.main.getElementsByTagName('a')[2], 'click');
            expect(onPick).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalled();

            expect(select.getValue()).toBe(2);
            expect(select.getValue(false)).toBe('2');

            select.reset();
            expect(select.getValue()).toBe(0);
            expect(select.getValue(false)).toBe('0');
        });

        it('datasource', function () {
            select.dispose();
            var container = lib.g('selectContainer');
            container.innerHTML = ''
                + '<input class="' + config.prefix 
                + '-sel-target" value="直辖市">';

            var cities = '直辖市, 北京, 上海, 天津, 重庆'.split(/\s*,\s*/);

            select = new Select({
                prefix: config.prefix + '-sel',
                target: lib.q(config.prefix + '-sel-target')[0],
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
            lib.fire(options[1], 'click');

            expect(onPick).toHaveBeenCalledWith({
                value: cities[1],
                text: cities[1],
                shortText: cities[1],
                type: 'pick'
            });

        });

    });

});
