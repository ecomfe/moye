/**
 * @file 表单关联域测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var lib = require('ui/lib');
    require('ui/Button');
    require('ui/TextBox');
    require('ui/Select');
    var Form = require('ui/Form');
    var FormRelation = require('ui/plugin/FormRelation');
    var FormFieldWatcher = require('ui/plugin/FormFieldWatcher');
    var form;
    var tpl = ''
        + '<form id="my-form" action="/test" target="_blank">'
        +   '<label data-ui-id="nameTextBox">姓名：<input type="text"></label>'
        +   '<label data-ui-id="ageTextBox">年龄：<input type="text"></label>'
        +   '性别：<div data-ui-id="sexSelect"></div>'
        +   '<input type="submit" value="提交" data-ui-id="submitBtn">'
        + '</form>';

    function createForm() {
        var main = $(tpl).appendTo(document.body);
        form = new Form({
            main: main[0],
            plugins: [
                {
                    type: 'FormFieldWatcher',
                    options: {
                        eventTypes: ['input', 'change']
                    }
                },
                {
                    type: 'FormRelation',
                    options: {
                        relations: [
                            {
                                dependences: [
                                    {
                                        id: 'sexSelect',
                                        logic: function () {
                                            return !this.getValue();
                                        }
                                    },
                                    {
                                        id: 'nameTextBox',
                                        logic: function () {
                                            return !this.getValue();
                                        }
                                    }
                                ],
                                pattern: FormRelation.patterns.any,
                                targets: ['submitBtn'],
                                actions: [
                                    function (result) {
                                        result ? this.disable() : this.enable();
                                    }
                                ]
                            }
                        ]
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
                name: 'age',
                value: ''
            },
            sexSelect: {
                type: 'Select',
                name: 'sex',
                datasource: [
                    {name: '男生', value: 1},
                    {name: '女生', value: 2}
                ]
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

    describe('表单域变化监控', function () {
        beforeEach(createForm);
        afterEach(disposeForm);

        it('check dependence', function () {
            var submitBtn = form.getChild('submitBtn');
            expect(submitBtn.isDisabled()).toBeTruthy();

            var nameInput = form.getChild('nameTextBox');
            nameInput.setValue('tom');
            nameInput.fire('input', {value: 'tom'});
            expect(submitBtn.isDisabled()).toBeTruthy();

            form.getChild('sexSelect').setValue(1);
            form.getChild('sexSelect').fire('change', {value: 1});
            expect(submitBtn.isDisabled()).toBeFalsy();

            var ageInput = form.getChild('ageTextBox');
            ageInput.setValue('');
            ageInput.fire('input');
            expect(submitBtn.isDisabled()).toBeFalsy();

            nameInput.setValue('');
            nameInput.fire('input');
            expect(submitBtn.isDisabled()).toBeTruthy();

        });
    });


});
