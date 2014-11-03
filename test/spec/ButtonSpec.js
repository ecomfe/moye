/**
 * @file MOYE - Button - 测试用例
 * @author Leon(leon@outlook.com)
 */
define(function (require) {

    var $ = require('jquery');
    var lib = require('ui/lib');
    var Button = require('ui/Button');
    
    var button;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', '<button id="button">ok</button>'
        );
        button = new Button({
            main: $('#button')
        });
        button.render();
    });


    afterEach(function () {
        button.dispose();
        $('#button').remove();
    });
  
    describe('标准接口', function () {

        it('setText', function () {
            var text = '123';
            button.setText(text);
            expect(button.main.innerHTML === text);
        });

        it('onClick', function () {
            var onClickSpy = jasmine.createSpy('onClickSpy');
            button.on('click', onClickSpy);
            $('#button').click();
            expect(onClickSpy).toHaveBeenCalled();
            button.un('click');
        });

        it('enable && disable', function () {
            var onClickSpy = jasmine.createSpy('onClickSpy');
            button.on('click', onClickSpy);
            button.disable();
            $('#button').click();
            expect(onClickSpy).not.toHaveBeenCalled();
            button.enable();
            $('#button').click();
            expect(onClickSpy).toHaveBeenCalled();
            button.un('click');
        });

    });

});
