/**
 * @file 校验结果状态测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var lib = require('ui/lib');
    var Validity = require('ui/plugin/Validity');
    var ValidityState = require('ui/plugin/ValidityState');

    describe('标准接口', function () {
        it('addState', function () {
            var validity = new Validity();
            var state = new ValidityState(true, 'pass');
            validity.addState('name', state);
            expect(validity.states.length).toBe(1);
            expect(validity.states[0]).toBe(state);

            validity.addState('name', state);
            expect(validity.states.length).toBe(1);
            expect(validity.states[0]).toBe(state);

            var state2 = new ValidityState(true, 'pass');
            validity.addState('name', state2);
            expect(validity.states.length).toBe(1);
            expect(validity.states[0]).toBe(state2);

            var state3 = new ValidityState(true, 'pass');
            validity.addState('name2', state3);
            expect(validity.states.length).toBe(2);
            expect(validity.states[1]).toBe(state3);
        });

        it('getState', function () {
            var validity = new Validity();
            var state = new ValidityState(true, 'pass');
            validity.addState('name', state);
            expect(validity.getState('name')).toBe(state);
            expect(validity.getState('name2')).toBe(null);
        });

        it('getStates', function () {
            var validity = new Validity();
            var state = new ValidityState(true, 'pass');
            validity.addState('name', state);
            var result = validity.getStates();
            expect(result).toEqual([state]);

            result.length = 0;
            expect(validity.getStates().length).toBe(1);
        });

        it('get/set custom message', function () {
            var validity = new Validity();
            var customMsg = 'test${title}sds';
            validity.setCustomMessage(customMsg);
            expect(validity.getCustomMessage()).toBe(customMsg);
        });

        it('isValid', function () {
            var validity = new Validity();
            expect(validity.isValid()).toBe(true);

            var state = new ValidityState(true, 'pass');
            validity.addState('name', state);
            expect(validity.isValid()).toBe(true);

            var state2 = new ValidityState(true, 'pass');
            validity.addState('name2', state2);
            expect(validity.isValid()).toBe(true);

            var state3 = new ValidityState(false, 'fail');
            validity.addState('name3', state3);
            expect(validity.isValid()).toBe(false);
        });

        it('setCustomValidState', function () {
            var validity = new Validity();
            var state = 'valid';
            validity.setCustomValidState(state);
            expect(validity.customValidState).toBe(state);
        });

        it('getValidState', function () {
            var validity = new Validity();
            expect(validity.getValidState()).toBe('valid');

            var state = new ValidityState(false, 'pass');
            validity.addState('name', state);
            expect(validity.getValidState()).toBe('invalid');

            var state2 = 'valid';
            validity.setCustomValidState(state2);
            expect(validity.getValidState()).toBe(state2);
        });
    });

});
