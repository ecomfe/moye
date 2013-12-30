define(function (require) {
    var lib = require('ui/lib');        
    var Tabs = require('ui/Tabs');

    var tabs;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd',
            ''
                + '<div class="ecl-ui-tabs">'
                +   '<ul class="ecl-ui-tabs-labels">'
                +       '<li>CSS控件</li>'
                +       '<li class="ecl-ui-tabs-selected">UI控件拆分</li>'
                +       '<li>UI栅格化设计</li>'
                +       '<li>如何使用</li>'
                +       '<li>新UI设计规范</li>'
                +       '<li>再点你也切换不了</li>'
                +   '</ul>'
                + '</div>'
        );

        tabs = new Tabs({
            main: lib.q('ecl-ui-tabs')[0],
            selectedIndex: 0
        }).render();

        jasmine.Clock.useMock();
    });


    afterEach(function () {
        tabs.dispose();
        tabs = null;
    });
    
    describe('create a instance', function () {
        
        it('auto compute selectedIndex', function () {
            var selected = lib.q('ecl-ui-tabs-selected', tabs.main)[0];
            var selectedIndex = selected.getAttribute('data-index') | 0;
            expect(tabs.selectedIndex).toBe(selectedIndex);
        });

        it('event:onChange', function () {
            var index = 4;
            var selected = tabs.labels[index];
            var count = 0;
            var onChange = function (e) {
                expect(e.newIndex).toBe(index);
                expect(e.selected).toBe(selected);
                count++;
            };
            tabs.on('change', onChange);
            lib.fire(tabs.labels[index], 'click');
            lib.fire(tabs.labels[index], 'click');

            expect(count).toBe(1);
            tabs.un('change', onChange);
        });

        it('simulate ie6 behavior', function () {
            var main = tabs.main;
            tabs.labels[tabs.selectedIndex].className = '';
            tabs.dispose();

            lib.browser.ie6 = true;
            var index = 3;

            tabs = new Tabs({
                main: main,
                selectedIndex: index
            }).render();

            expect(tabs.selectedIndex).toBe(index);

            index = 4;
            var iTag = tabs.labels[index].getElementsByTagName('i')[0];
            tabs.on('change', function (e) {
                expect(e.newIndex).toBe(index);
                expect(e.selected).toBe(selected);
                expect(tabs.selectedIndex).toBe(index);
            });
            lib.fire(iTag, 'click');
        });

        it('enable change', function () {
            tabs.onBeforeChange = function () {
                return true;
            };

            var onChange = jasmine.createSpy('onChange');
            var rndIndex = Math.floor(Math.random() * tabs.labels.length);

            tabs.on('change', onChange);
            lib.fire(tabs.labels[rndIndex], 'click');
            onChange();

            // jasmine.Clock.tick(100);
            expect(onChange).toHaveBeenCalled();
        });

        it('disabled change', function () {
            tabs.onBeforeChange = function () {
                return false;
            };

            var onChange = jasmine.createSpy('onChange');
            var rndIndex = Math.random() * tabs.labels.length | 0;

            tabs.on('change', onChange);
            lib.fire(tabs.labels[rndIndex], 'click');
            
            // jasmine.Clock.tick(100);
            expect(onChange).not.toHaveBeenCalled();
        });
    });


});