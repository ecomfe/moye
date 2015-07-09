/**
 * @file MOYE - Marquee - 测试用例
 * @author cxtom(cxtom2010@gmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var Marquee = require('ui/Marquee');

    var marquee;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', '<div id="marquee" class="ui-marquee"></div>'
        );
        marquee = new Marquee({
            main: $('#marquee'),
            content: '这是一句话，句话，话。这是一句话，句话，话。这是一句话，句话，话。'
        });
        marquee.render();
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

            marquee.dispose();
            marquee = new Marquee({
                main: $('#marquee'),
                direction: 'other'
            });
            marquee.render();
            expect(marquee.getDirection()).toBe('left');
        });

        it('data-content', function () {
            $('#marquee').data('content', 'aaaa');
            marquee.dispose();
            marquee = new Marquee({
                main: $('#marquee')
            });
            marquee.render();
            expect(marquee.content).toContain('aaaa');
        });

        it('not auto', function () {
            marquee.dispose();
            marquee = new Marquee({
                main: $('#marquee'),
                auto: false
            });
            marquee.render();
            expect(marquee.timeoutID).toBe(null);
        });

        it('initPosition()', function () {
            marquee.dispose();
            marquee = new Marquee({
                main: $('#marquee'),
                content: '这是一句话，句话，话。这是一句话，句话，句话，话。',
                auto: false
            });
            marquee.render();
            expect(marquee.pos).toBe($('#marquee').width());
            expect(marquee.max).toBe(marquee.width - $('#marquee').width());

            marquee.dispose();
            marquee = new Marquee({
                main: $('#marquee'),
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                direction: 'right',
                auto: false
            });
            marquee.render();
            expect(marquee.pos).toBe(marquee.item.outerWidth());
            expect(marquee.max).toBe(0);
        });

        it('behaviors continus', function () {
            marquee.dispose();
            marquee = new Marquee({
                main: $('#marquee'),
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。',
                auto: false
            });
            marquee.render();
            marquee.pos = 1;
            marquee.start();
            expect(marquee.pos).toBe(0);
            marquee.stop();

            marquee.pos = -marquee.max;
            var max = marquee.max;
            marquee.start();
            expect(marquee.max).toBe(max + marquee.width);
            marquee.stop();

            marquee.dispose();
            marquee = new Marquee({
                main: $('#marquee'),
                content: '这是一句话，句话，话。这话，句话，话。这是一句话，句话，话。话。话。话。话',
                direction: 'right',
                auto: false
            });
            marquee.render();
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
        });

        it('hoverable 事件', function () {
            $(marquee.main).trigger('mouseenter');
            expect(marquee.timeoutID).toBe(null);

            $(marquee.main).trigger('mouseleave');
            expect(marquee.timeoutID).not.toBe(null);
        });

    });
});
