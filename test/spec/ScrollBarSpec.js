define(function (require) {
    var $ = require('jquery');
    var lib = require('ui/lib');
    var ScrollBar = require('ui/ScrollBar');

    var scrollbar;

    beforeEach(function () {

        var html = ''
            + '<div id="ecl-ui-scrollbar" class="ecl-ui-scrollbar">'
            +   '<div class="ecl-ui-scrollbar-track">'
            +       '<i id="ecl-ui-scrollbar-thumb" '
            +           'class="ecl-ui-scrollbar-thumb"></i>'
            +   '</div>'
            +   '<div class="ecl-ui-scrollbar-panel" style="width:490px">'
            +       '<div id="ecl-ui-scrollbar-main" '
            +           'style="width:490px;height:500px">'
            +           '<p>测试文本测试文本测试文本</p>'
            +           '<p>测试文本测试文本测试文本</p>'
            +       '</div>'
            +   '</div>'
            + '</div>';

        document.body.insertAdjacentHTML('beforeEnd', html);

        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: '/src/css/ScrollBar.less'
        }).appendTo('head');

        scrollbar = new ScrollBar({
            main: lib.g('ecl-ui-scrollbar'),
            disabled: 0
        });

        scrollbar.render();

    });


    afterEach(function () {
        scrollbar.dispose();
        document.body.removeChild(lib.g('ecl-ui-scrollbar'));
    });

    describe('基本接口', function () {


        it('控件类型', function () {
            expect(scrollbar.type).toBe('ScrollBar');
        });

        it('scrollTo begin', function () {
            scrollbar.scrollTo('begin');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.panel.scrollTop).toBe(0);
        });

        it('scrollTo end', function () {
            var scrollSize = scrollbar.panel.scrollHeight
                - scrollbar.track.clientHeight;
            var trackSize = scrollbar.track.clientHeight
                - scrollbar.thumb.offsetHeight;

            scrollbar.scrollTo('end');
            expect(scrollbar.thumb.style.top).toBe(trackSize + 'px');
            expect(scrollbar.panel.scrollTop).toBe(scrollSize);
        });

        it('scrollTo ab', function () {

            scrollbar.scrollTo('ab');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.panel.scrollTop).toBe(0);
            
        });

        it('scrollTo 50%', function () {
            var scrollSize = scrollbar.panel.scrollHeight
                - scrollbar.main.clientHeight;
            var trackSize = scrollbar.track.clientHeight
                - scrollbar.thumb.offsetHeight;
            scrollbar.scrollTo(0.5);
            expect(scrollbar.thumb.style.top)
                .toBe(Math.round(trackSize / 2) + 'px');
            expect(scrollbar.panel.scrollTop).toBe(Math.round(scrollSize / 2));
        });

        it('onchange', function () {
            var a = 1;
            scrollbar.on('change', scrollbar.options.onChange = function (e) {
                expect(a).toBe(1);
                expect(e.position >= 0).toBe(true);
                expect(e.position <= 1).toBe(true);
            });
        });

        it('refresh', function () {

            lib.g('ecl-ui-scrollbar-main').innerHTML +=
                lib.g('ecl-ui-scrollbar-main').innerHTML;

            var scrollSize = scrollbar.panel.scrollHeight
                - scrollbar.main.clientHeight;
            var trackSize = scrollbar.track.clientHeight
                - scrollbar.thumb.offsetHeight;

            scrollbar.refresh();

            scrollbar.scrollTo('begin');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.panel.scrollTop).toBe(0);

            scrollbar.scrollTo('end');
            expect(scrollbar.thumb.style.top).toBe(trackSize + 'px');
            expect(scrollbar.panel.scrollTop).toBe(scrollSize);

            scrollbar.scrollTo('ab');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.panel.scrollTop).toBe(0);

            scrollbar.scrollTo(0.5);
            expect(scrollbar.thumb.style.top)
                .toBe(Math.round(trackSize / 2) + 'px');
            expect(scrollbar.panel.scrollTop).toBe(Math.round(scrollSize / 2));

        });

        it('disable不影响接口调用', function () {

            var scrollSize = scrollbar.panel.scrollHeight
                - scrollbar.main.clientHeight;
            var trackSize = scrollbar.track.clientHeight
                - scrollbar.thumb.offsetHeight;

            scrollbar.scrollTo('begin');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.panel.scrollTop).toBe(0);

            scrollbar.disable();
            expect($(scrollbar.main).hasClass('ecl-ui-scrollbar-disable')).toBe(true);
            scrollbar.scrollTo(0.5);
            // disable 不影响接口调用
            expect(scrollbar.thumb.style.top)
                .toBe(Math.round(trackSize / 2) + 'px');
            expect(scrollbar.panel.scrollTop).toBe(Math.round(scrollSize / 2));

            scrollbar.enable();
            expect($(scrollbar.main).hasClass('ecl-ui-scrollbar-disable')).toBe(false);

        });

        it('over & out', function () {
            expect($(scrollbar.main).hasClass('ecl-ui-scrollbar-over')).toBe(false);
            $(scrollbar.main).trigger('mouseenter');
            expect($(scrollbar.main).hasClass('ecl-ui-scrollbar-over')).toBe(true);
            
            $(scrollbar.main).trigger('mouseleave');
            expect($(scrollbar.main).hasClass('ecl-ui-scrollbar-over')).toBe(false);           
        });

        it('事件', function () {
            var wheelEvent = lib.browser.firefox ? 'DOMMouseScroll' : 'mousewheel';
            $(scrollbar.thumb).trigger('mousedown');
            $(scrollbar.track).trigger('mouseup');
            $(scrollbar.panel).trigger(wheelEvent);

            $(document).trigger('mousemove');
            $(document).trigger('mouseup');

            expect(1).toBe(1);
        });

    });

});
