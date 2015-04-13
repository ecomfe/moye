/**
 * @file 表单提交按钮测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var lib = require('ui/lib');
    require('ui/Button');
    require('ui/TextBox');
    var Form = require('ui/Form');
    var FormSubmit = require('ui/plugin/FormSubmit');
    var form;
    var tpl = ''
        + '<form id="my-form" action="/test">'
        +   '<label data-ui-id="nameTextBox">姓名：<input type="text"></label>'
        +   '<input id="save-btn" type="button" value="提交">'
        +   '<input id="submit-btn" type="submit" value="提交" data-ui-id="submitBtn">'
        + '</form>'
        + '<iframe name="my-frame" src="about:blank"></iframe>';

    function createForm() {
        jasmine.Clock.useMock();

        var main = $(tpl).appendTo(document.body);
        form = new Form({
            main: main[0],
            target: 'my-frame',
            plugins: [
                {
                    type: 'FormSubmit',
                    options: {
                        triggers: ['submitBtn', 'save-btn']
                    }
                }
            ]
        });
        form.context.fill({
            nameTextBox: {
                type: 'TextBox',
                name: 'userName',
                value: '',
                plugins: ['Validator'],
                rules: []
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

    describe('表单提交按钮', function () {
        beforeEach(createForm);
        afterEach(disposeForm);

        it('trigger submit', function () {

            var fakeOnSubmit = jasmine.createSpy('onsubmit');
            form.onSubmit = function (e) {
                e.preventDefault();
                fakeOnSubmit();
            };

            $('#save-btn').click();
            expect(fakeOnSubmit).toHaveBeenCalled();

            form.getChild('submitBtn').fire('click');
            expect(fakeOnSubmit.callCount).toEqual(2);
        });
    });


});
