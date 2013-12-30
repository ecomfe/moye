define(function (require) {
    var lib = require('ui/lib');
    var ScrollBar = require('ui/ScrollBar');
    
    var scrollbar;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="ecl-ui-scrollbar" class="ecl-ui-scrollbar">'
                +   '<div class="ecl-ui-scrollbar-track">'
                +     '<i id="ecl-ui-scrollbar-thumb" '
                +     'class="ecl-ui-scrollbar-thumb"></i>'
                +   '</div>'
                +   '<div class="ecl-ui-scrollbar-panel" style="width:490px">'
                +     '<div id="ecl-ui-scrollbar-main" '
                +       'style="width:490px;height:500px">'
                +           '<p>测试文本测试文本测试文本</p>'
                +           '<p>测试文本测试文本测试文本</p>'
                +     '</div>'
                +   '</div>'
                + '</div>'
        );

        scrollbar = new ScrollBar({
           main: lib.g('ecl-ui-scrollbar-main'),
           thumb: lib.g('ecl-ui-scrollbar-thumb'),
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

        it('scrollTo', function () {
            var scrollSize = scrollbar.main.scrollHeight 
                - scrollbar.main.parentNode.clientHeight;
            var trackSize = scrollbar.track.clientHeight
                - scrollbar.thumb.offsetHeight;

            scrollbar.scrollTo('begin');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(0);

            scrollbar.scrollTo('end');
            expect(scrollbar.thumb.style.top).toBe(trackSize + 'px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(scrollSize);

            scrollbar.scrollTo('ab');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(0);

            scrollbar.scrollTo(0.5);
            expect(scrollbar.thumb.style.top).toBe( (trackSize/2) + 'px');
            expect(scrollbar.main.parentNode.scrollTop).toBe( 
                scrollSize/2 
            );
        });

        it('onchange', function () {
            var a = 1;
            scrollbar.on('change', scrollbar.options.onChange = function(e) {
                expect(a).toBe(1);
                expect(e.position >=0).toBe(true);
                expect(e.position <=1).toBe(true);
            });
        });

        it('refresh', function () {

            lib.g('ecl-ui-scrollbar-main').innerHTML += 
                lib.g('ecl-ui-scrollbar-main').innerHTML;

            var scrollSize = scrollbar.main.scrollHeight 
                - scrollbar.main.parentNode.clientHeight;
            var trackSize = scrollbar.track.clientHeight
                - scrollbar.thumb.offsetHeight;

            scrollbar.refresh();

            scrollbar.scrollTo('begin');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(0);

            scrollbar.scrollTo('end');
            expect(scrollbar.thumb.style.top).toBe(trackSize + 'px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(scrollSize);

            scrollbar.scrollTo('ab');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.main.parentNode.scrollTop).toBe(0);

            scrollbar.scrollTo(0.5);
            expect(scrollbar.thumb.style.top).toBe( (trackSize/2) + 'px');
            expect(scrollbar.main.parentNode.scrollTop).toBe( 
                scrollSize/2 
            );

        });

        it('disable不影响接口调用', function () {

            var scrollSize = scrollbar.main.scrollHeight 
                - scrollbar.main.parentNode.clientHeight;
            var trackSize = scrollbar.track.clientHeight
                - scrollbar.thumb.offsetHeight;

            scrollbar.scrollTo('begin');
            expect(scrollbar.thumb.style.top).toBe('0px');
            expect(scrollbar.main.scrollTop).toBe(0);

            scrollbar.disable();
            scrollbar.scrollTo(0.5);
            //disable 不影响接口调用
            expect(scrollbar.thumb.style.top).toBe( (trackSize/2) + 'px');
            expect(scrollbar.main.parentNode.scrollTop).toBe( 
                scrollSize/2 
            );

        });

    });

});