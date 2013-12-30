define(function (require) {
    var lib = require('ui/lib');        
    var Select = require('ui/Select');
    
    var select;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="selectContainer" class="result-op"'
                + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}"'
                + ' style="display:none">'
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
            main: lib.q('ecl-ui-sel')[0],
            target: lib.q('ecl-ui-sel-target')[0],
            maxLength: 8,
            cols: 2,
            offset: {
              y: -1
            }
          });
        select.render();
        
    });


    afterEach(function () {
        document.body.removeChild(lib.g('selectContainer'));
        select.dispose();
    });
  
    describe('基本接口', function () {

        it('控件类型', function () {

            expect(select.type).toBe('Select');

        });

        it('显示/隐藏', function () {
            var isVisible = false;
            select.on('show', function () {
                isVisible = true;
                select.un(arguments.callee);
            });
            select.show();

            expect(isVisible).toBeTruthy();

            var isHide = false;
            select.on('hide', function () {
                isHide = true;
                select.un(arguments.callee);
            });
            select.hide();

            expect(isHide).toBeTruthy();
        });

        it('选择：无事件', function () {
            var isFired = false;
            var onPick = function () {
                isFired = true;
            };
            select.on('pick', onPick);
            select.pick(select.main.getElementsByTagName('a')[1], true);
            select.un('pick', onPick);
            select.reset();
            expect(isFired).toBeFalsy();
        });

        it('beforeShow', function () {
            var isFired = false;
            var onBeforeShow = function () {
                isFired = true;
            };
            select.on('beforeShow', onBeforeShow);
            lib.fire(select.target, 'click');
            //select.onBeforeShow({event: {target: select.target}});
            select.un('beforeShow', onBeforeShow);
            expect(isFired).toBeTruthy();
        });

        it('选择：有事件', function () {
            var isFired = false;
            var target = select.main.getElementsByTagName('a')[1];
            var onPick = function (json) {
                isFired = true;
                expect(json.value)
                    .toBe(target.getAttribute('data-value') | 0);
                expect(json.text).toBe(target.innerHTML);
                expect(json.shortText).toBe('中关...');
           };
            select.on('pick', onPick);
            select.pick(target);
            select.un('pick', onPick);
            select.reset();
            expect(isFired).toBeTruthy();
        });

        it('模拟点击', function () {
            var isFired = false;
            var target = select.main.getElementsByTagName('a')[2];
            var onPick = function (json) {
                isFired = true;
                expect(json.value)
                    .toBe(target.getAttribute('data-value') | 0);
                expect(json.text).toBe(target.innerHTML);
                expect(json.shortText).toBe(json.text);
            };
            select.on('pick', onPick);
            select.onClick({});
            expect(isFired).toBeFalsy();
            lib.fire(target, 'click');
            select.un('pick', onPick);
            select.reset();
            expect(isFired).toBeTruthy();
        });

        it('disable && enable', function () {
            var count = 0;
            var target = select.main.getElementsByTagName('a')[2];
            var onPick = function () {
                count++;
            };

            select.disable();
            expect(select.isDisabled()).toBeTruthy();

            select.on('pick', onPick);
            lib.fire(target, 'click');
            lib.fire(target, 'click');
            expect(count).toBe(0);

            select.enable();
            expect(select.isDisabled()).toBeFalsy();

            lib.fire(target, 'click');
            expect(count).toBe(1);
            lib.fire(target, 'click');
            expect(count).toBe(1);
            select.un('pick', onPick);
            select.reset();
        });


        it('模拟重复点击', function () {
            var count = 0;
            var target = select.main.getElementsByTagName('a')[2];
            var onPick = function () {
                count++;
            };
            select.on('pick', onPick);
            lib.fire(target, 'click');
            expect(count).toBe(1);
            lib.fire(target, 'click');
            expect(count).toBe(1);
            lib.fire(target, 'click');
            expect(count).toBe(1);
            select.un('pick', onPick);
            select.reset();
        });

        it('模拟点击不触发onChange', function () {
            var count = 0;
            var onChangeCount = 0;
            var options = select.main.getElementsByTagName('a');
            var oldValue = options[3].getAttribute('data-value');

            var onPick = function () {
                count++;
            };
            var onChange = function () {
                onChangeCount++;
            };

            select.on('pick', onPick);
            select.on('change', onChange);
            lib.fire(options[2], 'click');
            expect(count).toBe(1);
            expect(onChangeCount).toBe(1);
            options[3].setAttribute(
                'data-value',
                options[2].getAttribute('data-value')
            );
            lib.fire(options[3], 'click');
            expect(count).toBe(2);
            expect(onChangeCount).toBe(1);
            select.un('pick', onPick);
            select.un('change', onChange);
            options[3].setAttribute('data-value', oldValue);
            select.reset();
        });

    });

});