/**
 * @file 校验结果Tip测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    require('ui/plugin/Validator');
    var lib = require('ui/lib');
    var ValidityState = require('ui/plugin/ValidityState');
    var Validity = require('ui/plugin/Validity');
    var TextBox = require('ui/TextBox');
    var ValidateTip = require('ui/plugin/ValidateTip');

    var textBox;
    function createTextBox() {
        var main = $('<label id="text-box" data-ui-id="nameTextBox">姓名：<input type="text"></label>');
        main.appendTo(document.body);
        textBox = new TextBox({
            main: main[0],
            plugins: [
                'Validator',
                {
                    type: 'ValidateTip',
                    options: {
                        message: {
                            skin: 'my-validate-tip',
                            arrow: 'tc',
                            showDelay: 0,
                            hideDelay: 0,
                            offset: {
                                x: 0,
                                y: -5
                            }
                        },
                        icon: {
                            content: 'checking',
                            skin: 'my-validate-tip-icon',
                            arrow: 'tc',
                            showDelay: 0,
                            hideDelay: 0,
                            offset: {
                                x: 0,
                                y: -5
                            }
                        }
                    }
                }
            ],
            rules: []
        });
        textBox.render();
    }

    function disposeTextBox() {
        textBox.dispose();
        $('#text-box').remove();
    }

    function getValidateTip() {
        return  $.grep(textBox.plugins, function (plugin) {
            if (plugin instanceof ValidateTip) {
                return true;
            }
            return false;
        })[0];
    }

    describe('标准接口', function () {
        beforeEach(createTextBox);
        afterEach(disposeTextBox);

        it('activate', function () {
            expect(textBox.plugins.length).toEqual(2);

            var validateTipPlugin = getValidateTip();

            expect(validateTipPlugin).toBeDefined();
            var msg = validateTipPlugin.message;
            expect(msg.skin).toContain('my-validate-tip');
            expect(msg.arrow).toEqual('tc');
            expect(msg.offset).toEqual({x: 0, y: -5});

            var icon = validateTipPlugin.icon;
            expect(icon.skin).toContain('my-validate-tip-icon');
            expect(icon.arrow).toEqual('tc');
            expect(icon.offset).toEqual({x: 0, y: -5});
            expect(icon.content).toEqual('checking');
        });

        it('show', function () {
            var validateTipPlugin = getValidateTip();
            var messageTip = validateTipPlugin.message;
            validateTipPlugin.show(new Validity());
            expect(messageTip.isVisible()).toBeTruthy();
        });

        it('hide', function () {
            var validateTipPlugin = getValidateTip();
            var messageTip = validateTipPlugin.message;
            validateTipPlugin.hide();
            expect(messageTip.isVisible()).toBeFalsy();
        });

        it('showLoading', function () {
            var validateTipPlugin = getValidateTip();
            var iconTip = validateTipPlugin.icon;
            validateTipPlugin.showLoading();
            expect(iconTip.isVisible()).toBeTruthy();
        });

        it('hideLoading', function () {
            var validateTipPlugin = getValidateTip();
            var iconTip = validateTipPlugin.icon;
            validateTipPlugin.hideLoading();
            expect(iconTip.isVisible()).toBeFalsy();
        });

        it('getMessage', function () {
            var validateTipPlugin = getValidateTip();
            var validity = new Validity();
            var customMsg = 'test${title}sds';
            validity.setCustomMessage(customMsg);

            expect(validateTipPlugin.getMessage(validity)).toBe(customMsg);

            validity.addState('name', new ValidityState(false, 'abc'));
            validity.addState('age', new ValidityState(true, 'haha'));
            expect(validateTipPlugin.getMessage(validity)).toBe(customMsg);

            validity.setCustomMessage('');
            expect(validateTipPlugin.getMessage(validity)).toEqual('abc');
        });
    });

    describe('事件', function () {
        var fakeShowMsg = null;
        var fakeHideMsg = null;
        var fakeShowLoading = null;
        var fakeHideLoading = null;

        beforeEach(function () {
            createTextBox();

            var validateTipPlugin = getValidateTip();
            fakeShowMsg = jasmine.createSpy('show');
            fakeHideMsg = jasmine.createSpy('hide');
            fakeShowLoading = jasmine.createSpy('showLoading');
            fakeHideLoading = jasmine.createSpy('hideLoading');

            validateTipPlugin.show = fakeShowMsg;
            validateTipPlugin.hide = fakeHideMsg;
            validateTipPlugin.showLoading = fakeShowLoading;
            validateTipPlugin.hideLoading = fakeHideLoading;
        });
        afterEach(disposeTextBox);

        it('show check icon when validating', function () {
            textBox.fire('validating', {});
            expect(fakeShowLoading).toHaveBeenCalled();
            expect(fakeHideLoading).not.toHaveBeenCalled();
            expect(fakeHideMsg).toHaveBeenCalled();
            expect(fakeShowMsg).not.toHaveBeenCalled();
        });

        it('show check result when aftervalidate', function () {
            var validity = new Validity();
            var customMsg = 'test${title}sds';
            validity.setCustomMessage(customMsg);
            textBox.fire('validating', {validity: validity});
            expect(fakeShowLoading).toHaveBeenCalled();
            expect(fakeHideLoading).not.toHaveBeenCalled();
            expect(fakeHideMsg).toHaveBeenCalled();
            expect(fakeShowMsg).not.toHaveBeenCalledWith(validity);
        });

        it('hide check result when input change', function () {
            textBox.fire('change', {});
            expect(fakeShowLoading).not.toHaveBeenCalled();
            expect(fakeHideLoading).not.toHaveBeenCalled();
            expect(fakeHideMsg).toHaveBeenCalled();
            expect(fakeShowMsg).not.toHaveBeenCalled();
        });
    });

});
