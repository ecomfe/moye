/**
 * @file 表单校验规则测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var lib = require('ui/lib');

    require('ui/Button');
    require('ui/TextBox');
    require('ui/plugin/validator/email');
    require('ui/plugin/validator/identity');
    require('ui/plugin/validator/max');
    require('ui/plugin/validator/min');
    require('ui/plugin/validator/maxlength');
    require('ui/plugin/validator/minlength');
    require('ui/plugin/validator/mobile');
    require('ui/plugin/validator/natural');
    require('ui/plugin/validator/required');

    require('ui/plugin/Validator');

    var Form = require('ui/Form');
    var form;
    var tpl = ''
        + '<form id="my-form" action="/test" target="_blank">'
        +   '<label data-ui-id="textBox">输入框：<input type="text"></label>'
        +   '<input type="submit" value="提交" data-ui-id="submitBtn">'
        + '</form>';

    function createForm(validateRule) {
        var main = $(tpl).appendTo(document.body);
        form = new Form({
            main: main[0]
        });
        form.context.fill({
            textBox: {
                type: 'TextBox',
                name: 'input',
                value: '',
                plugins: [
                    {
                        type: 'Validator'
                    }
                ],
                rules: [validateRule]
            },
            submitBtn: {
                type: 'Button'
            }
        });
        form.render();
    }

    function disposeForm() {
        form.dispose();
        $('#my-form').remove();
    }

    describe('校验规则', function () {
        afterEach(disposeForm);

        it('email', function () {
            createForm('email');

            var textBox = form.getChild('textBox');
            textBox.setValue('asd');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('asd23@s.com');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('00@163.com');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('abc@163.com');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('asd_23@163.com');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('asd_23@yahoo');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('asd_23@中国.cn');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('');
            expect(textBox.validate()).toBeTruthy();
        });

        it('identity', function () {
            createForm('identity');

            var textBox = form.getChild('textBox');
            textBox.setValue('');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('223');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('2 2X');
            expect(textBox.validate()).toBeFalsy();

            // 16 bit
            textBox.setValue('1234569012317653');
            expect(textBox.validate()).toBeFalsy();

            // 14 bit
            textBox.setValue('23456901231765');
            expect(textBox.validate()).toBeFalsy();

            // 17 bit
            textBox.setValue('12345690123176532');
            expect(textBox.validate()).toBeFalsy();

            // 19 bit
            textBox.setValue('1234569012317653221');
            expect(textBox.validate()).toBeFalsy();

            // check 15 bit
            textBox.setValue('123456789098765');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('123456001203765');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('123456911203765');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('123456021303765');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('123456020003765');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('123456021200765');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('123456021232765');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('12X456010101765');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('123456010101765');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('123456901231765');
            expect(textBox.validate()).toBeTruthy();

            // check 18 bit
            textBox.setValue('123456010101765224');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('53010219200508011X');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('53010219200508011x');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('53010212200508011X');
            expect(textBox.validate()).toBeFalsy();
        });

        it('max', function () {
            createForm({type: 'max', value: 30});

            var textBox = form.getChild('textBox');
            textBox.setValue('31');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('30.01');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('30.00000000000000000000000000000000000001');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('29.999999999999999999999999999999999999999999999999999999999999999999');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('30');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('23s');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('2e1');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue(30);
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue(0);
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('');
            expect(textBox.validate()).toBeTruthy();
        });

        it('min', function () {
            createForm({type: 'min', value: 3});

            var textBox = form.getChild('textBox');
            textBox.setValue('4');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('3');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('3.223');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('2.999999999999999999999999999999999999');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('2.999');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('2');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('23s');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('2e1');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue(3);
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue(0);
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('');
            expect(textBox.validate()).toBeTruthy();
        });

        it('maxlength', function () {
            createForm({type: 'maxlength', maxLength: 5});

            var textBox = form.getChild('textBox');
            textBox.setValue('000051');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('00001');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('1234');
            expect(textBox.validate()).toBeTruthy();
        });

        it('minlength', function () {
            createForm({type: 'minlength', minLength: 3});

            var textBox = form.getChild('textBox');
            textBox.setValue('0001');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('123');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('0');
            expect(textBox.validate()).toBeFalsy();
        });

        it('mobile', function () {
            createForm('mobile');

            var textBox = form.getChild('textBox');

            textBox.setValue('12345678907');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('22345678907');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('123456789072');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('');
            expect(textBox.validate()).toBeTruthy();
        });

        it('natural', function () {
            createForm('natural');

            var textBox = form.getChild('textBox');
            textBox.setValue('asd');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('123');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('001');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue(23);
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('2e2');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue('3.2');
            expect(textBox.validate()).toBeFalsy();

            textBox.setValue(0);
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('');
            expect(textBox.validate()).toBeTruthy();
        });

        it('required', function () {
            createForm('required');

            var textBox = form.getChild('textBox');
            textBox.setValue('asd');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('0');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('null');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('undefined');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('false');
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue(0);
            expect(textBox.validate()).toBeTruthy();

            textBox.setValue('');
            expect(textBox.validate()).toBeFalsy();
        });
    });


});
