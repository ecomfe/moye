/**
 * @file 校验规则测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var lib = require('ui/lib');
    var ValidityState = require('ui/plugin/ValidityState');
    var ValidateRule = require('ui/plugin/ValidateRule');

    describe('标准接口', function () {
        beforeEach(function () {
            jasmine.Clock.useMock();
        });

        it('check regex', function () {
            // 传入正则作为校验规则
            var rule = new ValidateRule(/\d+/);
            var fakeInputControl = {};
            var result = rule.check('abc', fakeInputControl);
            expect(result instanceof ValidityState).toBe(true);
            expect(result.getState()).toBe(false);

            result = rule.check(233, fakeInputControl);
            expect(result.getState()).toBe(true);

            // use check option
            rule = new ValidateRule({check: /\d+/});
            fakeInputControl = {};
            result = rule.check('abc', fakeInputControl);
            expect(result instanceof ValidityState).toBe(true);
            expect(result.getState()).toBe(false);

            result = rule.check(233, fakeInputControl);
            expect(result.getState()).toBe(true);
        });

        it('custom check function', function () {
            // 使用自定义的check方法
            var customCheck = jasmine.createSpy('customCheck');
            var checkFunc = function (value, control) {
                customCheck.apply(this, arguments);
                return value === 'abc';
            };

            var rule = new ValidateRule(checkFunc);
            var fakeInputControl = {};
            var checkValue = 'abc';
            var result = rule.check(checkValue, fakeInputControl);
            expect(customCheck).toHaveBeenCalledWith(checkValue, fakeInputControl);
            expect(result.getState()).toBe(true);

            result = rule.check('abc2', fakeInputControl);
            expect(result.getState()).toBe(false);

            // use check option
            rule = new ValidateRule({check: checkFunc});
            fakeInputControl = {};
            checkValue = 'abc';
            result = rule.check(checkValue, fakeInputControl);
            expect(customCheck).toHaveBeenCalledWith(checkValue, fakeInputControl);
            expect(result.getState()).toBe(true);

            result = rule.check('abc2', fakeInputControl);
            expect(result.getState()).toBe(false);
        });

        it('use register rule', function () {
            var myCheck = jasmine.createSpy('myCheck');
            var registerRule = {
                check: myCheck,
                message: 'hello'
            };
            ValidateRule.register('myRule', registerRule);

            // 使用注册规则
            var rule = new ValidateRule('myRule');
            var result = rule.check('22', {});
            expect(myCheck).toHaveBeenCalled();
            expect(result.getMessage()).toEqual('hello');

            // 使用 type 选项
            rule = new ValidateRule({type: 'myRule'});
            rule.check('22', {});
            expect(myCheck).toHaveBeenCalled();

            // 重写预定义规则的配置
            var customMsg = {invalid: 'invalid msg'};
            rule = new ValidateRule({type: 'myRule', message: customMsg});
            result = rule.check('22', {});
            expect(myCheck).toHaveBeenCalled();
            expect(result.getMessage()).toEqual(customMsg.invalid);
        });

        it('check return result', function () {
            var defaultErrorMsg = 'warning';
            var messageConf = {
                invalid: defaultErrorMsg,
                valid: 'ok'
            };
            var customMsg = 'error';
            var validState = new ValidityState(true, 'ok');

            // check return boolean
            var rule = new ValidateRule({
                message: messageConf,
                check: function () {
                    return true;
                }
            });
            var result = rule.check('abc', {});
            expect(result instanceof ValidityState).toBe(true);
            expect(result.getState()).toBe(true);
            expect(result.getMessage()).toBe(messageConf.valid);

            rule = new ValidateRule(function () {
                return false;
            });
            result = rule.check('abc', {});
            expect(result.getState()).toBe(false);

            // check return number
            rule = new ValidateRule({
                message: messageConf,
                check: function () {
                    return 33;
                }
            });
            result = rule.check('abc', {});
            expect(result.getState()).toBe(true);
            expect(result.getMessage()).toBe(messageConf.valid);

            rule = new ValidateRule({
                message: messageConf,
                check: function () {
                    return 0;
                }
            });
            result = rule.check('abc', {});
            expect(result.getState()).toBe(false);
            expect(result.getMessage()).toBe(messageConf.invalid);

            // check return string
            rule = new ValidateRule({
                message: messageConf,
                check: function () {
                    return customMsg;
                }
            });
            result = rule.check('abc', {});
            expect(result.getState()).toBe(false);
            expect(result.getMessage()).toBe(customMsg);

            // check return empty string
            rule = new ValidateRule({
                message: messageConf,
                check: function () {
                    return '';
                }
            });
            result = rule.check('abc', {});
            expect(result.getState()).toBe(false);
            expect(result.getMessage()).toBe(messageConf.invalid);

            // check no return
            rule = new ValidateRule({
                message: defaultErrorMsg,
                check: function () {}
            });
            result = rule.check('abc', {});
            expect(result.getState()).toBe(false);
            expect(result.getMessage()).toBe(defaultErrorMsg);

            // check return ValidityState
            rule = new ValidateRule({
                message: defaultErrorMsg,
                check: function () {
                    return validState;
                }
            });
            expect(rule.check('abc', {})).toBe(validState);

            // check return promise
            var delay = 1;
            rule = new ValidateRule({
                message: defaultErrorMsg,
                check: function () {
                    var def = new $.Deferred();
                    def.resolve(customMsg);
                    return def.promise();
                }
            });
            result = rule.check('abc', {});
            expect(lib.isPromise(result)).toBeTruthy();
            var validateDone = jasmine.createSpy('validateDone');
            result.then(validateDone);
            expect(validateDone).toHaveBeenCalled();
            result = validateDone.mostRecentCall.args[0];
            expect(result.getState()).toBe(false);
            expect(result.getMessage()).toBe(customMsg);

            rule = new ValidateRule({
                message: messageConf,
                check: function () {
                    var def = new $.Deferred();
                    def.resolve(true);
                    return def.promise();
                }
            });
            result = rule.check('abc', {});
            var validateDone2 = jasmine.createSpy('validateDone2');
            result.then(validateDone2);
            expect(validateDone2).toHaveBeenCalled();
            result = validateDone2.mostRecentCall.args[0];
            expect(result.getState()).toBe(true);
            expect(result.getMessage()).toBe(messageConf.valid);

            rule = new ValidateRule({message: defaultErrorMsg, check: function () {
                var def = new $.Deferred();
                def.resolve({state: false, message: customMsg});
                return def.promise();
            }});
            result = rule.check('abc', {});
            var validateDone3 = jasmine.createSpy('validateDone3');
            result.then(validateDone3);
            expect(validateDone3).toHaveBeenCalled();
            result = validateDone3.mostRecentCall.args[0];
            expect(result.getState()).toBe(false);
            expect(result.getMessage()).toBe(customMsg);

            rule = new ValidateRule({message: defaultErrorMsg, check: function () {
                var def = new $.Deferred();
                def.resolve(validState);
                return def.promise();
            }});
            result = rule.check('abc', {});
            var validateDone4 = jasmine.createSpy('validateDone2');
            result.then(validateDone4);
            expect(validateDone4).toHaveBeenCalled();
            result = validateDone4.mostRecentCall.args[0];
            expect(result).toBe(validState);

            rule = new ValidateRule({message: defaultErrorMsg, check: function () {
                var def = new $.Deferred();
                def.reject({state: false, message: customMsg});
                return def.promise();
            }});
            result = rule.check('abc', {});
            var validateDone5 = jasmine.createSpy('validateDone5');
            result.then(null, validateDone5);
            expect(validateDone5).toHaveBeenCalled();
            result = validateDone5.mostRecentCall.args[0];
            expect(result.getState()).toBe(false);
            expect(result.getMessage()).toBe(customMsg);
        });

        it('getMessage', function () {
            // normal message config
            var defaultErrorMsg = 'error';
            var defaultOkMsg = 'good';
            var rule = new ValidateRule({
                check: /\d+/,
                message: {
                    valid: defaultOkMsg,
                    invalid: defaultErrorMsg
                }
            });
            expect(rule.getMessage({}, true)).toBe(defaultOkMsg);
            expect(rule.getMessage({}, false)).toBe(defaultErrorMsg);

            // default message string should be treated as invalid message
            rule = new ValidateRule({
                check: /\d+/,
                message: defaultErrorMsg
            });
            expect(rule.getMessage({}, false)).toBe(defaultErrorMsg);

            // use message defined in control
            var registerRule = {
                check: function () {}
            };
            ValidateRule.register('myRule', registerRule);
            rule = new ValidateRule({
                type: 'myRule'
            });
            var fakeInputControl = {
                myRuleValidMessage: defaultOkMsg,
                myRuleInvalidMessage: defaultErrorMsg
            };
            expect(rule.getMessage(fakeInputControl, true)).toBe(fakeInputControl.myRuleValidMessage);
            expect(rule.getMessage(fakeInputControl, false)).toBe(fakeInputControl.myRuleInvalidMessage);

            // use function to custom message
            rule = new ValidateRule({
                check: /\d+/,
                message: function (control, isValid) {
                    return isValid ? defaultOkMsg : defaultErrorMsg;
                }
            });
            expect(rule.getMessage({}, true)).toBe(defaultOkMsg);
            expect(rule.getMessage({}, false)).toBe(defaultErrorMsg);

            // use template variable
            rule = new ValidateRule({
                check: /\d+/,
                message: {
                    valid: 'hello !{userName}',
                    invalid: 'bye !{userName}'
                }
            });
            var fakeInput = {userName: 'jack'};
            expect(rule.getMessage(fakeInput, true)).toBe('hello jack');
            expect(rule.getMessage(fakeInput, false)).toBe('bye jack');
        });
    });

});
