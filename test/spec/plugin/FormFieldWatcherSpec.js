/**
 * @file 表单域变化监控测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var lib = require('ui/lib');
    require('ui/Button');
    require('ui/TextBox');
    var Form = require('ui/Form');
    var FormFieldWatcher = require('ui/plugin/FormFieldWatcher');
    var form;
    var tpl = ''
        + '<form id="my-form" action="/test" target="_blank">'
        +   '<label data-ui-id="nameTextBox">姓名：<input type="text"></label>'
        +   '<label data-ui-id="ageTextBox">年龄：<input type="text"></label>'
        +   '<input id="save-btn" type="button" value="提交">'
        + '</form>';

    function createForm() {
        var main = $(tpl).appendTo(document.body);
        form = new Form({
            main: main[0],
            plugins: [
                {
                    type: 'FormFieldWatcher',
                    options: {
                        eventTypes: ['input', 'change', 'change2']
                    }
                }
            ]
        });
        form.context.fill({
            nameTextBox: {
                type: 'TextBox',
                name: 'userName',
                value: ''
            },
            ageTextBox: {
                type: 'TextBox',
                name: 'userName',
                value: ''
            }
        });
        form.render();
    }

    function disposeForm() {
        form.dispose();
        $('#my-form').remove();
    }

    describe('表单域变化监控', function () {
        beforeEach(createForm);
        afterEach(disposeForm);

        it('trigger submit', function () {

            var fakeOnFieldChange = jasmine.createSpy('onfieldchange');
            form.on('fieldchange', fakeOnFieldChange);

            form.getChild('nameTextBox').fire('input', {});
            expect(fakeOnFieldChange).toHaveBeenCalled();

            form.getChild('nameTextBox').fire('change', {});
            expect(fakeOnFieldChange.callCount).toEqual(2);

            form.getChild('ageTextBox').fire('change2', {});
            expect(fakeOnFieldChange.callCount).toEqual(3);
        });
    });


});
