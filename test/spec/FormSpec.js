/**
 * @file Form控件测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('ui/lib');

    require('ui/Button');
    require('ui/TextBox');
    var Form = require('ui/Form');

    var form;
    var tpl = ''
        + '<form id="my-form" action="/test" target="my-frame">'
        +   '<label data-ui-id="uNameTextBox">姓名：<input type="text"></label>'
        +   '<label data-ui-id="disabledTextBox">不可用：<input type="text"></label>'
        +   '<input id="submit-btn" type="submit" value="提交" data-ui-id="submitBtn">'
        + '</form>'
        + '<iframe name="my-frame" src="about:blank"></iframe>';

    function createForm() {
        var main = $(tpl).appendTo(document.body);
        form = new Form({main: main[0]});
        form.context.fill({
            uNameTextBox: {
                type: 'TextBox',
                name: 'userName',
                value: 'jack'
            },
            disabledTextBox: {
                type: 'TextBox',
                name: 'disabledField',
                value: 'abc',
                disabled: true
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

    describe('标准接口', function () {
        beforeEach(createForm);
        afterEach(disposeForm);

        it('render', function () {
            var main = form.main;
            expect(main.action).toMatch(/\/test$/);
            expect(main.method).toMatch(/^get$/i);
            expect(main.target).toEqual('_self');

            expect(main.children.length).toEqual(3);
        });

        it('set action', function () {
            form.set('action', '/test2');

            var main = form.main;
            expect(main.action).toMatch(/\/test2$/);
        });

        it('set target', function () {
            var targetValue = '_blank';
            form.set('target', targetValue);

            var main = form.main;
            expect(main.target).toMatch(targetValue);
        });

        it('auto check form when submiting', function () {
            var fakeValidate = jasmine.createSpy('valid');
            form.validate = function () {
                fakeValidate();
                return true;
            }

            var onSubmitSpy = jasmine.createSpy('onSubmitSpy');
            form.main.target = 'my-frame';
            form.on('submit', onSubmitSpy);

            form.submit();
            expect(fakeValidate).toHaveBeenCalled();
            expect(onSubmitSpy).toHaveBeenCalled();
        });

        it('prevent submit when check form fail', function () {
            var fakeValidate = jasmine.createSpy('valid');
            form.validate = function () {
                fakeValidate();
                return false;
            }

            var onSubmitSpy = jasmine.createSpy('onSubmitSpy');
            form.on('submit', onSubmitSpy);
            form.submit();
            expect(onSubmitSpy).not.toHaveBeenCalled();
        });

        it('get data', function () {
            var data = form.getData();
            expect(data).toEqual({userName: 'jack'});
        });
    });

    describe('事件', function () {
        beforeEach(createForm);
        afterEach(disposeForm);

        it('trigger submit event and auto check form before submit', function () {
            var fakeValidate = jasmine.createSpy('valid');
            form.validate = function () {
                fakeValidate();
                return true;
            }

            var onSubmitSpy = jasmine.createSpy('onSubmitSpy');
            form.on('submit', onSubmitSpy);
            form.main.target = 'my-frame';
            $('#submit-btn').click();
            expect(onSubmitSpy).toHaveBeenCalled();
            expect(fakeValidate).toHaveBeenCalled();
        });

    });

});
