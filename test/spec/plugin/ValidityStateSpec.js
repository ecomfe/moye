/**
 * @file 校验状态测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var lib = require('ui/lib');
    var ValidityState = require('ui/plugin/ValidityState');

    describe('标准接口', function () {
        it('constructor', function () {
            var stateMsg = 'abc';
            var isValid = true;
            var state = new ValidityState(isValid, stateMsg);
            expect(state.state).toBe(isValid);
            expect(state.message).toBe(stateMsg);
        });

        it('getter', function () {
            var stateMsg = 'abc';
            var isValid = true;
            var state = new ValidityState(isValid, stateMsg);
            expect(state.getState()).toBe(isValid);
            expect(state.getMessage()).toBe(stateMsg);
        });

        it('setter', function () {
            var stateMsg = 'abc';
            var isValid = true;
            var state = new ValidityState(isValid, stateMsg);

            var newIsValid = false;
            state.setState(newIsValid);
            expect(state.getState()).toBe(newIsValid);

            var newMsg = '${title}efg';
            state.setMessage(newMsg);
            expect(state.getMessage()).toBe(newMsg);
        });
    });

});
