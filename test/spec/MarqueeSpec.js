/**
 * @file MOYE - Marquee - 测试用例
 * @author cxtom(cxtom2010@gmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var Marquee = require('ui/Marquee');

    var marquee;

    function createMarquee(options) {
        options = $.extend({
            main: $('#marquee')
        }, options || {});

        marquee && marquee.dispose();
        marquee = new Marquee(options);
        marquee.render();
    }

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', '<div id="marquee" class="ui-marquee"></div>'
        );

        createMarquee({
            content: '这是一句话，句话，话。这是一句话，句话，话。这是一句话，句话，话。'
        });
    });


    afterEach(function () {
        marquee.dispose();
        $('#marquee').remove();
    });

    describe('Marquee 标准', function () {

        it('基础属性', function () {
            expect(marquee.itemHtml).toContain('span');
            expect(marquee.itemHtml).toContain(marquee.getGapStr());
            expect(marquee.itemHtml).toContain(marquee.content);
            expect(marquee.main.html()).toContain(marquee.itemHtml);

            expect(marquee.width).toBe(marquee.item.outerWidth());
            expect(marquee.height).toBe(marquee.item.outerHeight());

            createMarquee({
                direction: 'other'
            });
            expect(marquee.getDirection()).toBe('left');
        });

        it('data-content', function () {
            $('#marquee').data('content', 'aaaa');

            createMarquee();
            expect(marquee.content).toContain('aaaa');
        });

        it('not auto', function () {
            createMarquee({
                auto: false
            });
            expect(marquee.timeoutID).toBe(null);
        });

        it('initPosition()', function () {

            createMarquee({
                content: '这是一句话，句话，话。这是一句话，句话，句话，话。',
                auto: false
            });
            expect(marquee.pos).toBe($('#marquee').width());
            expect(marquee.max).toBe(marquee.width - $('#marquee').width());


            createMarquee({
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                direction: 'right',
                auto: false
            });
            expect(marquee.pos).toBe(marquee.item.outerWidth());
            expect(marquee.max).toBe(0);
        });

        it('hoverable 事件', function () {
            $(marquee.main).trigger('mouseenter');
            expect(marquee.timeoutID).toBe(null);

            $(marquee.main).trigger('mouseleave');
            expect(marquee.timeoutID).not.toBe(null);
        });

    });


    describe('Marquee behaviors', function () {
        it('continus', function () {

            createMarquee({
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                auto: false
            });
            marquee.pos = 1;
            marquee.start();
            expect(marquee.pos).toBe(0);
            marquee.stop();

            marquee.pos = -marquee.max;
            var max = marquee.max;
            marquee.start();
            expect(marquee.max).toBe(max + marquee.width);
            marquee.stop();

            // 向右
            createMarquee({
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                direction: 'right',
                auto: false
            });
            marquee.pos = -marquee.max;
            var pos = marquee.pos - 1;
            marquee.start();
            expect(marquee.pos).toBe(pos + marquee.width);
            marquee.stop();

            expect(marquee.item.find('span').length).toBe(2);
            marquee.pos = -marquee.max;
            pos = marquee.pos - 1;
            marquee.start();
            expect(marquee.item.find('span').length).toBe(2);
            expect(marquee.pos).toBe(pos + marquee.width);

            // 向上
            createMarquee({
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                direction: 'up',
                auto: false
            });
            marquee.pos = -marquee.max;
            max = marquee.max;
            marquee.start();
            expect(marquee.max).toBe(max + marquee.height);
            marquee.stop();

            // 向下
            createMarquee({
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                direction: 'down',
                auto: false
            });
            marquee.pos = -marquee.max;
            pos = marquee.pos - 1;
            marquee.start();
            expect(marquee.pos).toBe(pos + marquee.height);
            marquee.stop();
        });

        it('scroll', function () {

            createMarquee({
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                auto: false,
                behavior: 'scroll'
            });
            marquee.pos = -marquee.max;
            marquee.start();
            expect(marquee.pos).toBe(marquee.main.outerWidth());

            createMarquee({
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                auto: false,
                direction: 'right',
                behavior: 'scroll'
            });
            marquee.pos = -marquee.max;
            marquee.start();
            expect(marquee.pos).toBe(marquee.width);

            createMarquee({
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                auto: false,
                direction: 'up',
                behavior: 'scroll'
            });
            marquee.pos = -marquee.max;
            marquee.start();
            expect(marquee.pos).toBe(marquee.main.outerHeight());

            createMarquee({
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                auto: false,
                direction: 'down',
                behavior: 'scroll'
            });
            marquee.pos = -marquee.max;
            marquee.start();
            expect(marquee.pos).toBe(marquee.height);
        });
    });
});
