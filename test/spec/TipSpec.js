define(function (require) {
    var lib = require('ui/lib');
    var Tip = require('ui/Tip');
    
    var tip;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="tipContainer">'
                +   '<a href="http://www.foo.com/" onclick="return false" class="tooltips" data-tooltips="n/a">'
                +       '<em>foo</em>'
                +   '</a>'
                +   '<a href="http://www.bar.com/" class="tooltips" style="position:absolute;right:0"'
                +   '   data-tooltips="rc">bar</a>'
                + '</div>'
        );

        tip = new Tip({
            mode: 'over',
            arrow: '1',
            showDelay: 0,
            hideDelay: 0,
            offset: {
                x: 5,
                y: 5
            }
        });
        tip.render();

        jasmine.Clock.useMock();
        
    });


    afterEach(function () {
        tip.dispose();
        document.body.removeChild(lib.g('tipContainer'));
    });
  
    describe('基本接口', function () {

        it('控件类型', function () {

            expect(tip.type).toBe('Tip');

        });

        it('点击模式', function () {
            tip.dispose();

            expect(tip.main).toBeUndefined();

            tip = new Tip({
                mode: 'click',
                showDelay: 0,
                hideDelay: 0
            });
            tip.render();

            var links = document.getElementById('tipContainer').getElementsByTagName('a');
            var target = links[0];

            var onBeforeShow = function (json) {
                expect(json.target).toBe(target);

                tip.setTitle('title');
                tip.setContent('content');
            };

            var onHide = function () {
                expect(this.current).toBe(null);
            };

            tip.on('beforeShow', onBeforeShow);
            tip.on('hide', onHide);

            lib.fire(target.firstChild, 'click');

            expect(tip.isVisible()).toBeTruthy();
            expect(tip.elements.title.innerHTML).toBe('title');
            expect(tip.elements.body.innerHTML).toBe('content');

            tip.setTitle();
            expect(tip.elements.title.offsetWidth).toBe(0);

            lib.fire(target, 'click');
            expect(tip.isVisible()).toBeFalsy();

            lib.fire(target.parentNode, 'click');
            expect(tip.isVisible()).toBeFalsy();

            target = links[1];
            lib.fire(target, 'click');

            tip.un('beforeShow', onBeforeShow);
            tip.un('hide', onHide);

        });

        it('hover 模式', function () {
            var links = document.getElementById('tipContainer').getElementsByTagName('a');
            var target = links[0];

            var onBeforeShow = function (json) {
                expect(json.target).toBe(target);

                tip.setTitle('title');
                tip.setContent('content');
            };

            var onHide = function () {
                expect(this.current).toBe(null);
            };

            tip.on('beforeShow', onBeforeShow);
            tip.on('hide', onHide);

            lib.fire(target, 'mouseenter');

            expect(tip.isVisible()).toBeTruthy();
            expect(tip.elements.title.innerHTML).toBe('title');
            expect(tip.elements.body.innerHTML).toBe('content');

            tip.setTitle();
            expect(tip.elements.title.offsetWidth).toBe(0);

            lib.fire(target, 'mouseleave');
            expect(tip.isVisible()).toBeFalsy();

            lib.fire(target.parentNode, 'mouseenter');
            expect(tip.isVisible()).toBeFalsy();

            target = links[1];
            lib.fire(target, 'mouseenter');

            tip.un('beforeShow', onBeforeShow);
            tip.un('hide', onHide);

        });

        it('延迟显示隐藏', function () {
            tip.dispose();

            expect(tip.main).toBeUndefined();

            var delay = 100;

            tip = new Tip({
                mode: 'click',
                showDelay: delay,
                hideDelay: delay
            });
            tip.render();        

            var links = document.getElementById('tipContainer').getElementsByTagName('a');
            var target = links[0];

            lib.fire(target, 'click');

            expect(tip.isVisible()).toBeFalsy();
            jasmine.Clock.tick(delay);
            expect(tip.isVisible()).toBeTruthy();

            lib.fire(target.parentNode, 'click');

            expect(tip.isVisible()).toBeTruthy();
            jasmine.Clock.tick(delay);
            expect(tip.isVisible()).toBeFalsy();

        });
    });

});