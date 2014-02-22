define(function (require) {
    var lib = require('ui/lib');
    var Filter = require('ui/Filter');
    
    
    var filter;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="filterContainer" class="result-op"'
                + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}"'
                + ' style="display:none">'
                +   '<form class="ecl-ui-filter" autocomplete="off">'
                +      '<p>按类型：'
                +      '    <label>'
                +      '        <input type="radio"'
                +      '            name="type" />全部'
                +      '    </label>'
                +      '    <label class="checked">'
                +      '        <input type="radio" name="type" value="1"'
                +      '            checked="checked" />角色扮演'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="radio"'
                +      '            name="type" value="2" />运动休闲'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="radio"'
                +      '            name="type" value="3" />射击游戏'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="radio"'
                +      '            name="type" value="4" />回合游戏'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="radio"'
                +      '            name="type" value="5" />策略经营'
                +      '    </label>'
                +      '</p>'
                +      '<p>按特色：'
                +      '    <label>'
                +      '        <input type="checkbox"'
                +      '            name="special" value="" />全部'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="checkbox"'
                +      '            name="special" value="1" />奇幻'
                +      '    </label>'
                +      '    <label class="checked">'
                +      '        <input type="checkbox" name="special"'
                +      '           value="2" checked="checked" />玄幻'
                +      '    </label>'
                +      '    <label class="checked">'
                +      '        <input type="checkbox" name="special"'
                +      '           value="3" checked="checked" />武侠'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="checkbox"'
                +      '            name="special" value="4" />历史'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="checkbox"'
                +      '            name="special" value="5" />写实'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="checkbox"'
                +      '            name="special" value="6" />魔幻'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="checkbox"'
                +      '            name="special" value="7" />体育'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="checkbox"'
                +      '            name="special" value="8" />科幻'
                +      '    </label>'
                +      '    <label>'
                +      '        <input type="checkbox"'
                +      '            name="special" value="9" />狂欢'
                +      '    </label>'
                +      '</p>'
                +   '</form>'
                + '</div>'
        );

        filter = new Filter({
            prefix: 'ecl-ui-filter',
            main: lib.q('ecl-ui-filter')[0],
            groups: 'p'
        });
        filter.render();
        
    });


    afterEach(function () {
        document.body.removeChild(lib.g('filterContainer'));
        filter.dispose();
    });
  
    describe('基本接口', function () {

        it('控件类型', function () {

            expect(filter.type).toBe('Filter');

        });

        it('getData', function () {
            
            expect(filter.getData('type'))
                .toEqual({key: 'type', value: ['1']});
            
            expect(filter.getData('special'))
                .toEqual({key: 'special', value: ['2', '3']});

        });

        it('disable & enable Items', function () {
            
            filter.disableItems('type', ['1', '2']);
            var inputs = filter.groups.type.getElementsByTagName('input');

            expect(inputs[1].checked).toBeFalsy();

            filter.enableItems('type');
            expect(inputs[2].parentNode.className)
                .not
                .toMatch(/\bdisabled\b/);

        });

        it('onClick - radio', function () {
            var firedClick = false;
            var firedChange = false;
            var inputs = filter.groups.type.getElementsByTagName('input');
            var target = inputs[3];
            var event = {target: target};

            var onClick = function () {
                firedClick = !firedClick;
            };

            var onChange = function (json) {
                firedChange = true;

                expect(json.key).toBe(target.name);
                expect(json.value[0]).toBe(target.value);
            };


            filter.on('click', onClick);
            filter.on('change', onChange);

            lib.fire(event.target, 'click');
            lib.fire(event.target, 'click');

            expect(firedClick).toBeFalsy();
            expect(firedChange).toBeTruthy();

            target = inputs[0];
            event.target = target.parentNode;
            lib.fire(event.target, 'click');
            lib.fire(event.target, 'click');

            filter.un('click', onClick);
            filter.un('change', onChange);

            expect(lib.q('checked', target.parentNode.parentNode).length)
                .toBe(1);
        });

        it('onClick - checkbox', function () {
            var inputs = filter.groups.special
                .getElementsByTagName('input');
            var target = inputs[3];
            var event = {target: target};
            var changeCount = 0;

            var onChange = function (json) {
                changeCount++;

                expect(json.key).toBe(target.name);

                lib.each(json.value, function (v) {
                    v && expect(inputs[v].checked).toBe(true);
                });
            };


            filter.on('change', onChange);
            lib.fire(event.target, 'click');
            expect(changeCount).toBe(1);

            target = inputs[0];
            event.target = target.parentNode;

            lib.fire(event.target, 'click');
            expect(changeCount).toBe(2);

            lib.fire(event.target, 'click');
            expect(changeCount).toBe(2);

            expect(lib.q('checked', target.parentNode.parentNode).length)
                .toBe(1);

            target = inputs[1];
            event.target = target;
            lib.fire(event.target, 'click');

            expect(changeCount).toBe(3);

            filter.un('change', onChange);

        });

    });

});