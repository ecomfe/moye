define(function (require) {

    var $ = require('jquery');
    var lib = require('ui/lib');
    var Tip = require('ui/Tip');

    var tip;

    beforeEach(function () {
        var tpl = ''
            + '<div id="tipContainer">'
            +     '<a href="http://www.foo.com/" onclick="return false" class="tooltips" data-tooltips="n/a">'
            +         '<em>foo</em>'
            +     '</a>'
            +     '<a href="http://www.bar.com/" class="tooltips" style="position:absolute;top:0;left:0;height:50px;width:50px;"'
            +     '   data-tooltips="rt">bar</a>'
            + '</div>';
        $(document.body).append(tpl);

        tip = new Tip({
            mode: 'over',
            arrow: '1',
            offset: {
                x: 5,
                y: 5
            }
        });
        tip.render();

        jasmine.Clock.useMock();
    });


    afterEach(function () {
        tip.destroy();
        $('#tipContainer').remove();
    });

    describe('基本接口', function () {

        it('点击模式', function () {

            tip.destroy();

            expect(tip.main).toBeUndefined();

            tip = new Tip({
                mode: 'click',
                showDelay: 0,
                hideDelay: 0
            });
            tip.render();

            var links = $('#tipContainer a');
            var target = links[0];

            var onShow = function (e) {
                expect(e.target).toBe(target);

                this.setContent('content');
            };

            var onHide = function (e) {
                expect(this.trigger).toBe(null);

                expect(this._dir).not.toBe('n/a');
            };

            tip.on('show', onShow);
            tip.on('hide', onHide);

            $(target).trigger('click');

            expect(tip.isVisible()).toBeTruthy();
            expect(tip.elements.body.innerHTML).toBe('content');

            // title待定
            // tip.setTitle();
            // expect(tip.elements.title.offsetWidth).toBe(0);

            // toggle了
            $(target).trigger('click');
            expect(tip.isVisible()).toBeFalsy();

            $(target).trigger('click');
            $(document).trigger('click');
            expect(tip.isVisible()).toBeFalsy();

            target = links[1];
            $(target).trigger('click');

            tip.un('show', onShow);
            tip.un('hide', onHide);

        });

        it('over 模式', function () {
            tip.destroy();

            expect(tip.main).toBeUndefined();

            var delay = 100;
            tip = new Tip({
                mode: 'over',
                showDelay: delay,
                hideDelay: delay
            });
            tip.render();

            var main = $(tip.main);

            var links = $('#tipContainer a');
            var target = links[0];

            var onBeforeShow = function (e) {
                expect(e.target).toBe(target);

                this.setContent('content');
            };

            var onShow = function (e) {
                expect(e.target).toBe(target);

                // this.setTitle('title');
                this.setContent('content2');
            };

            var onHide = function () {
                expect(this.trigger).toBe(null);
            };

            // main click
            var onClick = function (e) {
                expect(e.type).toBe('click');
            };

            tip.on('beforeshow', onBeforeShow);
            tip.on('show', onShow);
            tip.on('hide', onHide);
            tip.on('click', onClick);

            $(target).trigger('mouseenter');

            main.trigger('click');

            expect(tip.isVisible()).toBeFalsy();
            // expect(tip.elements.title.innerHTML).toBe('title');
            expect(tip.elements.body.innerHTML).toBe('content');

            // tip.setTitle();
            // expect(tip.elements.title.offsetWidth).toBe(0);

            jasmine.Clock.tick(delay);
            expect(tip.isVisible()).toBeTruthy();
            expect(tip.elements.body.innerHTML).toBe('content2');
            $(target).trigger('mouseleave');

            jasmine.Clock.tick(delay);
            expect(tip.isVisible()).toBeFalsy();

            $(target.parentNode).trigger('mouseenter');
            expect(tip.isVisible()).toBeFalsy();

            // main enter leave
            target = links[1];
            $(target).trigger('mouseenter');
            jasmine.Clock.tick(delay);

            main.trigger('mouseenter');
            expect(tip.isVisible()).toBeTruthy();
            main.trigger('mouseleave');
            jasmine.Clock.tick(delay);
            expect(tip.isVisible()).toBeFalsy();

            // clear
            $(target).trigger('mouseenter');
            jasmine.Clock.tick(delay);
            $(target).trigger('mouseleave');
            tip.clear();
            expect(tip.trigger).not.toBe(null);


            tip.un('show', onShow);
            tip.un('hide', onHide);
            tip.un('click', onClick);

        });

        it('static 模式', function () {
            tip.destroy();

            expect(tip.main).toBeUndefined();

            tip = new Tip({
                arrow: '1',
                hideDelay: 0,
                showDelay: 0,
                mode: 'static',
                content: 'static'
            })
            .render();

            var main = $(tip.main);
            main.css({
                width: 100,
                height: 100
            });

            tip.show();
            expect(tip.isVisible()).toBeTruthy();

            // 位置计算(无offset，默认水平居中，垂直0.4)
            var win = $(window);
            var offset = main.offset();
            expect(main.css('position')).toBe('fixed');
            expect(parseInt(offset.left), 10).toBe(parseInt((win.width() - main.width()) / 2), 10);
            expect(parseInt(offset.top), 10).toBe(parseInt((win.height() - main.height()) * 0.4), 10);

            tip.hide();
            expect(tip.isVisible()).toBeFalsy();

            tip.destroy();

        });



        it('其它接口', function () {

            tip.destroy();

            expect(tip.main).toBeUndefined();

            var delay = 100;
            tip = new Tip({
                mode: 'over',
                arrow: 'bl',
                showDelay: delay,
                hideDelay: delay,
                content: 'content',
                offset: {
                    x: 10,
                    y: 10
                }
            });
            tip.render();

            // 位置计算
            var main = $(tip.main);
            main.css('position', 'absolute');

            expect(tip.type).toBe('Tip');

            var tipTarget = $('<div id="tipTarget"></div>');
            tipTarget
                .css({
                    position: 'absolute',
                    height: 100,
                    width: 100,
                    left: 100,
                    top: 100
                })
                .appendTo(document.body);

            var links = $('#tipContainer a');
            var target = links[1];

            $(target).trigger('mouseenter');
            jasmine.Clock.tick(delay);

            // rt
            expect(main.offset().top).toBe(10);
            expect(main.offset().left).toBe(60);

            // setTarget
            tip.setTarget(tipTarget.get(0));

            $(target).trigger('mouseleave');
            jasmine.Clock.tick(delay);
            $(target).trigger('mouseenter');
            jasmine.Clock.tick(delay);

            // bl
            expect(main.offset().top).toBe(210);
            expect(main.offset().left).toBe(110);

            $(window).trigger('resize');

            var onBeforeShow = function (e) {
                e.preventDefault();
            };

            // preventDefault
            tip.on('beforeshow', onBeforeShow);

            $(target).trigger('mouseleave');
            jasmine.Clock.tick(delay);
            $(target).trigger('mouseenter');
            jasmine.Clock.tick(delay);
            expect(tip.isVisible()).toBeFalsy();

            tipTarget.remove();
        });

        it('liveTriggers', function () {
            tip.destroy();

            expect(tip.main).toBeUndefined();

            var delay = 100;
            tip = new Tip({
                mode: 'over',
                showDelay: delay,
                hideDelay: delay,
                liveTriggers: '#tipContainer',
                trigger: '.tooltips'
            });
            tip.render();

            var tipContainer = $('#tipContainer');
            var links = $('#tipContainer a');
            var target = links[0];

            tipContainer.trigger({
                type: 'mouseenter',
                target: target
            });
            jasmine.Clock.tick(delay);
            expect(tip.isVisible()).toBeTruthy();
            tipContainer.trigger({
                type: 'mouseleave',
                target: target
            });
            jasmine.Clock.tick(delay);

            tipContainer.append('<span class="tooltips live-test">test</span>');

            expect(tip.isVisible()).toBeFalsy();

            var newTarget = $('.live-test').get(0);

            tipContainer.trigger({
                type: 'mouseenter',
                target: newTarget
            });

            jasmine.Clock.tick(delay);
            expect(tip.isVisible()).toBeTruthy();

        });
    });

});
