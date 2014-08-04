define(function (require) {
    var $ = require('jquery');
    var Dialog = require('ui/Dialog');
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
        var mask = Dialog.Mask.create({
            className: 'ecl-ui-dialog-mask',
            styles: {
                zIndex: 9
            }
        });

        it('mask.hide', function () {
            mask.hide();
            expect($(mask.mask).css('display')).toBe('none');
        });

        it('mask.show', function () {
            mask.show();
            expect($(mask.mask).css('display')).toNotBe('none');
        });

        it('mask.repaint', function () {
            mask.repaint();

            var width = $(window).width();

            expect(mask.mask.style.width).toBe(width + 'px');
        });

        it('mask.dispose', function () {
            mask.dispose();
            expect(!!mask.mask).toBeTruthy();
            mask = null;
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
            var header = dialog.query('ecl-ui-dialog-header')[0];
            expect(header.innerHTML).toBe('标题');
            dialog.setTitle('标题1');
            expect(header.innerHTML).toBe('标题1');
        });

        it('content check', function () {
            var body = dialog.query('ecl-ui-dialog-body')[0];
            expect(body.innerHTML).toBe('内容');
            dialog.setContent('内容1');
            expect(body.innerHTML).toBe('内容1');
        });

        it('footer check', function () {
            var footer = dialog.query('ecl-ui-dialog-footer')[0];
            expect(footer.innerHTML).toBe('底部');
            dialog.setFooter('底部1');
            expect(footer.innerHTML).toBe('底部1');
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
