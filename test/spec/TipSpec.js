define(function (require) {
    var lib = require('ui/lib');
    var Tip = require('ui/Tip');
    
    var tip;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="tipContainer" class="result-op"'
                + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}"'
                + ' style="display:none">'
                +   '<a href="http://www.baidu.com/"'
                +   '   class="tooltips" data-tooltips="n/a">百度</a>'
                +   '<a href="http://www.google.com/" class="tooltips"'
                +   '   style="position:absolute;right:0"'
                +   '   data-tooltips="rc">谷歌</a>'
                + '</div>'
        );

        tip = new Tip({
            mode: 'over',
            arrow: '1',
            hideDelay: 0,
            offset: { x: 5, y: 5}
          });
        tip.render();
        
    });


    afterEach(function () {
        tip.dispose();
        document.body.removeChild(lib.g('tipContainer'));
    });
  
    describe('基本接口', function () {

        it('控件类型', function () {

            expect(tip.type).toBe('Tip');

        });

        it('onShow', function () {
            var links = document.getElementById('tipContainer')
                .getElementsByTagName('a');
            var target = links[0];
            var event = {target: target};

            var onBeforeShow = function (json) {
                expect(json.target).toBe(target);
                expect(this.current).toBe(target);
                expect(json.event).toBe(event);

                tip.setTitle('title');
                tip.setContent('content');
            };

            var onHide = function () {
                expect(this.current).toBe(null);
            };

            tip.on('beforeShow', onBeforeShow);
            tip.on('hide', onHide);
            tip.onShow(event);

            expect(tip.isVisible()).toBeTruthy();
            expect(tip.elements.title.innerHTML).toBe('title');
            expect(tip.elements.body.innerHTML).toBe('content');

            tip.setTitle();
            expect(tip.elements.title.offsetWidth).toBe(0);

            tip.onHide();
            expect(tip.isVisible()).toBeFalsy();

            tip.onShow({target: target.parentNode});
            expect(tip.isVisible()).toBeFalsy();

            target = links[1];
            event.target = target;
            tip.onShow(event);

            tip.un('beforeShow', onBeforeShow);
            tip.un('hide', onHide);

        });

    });

});