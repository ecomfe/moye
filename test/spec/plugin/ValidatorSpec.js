/**
 * @file 校验插件测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('ui/lib');

    var TextBox = require('ui/TextBox');
    var Validity = require('ui/plugin/Validity');
    var Validator = require('ui/plugin/Validator');

    var textBox;
    function createTextBox(validatorOption, rules) {
        jasmine.Clock.useMock();

        var main = $('<label id="text-box" data-ui-id="textBox">输入框：<input type="text"></label>');
        main.appendTo(document.body);
        textBox = new TextBox({
            main: main[0],
            plugins: [
                {
                    type: 'Validator',
                    options: validatorOption
                }
            ],
            rules: rules || []
        });
        textBox.render();
    }

    function disposeTextBox() {
        textBox.dispose();
        $('#text-box').remove();
    }

    function getValidator() {
        return  $.grep(textBox.plugins, function (plugin) {
            if (plugin instanceof Validator) {
                return true;
            }
            return false;
        })[0];
    }

    describe('标准接口', function () {
        afterEach(disposeTextBox);

        it('validate with empty rule', function () {
            createTextBox({}, []);
            expect(textBox.validate).toBeDefined();

            // no rules
            expect(textBox.validate()).toBeTruthy();
        });

        it('validate with one rule', function () {
            createTextBox({}, [
                function (value, control) {
                    return /^\d+$/.test(value);
                }
            ]);

            expect(textBox.validate()).toBeFalsy();
        });

        it('validate with more then one rule', function () {
            createTextBox({}, [
                function () {
                    return true;
                },
                function (value, control) {
                    return /^\d+$/.test(value);
                }
            ]);

            expect(textBox.validate()).toBeFalsy();
        });

        it('validate disabled control', function () {
            createTextBox({}, [
                function (value, control) {
                    return /^\d+$/.test(value);
                }
            ]);

            // disabled control
            textBox.disable();
            expect(textBox.validate()).toBeTruthy();
        });


        it('failEary option', function () {
            var fakeRule = jasmine.createSpy('myRule');
            createTextBox({failEarly: false}, [
                function (value, control) {
                    return /^\d+$/.test(value);
                },
                fakeRule
            ]);

            textBox.validate();
            expect(fakeRule).toHaveBeenCalled();
            disposeTextBox();

            var fakeRule2 = jasmine.createSpy('myRule2');
            createTextBox({failEarly: true}, [
                function (value, control) {
                    return /^\d+$/.test(value);
                },
                fakeRule2
            ]);
            textBox.validate();
            expect(fakeRule2).not.toHaveBeenCalled();
        });

        it('delay option', function () {
            var delay = 1;
            var fakeRule = jasmine.createSpy('myRule');
            createTextBox({delay: delay}, [
                fakeRule
            ]);

            textBox.fire('blur', {});
            expect(fakeRule).not.toHaveBeenCalled();

            jasmine.Clock.tick(delay * 2);
            expect(fakeRule).toHaveBeenCalled();
        });

        it('fire validate events', function () {
            var onBeforevalidate = null;
            var onAftervalidate = null;
            var onValidating = null;
            var onValid = null;
            var onInvalid = null;

            function initTextBox(rules) {
                createTextBox({}, rules);

                onBeforevalidate = jasmine.createSpy('beforevalidate');
                onAftervalidate = jasmine.createSpy('aftervalidate');
                onValidating = jasmine.createSpy('validating');
                onValid = jasmine.createSpy('valid');
                onInvalid = jasmine.createSpy('invalid');

                textBox.on('beforevalidate', onBeforevalidate);
                textBox.on('aftervalidate', onAftervalidate);
                textBox.on('validating', onValidating);
                textBox.on('valid', onValid);
                textBox.on('invalid', onInvalid);
            }

            // valid result
            initTextBox([
                function (value, control) {
                    return true;
                }
            ]);
            textBox.validate();
            expect(onBeforevalidate).toHaveBeenCalled();
            expect(onBeforevalidate.mostRecentCall.args[0].validity instanceof Validity).toBeTruthy();

            expect(onAftervalidate).toHaveBeenCalled();
            expect(onAftervalidate.mostRecentCall.args[0].validity instanceof Validity).toBeTruthy();

            expect(onValid).toHaveBeenCalled();
            expect(onValid.mostRecentCall.args[0].validity instanceof Validity).toBeTruthy();

            disposeTextBox();

            // invalid result
            initTextBox([
                function (value, control) {
                    return false;
                }
            ]);
            textBox.validate();
            expect(onInvalid).toHaveBeenCalled();
            expect(onInvalid.mostRecentCall.args[0].validity instanceof Validity).toBeTruthy();
            disposeTextBox();

            // check with async
            initTextBox([
                function (value, control) {
                    var def = new $.Deferred();
                    def.resolve(true);
                    return def.promise();
                }
            ]);
            textBox.validate();
            expect(onValidating).toHaveBeenCalled();
            expect(onValidating.mostRecentCall.args[0].validity instanceof Validity).toBeTruthy();

            expect(onAftervalidate).toHaveBeenCalled();
            expect(onAftervalidate.mostRecentCall.args[0].validity instanceof Validity).toBeTruthy();
            expect(onValid).toHaveBeenCalled();
            expect(onValid.mostRecentCall.args[0].validity instanceof Validity).toBeTruthy();
        });

        it('update control state after validate', function () {

            // invalid result
            createTextBox({}, [
                function (value, control) {
                    return false;
                }
            ]);
            textBox.validate();
            expect(textBox.hasState('invalid')).toBeTruthy();
            disposeTextBox();

            // invalid result
            createTextBox({}, [
                function (value, control) {
                    return true;
                }
            ]);
            textBox.validate();
            expect(textBox.hasState('valid')).toBeTruthy();
        });

        it('checkValidity', function () {
            createTextBox({}, [
                function (value, control) {
                    var def = new $.Deferred();
                    def.resolve(true);
                    return def.promise();
                }
            ]);
            expect(textBox.checkValidity).toBeDefined();

            // event is not allowed to be fired and control state is not allowed to be updated
            var onBeforevalidate = jasmine.createSpy('beforevalidate');
            var onAftervalidate = jasmine.createSpy('aftervalidate');
            var onValidating = jasmine.createSpy('validating');
            var onValid = jasmine.createSpy('valid');
            var onInvalid = jasmine.createSpy('invalid');
            textBox.on('beforevalidate', onBeforevalidate);
            textBox.on('aftervalidate', onAftervalidate);
            textBox.on('validating', onValidating);
            textBox.on('valid', onValid);
            textBox.on('invalid', onInvalid);

            textBox.removeState('valid');
            textBox.checkValidity();

            expect(onBeforevalidate).not.toHaveBeenCalled();
            expect(onValidating).not.toHaveBeenCalled();

            expect(onAftervalidate).not.toHaveBeenCalled();
            expect(onValid).not.toHaveBeenCalled();
            expect(textBox.hasState('valid')).toBeFalsy();

            disposeTextBox();

            createTextBox({}, [
                function (value, control) {
                    return false;
                }
            ]);
            textBox.removeState('invalid');
            textBox.checkValidity();
            expect(onInvalid).not.toHaveBeenCalled();
            expect(textBox.hasState('invalid')).toBeFalsy();
        });

        it('listen control events', function () {
            var fakeRule = jasmine.createSpy('fakeRule');
            createTextBox({listen: ['blur', 'change']}, [
                fakeRule
            ]);

            textBox.fire('blur');
            expect(fakeRule).toHaveBeenCalled();

            textBox.fire('change');
            expect(fakeRule.callCount).toBe(2);
        });
    });

});
