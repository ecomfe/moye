define(function (require) {
    var lib = require('ui/lib');
    
    var CalendarExtension = require('ui/CalendarExtension');
    
    var calendarExtension;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="calendarExtensionContainer">'
                + ' <input type="text" class="calendar-extension-trigger" />'
                + ' <input type="button" value="click" class="calendar-extension-trigger" />'
                + '</div>'
        );

        var triggers = lib.q('calendar-extension-trigger');
        calendarExtension = new CalendarExtension({
            triggers: triggers,
            target: triggers[0]
        });
        calendarExtension.render();
    });


    afterEach(function () {
        document.body.removeChild(lib.g('calendarExtensionContainer'));
        calendarExtension.dispose();
    });
  
    describe('基本操作', function () {

        it('选取日期', function (done) {
            var date = new Date(new Date() - 3600 * 24);
            var onShow = function (arg) {
                var target = arg.target;
                expect(target).toBe(calendar.target);

                var checked = calendar.query('ecl-ui-cal-checked')[0];
                expect(checked.getAttribute('data-date')).toBe(
                    calendar.format(date, 'yyyy-MM-dd')
                );

                var el = lib.dom.next(checked)
                    || dom._matchNode(
                        target,
                        'previousSibling',
                        'previousSibling'
                    );

                lib.fire(el, 'click');

                var pickDate = calendar.from(
                    el.getAttribute('data-date'),
                    'yyyy-MM-dd'
                );

                expect(target.value).toBe(calendar.format(pickDate));

                done();

            };
            var calendar = calendarExtension.calendar;
            calendar.on('show', onShow);

            calendar.target.value = calendar.format(date);
            lib.fire(calendar.target, 'click');

            calendar.on('show', onShow);
        });

        it('显示年份菜单', function () {
            var calendar = calendarExtension.calendar;

            // 先使日历显示
            lib.fire(lib.q('calendar-extension-trigger')[0], 'click');

            var yearMenuHandler = calendar.query('ecl-ui-cal-menu-year-handler')[0];

            expect(yearMenuHandler).toBeDefined();

            lib.fire(yearMenuHandler, 'mouseover');

            var menu = calendarExtension.menus.year;
            expect(menu).toBeDefined();

            var links = menu.main.getElementsByTagName('a');
            var target = links[Math.random() * (links.length - 3) | 0]; // 最后三个链接不是年份

            lib.fire(target, 'click');

            expect(yearMenuHandler.innerHTML).toBe(target.innerHTML);
        });

        it('显示月份菜单', function () {
            var calendar = calendarExtension.calendar;

            // 先使日历显示
            lib.fire(lib.q('calendar-extension-trigger')[0], 'click');

            var monthMenuHandler = calendar.query('ecl-ui-cal-menu-month-handler')[0];

            expect(monthMenuHandler).toBeDefined();

            lib.fire(monthMenuHandler, 'mouseover');

            var menu = calendarExtension.menus.month;
            expect(menu).toBeDefined();

            var links = menu.main.getElementsByTagName('a');
            var target = links[Math.random() * links.length | 0];

            lib.fire(target, 'click');

            expect(monthMenuHandler.innerHTML).toBe(target.innerHTML);
        });
        
    });


});