define(function (require) {
    var $ = require('jquery');
    var lib = require('ui/lib');
    
    var CalendarExtension = require('ui/CalendarExtension');
    
    var calendarExtension;

    beforeEach(function () {
        var html = ''
            + '<div id="calendarExtensionContainer">'
            + ' <input type="text" class="calendar-extension-trigger" />'
            + ' <input type="button" value="click" class="calendar-extension-trigger" />'
            + '</div>';

        document.body.insertAdjacentHTML(
            'beforeEnd',
            html
        );

        var triggers = $('.calendar-extension-trigger');
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
                var checked = $('.ecl-ui-cal-checked', calendar.main);
                expect(checked.attr('data-date')).toBe(
                    calendar.format(date, 'yyyy-MM-dd')
                );
                var el = checked.next();
                el.trigger('click');
                var pickDate = calendar.from(el.attr('data-date'), 'yyyy-MM-dd');
                expect(target.value).toBe(calendar.format(pickDate));
                done();
            };
            var calendar = calendarExtension.calendar;
            calendar.on('show', onShow);

            calendar.target.value = calendar.format(date);
            $(calendar.target).trigger('click');
            calendar.on('show', onShow);
        });

        it('显示年份菜单', function () {
            var calendar = calendarExtension.calendar;

            // 先使日历显示
            $('.calendar-extension-trigger').trigger('click');

            var yearMenuHandler = calendar.query('ecl-ui-cal-menu-year-handler')[0];

            expect(yearMenuHandler).toBeDefined();

            $(yearMenuHandler).trigger('mouseover');

            var menu = calendarExtension.menus.year;
            expect(menu).toBeDefined();

            var links = menu.main.getElementsByTagName('a');
            var target = links[Math.random() * (links.length - 3) | 0]; // 最后三个链接不是年份

            $(target).trigger('click');

            expect(yearMenuHandler.innerHTML).toBe(target.innerHTML);
        });

        it('显示月份菜单', function () {
            var calendar = calendarExtension.calendar;

            // 先使日历显示
            $('.calendar-extension-trigger').trigger('click');

            var monthMenuHandler = calendar.query('ecl-ui-cal-menu-month-handler')[0];

            expect(monthMenuHandler).toBeDefined();

            $(monthMenuHandler).trigger('mouseover');

            var menu = calendarExtension.menus.month;
            expect(menu).toBeDefined();

            var links = menu.main.getElementsByTagName('a');
            var target = links[Math.random() * links.length | 0];

            $(target).trigger('click');

            expect(monthMenuHandler.innerHTML).toBe(target.innerHTML);
        });
        
    });

});
