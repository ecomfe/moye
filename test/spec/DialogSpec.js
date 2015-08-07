define(function (require) {
    var $ = require('jquery');
    var Dialog = require('ui/Dialog');
    var Mask = require('ui/Mask');
    var dialog;

    beforeEach(function () {

        dialog = new Dialog({
            content: '内容',
            footer: '底部',
            width: '600px',
            title: '标题',
            top: '50px',
            left: '',
            fixed: 1,
            showMask: 1,
            leve: 10,
            skin: 'xxx-dlg'
        });
        dialog.render();

    });


    afterEach(function () {
        dialog.dispose();
    });

    describe('MASK相关接口', function () {

        var mask = Mask.create().render();

        it('mask.show', function () {
            mask.show();
            expect($(mask.main).css('visibility')).toBe('visible');
        });

        it('mask.hide', function () {
            mask.hide();
            expect($(mask.main).css('visibility')).toBe('hidden');
        });

        it('mask.repaint', function () {
            mask.repaint();
            var width = $(window).width();
            expect(mask.main.offsetWidth).toBe(width);
        });

    });

    describe('基本接口', function () {

        it('控件类型', function () {
            expect(dialog.type).toBe('Dialog');
        });

        it('event:show', function () {
            dialog.on('show', function () {
                expect(dialog.main).toBeTruthy();
                expect($(dialog.main).hasClass('ecl-ui-dialog-hide')).toBeFalsy();
            });
            dialog.show();
        });


        it('event:show', function () {
            dialog.on('show', function () {
                expect(dialog.main).toBeTruthy();
                expect($(dialog.main).hasClass('ecl-ui-dialog-hide')).toBeFalsy();
            });
            dialog.show();
        });

        it('event:hide', function () {
            dialog.on('hide', function () {
                expect($(dialog.main).hasClass('ecl-ui-dialog-hide')).toBeTruthy();
            });
            dialog.hide();
        });

        it('title check', function () {
            var header = $('.ui-dialog-header', dialog.main);
            expect(header.text()).toBe('标题');
            dialog.setTitle('标题1');
            expect(header.text()).toBe('标题1');
        });

        it('content check', function () {
            var content = $('.ui-dialog-content', dialog.main);
            expect(content.text()).toBe('内容');
            dialog.setContent('内容1');
            expect(content.text()).toBe('内容1');
        });

        it('footer check', function () {
            var content = $('.ui-dialog-footer', dialog.main);
            expect(content.text()).toBe('底部');
            dialog.setFooter('底部1');
            expect(content.text()).toBe('底部1');
        });

        it('mask check', function () {
            expect(dialog.mask).toBeTruthy();
        });

        it('event:dispose', function () {
            dialog.on('dispose', function () {
                expect(!!dialog.main).toBeFalsy();
            });
        });

    });

});
